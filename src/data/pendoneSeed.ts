import { ApiUsageLog, PenDoneApp, RevenueTransaction, StoragePointer } from '../types/pendone';

export const DAILY_CALL_LIMIT = 2000;

export const INITIAL_STORE_APPS: PenDoneApp[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    slug: 'task-vault',
    name: 'Task Vault',
    builderName: 'Amina Khalid',
    category: 'Productivity',
    description:
      'Personal milestone and project notebook saved directly inside your own Google Drive folder with field-locked audit timestamps.',
    priceUsd: 9,
    usesCodeGs: false,
    manifest: {
      app_id: '11111111-1111-1111-1111-111111111111',
      slug: 'task-vault',
      name: 'Task Vault',
      schema_version: '1.0.0',
      storage: {
        provider: 'google_drive',
        scope: 'https://www.googleapis.com/auth/drive.file',
        folder_name: 'PenDone/task-vault',
        file_name: 'data.json',
        format: 'json',
      },
      fields: {
        updatable_info: ['notes', 'user_status', 'preferred_theme'],
        read_only_fields: ['record_id', 'issued_by', 'verified_balance', 'created_at'],
      },
      revenue_share: {
        platform_fee_percent: 10,
        builder_share_percent: 90,
      },
    },
    sampleRecord: {
      record_id: 'TV-9042-PD',
      issued_by: 'PenDone Store',
      verified_balance: 120,
      created_at: '2026-11-20T09:15:00Z',
      notes: 'Ship Q4 PWA offline checklist and verify Drive folder permissions.',
      user_status: 'in_progress',
      preferred_theme: 'dark',
    },
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    slug: 'ledger-sheet-pro',
    name: 'Ledger Sheet Pro',
    builderName: 'Tariq Mansoor',
    category: 'Finance & Invoices',
    description:
      'Client invoice tracker synced to a private Google Sheet in your Drive, using Code.gs for PDF receipts while keeping totals immutable.',
    priceUsd: 24,
    usesCodeGs: true,
    manifest: {
      app_id: '22222222-2222-2222-2222-222222222222',
      slug: 'ledger-sheet-pro',
      name: 'Ledger Sheet Pro',
      schema_version: '1.2.0',
      storage: {
        provider: 'google_drive',
        scope: 'https://www.googleapis.com/auth/drive.file',
        folder_name: 'PenDone/ledger-sheet-pro',
        file_name: 'invoices.gsheet',
        format: 'google_sheet',
      },
      fields: {
        updatable_info: ['client_memo', 'payment_reference', 'preferred_currency'],
        read_only_fields: ['invoice_hash', 'tax_rate_pct', 'verified_total_usd', 'ledger_lock'],
      },
      revenue_share: {
        platform_fee_percent: 10,
        builder_share_percent: 90,
      },
    },
    sampleRecord: {
      invoice_hash: 'INV-8831-A',
      tax_rate_pct: 5,
      verified_total_usd: 1450,
      ledger_lock: 'signed_by_gateway',
      client_memo: 'Annual BYOS architecture retainer',
      payment_reference: 'WIRE-44910',
      preferred_currency: 'USD',
    },
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    slug: 'clinic-vital-log',
    name: 'Vital Log',
    builderName: 'Dr. Nadia Rahman',
    category: 'Health & Logs',
    description:
      'Patient-owned wellness journal stored exclusively in the individual’s Drive, separating doctor-verified baselines from daily notes.',
    priceUsd: 15,
    usesCodeGs: false,
    manifest: {
      app_id: '33333333-3333-3333-3333-333333333333',
      slug: 'clinic-vital-log',
      name: 'Vital Log',
      schema_version: '1.0.4',
      storage: {
        provider: 'google_drive',
        scope: 'https://www.googleapis.com/auth/drive.file',
        folder_name: 'PenDone/clinic-vital-log',
        file_name: 'data.json',
        format: 'json',
      },
      fields: {
        updatable_info: ['daily_energy_note', 'hydration_ml', 'sleep_hours'],
        read_only_fields: ['patient_ref', 'clinician_signature', 'baseline_bp'],
      },
      revenue_share: {
        platform_fee_percent: 10,
        builder_share_percent: 90,
      },
    },
    sampleRecord: {
      patient_ref: 'VL-2041',
      clinician_signature: 'Dr. N. Rahman (Verified)',
      baseline_bp: '118/76',
      daily_energy_note: 'Morning walk 35 min, steady energy.',
      hydration_ml: 2200,
      sleep_hours: 7.5,
    },
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    slug: 'prompt-snippet-box',
    name: 'Snippet Box',
    builderName: 'Omar Farooq',
    category: 'Developer Tools',
    description:
      'Cross-device developer snippet and Workspace script library backed by your own Drive JSON file and metered API gateway.',
    priceUsd: 12,
    usesCodeGs: true,
    manifest: {
      app_id: '44444444-4444-4444-4444-444444444444',
      slug: 'prompt-snippet-box',
      name: 'Snippet Box',
      schema_version: '1.1.0',
      storage: {
        provider: 'google_drive',
        scope: 'https://www.googleapis.com/auth/drive.file',
        folder_name: 'PenDone/prompt-snippet-box',
        file_name: 'data.json',
        format: 'json',
      },
      fields: {
        updatable_info: ['snippet_title', 'snippet_body', 'favorite_language'],
        read_only_fields: ['author_uid', 'license_tier', 'checksum'],
      },
      revenue_share: {
        platform_fee_percent: 10,
        builder_share_percent: 90,
      },
    },
    sampleRecord: {
      author_uid: 'usr_9821_of',
      license_tier: 'Pro Builder',
      checksum: 'sha256:9f4b21c8',
      snippet_title: 'Supabase RLS Policy Template',
      snippet_body: 'create policy "owner_read" on public.apps for select using (auth.uid() = builder_id);',
      favorite_language: 'SQL',
    },
  },
];

