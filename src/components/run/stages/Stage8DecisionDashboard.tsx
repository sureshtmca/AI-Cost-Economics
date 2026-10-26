import React from 'react';
import {
  Stage8DashboardData,
  RunStageState,
  RunConfigSetup,
} from '../../../types/cost-economics';
import { calculateRunCosts, formatCurrency, formatNumber } from '../../../utils/calculations';
import { CheckCircle2, TrendingUp, Users, Cpu, FileText, ArrowUpRight } from 'lucide-react';

interface Stage8DecisionDashboardProps {
  runState: RunStageState;
  config: RunConfigSetup;
  currency: string;
  onOpenConsolidated: () => void;
}

export const Stage8DecisionDashboard: React.FC<Stage8DecisionDashboardProps> = ({
  runState,
  config,
  currency,
  onOpenConsolidated,
}) => {
  const calc = calculateRunCosts(runState, config);

  return (
    <div className="space-y-6">
      {/* Stage Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Stage 8: RUN Decision Dashboard & Executive Financials
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Pipeline Complete
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl">
            Synthesized operational cost economics derived from the 8-stage RUN workflow. Ready for RFP/RFI proposal budget presentation and client submission.
          </p>
        </div>

        <button
          onClick={onOpenConsolidated}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <span>View Full Multi-Pool Consolidated Roll-Up</span>
          <ArrowUpRight className="w-4 h-4 text-indigo-300" />
        </button>
      </div>

      {/* Top 3 Core Summarized Metric KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              Expected Operating Cost - 36 Months
            </span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono-numbers tracking-tight">
            {formatCurrency(calc.expectedOperatingCost36Months, currency)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Total 3-Year runtime expenditure factoring phased ramp & growth
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              Current Baseline Cost / Month (USD)
            </span>
            <Cpu className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono-numbers tracking-tight">
            {formatCurrency(calc.baselineMonthlyCostUSD, currency)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Steady-state monthly run-rate (tokens + vector DB + GPU + audit)
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              Human Review Share - Base Cost
            </span>
            <Users className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-indigo-700 font-mono-numbers tracking-tight">
            {formatCurrency(calc.humanReviewBaseCostMonthly, currency)}
            <span className="text-xs font-normal text-slate-500 ml-1.5 font-sans">
              / mo ({calc.humanReviewSharePct.toFixed(1)}%)
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {config.rules.humanReviewAuditRatePct}% sampled production queries audited by AI-assisted SMEs
          </div>
        </div>
      </div>

      {/* Middle Grid: Annual Operating Cost (Y1, Y2, Y3) & Cost by Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Annual Operating Cost Table & Details */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Annual Operating Cost Horizon (Y1, Y2, Y3)
            </h4>
            <span className="text-[11px] text-slate-500 font-mono-numbers">
              Trajectory: {runState.stage7.rampUpTrajectory}
            </span>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
                  <th className="py-2.5 px-3">Horizon</th>
                  <th className="py-2.5 px-3">Adoption & Ramp Stage</th>
                  <th className="py-2.5 px-3 text-right">Annual Cost</th>
                  <th className="py-2.5 px-3 text-right">Share of RUN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono-numbers">
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-semibold text-slate-800">Year 1 (Y1)</td>
                  <td className="py-2.5 px-3 text-slate-500 font-sans">
                    Initial Rollout & Pilot Ramp ({runState.stage7.y1RampFactor}x factor)
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                    {formatCurrency(calc.y1AnnualCost, currency)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-500">
                    {calc.expectedOperatingCost36Months > 0
                      ? ((calc.y1AnnualCost / calc.expectedOperatingCost36Months) * 100).toFixed(1)
                      : 0}
                    %
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-semibold text-slate-800">Year 2 (Y2)</td>
                  <td className="py-2.5 px-3 text-slate-500 font-sans">
                    Full Production Steady State (+{runState.stage7.y2GrowthPct}% growth)
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                    {formatCurrency(calc.y2AnnualCost, currency)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-500">
                    {calc.expectedOperatingCost36Months > 0
                      ? ((calc.y2AnnualCost / calc.expectedOperatingCost36Months) * 100).toFixed(1)
                      : 0}
                    %
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-semibold text-slate-800">Year 3 (Y3)</td>
                  <td className="py-2.5 px-3 text-slate-500 font-sans">
                    Compounding Enterprise Scale (+{runState.stage7.y3GrowthPct}% growth)
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                    {formatCurrency(calc.y3AnnualCost, currency)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-500">
                    {calc.expectedOperatingCost36Months > 0
                      ? ((calc.y3AnnualCost / calc.expectedOperatingCost36Months) * 100).toFixed(1)
                      : 0}
                    %
                  </td>
                </tr>
                <tr className="bg-slate-50/80 font-bold border-t border-slate-200">
                  <td className="py-2.5 px-3 text-slate-900 font-sans">Total 36-Months</td>
                  <td className="py-2.5 px-3 text-slate-500 font-sans">Cumulative RUN Cost</td>
                  <td className="py-2.5 px-3 text-right text-indigo-700">
                    {formatCurrency(calc.expectedOperatingCost36Months, currency)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-700">100.0%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
            <span className="font-semibold text-slate-700 block">
              Budget Planning Takeaway
            </span>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Year 1 represents an efficient entry ramp with only {((calc.y1AnnualCost / calc.expectedOperatingCost36Months) * 100).toFixed(0)}% of the total 3-year runtime budget, allowing leadership to validate adoption KPIs before scaling into Year 2 and Year 3.
            </p>
          </div>
        </div>

        {/* Cost by Architecture Breakdown */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Cost by Architecture Component
            </h4>
            <span className="text-[11px] text-slate-500">
              Archetype: {runState.stage1.architectureArchetype}
            </span>
          </div>

          {/* Visual Bar Distribution */}
          <div className="space-y-3">
            {calc.costByArchitecture.map((item) => (
              <div key={item.archetype} className="space-y-1 text-xs">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="font-medium text-[11px]">{item.archetype}</span>
                  <div className="flex items-center gap-2 font-mono-numbers">
                    <span className="font-semibold text-slate-900">
                      {formatCurrency(item.amountUSD, currency)}
                    </span>
                    <span className="text-slate-400 text-[10px]">({item.sharePct}%)</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${item.sharePct}%` }}
                    className={`h-full rounded-full ${
                      item.archetype.includes('Inference')
                        ? 'bg-indigo-600'
                        : item.archetype.includes('Vector')
                        ? 'bg-blue-500'
                        : item.archetype.includes('Hosting')
                        ? 'bg-slate-700'
                        : 'bg-amber-500'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Model Tier Bound:</span>
              <span className="font-semibold text-slate-800">
                {runState.stage4.primaryModelTier}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>SLA Target Commitment:</span>
              <span className="font-semibold text-slate-800">
                {runState.stage5.slaTier} (&lt; {runState.stage5.p95LatencyBudgetMs}ms)
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Prompt Cache Benefit:</span>
              <span className="font-semibold text-emerald-600 font-mono-numbers">
                {runState.stage4.promptCacheHitRatePct}% Hit Rate Applied
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
