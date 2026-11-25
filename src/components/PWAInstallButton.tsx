import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowGuide(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center gap-2 rounded-lg border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-3.5 py-2 text-xs font-semibold text-[#9A7213] dark:text-[#E5C158] hover:bg-[#D4AF37]/20 transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
      >
        {isIOS ? <Smartphone className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
        <span>Install PWA</span>
      </button>

      {showGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pwa-guide-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-[#E5E1D8] dark:border-[#252A38] bg-white dark:bg-[#12151E] p-6 shadow-xl">
            <div className="flex items-center justify-between gap-4">
              <h3 id="pwa-guide-title" className="text-base font-semibold text-[#14161F] dark:text-[#F4F1EA]">
                {isIOS ? 'Install PenDone on iPhone / iPad' : 'Install PenDone Store App'}
              </h3>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white min-w-[40px] min-h-[40px] flex items-center justify-center"
                aria-label="Close install instructions"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {isIOS ? (
              <ol className="mt-4 space-y-2.5 text-sm text-neutral-600 dark:text-neutral-300 list-decimal list-inside">
                <li>Tap the Share button in Safari’s toolbar.</li>
                <li>Scroll down and choose Add to Home Screen.</li>
                <li>Tap Add to run PenDone Store in standalone mode.</li>
              </ol>
            ) : (
              <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                Open your browser menu or address-bar install icon and select{' '}
                <span className="font-semibold text-[#14161F] dark:text-white">Install PenDone</span>. The
                lightweight service worker caches only static UI and manifest assets—never your Drive data or auth tokens.
              </p>
            )}
            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="mt-6 w-full rounded-lg bg-[#B4861C] dark:bg-[#D4AF37] px-4 py-2.5 text-sm font-semibold text-white dark:text-[#0B0D12] hover:opacity-90 transition-opacity"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
