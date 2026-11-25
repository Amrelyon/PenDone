import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const DAILY_CALL_LIMIT = Number(Deno.env.get("PENDONE_DAILY_CALL_LIMIT") ?? "2000");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GatewayPayload {
  app_id: string;
  action: "read_pointer" | "write_updatable";
  updates?: Record<string, unknown>;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const startTime = Date.now();
  let userId: string | null = null;
  let appId: string | null = null;
  let bytesTransferred = 0;

  const logUsage = async (statusCode: number) => {
    if (!userId && !appId) return;
    await supabaseAdmin.from("api_usage_logs").insert({
      user_id: userId,
      app_id: appId,
      endpoint: "/functions/v1/pendone-gateway",
      api_calls: 1,
      bytes_transferred: bytesTransferred,
      status_code: statusCode,
    });
  };

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "").trim();
    const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !authData.user) {
      return new Response(JSON.stringify({ error: "Invalid or expired session" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    userId = authData.user.id;
    const rawBody = await req.text();
    bytesTransferred += new TextEncoder().encode(rawBody).length;

    const body: GatewayPayload = JSON.parse(rawBody);
    appId = body.app_id;

    if (!appId || !body.action) {
      await logUsage(400);
      return new Response(JSON.stringify({ error: "app_id and action are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check daily quota for this user
    const sinceIso = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: usageRows } = await supabaseAdmin
      .from("api_usage_logs")
      .select("api_calls")
      .eq("user_id", userId)
      .gte("created_at", sinceIso);

    const callsLast24h = (usageRows ?? []).reduce((sum, r) => sum + (r.api_calls ?? 0), 0);
    if (callsLast24h >= DAILY_CALL_LIMIT) {
      await logUsage(429);
      return new Response(JSON.stringify({ error: "Daily API quota exceeded" }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch user's storage pointer and allowed updatable fields for this app
    const { data: pointer, error: pointerError } = await supabaseAdmin
      .from("user_app_storage_pointers")
      .select("id, provider, drive_folder_id, drive_file_id, storage_path, updatable_fields")
      .eq("user_id", userId)
      .eq("app_id", appId)
      .single();

    if (pointerError || !pointer) {
      await logUsage(404);
      return new Response(JSON.stringify({ error: "Storage pointer not found for user and app" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (body.action === "write_updatable") {
      const updates = body.updates ?? {};
      const allowedSet = new Set<string>(pointer.updatable_fields ?? []);
      const filteredUpdates: Record<string, unknown> = {};
      const rejectedKeys: string[] = [];

      for (const [key, value] of Object.entries(updates)) {
        if (allowedSet.has(key)) {
          filteredUpdates[key] = value;
        } else {
          rejectedKeys.push(key);
        }
      }

      if (rejectedKeys.length > 0) {
        await logUsage(403);
        return new Response(
          JSON.stringify({
            error: "Attempted to modify non-updatable fields",
            rejected_fields: rejectedKeys,
          }),
          {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      // Touch pointer timestamp; forward filteredUpdates to Drive/Code.gs via your next step
      await supabaseAdmin
        .from("user_app_storage_pointers")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", pointer.id);

      const responsePayload = {
        ok: true,
        pointer_id: pointer.id,
        storage_path: pointer.storage_path,
        accepted_updates: filteredUpdates,
        latency_ms: Date.now() - startTime,
      };
      const encoded = JSON.stringify(responsePayload);
      bytesTransferred += new TextEncoder().encode(encoded).length;
      await logUsage(200);

      return new Response(encoded, {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const readPayload = {
      ok: true,
      pointer,
      latency_ms: Date.now() - startTime,
    };
    const encodedRead = JSON.stringify(readPayload);
    bytesTransferred += new TextEncoder().encode(encodedRead).length;
    await logUsage(200);

    return new Response(encodedRead, {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    await logUsage(500);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
