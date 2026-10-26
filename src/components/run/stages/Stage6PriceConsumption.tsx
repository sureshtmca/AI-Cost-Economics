import React from 'react';
import {
  Stage6PriceData,
  Stage5ProductionData,
  Stage4ConsumptionData,
  Stage3WorkloadData,
  Stage2DemandData,
  RunConfigSetup,
} from '../../../types/cost-economics';
import { DollarSign, Tag, Check, ArrowRight } from 'lucide-react';
import { formatCurrency, formatNumber } from '../../../utils/calculations';

interface Stage6PriceConsumptionProps {
  data: Stage6PriceData;
  productionData: Stage5ProductionData;
  consumptionData: Stage4ConsumptionData;
  workloadData: Stage3WorkloadData;
  demandData: Stage2DemandData;
  config: RunConfigSetup;
  onChange: (data: Stage6PriceData) => void;
  currency: string;
}

export const Stage6PriceConsumption: React.FC<Stage6PriceConsumptionProps> = ({
  data,
  productionData,
  consumptionData,
  workloadData,
  demandData,
  config,
  onChange,
  currency,
}) => {
  const handleSelectCatalogue = (catalogueId: string) => {
    const selected = config.catalogues.find((c) => c.id === catalogueId);
    if (!selected) return;

    onChange({
      ...data,
      selectedCatalogueId: selected.id,
      inputTokenPricePerM: selected.inputPricePerM,
      cachedInputTokenPricePerM: selected.cachedInputPricePerM,
      outputTokenPricePerM: selected.outputPricePerM,
      vectorDbCostPerGB: selected.vectorDbPricePerGB,
      gpuUnitCostPerHour: selected.gpuHourlyRate,
    });
  };

  // Sizing inputs
  const monthlyRequests =
    demandData.monthlyActiveUsers *
    demandData.queriesPerUserPerDay *
    demandData.workingDaysPerMonth;

  const totalInputTokensMonthly =
    monthlyRequests * workloadData.inputTokensPerQuery * workloadData.agentToolLoops;
  const totalOutputTokensMonthly =
    monthlyRequests * workloadData.outputTokensPerQuery * workloadData.agentToolLoops;

  const cacheHitPct = consumptionData.promptCacheHitRatePct / 100;
  const cachedInputMillions = (totalInputTokensMonthly * cacheHitPct) / 1_000_000;
  const uncachedInputMillions = (totalInputTokensMonthly * (1 - cacheHitPct)) / 1_000_000;
  const outputMillions = totalOutputTokensMonthly / 1_000_000;

  const slaMultiplier =
    productionData.redundancyMultiplier *
    (1 + productionData.rateLimitSafetyBufferPct / 100);

  const discountMultiplier = 1 - data.volumeDiscountPct / 100;

  const modelInferenceCostMonthly =
    (uncachedInputMillions * data.inputTokenPricePerM +
      cachedInputMillions * data.cachedInputTokenPricePerM +
      outputMillions * data.outputTokenPricePerM) *
    slaMultiplier *
    discountMultiplier;

  const vectorDbCostMonthly =
    consumptionData.vectorDbStorageGB * data.vectorDbCostPerGB;
  const gpuComputeCostMonthly =
    consumptionData.gpuHostingUnits * 730 * data.gpuUnitCostPerHour;

  const auditedQueriesMonthly =
    monthlyRequests * (config.rules.humanReviewAuditRatePct / 100);
  const humanReviewHoursMonthly = auditedQueriesMonthly * 0.05;
  const humanReviewBaseCostMonthly =
    humanReviewHoursMonthly * config.rules.humanReviewHourlyRateUSD;

  const baselineMonthlyCostUSD =
    modelInferenceCostMonthly +
    vectorDbCostMonthly +
    gpuComputeCostMonthly +
    humanReviewBaseCostMonthly;

  return (
    <div className="space-y-6">
      {/* Stage Header */}
      <div>
        <h3 className="text-base font-bold text-slate-900">
          Stage 6: Price Consumption & Unit Rate Modeling
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Bind technical consumption from Stage 4 with the model catalogue pricing and enterprise volume discounts to yield the baseline monthly operating cost.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Rate Selectors & Overrides */}
        <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Tag className="w-4 h-4 text-indigo-600" />
              Catalogue Unit Pricing & Enterprise Tiers
            </h4>
            <span className="text-[11px] text-slate-500">
              Pick from configured catalogues or override
            </span>
          </div>

          {/* Quick Catalogue Selector Pills */}
          <div>
            <label className="text-[11px] font-medium text-slate-600 block mb-1.5">
              Bind Model Catalogue Preset
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {config.catalogues.map((cat) => {
                const isSelected = data.selectedCatalogueId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectCatalogue(cat.id)}
                    className={`p-2.5 text-left rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-500'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="font-semibold text-slate-800 text-[11px] truncate">
                      {cat.name}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{cat.provider}</div>
                    <div className="text-[10px] text-slate-600 font-mono-numbers mt-1">
                      In: ${cat.inputPricePerM} / Out: ${cat.outputPricePerM}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Editable Pricing Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div>
              <label className="text-[10px] text-slate-500 uppercase font-medium block">
                Input Price ($/M Tokens)
              </label>
              <input
                type="number"
                step="0.05"
                min="0"
                value={data.inputTokenPricePerM}
                onChange={(e) =>
                  onChange({
                    ...data,
                    inputTokenPricePerM: Math.max(0, parseFloat(e.target.value) || 0),
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-md px-2.5 py-1.5 font-mono-numbers text-xs mt-0.5"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-500 uppercase font-medium block">
                Cached Input Price ($/M)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={data.cachedInputTokenPricePerM}
                onChange={(e) =>
                  onChange({
                    ...data,
                    cachedInputTokenPricePerM: Math.max(0, parseFloat(e.target.value) || 0),
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-md px-2.5 py-1.5 font-mono-numbers text-xs mt-0.5"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-500 uppercase font-medium block">
                Output Price ($/M Tokens)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={data.outputTokenPricePerM}
                onChange={(e) =>
                  onChange({
                    ...data,
                    outputTokenPricePerM: Math.max(0, parseFloat(e.target.value) || 0),
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-md px-2.5 py-1.5 font-mono-numbers text-xs mt-0.5"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-500 uppercase font-medium block">
                Vector DB Storage ($/GB/mo)
              </label>
              <input
                type="number"
                step="0.05"
                min="0"
                value={data.vectorDbCostPerGB}
                onChange={(e) =>
                  onChange({
                    ...data,
                    vectorDbCostPerGB: Math.max(0, parseFloat(e.target.value) || 0),
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-md px-2.5 py-1.5 font-mono-numbers text-xs mt-0.5"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-500 uppercase font-medium block">
                GPU Compute Rate ($/hr)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={data.gpuUnitCostPerHour}
                onChange={(e) =>
                  onChange({
                    ...data,
                    gpuUnitCostPerHour: Math.max(0, parseFloat(e.target.value) || 0),
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-md px-2.5 py-1.5 font-mono-numbers text-xs mt-0.5"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-500 uppercase font-medium block">
                Enterprise Volume Discount (%)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                step="1"
                value={data.volumeDiscountPct}
                onChange={(e) =>
                  onChange({
                    ...data,
                    volumeDiscountPct: Math.max(0, parseFloat(e.target.value) || 0),
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-md px-2.5 py-1.5 font-mono-numbers text-xs mt-0.5"
              />
            </div>
          </div>
        </div>

        {/* Right Col: Price Breakdown & Monthly Baseline */}
        <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide pb-2 border-b border-slate-200 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Monthly Baseline Operating Sizing
            </h4>

            <div className="space-y-2.5 mt-3 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-md">
                <span className="text-slate-600">Model Token Inference</span>
                <span className="font-semibold text-slate-900 font-mono-numbers">
                  {formatCurrency(modelInferenceCostMonthly, currency)}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-md">
                <span className="text-slate-600">Vector Corpus Storage</span>
                <span className="font-semibold text-slate-900 font-mono-numbers">
                  {formatCurrency(vectorDbCostMonthly, currency)}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-md">
                <span className="text-slate-600">Dedicated Compute / Hosting</span>
                <span className="font-semibold text-slate-900 font-mono-numbers">
                  {formatCurrency(gpuComputeCostMonthly, currency)}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-md">
                <span className="text-slate-600">Human Review Base Share</span>
                <span className="font-semibold text-indigo-700 font-mono-numbers">
                  {formatCurrency(humanReviewBaseCostMonthly, currency)}
                </span>
              </div>

              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg mt-3">
                <span className="text-[10px] text-indigo-800 uppercase font-bold block">
                  Current Baseline Cost / Month (USD)
                </span>
                <span className="text-xl font-bold text-indigo-900 font-mono-numbers">
                  {formatCurrency(baselineMonthlyCostUSD, currency)}
                </span>
                <span className="text-[10px] text-indigo-700 block mt-0.5">
                  Full steady-state monthly operating expense
                </span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-200">
            Baseline feeds into Stage 7 to project the 36-month operating lifecycle
          </div>
        </div>
      </div>
    </div>
  );
};