export const INITIAL_POINTERS: StoragePointer[] = [
  {
    id: 'ptr-101',
    appId: '11111111-1111-1111-1111-111111111111',
    storagePath: '/PenDone/task-vault/data.json',
    driveFileId: '1A9x_DriveFile_TaskVault',
    accessGranted: true,
    updatableFields: ['notes', 'user_status', 'preferred_theme'],
    readOnlyFields: ['record_id', 'issued_by', 'verified_balance', 'created_at'],
    updatedAt: '2026-11-25 02:14',
  },
  {
    id: 'ptr-102',
    appId: '22222222-2222-2222-2222-222222222222',
    storagePath: '/PenDone/ledger-sheet-pro/invoices.gsheet',
    driveFileId: '1B4z_DriveSheet_Invoices',
    accessGranted: true,
    updatableFields: ['client_memo', 'payment_reference', 'preferred_currency'],
    readOnlyFields: ['invoice_hash', 'tax_rate_pct', 'verified_total_usd', 'ledger_lock'],
    updatedAt: '2026-11-24 18:40',
  },
];

export const INITIAL_API_LOGS: ApiUsageLog[] = [
  {
    id: 'log-01',
    appSlug: 'task-vault',
    endpoint: '/functions/v1/pendone-gateway',
    action: 'read_pointer',
    apiCalls: 1,
    bytesTransferred: 642,
    statusCode: 200,
    createdAt: '2026-11-25 02:14:09',
  },
  {
    id: 'log-02',
    appSlug: 'task-vault',
    endpoint: '/functions/v1/pendone-gateway',
    action: 'write_updatable',
    apiCalls: 1,
    bytesTransferred: 814,
    statusCode: 200,
    createdAt: '2026-11-25 02:18:44',
  },
  {
    id: 'log-03',
    appSlug: 'ledger-sheet-pro',
    endpoint: '/functions/v1/pendone-gateway',
    action: 'write_updatable (blocked field)',
    apiCalls: 1,
    bytesTransferred: 412,
    statusCode: 403,
    createdAt: '2026-11-25 02:26:12',
  },
];

export const INITIAL_REVENUE_TRANSACTIONS: RevenueTransaction[] = [
  {
    id: 'tx-501',
    appName: 'Ledger Sheet Pro',
    builderName: 'Tariq Mansoor',
    grossAmount: 24.0,
    platformFee10Pct: 2.4,
    netToBuilder90Pct: 21.6,
    currency: 'USD',
    status: 'recorded',
    createdAt: '2026-11-24 19:05',
  },
  {
    id: 'tx-502',
    appName: 'Vital Log',
    builderName: 'Dr. Nadia Rahman',
    grossAmount: 15.0,
    platformFee10Pct: 1.5,
    netToBuilder90Pct: 13.5,
    currency: 'USD',
    status: 'paid_out',
    createdAt: '2026-11-23 14:22',
  },
  {
    id: 'tx-503',
    appName: 'Task Vault',
    builderName: 'Amina Khalid',
    grossAmount: 9.0,
    platformFee10Pct: 0.9,
    netToBuilder90Pct: 8.1,
    currency: 'USD',
    status: 'recorded',
    createdAt: '2026-11-22 11:48',
  },
];

