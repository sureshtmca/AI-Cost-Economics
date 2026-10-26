import React from 'react';
import { Stage5ProductionData } from '../../../types/cost-economics';
import { Shield, Activity, Clock, Zap } from 'lucide-react';

interface Stage5ProductionRequirementsProps {
  data: Stage5ProductionData;
  onChange: (data: Stage5ProductionData) => void;
}

export const Stage5ProductionRequirements: React.FC<Stage5ProductionRequirementsProps> = ({
  data,
  onChange,
}) => {
  const slaTiers: Stage5ProductionData['slaTier'][] = [
    '99.5% Standard SLA',
    '99.9% High Availability',
    '99.99% Multi-Region Failover',
  ];

  const handleSlaChange = (tier: Stage5ProductionData['slaTier']) => {
    let redundancy = 1.0;
    if (tier === '99.9% High Availability') redundancy = 1.25;
    if (tier === '99.99% Multi-Region Failover') redundancy = 1.6;

    onChange({
      ...data,
      slaTier: tier,
      redundancyMultiplier: redundancy,
    });
  };

  const totalSlaOverhead = (data.redundancyMultiplier * (1 + data.rateLimitSafetyBufferPct / 100) - 1) * 100;

  return (
    <div className="space-y-6">
      {/* Stage Header */}
      <div>
        <h3 className="text-base font-bold text-slate-900">
          Stage 5: Apply Production & Service Requirements (SLAs)
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Factor in enterprise availability commitments, multi-region disaster recovery, P95 latency guarantees, and rate limit safety buffers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Production Controls */}
        <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide pb-2 border-b border-slate-100 flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-600" />
            Service Level Agreements & Reliability Architecture
          </h4>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">
                Enterprise Uptime & Availability SLA Tier
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {slaTiers.map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => handleSlaChange(tier)}
                    className={`p-3 text-left rounded-lg border transition-all cursor-pointer ${
                      data.slaTier === tier
                        ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-500'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="font-semibold text-slate-900 text-xs mb-0.5">
                      {tier}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {tier === '99.5% Standard SLA'
                        ? 'Single-region deployment with automated restart.'
                        : tier === '99.9% High Availability'
                        ? 'Multi-zone deployment with hot standby.'
                        : 'Active-active multi-region cross-cloud failover.'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">
                  Redundancy & Failover Multiplier
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="1.0"
                  max="2.5"
                  value={data.redundancyMultiplier}
                  onChange={(e) =>
                    onChange({
                      ...data,
                      redundancyMultiplier: Math.max(1.0, parseFloat(e.target.value) || 1.0),
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-md px-3 py-2 font-mono-numbers text-xs text-slate-800"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Capacity multiplier to maintain reserved standby headroom during regional outages.
                </span>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">
                  Rate Limit & Burst Safety Buffer (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={data.rateLimitSafetyBufferPct}
                  onChange={(e) =>
                    onChange({
                      ...data,
                      rateLimitSafetyBufferPct: Math.max(0, parseFloat(e.target.value) || 0),
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-md px-3 py-2 font-mono-numbers text-xs text-slate-800"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Safety overhead to absorb traffic spikes without triggering 429 throttling errors.
                </span>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">
                  P95 Latency SLA Budget (ms)
                </label>
                <input
                  type="number"
                  min="200"
                  step="100"
                  value={data.p95LatencyBudgetMs}
                  onChange={(e) =>
                    onChange({
                      ...data,
                      p95LatencyBudgetMs: Math.max(100, parseInt(e.target.value) || 100),
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-md px-3 py-2 font-mono-numbers text-xs text-slate-800"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Contractual latency SLA for 95th percentile requests end-to-end.
                </span>
              </div>

              <div className="flex flex-col justify-center">
                <label className="text-[11px] font-medium text-slate-600 block mb-1">
                  Throughput Commitment Mode
                </label>
                <div className="flex items-center gap-3 mt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.provisionedThroughput}
                      onChange={(e) =>
                        onChange({
                          ...data,
                          provisionedThroughput: e.target.checked,
                        })
                      }
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <span className="text-xs font-semibold text-slate-800">
                      Provisioned Throughput Unit (PTU) Commitment
                    </span>
                  </label>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Guarantees reserved token throughput per minute with enterprise priority routing.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: SLA Overhead Factor */}
        <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide pb-2 border-b border-slate-200 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-600" />
              Production Overhead Scaling Factor
            </h4>

            <div className="space-y-3 mt-3">
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                  Aggregate SLA Scaling Multiplier
                </span>
                <span className="text-xl font-bold text-indigo-600 font-mono-numbers">
                  {(data.redundancyMultiplier * (1 + data.rateLimitSafetyBufferPct / 100)).toFixed(3)}x
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  +{totalSlaOverhead.toFixed(1)}% availability buffer applied to raw consumption
                </span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                  SLA Commitment Level
                </span>
                <span className="text-base font-bold text-slate-900 font-mono-numbers">
                  {data.slaTier}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Target latency budget: &lt; {data.p95LatencyBudgetMs}ms P95
                </span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-200">
            SLA multipliers scale the unit pricing calculations in Stage 6 Price Consumption
          </div>
        </div>
      </div>
    </div>
  );
};
