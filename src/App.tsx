import React, { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  Code2,
  FolderCheck,
  Globe,
  Hammer,
  HardDrive,
  Layers,
  Moon,
  Search,
  ShieldCheck,
  Store,
  Sun,
  Wallet,
} from 'lucide-react';
import {
  INITIAL_API_LOGS,
  INITIAL_POINTERS,
  INITIAL_REVENUE_TRANSACTIONS,
  INITIAL_STORE_APPS,
} from './data/pendoneSeed';
import { TRANSLATIONS } from './i18n/translations';
import {
  ApiUsageLog,
  AppTab,
  LanguageCode,
  PenDoneApp,
  RevenueTransaction,
  StoragePointer,
} from './types/pendone';
import { PenDoneLogo } from './components/PenDoneLogo';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import { OnboardingWalkthrough } from './components/OnboardingWalkthrough';
import { AppSandboxModal } from './components/AppSandboxModal';
import { BuilderStudio } from './components/BuilderStudio';
import { RevenueAndMeteringView } from './components/RevenueAndMeteringView';
import { BlueprintsView } from './components/BlueprintsView';

type CategoryFilter = 'All' | PenDoneApp['category'];

const CATEGORIES: CategoryFilter[] = [
  'All',
  'Productivity',
  'Finance & Invoices',
  'Health & Logs',
  'Developer Tools',
];

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [lang, setLang] = useState<LanguageCode>('en');
  const [activeTab, setActiveTab] = useState<AppTab>('store');
  const [driveConnected, setDriveConnected] = useState(true);

  const [apps, setApps] = useState<PenDoneApp[]>(INITIAL_STORE_APPS);
  const [pointers, setPointers] = useState<StoragePointer[]>(INITIAL_POINTERS);
  const [apiLogs, setApiLogs] = useState<ApiUsageLog[]>(INITIAL_API_LOGS);
  const [transactions, setTransactions] = useState<RevenueTransaction[]>(
    INITIAL_REVENUE_TRANSACTIONS
  );

  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<PenDoneApp | null>(null);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#0B0D12' : '#FAF9F6');
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.dir = t.dir;
    document.documentElement.lang = lang;
  }, [lang, t.dir]);

  const filteredApps = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return apps.filter((app) => {
      const matchesCat = categoryFilter === 'All' || app.category === categoryFilter;
      if (!matchesCat) return false;
      if (!q) return true;
      return (
        app.name.toLowerCase().includes(q) ||
        app.slug.toLowerCase().includes(q) ||
        app.description.toLowerCase().includes(q) ||
        app.manifest.storage.format.toLowerCase().includes(q)
      );
    });
  }, [apps, categoryFilter, searchQuery]);

  const pointerByAppId = useMemo(() => {
    const map = new Map<string, StoragePointer>();
    pointers.forEach((p) => map.set(p.appId, p));
    return map;
  }, [pointers]);

  const appendLog = (appSlug: string, action: string, bytes: number, statusCode: number) => {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    setApiLogs((prev) => [
      {
        id: `log-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
        appSlug,
        endpoint: '/functions/v1/pendone-gateway',
        action,
        apiCalls: 1,
        bytesTransferred: bytes,
        statusCode,
        createdAt: now,
      },
      ...prev,
    ]);
  };

  const handleGrantPointer = (app: PenDoneApp) => {
    setDriveConnected(true);
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const storagePath = `/${app.manifest.storage.folder_name}/${app.manifest.storage.file_name}`;
    setPointers((prev) => {
      const exists = prev.find((p) => p.appId === app.id);
      if (exists) {
        return prev.map((p) =>
          p.appId === app.id ? { ...p, accessGranted: true, updatedAt: now } : p
        );
      }
      return [
        {
          id: `ptr-${Date.now()}`,
          appId: app.id,
          storagePath,
          driveFileId: `1Drv_${app.slug.slice(0, 8)}`,
          accessGranted: true,
          updatableFields: app.manifest.fields.updatable_info,
          readOnlyFields: app.manifest.fields.read_only_fields,
          updatedAt: now,
        },
        ...prev,
      ];
    });
    appendLog(app.slug, 'grant_drive_pointer', 384, 200);
  };

  const handleRevokePointer = (appId: string) => {
    const app = apps.find((a) => a.id === appId);
    setPointers((prev) =>
      prev.map((p) => (p.appId === appId ? { ...p, accessGranted: false } : p))
    );
    if (app) {
      appendLog(app.slug, 'revoke_pointer', 256, 200);
    }
  };

  const handleGatewayWrite = (
    app: PenDoneApp,
    fieldKey: string,
    nextValue: string | number
  ): { statusCode: number; message: string } => {
    const allowed = new Set(app.manifest.fields.updatable_info);
    const payloadBytes = new TextEncoder().encode(
      JSON.stringify({ app_id: app.id, updates: { [fieldKey]: nextValue } })
    ).length;

    if (!allowed.has(fieldKey)) {
      appendLog(app.slug, `write_updatable (blocked: ${fieldKey})`, payloadBytes + 180, 403);
      return {
        statusCode: 403,
        message: `Attempted to modify non-updatable field "${fieldKey}". Rejected by pendone-gateway.`,
      };
    }

    setApps((prev) =>
      prev.map((a) =>
        a.id === app.id
          ? { ...a, sampleRecord: { ...a.sampleRecord, [fieldKey]: nextValue } }
          : a
      )
    );
    appendLog(app.slug, `write_updatable (${fieldKey})`, payloadBytes + 240, 200);
    return {
      statusCode: 200,
      message: `Saved "${fieldKey}" to ${app.manifest.storage.folder_name}/${app.manifest.storage.file_name}.`,
    };
  };

  const handleRecordPurchase = (app: PenDoneApp, grossAmount: number) => {
    const fee = Number((grossAmount * 0.1).toFixed(2));
    const net = Number((grossAmount * 0.9).toFixed(2));
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);

    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        appName: app.name,
        builderName: app.builderName,
        grossAmount,
        platformFee10Pct: fee,
        netToBuilder90Pct: net,
        currency: 'USD',
        status: 'recorded',
        createdAt: now,
      },
      ...prev,
    ]);
    appendLog(app.slug, 'record_revenue', 420, 200);
  };

  const handlePublishApp = (newApp: PenDoneApp) => {
    setApps((prev) => [newApp, ...prev]);
    handleGrantPointer(newApp);
    setActiveTab('store');
  };

  const navItems: { id: AppTab; label: string; shortLabel: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'store', label: t.navStore, shortLabel: 'Store', icon: Store },
    { id: 'onboarding', label: t.navOnboarding, shortLabel: 'Control', icon: ShieldCheck },
    { id: 'builder', label: t.navBuilder, shortLabel: 'Builder', icon: Hammer },
    { id: 'ledger', label: t.navLedger, shortLabel: 'Ledger', icon: Wallet },
    { id: 'blueprints', label: t.navBlueprints, shortLabel: 'Code', icon: Code2 },
  ];

  const openGooglePageTranslate = () => {
    const currentUrl = encodeURIComponent(window.location.href);
    window.open(
      `https://translate.google.com/translate?sl=auto&tl=${lang}&u=${currentUrl}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#14161F] dark:bg-[#0B0D12] dark:text-[#F4F1EA] pb-20 md:pb-0 transition-colors">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 border-b border-[#E5E1D8] dark:border-[#252A38] bg-[#FAF9F6]/90 dark:bg-[#0B0D12]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 md:h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Borderless transparent Brand Wordmark */}
          <button
            type="button"
            onClick={() => setActiveTab('store')}
            className="bg-transparent border-0 p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] rounded-md whitespace-nowrap shrink-0"
            aria-label="PenDone Home"
          >
            <PenDoneLogo size="md" />
          </button>

          {/* Zone 2: 5 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium" aria-label="Primary">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'border-[#B4861C] dark:border-[#D4AF37] text-[#14161F] dark:text-[#E5C158]'
                      : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-[#14161F] dark:hover:text-[#F4F1EA]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary CTA */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => setDriveConnected((prev) => !prev)}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 min-h-[40px] ${
                driveConnected
                  ? 'border border-[#B4861C]/50 dark:border-[#D4AF37]/50 bg-[#D4AF37]/10 text-[#9A7213] dark:text-[#E5C158]'
                  : 'bg-[#B4861C] dark:bg-[#D4AF37] text-white dark:text-[#0B0D12] hover:opacity-90'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5 shrink-0" />
              <span>{driveConnected ? t.driveConnected : t.connectDrive}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Workspace Utility Strip (Slogan + Theme + Google Page Translator + PWA Install) */}
      <div className="border-b border-[#E5E1D8] dark:border-[#252A38] bg-[#F5F3EE] dark:bg-[#0F121A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
            <span className="text-[#9A7213] dark:text-[#E5C158] font-semibold">PenDone Data</span>
            <span className="mx-2 text-neutral-400" aria-hidden="true">
              ·
            </span>
            <span>{t.slogan}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Multi-Language & Google Page Translator */}
            <div className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E1D8] dark:border-[#252A38] bg-white dark:bg-[#12151E] px-2.5 py-1 min-h-[40px]">
              <Globe className="w-3.5 h-3.5 text-[#B4861C] dark:text-[#D4AF37] shrink-0" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as LanguageCode)}
                aria-label={t.translateLabel}
                className="bg-transparent text-xs font-medium text-[#14161F] dark:text-[#F4F1EA] focus:outline-none pr-1"
              >
                {Object.entries(TRANSLATIONS).map(([code, bundle]) => (
                  <option key={code} value={code} className="bg-white dark:bg-[#12151E]">
                    {bundle.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={openGooglePageTranslate}
                title="Open in Google Page Translator"
                className="text-[11px] font-medium text-[#9A7213] dark:text-[#E5C158] hover:underline whitespace-nowrap shrink-0 pl-1.5 border-l border-[#E5E1D8] dark:border-[#252A38]"
              >
                Google Translate
              </button>
            </div>

            {/* Dark & Light Theme Switcher */}
            <button
              type="button"
              onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E1D8] dark:border-[#252A38] bg-white dark:bg-[#12151E] px-3 py-1.5 text-xs font-medium text-[#14161F] dark:text-[#F4F1EA] hover:border-[#B4861C] dark:hover:border-[#D4AF37] transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#E5C158]" />
                  <span>{t.themeLight}</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-[#B4861C]" />
                  <span>{t.themeDark}</span>
                </>
              )}
            </button>

            <PWAInstallButton />
          </div>
        </div>
      </div>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-12">
        {/* Hero Overview (shown on Store home for clear focal anchor) */}
        {activeTab === 'store' && (
          <section className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <p className="text-xs font-semibold tracking-wide text-[#9A7213] dark:text-[#E5C158]">
                  BYOS Cloud Architecture · Google AI Studio · GitHub · Supabase
                </p>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#14161F] dark:text-[#F4F1EA] [text-wrap:balance] leading-[1.12]">
                  {t.heroTitle}
                </h1>
                <p className="text-sm sm:text-base leading-relaxed text-neutral-600 dark:text-neutral-400 max-w-2xl">
                  {t.heroSubtitle}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a
                    href="#store-catalog"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#B4861C] dark:bg-[#D4AF37] px-5 py-2.5 text-sm font-semibold text-white dark:text-[#0B0D12] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
                  >
                    <Store className="w-4 h-4" />
                    <span>{t.exploreStore}</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setActiveTab('onboarding')}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#E5E1D8] dark:border-[#252A38] bg-white dark:bg-[#12151E] px-5 py-2.5 text-sm font-semibold text-[#14161F] dark:text-[#F4F1EA] hover:border-[#B4861C] dark:hover:border-[#D4AF37] transition-colors whitespace-nowrap shrink-0"
                  >
                    <BookOpen className="w-4 h-4 text-[#B4861C] dark:text-[#D4AF37]" />
                    <span>{t.howControlWorks}</span>
                  </button>
                </div>
              </div>

              {/* Architecture Snapshot Card */}
              <div className="lg:col-span-5 rounded-2xl border border-[#E5E1D8] dark:border-[#252A38] bg-white dark:bg-[#12151E] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#9A7213] dark:text-[#E5C158]">
                    Live BYOS Vault Summary
                  </span>
                  <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
                    drive.file
                  </span>
                </div>
                <div className="divide-y divide-[#E5E1D8] dark:divide-[#252A38] text-xs">
                  <div className="py-2.5 flex items-center justify-between gap-4">
                    <span className="text-neutral-500 dark:text-neutral-400">Active Drive Pointers</span>
                    <span className="font-mono font-semibold tabular-nums">
                      {pointers.filter((p) => p.accessGranted).length} folders
                    </span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between gap-4">
                    <span className="text-neutral-500 dark:text-neutral-400">Enforced Field Policy</span>
                    <span className="font-mono font-semibold">updatable_info</span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between gap-4">
                    <span className="text-neutral-500 dark:text-neutral-400">Builder Revenue Share</span>
                    <span className="font-mono font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                      90% Builder · 10% PenDone
                    </span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between gap-4">
                    <span className="text-neutral-500 dark:text-neutral-400">Metered Gateway Calls</span>
                    <span className="font-mono font-semibold tabular-nums">
                      {apiLogs.reduce((s, l) => s + l.apiCalls, 0)} logged
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4-Column Ecosystem Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="rounded-xl border border-[#E5E1D8] dark:border-[#252A38] bg-white dark:bg-[#12151E] p-4 space-y-1">
                <div className="text-xs font-semibold text-[#14161F] dark:text-[#F4F1EA]">
                  User-Owned Storage
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Data writes into /PenDone/&lt;slug&gt; inside your Google Drive.
                </p>
              </div>
              <div className="rounded-xl border border-[#E5E1D8] dark:border-[#252A38] bg-white dark:bg-[#12151E] p-4 space-y-1">
                <div className="text-xs font-semibold text-[#14161F] dark:text-[#F4F1EA]">
                  Controlled Editing
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Edge gateway restricts edits strictly to updatable_info fields.
                </p>
              </div>
              <div className="rounded-xl border border-[#E5E1D8] dark:border-[#252A38] bg-white dark:bg-[#12151E] p-4 space-y-1">
                <div className="text-xs font-semibold text-[#14161F] dark:text-[#F4F1EA]">
                  Zero Upfront Cost
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Build HTML + Code.gs apps freely; 10% applies only on paid income.
                </p>
              </div>
              <div className="rounded-xl border border-[#E5E1D8] dark:border-[#252A38] bg-white dark:bg-[#12151E] p-4 space-y-1">
                <div className="text-xs font-semibold text-[#14161F] dark:text-[#F4F1EA]">
                  Cross-Device PWA
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Runs in mobile or desktop browsers and installs to home screens.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Store Catalog View */}
        {activeTab === 'store' && (
          <section id="store-catalog" className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight text-[#14161F] dark:text-[#F4F1EA]">
                  {t.storeTitle}
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{t.storeSubtitle}</p>
              </div>

              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  aria-label="Search PenDone Store"
                  className="w-full rounded-lg border border-[#E5E1D8] dark:border-[#252A38] bg-white dark:bg-[#12151E] pl-9 pr-3 py-2 text-xs text-[#14161F] dark:text-[#F4F1EA] placeholder:text-neutral-400"
                />
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#F5F3EE] dark:bg-[#12151E] border border-[#E5E1D8] dark:border-[#252A38] w-fit">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 min-h-[36px] ${
                    categoryFilter === cat
                      ? 'bg-white dark:bg-[#181C28] text-[#9A7213] dark:text-[#E5C158] shadow-sm'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-[#14161F] dark:hover:text-[#F4F1EA]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* App Grid */}
            {filteredApps.length === 0 ? (
              <div className="rounded-xl border border-[#E5E1D8] dark:border-[#252A38] bg-white dark:bg-[#12151E] p-10 text-center space-y-3">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  No apps matched your search filter.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setCategoryFilter('All');
                    setSearchQuery('');
                  }}
                  className="rounded-lg bg-[#B4861C] dark:bg-[#D4AF37] px-4 py-2 text-xs font-semibold text-white dark:text-[#0B0D12]"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredApps.map((app) => {
                  const ptr = pointerByAppId.get(app.id);
                  const isConnected = driveConnected && ptr?.accessGranted;
                  return (
                    <article
                      key={app.id}
                      className="rounded-xl border border-[#E5E1D8] dark:border-[#252A38] bg-white dark:bg-[#12151E] p-6 flex flex-col justify-between gap-5"
                    >
                      <div className="space-y-3">
                        {/* Unboxed Metadata Line (Zero-Pill Rule) */}
                        <div className="flex items-center justify-between gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                          <span>
                            {app.category} · {app.manifest.storage.format === 'google_sheet' ? 'Google Sheet' : 'Drive JSON'}
                            {app.usesCodeGs ? ' · Code.gs' : ''}
                          </span>
                          <span className="font-mono tabular-nums font-semibold text-[#9A7213] dark:text-[#E5C158]">
                            ${app.priceUsd.toFixed(0)} USD
                          </span>
                        </div>

                        <div className="space-y-1">
                          <h3 className="text-lg font-bold text-[#14161F] dark:text-[#F4F1EA]">
                            {app.name}
                          </h3>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            By {app.builderName} · /{app.manifest.storage.folder_name}/
                            {app.manifest.storage.file_name}
                          </p>
                        </div>

                        <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                          {app.description}
                        </p>

                        <div className="pt-2 border-t border-[#E5E1D8] dark:border-[#252A38] text-xs space-y-1">
                          <div className="text-neutral-500 dark:text-neutral-400">
                            <span className="font-semibold text-[#14161F] dark:text-[#F4F1EA]">
                              updatable_info:{' '}
                            </span>
                            <span className="font-mono">
                              {app.manifest.fields.updatable_info.join(', ')}
                            </span>
                          </div>
                          <div className="text-neutral-500 dark:text-neutral-400">
                            <span className="font-semibold text-[#14161F] dark:text-[#F4F1EA]">
                              read_only:{' '}
                            </span>
                            <span className="font-mono">
                              {app.manifest.fields.read_only_fields.join(', ')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 pt-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                          <FolderCheck
                            className={`w-4 h-4 ${
                              isConnected
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-neutral-400'
                            }`}
                          />
                          <span>{isConnected ? 'Drive Folder Linked' : 'Requires Drive Grant'}</span>
                        </span>

                        <button
                          type="button"
                          onClick={() => setSelectedApp(app)}
                          className="rounded-lg bg-[#14161F] dark:bg-[#F4F1EA] px-4 py-2 text-xs font-semibold text-white dark:text-[#0B0D12] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 min-h-[40px]"
                        >
                          {t.openAppVault}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {activeTab === 'onboarding' && (
          <OnboardingWalkthrough
            t={t}
            driveConnected={driveConnected}
            onConnectDrive={() => setDriveConnected(true)}
            onGoToStore={() => setActiveTab('store')}
          />
        )}

        {activeTab === 'builder' && <BuilderStudio t={t} onPublishApp={handlePublishApp} />}

        {activeTab === 'ledger' && (
          <RevenueAndMeteringView t={t} logs={apiLogs} transactions={transactions} />
        )}

        {activeTab === 'blueprints' && <BlueprintsView t={t} />}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-[#E5E1D8] dark:border-[#252A38] py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-3">
            <PenDoneLogo size="sm" />
            <span>{t.slogan}</span>
          </div>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => setActiveTab('onboarding')}
              className="hover:text-[#14161F] dark:hover:text-[#F4F1EA]"
            >
              {t.howControlWorks}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('blueprints')}
              className="hover:text-[#14161F] dark:hover:text-[#F4F1EA]"
            >
              SQL &amp; Edge Gateway
            </button>
            <span className="inline-flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-[#B4861C] dark:text-[#D4AF37]" />
              <span>AI Studio · GitHub · Supabase</span>
            </span>
          </div>
        </div>
      </footer>

      {/* Mobile Fixed Bottom Thumb-Zone Navigation (16px*4 = 64px height) */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 border-t border-[#E5E1D8] dark:border-[#252A38] bg-[#FAF9F6]/95 dark:bg-[#0B0D12]/95 backdrop-blur-md grid grid-cols-5"
        aria-label="Mobile navigation"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center gap-1 min-h-[44px] ${
                active
                  ? 'text-[#B4861C] dark:text-[#E5C158] font-semibold'
                  : 'text-neutral-500 dark:text-neutral-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] tracking-tight">{item.shortLabel}</span>
            </button>
          );
        })}
      </nav>

      <OfflineIndicator />

      {selectedApp && (
        <AppSandboxModal
          app={selectedApp}
          pointer={pointerByAppId.get(selectedApp.id)}
          driveConnected={driveConnected}
          onClose={() => setSelectedApp(null)}
          onGrantPointer={handleGrantPointer}
          onRevokePointer={handleRevokePointer}
          onGatewayWrite={handleGatewayWrite}
          onRecordPurchase={handleRecordPurchase}
        />
      )}
    </div>
  );
}