export const BLUEPRINT_FILES = {
  sql: {
    filename: 'supabase/migrations/001_pendone_core.sql',
    language: 'sql',
    title: 'Supabase PostgreSQL Schema & RLS Policies',
    summary:
      'Defines profiles, apps, user_app_storage_pointers, api_usage_logs, and revenue_transactions with server-calculated 10% platform fee and 90% builder net share.',
    code: `-- Enable UUID extension if not already active
create extension if not exists "pgcrypto";

-- 1. User Profiles (linked 1:1 to Supabase Auth users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'user' check (role in ('user', 'builder', 'admin')),
  google_drive_connected boolean not null default false,
  created_at timestamptz not null default now()
);

-- 2. PenDone Store Apps (built by creators, listed in PenDone Store)
create table if not exists public.apps (
  id uuid primary key default gen_random_uuid(),
  builder_id uuid not null references public.profiles(id) on delete cascade,
  slug text not null unique,
  name text not null,
  description text,
  category text not null default 'Productivity',
  manifest_json jsonb not null default '{}'::jsonb,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

-- 3. BYOS Storage Pointers (stores Drive file/folder IDs & field rules, NOT bulk user files)
create table if not exists public.user_app_storage_pointers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  app_id uuid not null references public.apps(id) on delete cascade,
  provider text not null default 'google_drive',
  drive_folder_id text,
  drive_file_id text,
  storage_path text not null,
  updatable_fields text[] not null default '{}'::text[],
  read_only_fields text[] not null default '{}'::text[],
  access_granted boolean not null default true,
  updated_at timestamptz not null default now(),
  unique (user_id, app_id)
);

-- 4. API Metering & Quota Logs (populated server-side by Edge Functions)
create table if not exists public.api_usage_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  app_id uuid references public.apps(id) on delete set null,
  endpoint text not null,
  api_calls integer not null default 1 check (api_calls > 0),
  bytes_transferred bigint not null default 0 check (bytes_transferred >= 0),
  status_code integer not null default 200,
  created_at timestamptz not null default now()
);

-- 5. Revenue Ledger (server-calculated 10% PenDone fee, 90% builder share)
create table if not exists public.revenue_transactions (
  id uuid primary key default gen_random_uuid(),
  app_id uuid not null references public.apps(id) on delete restrict,
  builder_id uuid not null references public.profiles(id) on delete restrict,
  payer_user_id uuid references public.profiles(id) on delete set null,
  gross_amount numeric(12, 2) not null check (gross_amount > 0),
  platform_fee_10pct numeric(12, 2) generated always as (round(gross_amount * 0.10, 2)) stored,
  net_to_builder_90pct numeric(12, 2) generated always as (round(gross_amount * 0.90, 2)) stored,
  currency text not null default 'USD',
  status text not null default 'recorded' check (status in ('pending', 'recorded', 'paid_out', 'refunded')),
  created_at timestamptz not null default now()
);

create or replace function public.sync_transaction_builder()
returns trigger language plpgsql as $$
declare v_builder_id uuid;
begin
  select builder_id into v_builder_id from public.apps where id = new.app_id;
  if v_builder_id is null then raise exception 'App % not found', new.app_id; end if;
  new.builder_id := v_builder_id;
  return new;
end;
$$;

drop trigger if exists trg_sync_transaction_builder on public.revenue_transactions;
create trigger trg_sync_transaction_builder
before insert on public.revenue_transactions
for each row execute function public.sync_transaction_builder();

alter table public.profiles enable row level security;
alter table public.apps enable row level security;
alter table public.user_app_storage_pointers enable row level security;
alter table public.api_usage_logs enable row level security;
alter table public.revenue_transactions enable row level security;

create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Anyone can view published apps" on public.apps for select using (is_published = true or auth.uid() = builder_id);
create policy "Builders can insert own apps" on public.apps for insert with check (auth.uid() = builder_id);
create policy "Builders can update own apps" on public.apps for update using (auth.uid() = builder_id);
create policy "Users can manage own storage pointers" on public.user_app_storage_pointers for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users or builders can view relevant api logs" on public.api_usage_logs for select using (
  auth.uid() = user_id or exists (select 1 from public.apps a where a.id = api_usage_logs.app_id and a.builder_id = auth.uid())
);
create policy "Builders and payers can view own transactions" on public.revenue_transactions for select using (
  auth.uid() = builder_id or auth.uid() = payer_user_id
);`,
  },
  gateway: {
    filename: 'supabase/functions/pendone-gateway/index.ts',
    language: 'typescript',
    title: 'Metered Supabase Edge Function Gateway',
    summary:
      'Authenticates user tokens, checks 24h API call quotas, rejects mutations outside updatable_fields with HTTP 403, records server-side 10% revenue splits, and logs metered usage.',
    code: `import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
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
  action: "read_pointer" | "write_updatable" | "record_revenue" | "revoke_pointer";
  updates?: Record<string, unknown>;
  gross_amount?: number;
  currency?: string;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
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
    if (!authHeader) return new Response(JSON.stringify({ error: "Missing Authorization header" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const token = authHeader.replace("Bearer ", "").trim();
    const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !authData.user) return new Response(JSON.stringify({ error: "Invalid or expired session" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    userId = authData.user.id;
    const rawBody = await req.text();
    bytesTransferred += new TextEncoder().encode(rawBody).length;
    const body: GatewayPayload = JSON.parse(rawBody);
    appId = body.app_id;

    // Enforce daily quota
    const sinceIso = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: usageRows } = await supabaseAdmin.from("api_usage_logs").select("api_calls").eq("user_id", userId).gte("created_at", sinceIso);
    const callsLast24h = (usageRows ?? []).reduce((sum, r) => sum + (r.api_calls ?? 0), 0);
    if (callsLast24h >= DAILY_CALL_LIMIT) {
      await logUsage(429);
      return new Response(JSON.stringify({ error: "Daily API quota exceeded" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Fetch storage pointer & field allowlist
    const { data: pointer } = await supabaseAdmin
      .from("user_app_storage_pointers")
      .select("id, provider, drive_folder_id, drive_file_id, storage_path, updatable_fields, access_granted")
      .eq("user_id", userId)
      .eq("app_id", appId)
      .single();

    if (!pointer || !pointer.access_granted) {
      await logUsage(404);
      return new Response(JSON.stringify({ error: "Active storage pointer not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (body.action === "write_updatable") {
      const updates = body.updates ?? {};
      const allowedSet = new Set<string>(pointer.updatable_fields ?? []);
      const filteredUpdates: Record<string, unknown> = {};
      const rejectedKeys: string[] = [];

      for (const [key, value] of Object.entries(updates)) {
        if (allowedSet.has(key)) filteredUpdates[key] = value;
        else rejectedKeys.push(key);
      }

      if (rejectedKeys.length > 0) {
        await logUsage(403);
        return new Response(JSON.stringify({ error: "Attempted to modify non-updatable fields", rejected_fields: rejectedKeys }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      await supabaseAdmin.from("user_app_storage_pointers").update({ updated_at: new Date().toISOString() }).eq("id", pointer.id);
      const encoded = JSON.stringify({ ok: true, pointer_id: pointer.id, accepted_updates: filteredUpdates, latency_ms: Date.now() - startTime });
      bytesTransferred += new TextEncoder().encode(encoded).length;
      await logUsage(200);
      return new Response(encoded, { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const encodedRead = JSON.stringify({ ok: true, pointer, latency_ms: Date.now() - startTime });
    bytesTransferred += new TextEncoder().encode(encodedRead).length;
    await logUsage(200);
    return new Response(encodedRead, { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    await logUsage(500);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});`,
  },
  manifest: {
    filename: 'templates/manifest.app.json',
    language: 'json',
    title: 'App Storage Manifest JSON Spec',
    summary:
      'Declares the user Drive folder/file target under drive.file scope, field-level edit rules (updatable_info vs read_only_fields), and 10%/90% revenue share metadata.',
    code: `{
  "app_id": "11111111-1111-1111-1111-111111111111",
  "slug": "task-vault",
  "name": "Task Vault",
  "schema_version": "1.0.0",
  "storage": {
    "provider": "google_drive",
    "scope": "https://www.googleapis.com/auth/drive.file",
    "folder_name": "PenDone/task-vault",
    "file_name": "data.json",
    "format": "json"
  },
  "fields": {
    "updatable_info": [
      "notes",
      "user_status",
      "preferred_theme"
    ],
    "read_only_fields": [
      "record_id",
      "issued_by",
      "verified_balance",
      "created_at"
    ]
  },
  "revenue_share": {
    "platform_fee_percent": 10,
    "builder_share_percent": 90
  }
}`,
  },
  pwa: {
    filename: 'public/manifest.json & public/sw.js',
    language: 'javascript',
    title: 'PWA Store Manifest, Service Worker & GitHub Pages Workflow',
    summary:
      'Installable Progressive Web App config and lightweight service worker caching strictly non-sensitive static UI and manifest assets.',
    code: `// public/sw.js — Lightweight static shell cache (zero sensitive tokens or Drive payloads)
const CACHE_NAME = "pendone-shell-v1";
const STATIC_ASSETS = ["/", "/index.html", "/manifest.json", "/icon.svg", "/pwa-192x192.png", "/pwa-512x512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith("/functions/")) return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});`,
  },
};
