import React, { useState } from 'react';
import { RunStageState, RunConfigSetup } from '../../types/cost-economics';
import { calculateRunCosts, formatCurrency } from '../../utils/calculations';
import { Sliders, ArrowLeft, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { RunConfigModal } from './RunConfigModal';
import { Stage1ExecutionFlow } from './stages/Stage1ExecutionFlow';
import { Stage2DemandAssumptions } from './stages/Stage2DemandAssumptions';
import { Stage3WorkloadEngine } from './stages/Stage3WorkloadEngine';
import { Stage4TechnicalConsumption } from './stages/Stage4TechnicalConsumption';
import { Stage5ProductionRequirements } from './stages/Stage5ProductionRequirements';
import { Stage6PriceConsumption } from './stages/Stage6PriceConsumption';
import { Stage7LifecycleForecast } from './stages/Stage7LifecycleForecast';
import { Stage8DecisionDashboard } from './stages/Stage8DecisionDashboard';

interface RunPoolViewProps {
  runState: RunStageState;
  config: RunConfigSetup;
  onChangeRunState: (newState: RunStageState) => void;
  onSaveConfig: (newConfig: RunConfigSetup) => void;
  currency: string;
  onOpenConsolidated: () => void;
}

export const RunPoolView: React.FC<RunPoolViewProps> = ({
  runState,
  config,
  onChangeRunState,
  onSaveConfig,
  currency,
  onOpenConsolidated,
}) => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  // Keep track of the highest reached stage to enforce strict sequential progression
  const [maxUnlockedStage, setMaxUnlockedStage] = useState(runState.currentStage || 1);

  const calc = calculateRunCosts(runState, config);

  const stageLabels = [
    { num: 1, name: 'Execution Flow & Upload', short: '1. Flow' },
    { num: 2, name: 'Demand & Usage Assumptions', short: '2. Demand' },
    { num: 3, name: 'Calculate Workload', short: '3. Workload' },
    { num: 4, name: 'Technical Consumption', short: '4. Consumption' },
    { num: 5, name: 'Production SLAs', short: '5. SLAs' },
    { num: 6, name: 'Price Consumption', short: '6. Pricing' },
    { num: 7, name: 'Lifecycle 3-Yr Forecast', short: '7. Forecast' },
    { num: 8, name: 'Decision Dashboard', short: '8. Dashboard' },
  ];

  const handleGoToStage = (stageNum: number) => {
    // Strict sequential rule: cannot jump ahead past maxUnlockedStage
    if (stageNum <= maxUnlockedStage) {
      onChangeRunState({ ...runState, currentStage: stageNum });
    }
  };

  const handleNextStage = () => {
    if (runState.currentStage < 8) {
      const next = runState.currentStage + 1;
      setMaxUnlockedStage(Math.max(maxUnlockedStage, next));
      onChangeRunState({ ...runState, currentStage: next });
    }
  };

  const handlePrevStage = () => {
    if (runState.currentStage > 1) {
      onChangeRunState({ ...runState, currentStage: runState.currentStage - 1 });
    }
  };

  return (
    <div className="space-y-5">
      {/* RUN Pool Banner & Config Access */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              RUN Cost Pool Pipeline
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 font-medium">
              Stage {runState.currentStage} of 8 (Strict Sequential Workflow)
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl">
            Sequential end-to-end forecasting pipeline that transforms solution architecture documents into demand, execution workload, technical consumption, unit prices, and 3-year operating economics.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsConfigOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-indigo-600" />
            <span>RUN Configuration (Price & Rules)</span>
          </button>

          <div className="bg-indigo-50/70 border border-indigo-100 px-3.5 py-1.5 rounded-lg text-right">
            <div className="text-[10px] font-semibold text-indigo-800 uppercase tracking-wider">
              RUN 36-Mo Total
            </div>
            <div className="text-sm font-bold text-indigo-950 font-mono-numbers">
              {formatCurrency(calc.expectedOperatingCost36Months, currency)}
            </div>
          </div>
        </div>
      </div>

      {/* Strict Sequential 8-Stage Horizontal Progression Navigator */}
      <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[760px] gap-1">
          {stageLabels.map((stg, idx) => {
            const isActive = runState.currentStage === stg.num;
            const isCompleted = stg.num < runState.currentStage;
            const isUnlocked = stg.num <= maxUnlockedStage;

            return (
              <React.Fragment key={stg.num}>
                <button
                  type="button"
                  onClick={() => handleGoToStage(stg.num)}
                  disabled={!isUnlocked}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all text-left whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : isCompleted
                      ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100/70 border border-emerald-200'
                      : isUnlocked
                      ? 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                      : 'bg-slate-50 text-slate-400 opacity-60 cursor-not-allowed border border-slate-100'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isActive
                        ? 'bg-indigo-400 text-slate-900'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : isUnlocked
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : stg.num}
                  </span>
                  <span className="truncate">{stg.short}</span>
                  {!isUnlocked && <Lock className="w-3 h-3 text-slate-400 shrink-0 ml-0.5" />}
                </button>

                {idx < stageLabels.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 min-w-3 mx-1 transition-colors ${
                      stg.num < maxUnlockedStage ? 'bg-emerald-300' : 'bg-slate-200'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Stage Body */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs">
        {runState.currentStage === 1 && (
          <Stage1ExecutionFlow
            data={runState.stage1}
            onChange={(s1) => onChangeRunState({ ...runState, stage1: s1 })}
          />
        )}

        {runState.currentStage === 2 && (
          <Stage2DemandAssumptions
            data={runState.stage2}
            onChange={(s2) => onChangeRunState({ ...runState, stage2: s2 })}
          />
        )}

        {runState.currentStage === 3 && (
          <Stage3WorkloadEngine
            data={runState.stage3}
            demandData={runState.stage2}
            flowData={runState.stage1}
            onChange={(s3) => onChangeRunState({ ...runState, stage3: s3 })}
          />
        )}

        {runState.currentStage === 4 && (
          <Stage4TechnicalConsumption
            data={runState.stage4}
            workloadData={runState.stage3}
            demandData={runState.stage2}
            onChange={(s4) => onChangeRunState({ ...runState, stage4: s4 })}
          />
        )}

        {runState.currentStage === 5 && (
          <Stage5ProductionRequirements
            data={runState.stage5}
            onChange={(s5) => onChangeRunState({ ...runState, stage5: s5 })}
          />
        )}

        {runState.currentStage === 6 && (
          <Stage6PriceConsumption
            data={runState.stage6}
            productionData={runState.stage5}
            consumptionData={runState.stage4}
            workloadData={runState.stage3}
            demandData={runState.stage2}
            config={config}
            onChange={(s6) => onChangeRunState({ ...runState, stage6: s6 })}
            currency={currency}
          />
        )}

        {runState.currentStage === 7 && (
          <Stage7LifecycleForecast
            data={runState.stage7}
            baselineMonthlyCostUSD={calc.baselineMonthlyCostUSD}
            onChange={(s7) => onChangeRunState({ ...runState, stage7: s7 })}
            currency={currency}
          />
        )}

        {runState.currentStage === 8 && (
          <Stage8DecisionDashboard
            runState={runState}
            config={config}
            currency={currency}
            onOpenConsolidated={onOpenConsolidated}
          />
        )}

        {/* Sequential Step Navigation Footer */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handlePrevStage}
            disabled={runState.currentStage === 1}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
              runState.currentStage === 1
                ? 'opacity-40 cursor-not-allowed border-slate-200 text-slate-400'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Previous Stage
          </button>

          <div className="text-xs text-slate-400">
            Stage {runState.currentStage} of 8
          </div>

          {runState.currentStage < 8 ? (
            <button
              onClick={handleNextStage}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-colors cursor-pointer"
            >
              <span>Next: {stageLabels[runState.currentStage].name}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onOpenConsolidated}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors cursor-pointer"
            >
              <span>View Consolidated Cost Economics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Config Modal */}
      <RunConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        config={config}
        onSaveConfig={onSaveConfig}
        currency={currency}
      />
    </div>
  );
};
