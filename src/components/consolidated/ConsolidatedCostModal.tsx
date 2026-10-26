import React, { useState } from 'react';
import {
  ProposalMetadata,
  BuildCostState,
  RunStageState,
  RunConfigSetup,
  LicenseCostState,
  AssureCostState,
} from '../../types/cost-economics';
import {
  calculateConsolidatedSummary,
  calculateRunCosts,
  calculateBuildCosts,
  calculateLicenseCosts,
  calculateAssureCosts,
  formatCurrency,
} from '../../utils/calculations';
import {
  X,
  PieChart,
  Copy,
  Check,
  Download,
  Hammer,
  PlayCircle,
  KeyRound,
  ShieldAlert,
  TrendingUp,
  Cpu,
  Users,
} from 'lucide-react';

interface ConsolidatedCostModalProps {
  isOpen: boolean;
  onClose: () => void;
  metadata: ProposalMetadata;
  buildData: BuildCostState;
  runState: RunStageState;
  runConfig: RunConfigSetup;
  licenseData: LicenseCostState;
  assureData: AssureCostState;
  currency: string;
}

export const ConsolidatedCostModal: React.FC<ConsolidatedCostModalProps> = ({
  isOpen,
  onClose,
  metadata,
  buildData,
  runState,
  runConfig,
  licenseData,
  assureData,
  currency,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const consolidated = calculateConsolidatedSummary(
    buildData,
    runState,
    runConfig,
    licenseData,
    assureData
  );

  const runCalc = calculateRunCosts(runState, runConfig);
  const buildCalc = calculateBuildCosts(buildData);
  const licenseCalc = calculateLicenseCosts(licenseData);
  const assureCalc = calculateAssureCosts(assureData);

  const buildShare = consolidated.grandTotal36Months > 0
    ? (consolidated.buildTotal / consolidated.grandTotal36Months) * 100
    : 0;
  const runShare = consolidated.grandTotal36Months > 0
    ? (consolidated.run36MonthsTotal / consolidated.grandTotal36Months) * 100
    : 0;
  const licenseShare = consolidated.grandTotal36Months > 0
    ? (consolidated.licenseTotal / consolidated.grandTotal36Months) * 100
    : 0;
  const assureShare = consolidated.grandTotal36Months > 0
    ? (consolidated.assureTotal / consolidated.grandTotal36Months) * 100
    : 0;

  const generateMarkdownSummary = () => {
    return `# AI Cost Economics Proposal Summary: ${metadata.title}
**Client**: ${metadata.clientName}
**Stage**: ${metadata.stage} | **Currency**: ${metadata.currency} | **Version**: ${metadata.version}
**Generated Date**: ${new Date().toISOString().split('T')[0]}

---

## 1. Executive Total Cost of Ownership (36 Months)
- **Grand Total AI Proposal Cost**: ${formatCurrency(consolidated.grandTotal36Months, currency)}
- **One-Time Capex (BUILD Pool)**: ${formatCurrency(consolidated.buildTotal, currency)} (${consolidated.capexShare}%)
- **Recurring 36-Month Opex (RUN + LICENSE + ASSURE)**: ${formatCurrency(consolidated.grandTotal36Months - consolidated.buildTotal, currency)} (${consolidated.opexShare}%)

---

## 2. Cost Pools Breakdown
| Cost Pool | Financial Scope | 36-Month Total | Share (%) |
| :--- | :--- | :---: | :---: |
| **BUILD** | AI Setup & Indexing, Training Compute, Pipeline AI Work, Staging, Review Gates | ${formatCurrency(consolidated.buildTotal, currency)} | ${buildShare.toFixed(1)}% |
| **RUN** | 8-Stage Sequential Production Inference & Ops | ${formatCurrency(consolidated.run36MonthsTotal, currency)} | ${runShare.toFixed(1)}% |
| **LICENSE** | Enterprise Software Subscriptions (ServiceNow, Datadog, etc.) | ${formatCurrency(consolidated.licenseTotal, currency)} | ${licenseShare.toFixed(1)}% |
| **ASSURE** | Continuous Red-Teaming, RAG Accuracy & Compliance | ${formatCurrency(consolidated.assureTotal, currency)} | ${assureShare.toFixed(1)}% |
| **SUM OF ALL POOLS** | **Total Comprehensive AI System Cost** | **${formatCurrency(consolidated.grandTotal36Months, currency)}** | **100.0%** |

---

## 3. RUN Cost Pool Key Metrics
- **Expected Operating Cost - 36 Months**: ${formatCurrency(consolidated.run36MonthsTotal, currency)}
- **Current Baseline Cost / Month**: ${formatCurrency(consolidated.runBaselineMonthly, currency)}
- **Human Review Share - Base Cost**: ${formatCurrency(consolidated.runHumanReviewBaseCost, currency)} / month (${runCalc.humanReviewSharePct.toFixed(1)}% of baseline)
- **Annual Operating Horizon**:
  - Year 1 (Y1): ${formatCurrency(consolidated.runAnnualY1, currency)}
  - Year 2 (Y2): ${formatCurrency(consolidated.runAnnualY2, currency)}
  - Year 3 (Y3): ${formatCurrency(consolidated.runAnnualY3, currency)}
- **Cost by Architecture Breakdown**:
${runCalc.costByArchitecture.map(a => `  - ${a.archetype}: ${formatCurrency(a.amountUSD, currency)} (${a.sharePct}%)`).join('\n')}
`;
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdownSummary());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const payload = {
      metadata,
      consolidatedSummary: consolidated,
      pools: {
        build: { data: buildData, calculation: buildCalc },
        run: { data: runState, calculation: runCalc },
        license: { data: licenseData, calculation: licenseCalc },
        assure: { data: assureData, calculation: assureCalc },
      },
      runConfig,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AI_Cost_Economics_${metadata.clientName.replace(/\s+/g, '_')}_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <PieChart className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Consolidated AI Cost Economics & Proposal Roll-Up
                </h2>
                <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                  {metadata.stage}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {metadata.title} · Client: <strong>{metadata.clientName}</strong> · Ver: {metadata.version}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          {/* Top Banner KPI: Total Cost & Capex/Opex Split */}
          <div className="bg-slate-900 text-white p-5 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">
                Total AI Proposal Economics (36-Month Horizon)
              </span>
              <div className="text-3xl font-extrabold font-mono-numbers tracking-tight mt-0.5 text-white">
                {formatCurrency(consolidated.grandTotal36Months, currency)}
              </div>
              <span className="text-xs text-indigo-300 block mt-1">
                Sum of BUILD, RUN, LICENSE, and ASSURE Cost Pools
              </span>
            </div>

            {/* Capex vs Opex Split Bar */}
            <div className="w-full md:w-80 space-y-2 bg-slate-800/80 p-3.5 rounded-lg border border-slate-700">
              <div className="flex items-center justify-between text-xs">
                <span>
                  Capex (BUILD): <strong className="font-mono-numbers">{consolidated.capexShare}%</strong>
                </span>
                <span>
                  Opex (Recurring): <strong className="font-mono-numbers">{consolidated.opexShare}%</strong>
                </span>
              </div>
              <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${consolidated.capexShare}%` }}
                  className="bg-blue-400 h-full"
                  title="Capex (Build)"
                />
                <div
                  style={{ width: `${consolidated.opexShare}%` }}
                  className="bg-indigo-500 h-full"
                  title="Opex (Run + License + Assure)"
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>{formatCurrency(consolidated.buildTotal, currency)}</span>
                <span>{formatCurrency(consolidated.grandTotal36Months - consolidated.buildTotal, currency)}</span>
              </div>
            </div>
          </div>

          {/* 4 Cost Pools Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-semibold text-slate-800 flex items-center justify-between">
              <span>Cost Pools Breakdown Summary</span>
              <span className="text-[11px] text-slate-500 font-normal">
                4 Pools · Single Unified View
              </span>
            </div>

            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-semibold text-slate-500 bg-slate-50/50">
                  <th className="py-2.5 px-4">Cost Pool</th>
                  <th className="py-2.5 px-4">Scope & AI Cost Focus</th>
                  <th className="py-2.5 px-4 text-right">36-Month Amount</th>
                  <th className="py-2.5 px-4 text-right">Share of Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono-numbers">
                {/* BUILD */}
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2 font-sans">
                    <Hammer className="w-4 h-4 text-blue-600" />
                    BUILD Cost Pool
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-sans">
                    AI Setup & Indexing, Training Compute, Pipeline AI Work, Staging Sandbox, Review Gates (One-Time)
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-900">
                    {formatCurrency(consolidated.buildTotal, currency)}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-500">{buildShare.toFixed(1)}%</td>
                </tr>

                {/* RUN */}
                <tr className="hover:bg-slate-50/50 bg-indigo-50/15">
                  <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2 font-sans">
                    <PlayCircle className="w-4 h-4 text-indigo-600" />
                    RUN Cost Pool
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-sans">
                    8-Stage Production Workload, Token Inference, Vector DB, Hosting, Human Review
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-indigo-700">
                    {formatCurrency(consolidated.run36MonthsTotal, currency)}
                  </td>
                  <td className="py-3 px-4 text-right text-indigo-700 font-semibold">
                    {runShare.toFixed(1)}%
                  </td>
                </tr>

                {/* LICENSE */}
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2 font-sans">
                    <KeyRound className="w-4 h-4 text-emerald-600" />
                    LICENSE Cost Pool
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-sans">
                    Enterprise Software (ServiceNow, Datadog, MS Copilot, Pinecone Pods)
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-900">
                    {formatCurrency(consolidated.licenseTotal, currency)}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-500">{licenseShare.toFixed(1)}%</td>
                </tr>

                {/* ASSURE */}
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2 font-sans">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    ASSURE Cost Pool
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-sans">
                    AI Risk Assessment, Automated Red-Teaming, RAG Accuracy, EU AI Act Audits
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-900">
                    {formatCurrency(consolidated.assureTotal, currency)}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-500">{assureShare.toFixed(1)}%</td>
                </tr>

                {/* SUM */}
                <tr className="bg-slate-50 font-bold border-t-2 border-slate-300 text-sm">
                  <td className="py-3 px-4 text-slate-900 font-sans" colSpan={2}>
                    SUM OF ALL 4 COST POOLS
                  </td>
                  <td className="py-3 px-4 text-right text-slate-950 font-extrabold font-mono-numbers">
                    {formatCurrency(consolidated.grandTotal36Months, currency)}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-900">100.0%</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Special RUN Cost Pool Summarized Metrics Section */}
          <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <PlayCircle className="w-4 h-4 text-indigo-600" />
                RUN Cost Pool Detailed Operational Breakdown
              </h4>
              <span className="text-[11px] text-slate-500 font-mono-numbers">
                36-Month Horizon
              </span>
            </div>

            {/* 3 Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 bg-white border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Expected Operating Cost - 36 Months
                </span>
                <span className="text-xl font-bold text-slate-900 font-mono-numbers block mt-1">
                  {formatCurrency(consolidated.run36MonthsTotal, currency)}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Cumulative runtime expenditure
                </span>
              </div>

              <div className="p-3.5 bg-white border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Current Baseline Cost / Month (USD)
                </span>
                <span className="text-xl font-bold text-slate-900 font-mono-numbers block mt-1">
                  {formatCurrency(consolidated.runBaselineMonthly, currency)}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Monthly steady-state run-rate
                </span>
              </div>

              <div className="p-3.5 bg-white border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Human Review Share - Base Cost
                </span>
                <span className="text-xl font-bold text-indigo-700 font-mono-numbers block mt-1">
                  {formatCurrency(consolidated.runHumanReviewBaseCost, currency)}
                  <span className="text-xs font-normal text-slate-500 ml-1">/ mo</span>
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  {runCalc.humanReviewSharePct.toFixed(1)}% of baseline for SME quality audit
                </span>
              </div>
            </div>

            {/* Annual Horizon & Architecture Split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
              {/* Annual Operating Cost Y1, Y2, Y3 */}
              <div className="p-3.5 bg-white border border-slate-200 rounded-lg space-y-2">
                <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wide block">
                  Annual Operating Cost (Y1, Y2, Y3)
                </span>
                <div className="space-y-1.5 text-xs font-mono-numbers">
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                    <span className="font-sans font-medium text-slate-700">Year 1 (Y1):</span>
                    <span className="font-bold text-slate-900">
                      {formatCurrency(consolidated.runAnnualY1, currency)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                    <span className="font-sans font-medium text-slate-700">Year 2 (Y2):</span>
                    <span className="font-bold text-slate-900">
                      {formatCurrency(consolidated.runAnnualY2, currency)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                    <span className="font-sans font-medium text-slate-700">Year 3 (Y3):</span>
                    <span className="font-bold text-slate-900">
                      {formatCurrency(consolidated.runAnnualY3, currency)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cost by Architecture Breakdown */}
              <div className="p-3.5 bg-white border border-slate-200 rounded-lg space-y-2">
                <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wide block">
                  Cost by Architecture Component
                </span>
                <div className="space-y-1.5 text-xs">
                  {runCalc.costByArchitecture.map((arch) => (
                    <div
                      key={arch.archetype}
                      className="flex items-center justify-between p-2 bg-slate-50 rounded text-[11px]"
                    >
                      <span className="text-slate-700 truncate">{arch.archetype}</span>
                      <div className="flex items-center gap-2 font-mono-numbers shrink-0">
                        <span className="font-semibold text-slate-900">
                          {formatCurrency(arch.amountUSD, currency)}
                        </span>
                        <span className="text-slate-400 text-[10px]">({arch.sharePct}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer with Export Utilities */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-md font-medium transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Proposal Summary (Markdown)</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadJson}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-md font-medium transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Schema JSON</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
