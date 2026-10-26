import React, { useState } from 'react';
import { RunConfigSetup, ModelCatalogueEntry, RulesAndReference } from '../../types/cost-economics';
import { X, Plus, Trash2, Sliders, Database, Save, RotateCcw } from 'lucide-react';
import { initialRunConfigSetup } from '../../data/initialData';

interface RunConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: RunConfigSetup;
  onSaveConfig: (newConfig: RunConfigSetup) => void;
  currency: string;
}

export const RunConfigModal: React.FC<RunConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  currency,
}) => {
  const [activeTab, setActiveTab] = useState<'catalogue' | 'rules'>('catalogue');
  const [localCatalogues, setLocalCatalogues] = useState<ModelCatalogueEntry[]>(config.catalogues);
  const [localRules, setLocalRules] = useState<RulesAndReference>(config.rules);

  if (!isOpen) return null;

  const handleAddCatalogue = () => {
    const newEntry: ModelCatalogueEntry = {
      id: `cat-${Date.now()}`,
      name: 'Custom Enterprise Model Tier',
      provider: 'Cloud Provider',
      tier: 'Balanced Reasoning',
      inputPricePerM: 1.50,
      cachedInputPricePerM: 0.375,
      outputPricePerM: 6.00,
      gpuHourlyRate: 2.20,
      vectorDbPricePerGB: 1.00,
      contextWindow: '128k',
    };
    setLocalCatalogues([...localCatalogues, newEntry]);
  };

  const handleUpdateCatalogue = (id: string, updates: Partial<ModelCatalogueEntry>) => {
    setLocalCatalogues(
      localCatalogues.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat))
    );
  };

  const handleRemoveCatalogue = (id: string) => {
    setLocalCatalogues(localCatalogues.filter((cat) => cat.id !== id));
  };

  const handleSave = () => {
    onSaveConfig({
      catalogues: localCatalogues,
      rules: localRules,
    });
    onClose();
  };

  const handleReset = () => {
    setLocalCatalogues(initialRunConfigSetup.catalogues);
    setLocalRules(initialRunConfigSetup.rules);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                RUN Cost Pool Configuration & Master References
              </h2>
              <p className="text-xs text-slate-500">
                Calibrate master Price & Catalogue tables and RULES & Reference parameters used across the 8 RUN stages.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation */}
        <div className="px-6 border-b border-slate-200 flex items-center gap-6 text-xs font-semibold bg-white">
          <button
            onClick={() => setActiveTab('catalogue')}
            className={`py-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'catalogue'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            Price & Catalogue Data ({localCatalogues.length} Models)
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`py-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'rules'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            RULES & Reference Multipliers
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs">
          {activeTab === 'catalogue' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-slate-500">
                  Unit rates per 1 Million tokens, hourly GPU orchestration, and storage rates. These values bind directly into Stage 6 (Price Consumption).
                </p>
                <button
                  onClick={handleAddCatalogue}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-md font-medium text-xs transition-colors shrink-0 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Model Catalogue
                </button>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
                      <th className="py-2.5 px-3">Model & Provider</th>
                      <th className="py-2.5 px-2 text-right">Input ($/M)</th>
                      <th className="py-2.5 px-2 text-right">Cached In ($/M)</th>
                      <th className="py-2.5 px-2 text-right">Output ($/M)</th>
                      <th className="py-2.5 px-2 text-right">GPU ($/hr)</th>
                      <th className="py-2.5 px-2 text-right">Vector ($/GB)</th>
                      <th className="py-2.5 px-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono-numbers">
                    {localCatalogues.map((cat) => (
                      <tr key={cat.id} className="hover:bg-slate-50/50">
                        <td className="py-2 px-3 font-sans">
                          <input
                            type="text"
                            value={cat.name}
                            onChange={(e) =>
                              handleUpdateCatalogue(cat.id, { name: e.target.value })
                            }
                            className="font-medium text-slate-800 text-xs w-full bg-transparent border-b border-transparent focus:border-slate-300 focus:outline-none"
                          />
                          <input
                            type="text"
                            value={cat.provider}
                            onChange={(e) =>
                              handleUpdateCatalogue(cat.id, { provider: e.target.value })
                            }
                            className="text-[11px] text-slate-400 w-full bg-transparent border-b border-transparent focus:border-slate-300 focus:outline-none"
                          />
                        </td>
                        <td className="py-2 px-2 text-right">
                          <input
                            type="number"
                            step="0.05"
                            value={cat.inputPricePerM}
                            onChange={(e) =>
                              handleUpdateCatalogue(cat.id, {
                                inputPricePerM: Math.max(0, parseFloat(e.target.value) || 0),
                              })
                            }
                            className="w-16 text-right bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-xs font-mono-numbers"
                          />
                        </td>
                        <td className="py-2 px-2 text-right">
                          <input
                            type="number"
                            step="0.01"
                            value={cat.cachedInputPricePerM}
                            onChange={(e) =>
                              handleUpdateCatalogue(cat.id, {
                                cachedInputPricePerM: Math.max(0, parseFloat(e.target.value) || 0),
                              })
                            }
                            className="w-16 text-right bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-xs font-mono-numbers"
                          />
                        </td>
                        <td className="py-2 px-2 text-right">
                          <input
                            type="number"
                            step="0.1"
                            value={cat.outputPricePerM}
                            onChange={(e) =>
                              handleUpdateCatalogue(cat.id, {
                                outputPricePerM: Math.max(0, parseFloat(e.target.value) || 0),
                              })
                            }
                            className="w-16 text-right bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-xs font-mono-numbers"
                          />
                        </td>
                        <td className="py-2 px-2 text-right">
                          <input
                            type="number"
                            step="0.1"
                            value={cat.gpuHourlyRate}
                            onChange={(e) =>
                              handleUpdateCatalogue(cat.id, {
                                gpuHourlyRate: Math.max(0, parseFloat(e.target.value) || 0),
                              })
                            }
                            className="w-16 text-right bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-xs font-mono-numbers"
                          />
                        </td>
                        <td className="py-2 px-2 text-right">
                          <input
                            type="number"
                            step="0.05"
                            value={cat.vectorDbPricePerGB}
                            onChange={(e) =>
                              handleUpdateCatalogue(cat.id, {
                                vectorDbPricePerGB: Math.max(0, parseFloat(e.target.value) || 0),
                              })
                            }
                            className="w-16 text-right bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-xs font-mono-numbers"
                          />
                        </td>
                        <td className="py-2 px-2 text-center">
                          <button
                            onClick={() => handleRemoveCatalogue(cat.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                            title="Remove catalogue"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-slate-500">
                Systemic mathematical coefficients, safety buffers, and human review assumptions applied across stages 2 through 8.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                  <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wide">
                    Operational Safety & Concurrency
                  </h4>

                  <div>
                    <label className="text-[11px] text-slate-600 font-medium block">
                      Token Safety Buffer (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={localRules.defaultTokenBufferPct}
                      onChange={(e) =>
                        setLocalRules({
                          ...localRules,
                          defaultTokenBufferPct: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="mt-1 w-full bg-white border border-slate-200 rounded px-2.5 py-1 text-xs font-mono-numbers"
                    />
                    <span className="text-[10px] text-slate-400">
                      Standard overhead for unexpected prompt expansions and agent retries.
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-600 font-medium block">
                      Default Peak Concurrency Factor (Multiplier)
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      min="1"
                      value={localRules.defaultPeakConcurrency}
                      onChange={(e) =>
                        setLocalRules({
                          ...localRules,
                          defaultPeakConcurrency: parseFloat(e.target.value) || 1,
                        })
                      }
                      className="mt-1 w-full bg-white border border-slate-200 rounded px-2.5 py-1 text-xs font-mono-numbers"
                    />
                    <span className="text-[10px] text-slate-400">
                      Traffic peak multiplier applied to provisioned throughput sizing.
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-600 font-medium block">
                      Failover Redundancy Multiplier
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      min="1"
                      value={localRules.failoverRedundancyRate}
                      onChange={(e) =>
                        setLocalRules({
                          ...localRules,
                          failoverRedundancyRate: parseFloat(e.target.value) || 1,
                        })
                      }
                      className="mt-1 w-full bg-white border border-slate-200 rounded px-2.5 py-1 text-xs font-mono-numbers"
                    />
                    <span className="text-[10px] text-slate-400">
                      Active-active backup capacity reserved across geographic zones.
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                  <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wide">
                    Human Review & Quality Auditing
                  </h4>

                  <div>
                    <label className="text-[11px] text-slate-600 font-medium block">
                      Human Review Audit Sampling Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="100"
                      value={localRules.humanReviewAuditRatePct}
                      onChange={(e) =>
                        setLocalRules({
                          ...localRules,
                          humanReviewAuditRatePct: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="mt-1 w-full bg-white border border-slate-200 rounded px-2.5 py-1 text-xs font-mono-numbers"
                    />
                    <span className="text-[10px] text-slate-400">
                      Percentage of production transactions sampled for SME oversight.
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-600 font-medium block">
                      Human Review Hourly Rate ($/hr)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={localRules.humanReviewHourlyRateUSD}
                      onChange={(e) =>
                        setLocalRules({
                          ...localRules,
                          humanReviewHourlyRateUSD: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="mt-1 w-full bg-white border border-slate-200 rounded px-2.5 py-1 text-xs font-mono-numbers"
                    />
                    <span className="text-[10px] text-slate-400">
                      Loaded hourly rate for human compliance, legal, or domain specialists.
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-600 font-medium block">
                      Prompt Cache Hit Assumption (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="90"
                      value={localRules.defaultCacheHitAssumptionPct}
                      onChange={(e) =>
                        setLocalRules({
                          ...localRules,
                          defaultCacheHitAssumptionPct: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="mt-1 w-full bg-white border border-slate-200 rounded px-2.5 py-1 text-xs font-mono-numbers"
                    />
                    <span className="text-[10px] text-slate-400">
                      Default baseline prefix cache hit rate for system instructions and document context.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restore Benchmark Defaults
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-md shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              Save & Apply Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
