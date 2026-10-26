import React from 'react';
import { Stage7ForecastData } from '../../../types/cost-economics';
import { TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { formatCurrency } from '../../../utils/calculations';

interface Stage7LifecycleForecastProps {
  data: Stage7ForecastData;
  baselineMonthlyCostUSD: number;
  onChange: (data: Stage7ForecastData) => void;
  currency: string;
}

export const Stage7LifecycleForecast: React.FC<Stage7LifecycleForecastProps> = ({
  data,
  baselineMonthlyCostUSD,
  onChange,
  currency,
}) => {
  const trajectories: Stage7ForecastData['rampUpTrajectory'][] = [
    'Standard S-Curve',
    'Fast Ramp (Pilot to Enterprise)',
    'Steady Linear',
  ];

  // Year 1 reflects ramp-up factor across initial rollout
  const y1AnnualCost = baselineMonthlyCostUSD * 12 * data.y1RampFactor;
  // Year 2 reflects steady state plus year-2 user base growth
  const y2AnnualCost = baselineMonthlyCostUSD * 12 * (1 + data.y2GrowthPct / 100);
  // Year 3 reflects compounding enterprise scale
  const y3AnnualCost = y2AnnualCost * (1 + data.y3GrowthPct / 100);

  const total36MonthsOperatingCost = y1AnnualCost + y2AnnualCost + y3AnnualCost;

  // Quarterly projection bars for visual ramp representation
  const quarters = [
    { q: 'Y1 Q1', factor: data.y1RampFactor * 0.4, label: 'Pilot Launch' },
    { q: 'Y1 Q2', factor: data.y1RampFactor * 0.7, label: 'Dept Expansion' },
    { q: 'Y1 Q3', factor: data.y1RampFactor * 1.1, label: 'Org Rollout' },
    { q: 'Y1 Q4', factor: data.y1RampFactor * 1.4, label: 'Full Production' },
    { q: 'Y2 Q1', factor: (1 + data.y2GrowthPct / 100) * 0.9, label: 'Scaling' },
    { q: 'Y2 Q2', factor: (1 + data.y2GrowthPct / 100) * 0.97, label: 'Scaling' },
    { q: 'Y2 Q3', factor: (1 + data.y2GrowthPct / 100) * 1.03, label: 'Optimization' },
    { q: 'Y2 Q4', factor: (1 + data.y2GrowthPct / 100) * 1.1, label: 'Year 2 Peak' },
    { q: 'Y3 Q1', factor: (y3AnnualCost / (baselineMonthlyCostUSD * 12)) * 0.95, label: 'Maturity' },
    { q: 'Y3 Q2', factor: (y3AnnualCost / (baselineMonthlyCostUSD * 12)) * 0.98, label: 'Maturity' },
    { q: 'Y3 Q3', factor: (y3AnnualCost / (baselineMonthlyCostUSD * 12)) * 1.02, label: 'Continuous Ops' },
    { q: 'Y3 Q4', factor: (y3AnnualCost / (baselineMonthlyCostUSD * 12)) * 1.05, label: 'Year 3 Peak' },
  ];

  const maxQuarterCost = Math.max(
    ...quarters.map((q) => (baselineMonthlyCostUSD * 3 * q.factor))
  );

  return (
    <div className="space-y-6">
      {/* Stage Header */}
      <div>
        <h3 className="text-base font-bold text-slate-900">
          Stage 7: Build Lifecycle Operating Cost Forecast (36 Months)
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Model multi-year production adoption curves, phased organizational roll-out ramps, and annual growth trajectories over a 3-year operating horizon.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Ramp Controls & Annual Totals */}
        <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              Ramp-Up Curve & Phased Growth Parameters
            </h4>
            <span className="text-[11px] text-slate-500 font-mono-numbers">
              Baseline: {formatCurrency(baselineMonthlyCostUSD, currency)}/mo
            </span>
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-600 block mb-1.5">
              Adoption Ramp-Up Trajectory
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {trajectories.map((traj) => (
                <button
                  key={traj}
                  type="button"
                  onClick={() => onChange({ ...data, rampUpTrajectory: traj })}
                  className={`p-2.5 text-left rounded-lg border transition-all cursor-pointer ${
                    data.rampUpTrajectory === traj
                      ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-500 font-medium'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="font-semibold text-slate-900 text-xs mb-0.5">{traj}</div>
                  <div className="text-[10px] text-slate-500">
                    {traj === 'Standard S-Curve'
                      ? 'Gradual pilot phase with mid-year acceleration.'
                      : traj === 'Fast Ramp (Pilot to Enterprise)'
                      ? 'Rapid organization-wide rollout within 3 months.'
                      : 'Even linear user onboarding quarter over quarter.'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-[10px] text-slate-500 uppercase font-medium block">
                Year 1 Ramp Factor
              </label>
              <input
                type="number"
                step="0.05"
                min="0.2"
                max="1.0"
                value={data.y1RampFactor}
                onChange={(e) =>
                  onChange({
                    ...data,
                    y1RampFactor: Math.min(
                      1.0,
                      Math.max(0.1, parseFloat(e.target.value) || 0.5)
                    ),
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-md px-2.5 py-1.5 font-mono-numbers text-xs mt-0.5"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Effective fraction of steady baseline incurred in Year 1 during onboarding.
              </span>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 uppercase font-medium block">
                Year 2 Growth Rate (%)
              </label>
              <input
                type="number"
                step="5"
                min="0"
                max="200"
                value={data.y2GrowthPct}
                onChange={(e) =>
                  onChange({
                    ...data,
                    y2GrowthPct: Math.max(0, parseFloat(e.target.value) || 0),
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-md px-2.5 py-1.5 font-mono-numbers text-xs mt-0.5"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Expected growth in queries and user adoption over steady baseline.
              </span>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 uppercase font-medium block">
                Year 3 Growth Rate (%)
              </label>
              <input
                type="number"
                step="5"
                min="0"
                max="200"
                value={data.y3GrowthPct}
                onChange={(e) =>
                  onChange({
                    ...data,
                    y3GrowthPct: Math.max(0, parseFloat(e.target.value) || 0),
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-md px-2.5 py-1.5 font-mono-numbers text-xs mt-0.5"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Year-over-year compounding growth in Year 3.
              </span>
            </div>
          </div>

          {/* Visual 12-Quarter Ramp Progression */}
          <div className="pt-2">
            <h5 className="text-[11px] font-semibold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
              12-Quarter Operating Ramp Trajectory
            </h5>
            <div className="grid grid-cols-12 gap-1 h-24 items-end bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              {quarters.map((q, idx) => {
                const quarterCost = baselineMonthlyCostUSD * 3 * q.factor;
                const heightPct = Math.min(100, (quarterCost / maxQuarterCost) * 100);

                return (
                  <div
                    key={q.q}
                    className="flex flex-col items-center h-full justify-end group relative"
                  >
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-t transition-all ${
                        idx < 4
                          ? 'bg-blue-400 group-hover:bg-blue-500'
                          : idx < 8
                          ? 'bg-indigo-500 group-hover:bg-indigo-600'
                          : 'bg-indigo-700 group-hover:bg-indigo-800'
                      }`}
                    />
                    <span className="text-[9px] text-slate-400 font-mono-numbers mt-1 truncate">
                      {q.q.replace(' ', '')}
                    </span>

                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full mb-1 hidden group-hover:block z-10 bg-slate-900 text-white text-[10px] rounded px-1.5 py-0.5 whitespace-nowrap shadow-md pointer-events-none font-mono-numbers">
                      {q.q}: {formatCurrency(quarterCost, currency)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Annualized Totals */}
        <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide pb-2 border-b border-slate-200 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              Annual Operating Distribution
            </h4>

            <div className="space-y-3 mt-3">
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                  Year 1 Operating Cost (Y1)
                </span>
                <span className="text-lg font-bold text-slate-900 font-mono-numbers">
                  {formatCurrency(y1AnnualCost, currency)}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Rollout & ramp-up phase (factor: {data.y1RampFactor}x)
                </span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                  Year 2 Operating Cost (Y2)
                </span>
                <span className="text-lg font-bold text-slate-900 font-mono-numbers">
                  {formatCurrency(y2AnnualCost, currency)}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Full production baseline + {data.y2GrowthPct}% growth
                </span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                  Year 3 Operating Cost (Y3)
                </span>
                <span className="text-lg font-bold text-slate-900 font-mono-numbers">
                  {formatCurrency(y3AnnualCost, currency)}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Compounding scale + {data.y3GrowthPct}% growth
                </span>
              </div>

              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg mt-3">
                <span className="text-[10px] text-indigo-800 uppercase font-bold block">
                  Expected Operating Cost - 36 Months
                </span>
                <span className="text-xl font-bold text-indigo-900 font-mono-numbers">
                  {formatCurrency(total36MonthsOperatingCost, currency)}
                </span>
                <span className="text-[10px] text-indigo-700 block mt-0.5">
                  Total 3-year runtime operational expenditure
                </span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-200">
            Lifecycle figures feed into Stage 8 Decision Dashboard
          </div>
        </div>
      </div>
    </div>
  );
};
