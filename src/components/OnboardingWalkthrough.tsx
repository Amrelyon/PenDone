import React, { useState } from 'react';
import { FolderKey, Lock, ShieldCheck, ShieldOff, ArrowRight } from 'lucide-react';
import { TranslationBundle } from '../i18n/translations';

interface OnboardingWalkthroughProps {
  t: TranslationBundle;
  driveConnected: boolean;
  onConnectDrive: () => void;
  onGoToStore: () => void;
}

export const OnboardingWalkthrough: React.FC<OnboardingWalkthroughProps> = ({
  t,
  driveConnected,
  onConnectDrive,
  onGoToStore,
}) => {
  const [activeStep, setActiveStep] = useState<0 | 1 | 2>(0);
  const [simField, setSimField] = useState<'notes' | 'verified_balance'>('notes');
  const [simNoteValue, setSimNoteValue] = useState('Approved supplier invoice memo');
  const [simResult, setSimResult] = useState<{ ok: boolean; msg: string } | null>(null);

  const runFieldTest = () => {
    if (simField === 'notes') {
      setSimResult({
        ok: true,
        msg: '200 OK — "notes" is in updatable_info. Written to /PenDone/task-vault/data.json and logged in api_usage_logs.',
      });
    } else {
      setSimResult({
        ok: false,
        msg: '403 Forbidden — "verified_balance" is listed under read_only_fields. Edge Function gateway blocked the write.',
      });
    }
  };

  const steps = [
    {
      title: t.step1Title,
      desc: t.step1Desc,
      icon: FolderKey,
      summary: 'Scope: drive.file · Folder: /PenDone/<AppSlug>/data.json',
    },
    {
      title: t.step2Title,
      desc: t.step2Desc,
      icon: Lock,
      summary: 'updatable_info (Editable) vs read_only_fields (HTTP 403)',
    },
    {
      title: t.step3Title,
      desc: t.step3Desc,
      icon: ShieldOff,
      summary: 'Zero lock-in · Instant pointer & Google Drive revocation',
    },
  ];

  return (
    <section className="space-y-8">
      <div className="max-w-3xl space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#14161F] dark:text-[#F4F1EA]">
          {t.onboardingTitle}
        </h2>
        <p className="text-sm md:text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
          {t.onboardingSubtitle}
        </p>
      </div>

      {/* Interactive 3-Pillar Walkthrough */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5 flex flex-col gap-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = activeStep === index;
            return (
              <button
                key={step.title}
                type="button"
                onClick={() => setActiveStep(index as 0 | 1 | 2)}
                className={`text-start rounded-xl border p-5 transition-colors min-h-[44px] ${
                  isActive
                    ? 'border-[#B4861C] dark:border-[#D4AF37] bg-white dark:bg-[#12151E]'
                    : 'border-[#E5E1D8] dark:border-[#252A38] bg-[#F5F3EE] dark:bg-[#0F121A] hover:border-[#B4861C]/50 dark:hover:border-[#D4AF37]/50'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`mt-0.5 rounded-lg p-2 shrink-0 ${
                      isActive
                        ? 'bg-[#B4861C]/15 text-[#9A7213] dark:bg-[#D4AF37]/15 dark:text-[#E5C158]'
                        : 'bg-neutral-200/70 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h3 className="text-sm font-semibold text-[#14161F] dark:text-[#F4F1EA]">
                      {step.title}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{step.summary}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Detail & Live Permission Simulator */}
        <div className="lg:col-span-7 rounded-xl border border-[#E5E1D8] dark:border-[#252A38] bg-white dark:bg-[#12151E] p-6 md:p-8 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div className="text-xs font-medium text-[#9A7213] dark:text-[#E5C158]">
              Control Rule {activeStep + 1} of 3
            </div>
            <h3 className="text-xl font-bold text-[#14161F] dark:text-[#F4F1EA]">
              {steps[activeStep].title}
            </h3>
            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
              {steps[activeStep].desc}
            </p>

            {activeStep === 0 && (
              <div className="pt-2 space-y-3 border-t border-[#E5E1D8] dark:border-[#252A38]">
                <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                  What Supabase stores vs. What stays in your Drive
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-lg border border-[#E5E1D8] dark:border-[#252A38] p-3.5 space-y-1">
                    <div className="font-semibold text-[#14161F] dark:text-[#F4F1EA]">
                      Your Google Drive (drive.file)
                    </div>
                    <p className="font-mono text-neutral-600 dark:text-neutral-400">
                      /PenDone/task-vault/data.json
                    </p>
                    <p className="text-neutral-500 dark:text-neutral-400">
                      Holds your full app records, notes, and user data.
                    </p>
                  </div>
                  <div className="rounded-lg border border-[#E5E1D8] dark:border-[#252A38] p-3.5 space-y-1">
                    <div className="font-semibold text-[#14161F] dark:text-[#F4F1EA]">
                      Supabase PostgreSQL
                    </div>
                    <p className="font-mono text-neutral-600 dark:text-neutral-400">
                      drive_file_id + updatable_fields[]
                    </p>
                    <p className="text-neutral-500 dark:text-neutral-400">
                      Holds only pointers, API call logs, and the 10% ledger.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 1 && (
              <div className="pt-3 space-y-3 border-t border-[#E5E1D8] dark:border-[#252A38]">
                <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                  Interactive Field-Level Gateway Check
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSimField('notes');
                      setSimResult(null);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      simField === 'notes'
                        ? 'border-[#B4861C] dark:border-[#D4AF37] bg-[#D4AF37]/15 text-[#9A7213] dark:text-[#E5C158]'
                        : 'border-[#E5E1D8] dark:border-[#252A38] text-neutral-600 dark:text-neutral-300'
                    }`}
                  >
                    Edit &quot;notes&quot; (updatable_info)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSimField('verified_balance');
                      setSimResult(null);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      simField === 'verified_balance'
                        ? 'border-[#B4861C] dark:border-[#D4AF37] bg-[#D4AF37]/15 text-[#9A7213] dark:text-[#E5C158]'
                        : 'border-[#E5E1D8] dark:border-[#252A38] text-neutral-600 dark:text-neutral-300'
                    }`}
                  >
                    Tamper &quot;verified_balance&quot; (read_only)
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={simField === 'notes' ? simNoteValue : '999999'}
                    onChange={(e) => simField === 'notes' && setSimNoteValue(e.target.value)}
                    readOnly={simField !== 'notes'}
                    aria-label="Test field payload value"
                    className="flex-1 rounded-lg border border-[#E5E1D8] dark:border-[#252A38] bg-[#FAF9F6] dark:bg-[#0B0D12] px-3 py-2 text-xs font-mono text-[#14161F] dark:text-[#F4F1EA]"
                  />
                  <button
                    type="button"
                    onClick={runFieldTest}
                    className="rounded-lg bg-[#B4861C] dark:bg-[#D4AF37] px-4 py-2 text-xs font-semibold text-white dark:text-[#0B0D12] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
                  >
                    Send to Edge Gateway
                  </button>
                </div>
                {simResult && (
                  <div
                    className={`rounded-lg border px-3.5 py-2.5 text-xs font-mono ${
                      simResult.ok
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                        : 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300'
                    }`}
                  >
                    {simResult.msg}
                  </div>
                )}
              </div>
            )}

            {activeStep === 2 && (
              <div className="pt-3 space-y-2 border-t border-[#E5E1D8] dark:border-[#252A38] text-xs text-neutral-600 dark:text-neutral-300">
                <p>
                  Because PenDone only holds a pointer in <span className="font-mono">user_app_storage_pointers</span>,
                  revoking access immediately sets <span className="font-mono">access_granted = false</span> at the Edge
                  Function gateway and stops all app writes. You can also remove PenDone directly from your Google Account
                  Permissions at any moment while keeping every file inside Google Drive.
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E5E1D8] dark:border-[#252A38]">
            <button
              type="button"
              onClick={onConnectDrive}
              className="inline-flex items-center gap-2 rounded-lg border border-[#E5E1D8] dark:border-[#252A38] px-4 py-2 text-xs font-semibold text-[#14161F] dark:text-[#F4F1EA] hover:border-[#B4861C] dark:hover:border-[#D4AF37] transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-[#B4861C] dark:text-[#D4AF37]" />
              <span>{driveConnected ? t.driveConnected : t.connectDrive}</span>
            </button>
            <button
              type="button"
              onClick={onGoToStore}
              className="inline-flex items-center gap-2 rounded-lg bg-[#B4861C] dark:bg-[#D4AF37] px-4 py-2 text-xs font-semibold text-white dark:text-[#0B0D12] hover:opacity-90 transition-opacity"
            >
              <span>{t.exploreStore}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
