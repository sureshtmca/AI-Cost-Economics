import React from 'react';
import { Stage3WorkloadData, Stage2DemandData, Stage1FlowData } from '../../../types/cost-economics';
import { Calculator, Cpu, Sparkles, Layers } from 'lucide-react';
import { formatNumber } from '../../../utils/calculations';

interface Stage3WorkloadEngineProps {
  data: Stage3WorkloadData;
  demandData: Stage2DemandData;
  flowData: Stage1FlowData;
  onChange: (data: Stage3WorkloadData) => void;
}

export const Stage3WorkloadEngine: React.FC<Stage3WorkloadEngineProps> = ({
  data,
  demandData,
  flowData,
  onChange,
}) => {
  const monthlyTransactions =
    demandData.monthlyActiveUsers *
    demandData.queriesPerUserPerDay *
    demandData.workingDaysPerMonth;

  // Factoring in agent tool loops
  const effectiveInputTokensPerQuery = data.inputTokensPerQuery * data.agentToolLoops;
  const effectiveOutputTokensPerQuery = data.outputTokensPerQuery * data.agentToolLoops;

  const totalMonthlyInputTokens = monthlyTransactions * effectiveInputTokensPerQuery;
  const totalMonthlyOutputTokens = monthlyTransactions * effectiveOutputTokensPerQuery;
  const totalMonthlyTokens = totalMonthlyInputTokens + totalMonthlyOutputTokens;

  const totalMonthlyVectorSearches = monthlyTransactions * data.vectorSearchesPerQuery;

  return (
    <div className="space-y-6">
      {/* Stage Header */}
      <div>
        <h3 className="text-base font-bold text-slate-900">
          Stage 3: Auto-Calculate Execution Workload
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Combines the solution topology from Stage 1 and demand profile from Stage 2 to calculate granular token volumes, context payloads, and search transactions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Workload Parameters */}
        <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Calculator className="w-4 h-4 text-indigo-600" />
              Per-Transaction Token & Context Payload Sizing
            </h4>
            <span className="text-[11px] text-slate-500 font-mono-numbers">
              Basis: {formatNumber(monthlyTransactions)} monthly runs
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">
                Prompt & Context Input Tokens / Query
              </label>
              <input
                type="number"
                min="100"
                step="50"
                value={data.inputTokensPerQuery}
                onChange={(e) =>
                  onChange({
                    ...data,
                    inputTokensPerQuery: Math.max(50, parseInt(e.target.value) || 50),
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-md px-3 py-2 font-mono-numbers text-xs text-slate-800"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Includes system instructions, past message history, and retrieved document context.
              </span>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">
                Completion Output Tokens / Query
              </label>
              <input
                type="number"
                min="50"
                step="50"
                value={data.outputTokensPerQuery}
                onChange={(e) =>
                  onChange({
                    ...data,
                    outputTokensPerQuery: Math.max(20, parseInt(e.target.value) || 20),
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-md px-3 py-2 font-mono-numbers text-xs text-slate-800"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Target response length, reasoning chains (thinking tokens), and JSON schema payloads.
              </span>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">
                Retrieved Context Chunks per Request
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={data.contextChunksPerQuery}
                onChange={(e) =>
                  onChange({
                    ...data,
                    contextChunksPerQuery: Math.max(1, parseInt(e.target.value) || 1),
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-md px-3 py-2 font-mono-numbers text-xs text-slate-800"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Number of knowledge corpus passages injected into prompt (~300 tokens each).
              </span>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">
                Vector DB Searches / Request
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={data.vectorSearchesPerQuery}
                onChange={(e) =>
                  onChange({
                    ...data,
                    vectorSearchesPerQuery: Math.max(1, parseInt(e.target.value) || 1),
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-md px-3 py-2 font-mono-numbers text-xs text-slate-800"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Dense embedding similarity queries executed against vector index per flow run.
              </span>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">
                Agent Tool Loops / Iterations Multiplier
              </label>
              <input
                type="number"
                min="1.0"
                step="0.1"
                value={data.agentToolLoops}
                onChange={(e) =>
                  onChange({
                    ...data,
                    agentToolLoops: Math.max(1.0, parseFloat(e.target.value) || 1.0),
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-md px-3 py-2 font-mono-numbers text-xs text-slate-800"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                1.0 for single-shot RAG; 1.5–3.0x for multi-hop agentic reasoning or tool loops.
              </span>
            </div>
          </div>
        </div>

        {/* Right Col: Auto-Calculated Workload Outputs */}
        <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide pb-2 border-b border-slate-200 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-indigo-600" />
              Calculated Monthly Workload
            </h4>

            <div className="space-y-3 mt-3">
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                  Total Monthly Input Workload
                </span>
                <span className="text-lg font-bold text-slate-900 font-mono-numbers">
                  {(totalMonthlyInputTokens / 1_000_000).toFixed(2)} M Tokens
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Raw prompt + context ingested
                </span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                  Total Monthly Output Workload
                </span>
                <span className="text-lg font-bold text-slate-900 font-mono-numbers">
                  {(totalMonthlyOutputTokens / 1_000_000).toFixed(2)} M Tokens
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Generated reasoning & responses
                </span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                  Vector Retrieval Operations
                </span>
                <span className="text-base font-bold text-emerald-600 font-mono-numbers">
                  {formatNumber(totalMonthlyVectorSearches)} queries/mo
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Similarity queries against vector index
                </span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-200">
            Workload figures flow into Stage 4 for Technical Consumption translation
          </div>
        </div>
      </div>
    </div>
  );
};
