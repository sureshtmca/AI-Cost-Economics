import React from 'react';
import { Stage4ConsumptionData, Stage3WorkloadData, Stage2DemandData } from '../../../types/cost-economics';
import { HardDrive, Server, Layers, Zap } from 'lucide-react';
import { formatNumber } from '../../../utils/calculations';

interface Stage4TechnicalConsumptionProps {
  data: Stage4ConsumptionData;
  workloadData: Stage3WorkloadData;
  demandData: Stage2DemandData;
  onChange: (data: Stage4ConsumptionData) => void;
}

export const Stage4TechnicalConsumption: React.FC<Stage4TechnicalConsumptionProps> = ({
  data,
  workloadData,
  demandData,
  onChange,
}) => {
  const monthlyTransactions =
    demandData.monthlyActiveUsers *
    demandData.queriesPerUserPerDay *
    demandData.workingDaysPerMonth;

  const totalInputTokensMonthly =
    monthlyTransactions * workloadData.inputTokensPerQuery * workloadData.agentToolLoops;
  const totalInputMillions = totalInputTokensMonthly / 1_000_000;

  const cacheHitPct = data.promptCacheHitRatePct / 100;
  const cachedInputMillions = totalInputMillions * cacheHitPct;
  const uncachedInputMillions = totalInputMillions * (1 - cacheHitPct);

  const modelTiers: Stage4ConsumptionData['primaryModelTier'][] = [
    'Frontier Reasoning (GPT-4o/Claude 3.5 Sonnet)',
    'High-Speed Flash (Gemini 2.0/Claude 3.5 Haiku)',
    'Self-Hosted Llama 3.3 70B',
  ];

  return (
    <div className="space-y-6">
      {/* Stage Header */}
      <div>
        <h3 className="text-base font-bold text-slate-900">
          Stage 4: Translate Workload into Technical Consumption
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Maps application workload into physical cloud and AI provider resources: cached vs uncached tokens, vector index sizing, and GPU hosting reservations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Technical Sizing Controls */}
        <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide pb-2 border-b border-slate-100 flex items-center gap-2">
            <Server className="w-4 h-4 text-indigo-600" />
            Infrastructure & Cache Architecture Sizing
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="text-[11px] font-medium text-slate-600 block mb-1">
                Primary Foundation Model Class
              </label>
              <select
                value={data.primaryModelTier}
                onChange={(e) =>
                  onChange({
                    ...data,
                    primaryModelTier: e.target.value as Stage4ConsumptionData['primaryModelTier'],
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-md px-3 py-2 text-xs font-semibold text-slate-800 cursor-pointer"
              >
                {modelTiers.map((tier) => (
                  <option key={tier} value={tier}>
                    {tier}
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Determines base inference pricing, context window efficiency, and hardware requirements.
              </span>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">
                Prompt Cache Hit Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="90"
                step="5"
                value={data.promptCacheHitRatePct}
                onChange={(e) =>
                  onChange({
                    ...data,
                    promptCacheHitRatePct: Math.min(
                      90,
                      Math.max(0, parseFloat(e.target.value) || 0)
                    ),
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-md px-3 py-2 font-mono-numbers text-xs text-slate-800"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Prefix caching reuse rate for large system instructions & fixed document embeddings.
              </span>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">
                Vector DB Index Storage (GB)
              </label>
              <input
                type="number"
                min="5"
                step="5"
                value={data.vectorDbStorageGB}
                onChange={(e) =>
                  onChange({
                    ...data,
                    vectorDbStorageGB: Math.max(1, parseInt(e.target.value) || 1),
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-md px-3 py-2 font-mono-numbers text-xs text-slate-800"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Total size of vectorized enterprise knowledge base and metadata storage.
              </span>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">
                Monthly Embedding Ops (Millions)
              </label>
              <input
                type="number"
                min="0.1"
                step="0.5"
                value={data.monthlyEmbeddingOpsMillions}
                onChange={(e) =>
                  onChange({
                    ...data,
                    monthlyEmbeddingOpsMillions: Math.max(
                      0.1,
                      parseFloat(e.target.value) || 0.1
                    ),
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-md px-3 py-2 font-mono-numbers text-xs text-slate-800"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Live query vectorization passes + continuous document re-indexing volume.
              </span>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">
                GPU Gateway / Private Hosting Units
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={data.gpuHostingUnits}
                onChange={(e) =>
                  onChange({
                    ...data,
                    gpuHostingUnits: Math.max(0, parseInt(e.target.value) || 0),
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-md px-3 py-2 font-mono-numbers text-xs text-slate-800"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Dedicated GPU instances for private LLM serving, cross-encoders, or routing gateways.
              </span>
            </div>
          </div>
        </div>

        {/* Right Col: Technical Consumption Breakdown */}
        <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide pb-2 border-b border-slate-200 flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-indigo-600" />
              Technical Consumption Bill of Materials
            </h4>

            <div className="space-y-3 mt-3">
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                  Prompt Cache Split
                </span>
                <div className="flex items-center justify-between mt-1 text-xs font-mono-numbers">
                  <div>
                    <span className="text-emerald-700 font-bold">
                      {cachedInputMillions.toFixed(2)} M
                    </span>
                    <span className="text-[10px] text-slate-400 block">Cached (Discounted)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-800 font-bold">
                      {uncachedInputMillions.toFixed(2)} M
                    </span>
                    <span className="text-[10px] text-slate-400 block">Uncached (Full Rate)</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                  Vector Corpus Footprint
                </span>
                <span className="text-base font-bold text-slate-900 font-mono-numbers">
                  {data.vectorDbStorageGB} GB Index
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  High-availability partitioned vector store
                </span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                  Dedicated Compute Allocation
                </span>
                <span className="text-base font-bold text-slate-900 font-mono-numbers">
                  {data.gpuHostingUnits * 730} GPU Hours / Month
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  {data.gpuHostingUnits} dedicated orchestrator instances (730 hrs/mo)
                </span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-200">
            Consumption values flow into Stage 5 Production & SLA multipliers
          </div>
        </div>
      </div>
    </div>
  );
};
