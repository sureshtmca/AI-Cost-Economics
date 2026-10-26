import React from 'react';
import { Stage2DemandData } from '../../../types/cost-economics';
import { Users, Activity, TrendingUp, DollarSign } from 'lucide-react';
import { formatNumber } from '../../../utils/calculations';

interface Stage2DemandAssumptionsProps {
  data: Stage2DemandData;
  onChange: (data: Stage2DemandData) => void;
}

export const Stage2DemandAssumptions: React.FC<Stage2DemandAssumptionsProps> = ({
  data,
  onChange,
}) => {
  const dailyQueries = data.monthlyActiveUsers * data.queriesPerUserPerDay;
  const monthlyTotalQueries = dailyQueries * data.workingDaysPerMonth;

  // Assuming an 8-hour workday distribution for peak concurrency sizing:
  // 8 hours = 28,800 seconds. Avg QPS = dailyQueries / 28,800. Peak QPS = Avg QPS * peakMultiplier
  const averageQps = dailyQueries / 28800;
  const peakQps = averageQps * data.peakConcurrencyMultiplier;

  return (
    <div className="space-y-6">
      {/* Stage Header */}
      <div>
        <h3 className="text-base font-bold text-slate-900">
          Stage 2: Establish Demand, Usage & Value Assumptions
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Quantify active user reach, usage frequency, and concurrency spikes to establish the foundational transaction baseline.
        </p>
      </div>

      {/* 2-Column Split: Inputs vs Derived Demand Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Assumptions Form */}
        <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide pb-2 border-b border-slate-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            User Population & Transaction Frequency
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">
                Monthly Active Users (MAU)
              </label>
              <input
                type="number"
                min="10"
                step="100"
                value={data.monthlyActiveUsers}
                onChange={(e) =>
                  onChange({
                    ...data,
                    monthlyActiveUsers: Math.max(1, parseInt(e.target.value) || 1),
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-md px-3 py-2 font-mono-numbers text-xs text-slate-800"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Total unique enterprise seats or customer accounts using the AI system.
              </span>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">
                Queries / User / Day
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={data.queriesPerUserPerDay}
                onChange={(e) =>
                  onChange({
                    ...data,
                    queriesPerUserPerDay: Math.max(1, parseInt(e.target.value) || 1),
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-md px-3 py-2 font-mono-numbers text-xs text-slate-800"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Average number of prompts, search queries, or agent triggers per user daily.
              </span>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">
                Working Days per Month
              </label>
              <input
                type="number"
                min="1"
                max="31"
                value={data.workingDaysPerMonth}
                onChange={(e) =>
                  onChange({
                    ...data,
                    workingDaysPerMonth: Math.min(
                      31,
                      Math.max(1, parseInt(e.target.value) || 22)
                    ),
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-md px-3 py-2 font-mono-numbers text-xs text-slate-800"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                22 days for enterprise B2B staff; 30 days for 24/7 consumer customer facing.
              </span>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">
                Peak Concurrency Multiplier (Peak / Avg)
              </label>
              <input
                type="number"
                min="1.0"
                step="0.1"
                value={data.peakConcurrencyMultiplier}
                onChange={(e) =>
                  onChange({
                    ...data,
                    peakConcurrencyMultiplier: Math.max(
                      1.0,
                      parseFloat(e.target.value) || 1.0
                    ),
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-md px-3 py-2 font-mono-numbers text-xs text-slate-800"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Peak burst ratio (e.g. 1.8x) used to size throughput limits and latency buffers.
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <label className="text-[11px] font-medium text-slate-600 block mb-1">
              Business Value & ROI Context Summary
            </label>
            <textarea
              rows={2}
              value={data.businessValueSummary}
              onChange={(e) =>
                onChange({ ...data, businessValueSummary: e.target.value })
              }
              placeholder="e.g. Accelerate loan underwriting review cycles from 4 days to 45 minutes while improving compliance adherence."
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-md px-3 py-2 text-xs text-slate-800"
            />
          </div>
        </div>

        {/* Right Col: Derived Volume Cards */}
        <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide pb-2 border-b border-slate-200 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-600" />
              Derived Demand Roll-Up
            </h4>

            <div className="space-y-3 mt-3">
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                  Daily Transaction Volume
                </span>
                <span className="text-lg font-bold text-slate-900 font-mono-numbers">
                  {formatNumber(dailyQueries)}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Queries processed per business day
                </span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                  Total Monthly Execution Demand
                </span>
                <span className="text-xl font-bold text-indigo-600 font-mono-numbers">
                  {formatNumber(monthlyTotalQueries)}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Total inference transactions / month
                </span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                  Concurrency Profile (Peak QPS)
                </span>
                <span className="text-base font-bold text-slate-900 font-mono-numbers">
                  {peakQps.toFixed(1)} req/sec
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Average throughput: {averageQps.toFixed(1)} req/sec
                </span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-200">
            Demand parameters flow forward into Stage 3 Workload Engine
          </div>
        </div>
      </div>
    </div>
  );
};
