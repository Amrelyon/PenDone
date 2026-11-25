import React, { useState } from 'react';
import { Check, Copy, Download } from 'lucide-react';
import { BLUEPRINT_FILES } from '../data/pendoneSeed';
import { TranslationBundle } from '../i18n/translations';

interface BlueprintsViewProps {
  t: TranslationBundle;
}

type BlueprintKey = keyof typeof BLUEPRINT_FILES;

export const BlueprintsView: React.FC<BlueprintsViewProps> = ({ t }) => {
  const [selected, setSelected] = useState<BlueprintKey>('sql');
  const [copied, setCopied] = useState(false);

  const activeFile = BLUEPRINT_FILES[selected];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDownload = () => {
    const blob = new Blob([activeFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.filename.split('/').pop() || 'pendone-file.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="space-y-8">
      <div className="max-w-3xl space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#14161F] dark:text-[#F4F1EA]">
          {t.blueprintsTitle}
        </h2>
        <p className="text-sm md:text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
          {t.blueprintsSubtitle}
        </p>
      </div>

      {/* Strict 3-Platform Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-[#E5E1D8] dark:border-[#252A38] bg-white dark:bg-[#12151E] p-5 space-y-1.5">
          <div className="text-xs font-semibold text-[#B4861C] dark:text-[#E5C158]">
            01. Google AI Studio
          </div>
          <div className="text-sm font-bold text-[#14161F] dark:text-[#F4F1EA]">
            Builder &amp; Code Generator
          </div>
          <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            Generates PenDone Store PWA shell, app manifests, HTML frontends, optional Code.gs, and SQL schemas.
          </p>
        </div>

        <div className="rounded-xl border border-[#E5E1D8] dark:border-[#252A38] bg-white dark:bg-[#12151E] p-5 space-y-1.5">
          <div className="text-xs font-semibold text-[#B4861C] dark:text-[#E5C158]">
            02. GitHub
          </div>
          <div className="text-sm font-bold text-[#14161F] dark:text-[#F4F1EA]">
            Repo, Pages PWA &amp; Actions
          </div>
          <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            Hosts the installable PWA on GitHub Pages and automates Supabase schema &amp; Edge Function deployments.
          </p>
        </div>

        <div className="rounded-xl border border-[#E5E1D8] dark:border-[#252A38] bg-white dark:bg-[#12151E] p-5 space-y-1.5">
          <div className="text-xs font-semibold text-[#B4861C] dark:text-[#E5C158]">
            03. Supabase (+ User Drive)
          </div>
          <div className="text-sm font-bold text-[#14161F] dark:text-[#F4F1EA]">
            Postgres, Auth &amp; Edge Gateway
          </div>
          <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            Stores file pointers, enforces updatable_info rules, meters API calls, and keeps bulk user data in Drive.
          </p>
        </div>
      </div>

      {/* Starter Files Inspector */}
      <div className="rounded-xl border border-[#E5E1D8] dark:border-[#252A38] bg-white dark:bg-[#12151E] overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-[#E5E1D8] dark:border-[#252A38]">
          <div className="flex flex-wrap items-center gap-1 p-1 rounded-lg bg-[#F5F3EE] dark:bg-[#0B0D12]">
            {(
              [
                ['sql', '1. SQL + RLS'],
                ['manifest', '2. Manifest Spec'],
                ['gateway', '3. Edge Gateway'],
                ['pwa', '4. PWA Service Worker'],
              ] as [BlueprintKey, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelected(key)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  selected === key
                    ? 'bg-white dark:bg-[#181C28] text-[#14161F] dark:text-[#E5C158] shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E1D8] dark:border-[#252A38] px-3 py-1.5 text-xs font-medium text-[#14161F] dark:text-[#F4F1EA] hover:border-[#B4861C] dark:hover:border-[#D4AF37]"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#B4861C] dark:bg-[#D4AF37] px-3 py-1.5 text-xs font-semibold text-white dark:text-[#0B0D12] hover:opacity-90"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>

        <div className="px-5 py-3 border-b border-[#E5E1D8] dark:border-[#252A38] flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#FAF9F6] dark:bg-[#0B0D12]">
          <div className="font-mono text-xs font-semibold text-[#B4861C] dark:text-[#E5C158]">
            {activeFile.filename}
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">{activeFile.summary}</div>
        </div>

        <pre className="p-5 text-xs leading-relaxed font-mono overflow-x-auto text-[#14161F] dark:text-neutral-200 bg-[#FAF9F6] dark:bg-[#0B0D12] max-h-[520px]">
          <code>{activeFile.code}</code>
        </pre>
      </div>
    </section>
  );
};
