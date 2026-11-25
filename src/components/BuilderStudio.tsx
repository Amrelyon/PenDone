import React, { useMemo, useState } from 'react';
import { Check, Copy, PlusCircle } from 'lucide-react';
import { PenDoneApp, StorageFormat } from '../types/pendone';
import { TranslationBundle } from '../i18n/translations';

interface BuilderStudioProps {
  t: TranslationBundle;
  onPublishApp: (newApp: PenDoneApp) => void;
}

export const BuilderStudio: React.FC<BuilderStudioProps> = ({ t, onPublishApp }) => {
  const [name, setName] = useState('Field Inspector');
  const [slug, setSlug] = useState('field-inspector');
  const [builderName, setBuilderName] = useState('You (Builder)');
  const [category, setCategory] = useState<PenDoneApp['category']>('Productivity');
  const [format, setFormat] = useState<StorageFormat>('json');
  const [priceUsd, setPriceUsd] = useState(14);
  const [updatableInput, setUpdatableInput] = useState('site_notes, inspection_status, photo_caption');
  const [readOnlyInput, setReadOnlyInput] = useState('inspection_id, auditor_badge, verified_score');
  const [includeCodeGs, setIncludeCodeGs] = useState(true);
  const [codeTab, setCodeTab] = useState<'manifest' | 'html' | 'codegs'>('manifest');
  const [copied, setCopied] = useState(false);
  const [publishedBanner, setPublishedBanner] = useState<string | null>(null);

  const updatableFields = useMemo(
    () => updatableInput.split(',').map((s) => s.trim()).filter(Boolean),
    [updatableInput]
  );
  const readOnlyFields = useMemo(
    () => readOnlyInput.split(',').map((s) => s.trim()).filter(Boolean),
    [readOnlyInput]
  );
  const cleanSlug = useMemo(
    () => slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-') || 'custom-app',
    [slug]
  );
  const fileName = format === 'google_sheet' ? 'records.gsheet' : 'data.json';

  const manifestJson = useMemo(() => {
    return JSON.stringify(
      {
        app_id: '55555555-5555-5555-5555-555555555555',
        slug: cleanSlug,
        name,
        schema_version: '1.0.0',
        storage: {
          provider: 'google_drive',
          scope: 'https://www.googleapis.com/auth/drive.file',
          folder_name: `PenDone/${cleanSlug}`,
          file_name: fileName,
          format,
        },
        fields: {
          updatable_info: updatableFields,
          read_only_fields: readOnlyFields,
        },
        revenue_share: {
          platform_fee_percent: 10,
          builder_share_percent: 90,
        },
      },
      null,
      2
    );
  }, [cleanSlug, name, fileName, format, updatableFields, readOnlyFields]);

  const htmlStarter = useMemo(() => {
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${name} — PenDone BYOS App</title>
</head>
<body>
  <h1>${name}</h1>
  <button id="saveBtn">Save Updatable Field</button>
  <script>
    // Calls metered Supabase Edge Function gateway (never exposes Google API keys)
    const GATEWAY_URL = "https://<PROJECT_REF>.supabase.co/functions/v1/pendone-gateway";
    document.getElementById("saveBtn").addEventListener("click", async () => {
      const res = await fetch(GATEWAY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + window.PENDONE_SUPABASE_JWT
        },
        body: JSON.stringify({
          app_id: "55555555-5555-5555-5555-555555555555",
          action: "write_updatable",
          updates: { ${updatableFields[0] || 'notes'}: "Updated from PenDone PWA" }
        })
      });
      console.log(await res.json());
    });
  </script>
</body>
</html>`;
  }, [name, updatableFields]);

  const codeGsStarter = useMemo(() => {
    return `// Optional Workspace Script scoped strictly to user folder PenDone/${cleanSlug}
const CONFIG = {
  FOLDER_ROOT: "PenDone",
  APP_SLUG: "${cleanSlug}",
  FILE_NAME: "${fileName}",
  UPDATABLE_INFO: ${JSON.stringify(updatableFields)},
  READ_ONLY_FIELDS: ${JSON.stringify(readOnlyFields)}
};

function updateAllowedFields(payload) {
  const allowed = new Set(CONFIG.UPDATABLE_INFO);
  Object.keys(payload || {}).forEach(function (k) {
    if (!allowed.has(k)) throw new Error("403 Forbidden: " + k + " is read-only.");
  });
  return { ok: true, updated: payload };
}`;
  }, [cleanSlug, fileName, updatableFields, readOnlyFields]);

  const activeSnippet =
    codeTab === 'manifest' ? manifestJson : codeTab === 'html' ? htmlStarter : codeGsStarter;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(activeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `app-${Date.now()}`;
    const sampleRecord: Record<string, string | number> = {};
    readOnlyFields.forEach((f, i) => {
      sampleRecord[f] = i === 0 ? `ID-${Math.floor(1000 + Math.random() * 9000)}` : 'system_locked';
    });
    updatableFields.forEach((f) => {
      sampleRecord[f] = `Initial ${f.replace(/_/g, ' ')}`;
    });

    const created: PenDoneApp = {
      id,
      slug: cleanSlug,
      name: name || 'Untitled App',
      builderName: builderName || 'Builder',
      category,
      description: `User-owned storage app writing to /PenDone/${cleanSlug}/${fileName} with ${updatableFields.length} updatable fields.`,
      priceUsd: Math.max(1, Number(priceUsd) || 9),
      usesCodeGs: includeCodeGs,
      manifest: {
        app_id: id,
        slug: cleanSlug,
        name: name || 'Untitled App',
        schema_version: '1.0.0',
        storage: {
          provider: 'google_drive',
          scope: 'https://www.googleapis.com/auth/drive.file',
          folder_name: `PenDone/${cleanSlug}`,
          file_name: fileName,
          format,
        },
        fields: {
          updatable_info: updatableFields,
          read_only_fields: readOnlyFields,
        },
        revenue_share: {
          platform_fee_percent: 10,
          builder_share_percent: 90,
        },
      },
      sampleRecord,
    };
    onPublishApp(created);
    setPublishedBanner(`Published "${created.name}" to PenDone Store at $0 upfront cost.`);
  };

  return (
    <section className="space-y-8">
      <div className="max-w-3xl space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#14161F] dark:text-[#F4F1EA]">
          {t.builderTitle}
        </h2>
        <p className="text-sm md:text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
          {t.builderSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <form
          onSubmit={handlePublish}
          className="lg:col-span-5 rounded-xl border border-[#E5E1D8] dark:border-[#252A38] bg-white dark:bg-[#12151E] p-6 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block space-y-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300">
              <span>App Name</span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-[#E5E1D8] dark:border-[#252A38] bg-[#FAF9F6] dark:bg-[#0B0D12] px-3 py-2 text-sm text-[#14161F] dark:text-[#F4F1EA]"
              />
            </label>
            <label className="block space-y-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300">
              <span>Slug (Drive Folder)</span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full rounded-lg border border-[#E5E1D8] dark:border-[#252A38] bg-[#FAF9F6] dark:bg-[#0B0D12] px-3 py-2 text-sm font-mono text-[#14161F] dark:text-[#F4F1EA]"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="block space-y-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300">
              <span>Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PenDoneApp['category'])}
                className="w-full rounded-lg border border-[#E5E1D8] dark:border-[#252A38] bg-[#FAF9F6] dark:bg-[#0B0D12] px-3 py-2 text-sm text-[#14161F] dark:text-[#F4F1EA]"
              >
                <option value="Productivity">Productivity</option>
                <option value="Finance & Invoices">Finance &amp; Invoices</option>
                <option value="Health & Logs">Health &amp; Logs</option>
                <option value="Developer Tools">Developer Tools</option>
              </select>
            </label>
            <label className="block space-y-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300">
              <span>Drive Format</span>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as StorageFormat)}
                className="w-full rounded-lg border border-[#E5E1D8] dark:border-[#252A38] bg-[#FAF9F6] dark:bg-[#0B0D12] px-3 py-2 text-sm text-[#14161F] dark:text-[#F4F1EA]"
              >
                <option value="json">JSON (data.json)</option>
                <option value="google_sheet">Google Sheet</option>
              </select>
            </label>
            <label className="block space-y-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300">
              <span>Price (USD)</span>
              <input
                type="number"
                min={1}
                value={priceUsd}
                onChange={(e) => setPriceUsd(Number(e.target.value))}
                className="w-full rounded-lg border border-[#E5E1D8] dark:border-[#252A38] bg-[#FAF9F6] dark:bg-[#0B0D12] px-3 py-2 text-sm font-mono tabular-nums text-[#14161F] dark:text-[#F4F1EA]"
              />
            </label>
          </div>

          <label className="block space-y-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300">
            <span>Builder Display Name</span>
            <input
              type="text"
              value={builderName}
              onChange={(e) => setBuilderName(e.target.value)}
              className="w-full rounded-lg border border-[#E5E1D8] dark:border-[#252A38] bg-[#FAF9F6] dark:bg-[#0B0D12] px-3 py-2 text-sm text-[#14161F] dark:text-[#F4F1EA]"
            />
          </label>

          <label className="block space-y-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300">
            <span>updatable_info (comma-separated editable fields)</span>
            <input
              type="text"
              value={updatableInput}
              onChange={(e) => setUpdatableInput(e.target.value)}
              className="w-full rounded-lg border border-[#E5E1D8] dark:border-[#252A38] bg-[#FAF9F6] dark:bg-[#0B0D12] px-3 py-2 text-xs font-mono text-[#14161F] dark:text-[#F4F1EA]"
            />
          </label>

          <label className="block space-y-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300">
            <span>read_only_fields (comma-separated locked fields)</span>
            <input
              type="text"
              value={readOnlyInput}
              onChange={(e) => setReadOnlyInput(e.target.value)}
              className="w-full rounded-lg border border-[#E5E1D8] dark:border-[#252A38] bg-[#FAF9F6] dark:bg-[#0B0D12] px-3 py-2 text-xs font-mono text-[#14161F] dark:text-[#F4F1EA]"
            />
          </label>

          <label className="flex items-center gap-2.5 text-xs text-neutral-700 dark:text-neutral-300 pt-1">
            <input
              type="checkbox"
              checked={includeCodeGs}
              onChange={(e) => setIncludeCodeGs(e.target.checked)}
              className="h-4 w-4 accent-[#B4861C] dark:accent-[#D4AF37]"
            />
            <span>Include optional Code.gs Workspace script</span>
          </label>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#B4861C] dark:bg-[#D4AF37] px-4 py-2.5 text-sm font-semibold text-white dark:text-[#0B0D12] hover:opacity-90 transition-opacity"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.publishToStore}</span>
          </button>

          {publishedBanner && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
              {publishedBanner}
            </div>
          )}
        </form>

        {/* Live Generated Code Output */}
        <div className="lg:col-span-7 rounded-xl border border-[#E5E1D8] dark:border-[#252A38] bg-white dark:bg-[#12151E] overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-[#E5E1D8] dark:border-[#252A38]">
            <div className="flex items-center gap-1 p-1 rounded-lg bg-[#F5F3EE] dark:bg-[#0B0D12]">
              <button
                type="button"
                onClick={() => setCodeTab('manifest')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  codeTab === 'manifest'
                    ? 'bg-white dark:bg-[#181C28] text-[#14161F] dark:text-[#E5C158] shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                manifest.app.json
              </button>
              <button
                type="button"
                onClick={() => setCodeTab('html')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  codeTab === 'html'
                    ? 'bg-white dark:bg-[#181C28] text-[#14161F] dark:text-[#E5C158] shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                index.html
              </button>
              {includeCodeGs && (
                <button
                  type="button"
                  onClick={() => setCodeTab('codegs')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    codeTab === 'codegs'
                      ? 'bg-white dark:bg-[#181C28] text-[#14161F] dark:text-[#E5C158] shadow-sm'
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  Code.gs
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E1D8] dark:border-[#252A38] px-3 py-1.5 text-xs font-medium text-[#14161F] dark:text-[#F4F1EA] hover:border-[#B4861C] dark:hover:border-[#D4AF37]"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <pre className="p-5 text-xs leading-relaxed font-mono overflow-x-auto text-[#14161F] dark:text-neutral-200 bg-[#FAF9F6] dark:bg-[#0B0D12] max-h-[440px]">
            <code>{activeSnippet}</code>
          </pre>
        </div>
      </div>
    </section>
  );
};
