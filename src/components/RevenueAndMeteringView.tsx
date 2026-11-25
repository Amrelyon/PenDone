import React, { useState } from 'react';
import { ApiUsageLog, RevenueTransaction } from '../types/pendone';
import { DAILY_CALL_LIMIT } from '../data/pendoneSeed';
import { TranslationBundle } from '../i18n/translations';

interface RevenueAndMeteringViewProps {
  t: TranslationBundle;
  logs: ApiUsageLog[];
  transactions: RevenueTransaction[];
}

export const RevenueAndMeteringView: React.FC<RevenueAndMeteringViewProps> = ({
  t,
  logs,
  transactions,
}) => {
  const [simGross, setSimGross] = useState(1250);

  const totalCalls = logs.reduce((sum, l) => sum + l.apiCalls, 0);
  const totalBytes = logs.reduce((sum, l) => sum + l.bytesTransferred, 0);
  const totalGross = transactions.reduce((sum, tx) => sum + tx.grossAmount, 0);
  const totalFee = transactions.reduce((sum, tx) => sum + tx.platformFee10Pct, 0);
  const totalBuilderNet = transactions.reduce((sum, tx) => sum + tx.netToBuilder90Pct, 0);

  const quotaPct = Math.min(100, (totalCalls / DAILY_CALL_LIMIT) * 100);

  return (
    <section className="space-y-8">
      <div className="max-w-3xl space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#14161F] dark:text-[#F4F1EA]">
          {t.ledgerTitle}
        </h2>
        <p className="text-sm md:text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
          {t.ledgerSubtitle}
        </p>
      </div>

      {/* Top KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#E5E1D8] dark:border-[#252A38] bg-white dark:bg-[#12151E] p-5 space-y-1.5">
          <div className="text-xs text-neutral-500 dark:text-neutral-400">24h Gateway Calls</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-[#14161F] dark:text-[#F4F1EA]">
            {totalCalls} / {DAILY_CALL_LIMIT}
          </div>
          <div className="h-1.5 w-full rounded-full bg-[#E5E1D8] dark:bg-[#252A38] overflow-hidden">
            <div
              className="h-full bg-[#B4861C] dark:bg-[#D4AF37]"
              style={{ width: `${Math.max(2, quotaPct)}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-[#E5E1D8] dark:border-[#252A38] bg-white dark:bg-[#12151E] p-5 space-y-1.5">
          <div className="text-xs text-neutral-500 dark:text-neutral-400">Payload Metered</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-[#14161F] dark:text-[#F4F1EA]">
            {(totalBytes / 1024).toFixed(2)} KB
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            Pointers only · Bulk files stay in Drive
          </div>
        </div>

        <div className="rounded-xl border border-[#E5E1D8] dark:border-[#252A38] bg-white dark:bg-[#12151E] p-5 space-y-1.5">
          <div className="text-xs text-neutral-500 dark:text-neutral-400">Gross Store Volume</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-[#14161F] dark:text-[#F4F1EA]">
            ${totalGross.toFixed(2)}
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            Net to Builders (90%): ${totalBuilderNet.toFixed(2)}
          </div>
        </div>

        <div className="rounded-xl border border-[#E5E1D8] dark:border-[#252A38] bg-white dark:bg-[#12151E] p-5 space-y-1.5">
          <div className="text-xs text-neutral-500 dark:text-neutral-400">PenDone 10% Share</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-[#B4861C] dark:text-[#E5C158]">
            ${totalFee.toFixed(2)}
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            Generated column in PostgreSQL
          </div>
        </div>
      </div>

      {/* Interactive 10% Share Calculator + Scale Cost Tiers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 rounded-xl border border-[#E5E1D8] dark:border-[#252A38] bg-white dark:bg-[#12151E] p-6 space-y-4">
          <h3 className="text-base font-semibold text-[#14161F] dark:text-[#F4F1EA]">
            Server-Side 10% Revenue Split Simulator
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Builders pay $0 upfront. When an app earns income, PostgreSQL computes{' '}
            <span className="font-mono">platform_fee_10pct</span> and{' '}
            <span className="font-mono">net_to_builder_90pct</span> automatically.
          </p>
          <label className="block space-y-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300">
            <span>Monthly App Gross Revenue (USD)</span>
            <input
              type="number"
              min={0}
              step={10}
              value={simGross}
              onChange={(e) => setSimGross(Math.max(0, Number(e.target.value)))}
              className="w-full rounded-lg border border-[#E5E1D8] dark:border-[#252A38] bg-[#FAF9F6] dark:bg-[#0B0D12] px-3 py-2 text-sm font-mono tabular-nums text-[#14161F] dark:text-[#F4F1EA]"
            />
          </label>
          <div className="divide-y divide-[#E5E1D8] dark:divide-[#252A38] rounded-lg border border-[#E5E1D8] dark:border-[#252A38] text-xs font-mono tabular-nums">
            <div className="flex justify-between px-3.5 py-2.5">
              <span className="text-neutral-500">gross_amount</span>
              <span className="font-semibold">${simGross.toFixed(2)}</span>
            </div>
            <div className="flex justify-between px-3.5 py-2.5">
              <span className="text-neutral-500">platform_fee_10pct</span>
              <span className="font-semibold text-[#B4861C] dark:text-[#E5C158]">
                ${(simGross * 0.1).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between px-3.5 py-2.5">
              <span className="text-neutral-500">net_to_builder_90pct</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                ${(simGross * 0.9).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 rounded-xl border border-[#E5E1D8] dark:border-[#252A38] bg-white dark:bg-[#12151E] p-6 space-y-4">
          <h3 className="text-base font-semibold text-[#14161F] dark:text-[#F4F1EA]">
            3-Platform Infrastructure Cost Reality
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="rounded-lg border border-[#E5E1D8] dark:border-[#252A38] p-4 space-y-2">
              <div className="font-semibold text-[#14161F] dark:text-[#F4F1EA]">Launch Phase</div>
              <div className="text-lg font-bold font-mono text-[#B4861C] dark:text-[#E5C158]">$0 / mo</div>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Supabase Free (500 MB DB, 500K Edge invocations), GitHub Pages Free, and AI Studio starter build.
              </p>
            </div>
            <div className="rounded-lg border border-[#E5E1D8] dark:border-[#252A38] p-4 space-y-2">
              <div className="font-semibold text-[#14161F] dark:text-[#F4F1EA]">Always-On Global</div>
              <div className="text-lg font-bold font-mono text-[#14161F] dark:text-[#F4F1EA]">$25–$300+/mo</div>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Supabase Pro removes 7-day pause, raises DB to 8 GB, 250 GB egress, and 2M Edge invocations/mo.
              </p>
            </div>
            <div className="rounded-lg border border-[#E5E1D8] dark:border-[#252A38] p-4 space-y-2">
              <div className="font-semibold text-[#14161F] dark:text-[#F4F1EA]">High-Volume Scale</div>
              <div className="text-lg font-bold font-mono text-[#14161F] dark:text-[#F4F1EA]">$500–$3,500+/mo</div>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Driven by larger Postgres compute, API bandwidth, MAUs above 100K, and optional runtime AI calls.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Ledger Table */}
      <div className="rounded-xl border border-[#E5E1D8] dark:border-[#252A38] bg-white dark:bg-[#12151E] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E5E1D8] dark:border-[#252A38]">
          <h3 className="text-sm font-semibold text-[#14161F] dark:text-[#F4F1EA]">
            PostgreSQL Revenue Ledger (revenue_transactions)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#E5E1D8] dark:border-[#252A38] text-neutral-500 dark:text-neutral-400 bg-[#FAF9F6] dark:bg-[#0B0D12]">
              <tr>
                <th className="py-3 px-4 font-medium">App</th>
                <th className="py-3 px-4 font-medium">Builder</th>
                <th className="py-3 px-4 font-medium text-right">Gross</th>
                <th className="py-3 px-4 font-medium text-right">PenDone (10%)</th>
                <th className="py-3 px-4 font-medium text-right">Builder Net (90%)</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E1D8] dark:divide-[#252A38] font-mono tabular-nums">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#FAF9F6] dark:hover:bg-[#0B0D12]/60">
                  <td className="py-3 px-4 font-sans font-medium text-[#14161F] dark:text-[#F4F1EA]">
                    {tx.appName}
                  </td>
                  <td className="py-3 px-4 font-sans text-neutral-600 dark:text-neutral-300">
                    {tx.builderName}
                  </td>
                  <td className="py-3 px-4 text-right">${tx.grossAmount.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right text-[#B4861C] dark:text-[#E5C158]">
                    ${tx.platformFee10Pct.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right text-emerald-600 dark:text-emerald-400">
                    ${tx.netToBuilder90Pct.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 font-sans text-neutral-600 dark:text-neutral-300">
                    {tx.status}
                  </td>
                  <td className="py-3 px-4 text-right text-neutral-500">{tx.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* API Metering Logs Table */}
      <div className="rounded-xl border border-[#E5E1D8] dark:border-[#252A38] bg-white dark:bg-[#12151E] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E5E1D8] dark:border-[#252A38]">
          <h3 className="text-sm font-semibold text-[#14161F] dark:text-[#F4F1EA]">
            Metered Edge Gateway Logs (api_usage_logs)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#E5E1D8] dark:border-[#252A38] text-neutral-500 dark:text-neutral-400 bg-[#FAF9F6] dark:bg-[#0B0D12]">
              <tr>
                <th className="py-3 px-4 font-medium">App Slug</th>
                <th className="py-3 px-4 font-medium">Action</th>
                <th className="py-3 px-4 font-medium text-right">Calls</th>
                <th className="py-3 px-4 font-medium text-right">Bytes</th>
                <th className="py-3 px-4 font-medium text-right">HTTP</th>
                <th className="py-3 px-4 font-medium text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E1D8] dark:divide-[#252A38] font-mono tabular-nums">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-[#FAF9F6] dark:hover:bg-[#0B0D12]/60">
                  <td className="py-3 px-4 font-medium text-[#14161F] dark:text-[#F4F1EA]">
                    {log.appSlug}
                  </td>
                  <td className="py-3 px-4 text-neutral-600 dark:text-neutral-300">{log.action}</td>
                  <td className="py-3 px-4 text-right">{log.apiCalls}</td>
                  <td className="py-3 px-4 text-right">{log.bytesTransferred} B</td>
                  <td
                    className={`py-3 px-4 text-right font-semibold ${
                      log.statusCode >= 400
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {log.statusCode}
                  </td>
                  <td className="py-3 px-4 text-right text-neutral-500">{log.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
