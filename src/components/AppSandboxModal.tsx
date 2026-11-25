import React, { useState } from 'react';
import { Lock, Pencil, ShieldAlert, ShieldCheck, Trash2, X, DollarSign } from 'lucide-react';
import { PenDoneApp, StoragePointer } from '../types/pendone';

interface AppSandboxModalProps {
  app: PenDoneApp;
  pointer: StoragePointer | undefined;
  driveConnected: boolean;
  onClose: () => void;
  onGrantPointer: (app: PenDoneApp) => void;
  onRevokePointer: (appId: string) => void;
  onGatewayWrite: (
    app: PenDoneApp,
    fieldKey: string,
    nextValue: string | number
  ) => { statusCode: number; message: string };
  onRecordPurchase: (app: PenDoneApp, grossAmount: number) => void;
}

export const AppSandboxModal: React.FC<AppSandboxModalProps> = ({
  app,
  pointer,
  driveConnected,
  onClose,
  onGrantPointer,
  onRevokePointer,
  onGatewayWrite,
  onRecordPurchase,
}) => {
  const [recordState, setRecordState] = useState<Record<string, string | number>>(app.sampleRecord);
  const [gatewayFeedback, setGatewayFeedback] = useState<{ statusCode: number; message: string } | null>(null);
  const [confirmRevoke, setConfirmRevoke] = useState(false);
  const [purchaseDone, setPurchaseDone] = useState<string | null>(null);

  const isGranted = driveConnected && pointer?.accessGranted;
  const updatableSet = new Set(app.manifest.fields.updatable_info);

  const handleFieldSave = (key: string) => {
    const val = recordState[key];
    const res = onGatewayWrite(app, key, val);
    setGatewayFeedback(res);
  };

  const handleTestPurchase = () => {
    onRecordPurchase(app, app.priceUsd);
    const fee = (app.priceUsd * 0.1).toFixed(2);
    const net = (app.priceUsd * 0.9).toFixed(2);
    setPurchaseDone(
      `Recorded $${app.priceUsd.toFixed(2)} gross · $${fee} PenDone 10% fee · $${net} net to ${app.builderName}`
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sandbox-app-title"
    >
      <div className="w-full max-w-3xl rounded-2xl border border-[#E5E1D8] dark:border-[#252A38] bg-white dark:bg-[#12151E] shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-[#E5E1D8] dark:border-[#252A38]">
          <div className="space-y-1 min-w-0">
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              {app.category} · {app.manifest.storage.folder_name}/{app.manifest.storage.file_name}
            </div>
            <h3 id="sandbox-app-title" className="text-xl font-bold text-[#14161F] dark:text-[#F4F1EA]">
              {app.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close app vault"
            className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white min-w-[40px] min-h-[40px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
          {/* BYOS Pointer Banner */}
          <div className="rounded-xl border border-[#E5E1D8] dark:border-[#252A38] bg-[#FAF9F6] dark:bg-[#0B0D12] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#14161F] dark:text-[#F4F1EA]">
                {isGranted ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Drive Storage Pointer Active (drive.file)</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Storage Pointer Not Granted</span>
                  </>
                )}
              </div>
              <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
                {pointer?.storagePath ?? `/${app.manifest.storage.folder_name}/${app.manifest.storage.file_name}`}
              </p>
            </div>

            {isGranted ? (
              <button
                type="button"
                onClick={() => setConfirmRevoke(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3.5 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors whitespace-nowrap shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Revoke App Access</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onGrantPointer(app)}
                className="inline-flex items-center gap-2 rounded-lg bg-[#B4861C] dark:bg-[#D4AF37] px-4 py-2 text-xs font-semibold text-white dark:text-[#0B0D12] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Open Folder in My Drive</span>
              </button>
            )}
          </div>

          {/* Explicit Revoke Confirmation */}
          {confirmRevoke && (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 space-y-3">
              <p className="text-xs font-medium text-red-800 dark:text-red-200">
                Revoke {app.name}&apos;s storage pointer? The app will immediately lose gateway write access to{' '}
                <span className="font-mono">{pointer?.storagePath}</span>. Your file stays safe in your Google Drive.
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onRevokePointer(app.id);
                    setConfirmRevoke(false);
                    setGatewayFeedback({
                      statusCode: 200,
                      message: 'Access revoked: user_app_storage_pointers.access_granted set to false.',
                    });
                  }}
                  className="rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-red-700 transition-colors"
                >
                  Confirm Revoke
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmRevoke(false)}
                  className="rounded-lg border border-[#E5E1D8] dark:border-[#252A38] px-3.5 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Field-Level Controlled Editing Matrix */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-sm font-semibold text-[#14161F] dark:text-[#F4F1EA]">
                Drive File Fields (Controlled Editing Rules)
              </h4>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                Try editing an updatable field vs. testing a read-only field
              </span>
            </div>

            <div className="divide-y divide-[#E5E1D8] dark:divide-[#252A38] rounded-xl border border-[#E5E1D8] dark:border-[#252A38]">
              {Object.entries(recordState).map(([key, value]) => {
                const isUpdatable = updatableSet.has(key);
                return (
                  <div
                    key={key}
                    className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="min-w-[180px] space-y-0.5">
                      <div className="flex items-center gap-2">
                        {isUpdatable ? (
                          <Pencil className="w-3.5 h-3.5 text-[#B4861C] dark:text-[#D4AF37]" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-neutral-400" />
                        )}
                        <span className="font-mono text-xs font-semibold text-[#14161F] dark:text-[#F4F1EA]">
                          {key}
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        {isUpdatable ? 'updatable_info · User editable' : 'read_only_fields · Protected'}
                      </div>
                    </div>

                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={String(value)}
                        onChange={(e) =>
                          setRecordState((prev) => ({ ...prev, [key]: e.target.value }))
                        }
                        aria-label={`Value for ${key}`}
                        className="w-full rounded-lg border border-[#E5E1D8] dark:border-[#252A38] bg-[#FAF9F6] dark:bg-[#0B0D12] px-3 py-1.5 text-xs font-mono text-[#14161F] dark:text-[#F4F1EA]"
                      />
                      <button
                        type="button"
                        disabled={!isGranted}
                        onClick={() => handleFieldSave(key)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                          !isGranted
                            ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
                            : isUpdatable
                            ? 'bg-[#B4861C] dark:bg-[#D4AF37] text-white dark:text-[#0B0D12] hover:opacity-90'
                            : 'border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                        }`}
                      >
                        {isUpdatable ? 'Save' : 'Test Write'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {gatewayFeedback && (
              <div
                className={`rounded-lg border px-4 py-3 text-xs font-mono ${
                  gatewayFeedback.statusCode === 200
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                    : 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300'
                }`}
              >
                [Edge Gateway HTTP {gatewayFeedback.statusCode}] {gatewayFeedback.message}
              </div>
            )}
          </div>

          {/* 10% Revenue Share Action */}
          <div className="rounded-xl border border-[#E5E1D8] dark:border-[#252A38] bg-[#FAF9F6] dark:bg-[#0B0D12] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-semibold text-[#14161F] dark:text-[#F4F1EA]">
                Pro App Unlock · ${app.priceUsd.toFixed(2)} USD
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Server-side PostgreSQL split: 90% to {app.builderName} · 10% PenDone platform fee
              </p>
              {purchaseDone && (
                <p className="text-xs font-mono text-[#9A7213] dark:text-[#E5C158] pt-1">
                  {purchaseDone}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={handleTestPurchase}
              className="inline-flex items-center gap-2 rounded-lg bg-[#14161F] dark:bg-[#F4F1EA] px-4 py-2.5 text-xs font-semibold text-white dark:text-[#0B0D12] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Record Paid Purchase</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
