import React, { useState } from 'react';
import { LicenseCostState, LicenseItem, LicenseModelType } from '../../types/cost-economics';
import { calculateLicenseCosts, formatCurrency } from '../../utils/calculations';
import { KeyRound, Plus, Trash2, HelpCircle, Layers, Check, ExternalLink } from 'lucide-react';

interface LicensePoolViewProps {
  licenseData: LicenseCostState;
  onChange: (data: LicenseCostState) => void;
  currency: string;
}

export const LicensePoolView: React.FC<LicensePoolViewProps> = ({
  licenseData,
  onChange,
  currency,
}) => {
  const calc = calculateLicenseCosts(licenseData);
  const [showAddModal, setShowAddModal] = useState(false);

  // Quick Presets from real-world enterprise AI software licenses
  const presets: Omit<LicenseItem, 'id'>[] = [
    {
      toolName: 'ServiceNow Now Assist GenAI SKU',
      vendor: 'ServiceNow Inc.',
      category: 'GenAI Platform License',
      licenseModel: 'Per Seat / Month',
      unitCost: 48,
      quantity: 150,
      durationMonths: 36,
      notes: 'Enterprise ITSM/HR agent assist GenAI add-on license tier.',
    },
    {
      toolName: 'Datadog LLM Observability & Security',
      vendor: 'Datadog',
      category: 'LLM Observability',
      licenseModel: 'Platform Subscription Tier',
      unitCost: 1650,
      quantity: 1,
      durationMonths: 36,
      notes: 'Comprehensive prompt tracing, token cost attribution, and LLM drift monitors.',
    },
    {
      toolName: 'Microsoft 365 Copilot Studio Extensions',
      vendor: 'Microsoft Corp.',
      category: 'Enterprise Copilot',
      licenseModel: 'Per Seat / Month',
      unitCost: 30,
      quantity: 100,
      durationMonths: 36,
      notes: 'Standard M365 Copilot commercial add-on seat license.',
    },
    {
      toolName: 'Pinecone Dedicated Vector DB Pods',
      vendor: 'Pinecone Systems',
      category: 'Vector DB Enterprise',
      licenseModel: 'Capacity / Reservation',
      unitCost: 420,
      quantity: 2,
      durationMonths: 36,
      notes: 'High-availability dedicated storage & compute pods for vector search.',
    },
    {
      toolName: 'LangSmith Enterprise Workspace',
      vendor: 'LangChain',
      category: 'Model Gateway & Security',
      licenseModel: 'Platform Subscription Tier',
      unitCost: 950,
      quantity: 1,
      durationMonths: 36,
      notes: 'Agentic tracing, prompt testing suites, and evaluation golden sets.',
    },
    {
      toolName: 'OpenAI Enterprise Annual Commitment',
      vendor: 'OpenAI',
      category: 'GenAI Platform License',
      licenseModel: 'Flat Enterprise Annual',
      unitCost: 45000,
      quantity: 1,
      durationMonths: 36,
      notes: 'Enterprise workspace with admin SSO, data privacy guarantees, and custom limits.',
    },
  ];

  const handleAddPreset = (preset: Omit<LicenseItem, 'id'>) => {
    const newItem: LicenseItem = {
      ...preset,
      id: `lic-${Date.now()}`,
    };
    onChange({
      ...licenseData,
      items: [...licenseData.items, newItem],
    });
  };

  const handleUpdateItem = (id: string, updates: Partial<LicenseItem>) => {
    onChange({
      ...licenseData,
      items: licenseData.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    });
  };

  const handleRemoveItem = (id: string) => {
    onChange({
      ...licenseData,
      items: licenseData.items.filter((item) => item.id !== id),
    });
  };

  const licenseModelDescriptions: Record<LicenseModelType, string> = {
    'Per Seat / Month': 'Priced per designated user or employee seat per month (e.g. M365 Copilot $30/user/mo, ServiceNow Now Assist $48/seat/mo).',
    'Platform Subscription Tier': 'Fixed base monthly platform fee with bundled feature entitlements (e.g. Datadog LLM Observability $1,650/mo, LangSmith Enterprise $950/mo).',
    'Capacity / Reservation': 'Monthly reservation for dedicated cloud or hardware capacity (e.g. Pinecone Dedicated Pods $420/pod/mo, Provisioned Throughput units).',
    'Flat Enterprise Annual': 'Fixed annual contract with master enterprise service agreements (e.g. OpenAI Enterprise, Anthropic Commercial).',
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              LICENSE Cost Pool
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 font-medium">
              Enterprise Software & Third-Party Tool Licenses
            </span>
          </div>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            Quantifies commercial software licenses, LLM observability platforms, enterprise copilots, and dedicated vector storage subscriptions required for the end-to-end AI system.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-lg text-right shrink-0">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            Total LICENSE Cost
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono-numbers">
            {formatCurrency(calc.total, currency)}
          </div>
          <div className="text-[11px] text-slate-500">36-Month Operating Commitment</div>
        </div>
      </div>

      {/* Licensing Model Guidance Guide Box */}
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
          Industry License & Subscription Models Guide
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[11px]">
          {(Object.keys(licenseModelDescriptions) as LicenseModelType[]).map((model) => (
            <div key={model} className="p-2.5 bg-white border border-slate-200 rounded-md">
              <span className="font-semibold text-slate-900 block mb-1">{model}</span>
              <p className="text-slate-500 leading-normal">{licenseModelDescriptions[model]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Add Enterprise Tool Presets */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            Enterprise Tool Catalog (Quick Add)
          </h4>
          <span className="text-[11px] text-slate-500">Click to add to proposal</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {presets.map((preset) => (
            <button
              key={preset.toolName}
              onClick={() => handleAddPreset(preset)}
              className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-400 rounded-lg text-left transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="font-semibold text-slate-800 text-xs group-hover:text-indigo-600 truncate">
                  {preset.toolName}
                </div>
                <div className="text-[10px] text-slate-400 truncate">{preset.vendor}</div>
              </div>
              <div className="mt-2 pt-1 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-600">
                <span className="font-mono-numbers">
                  ${preset.unitCost}/{preset.licenseModel === 'Flat Enterprise Annual' ? 'yr' : 'mo'}
                </span>
                <span className="text-indigo-600 font-bold group-hover:translate-x-0.5 transition-transform">
                  + Add
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Active License Line Items Table */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-emerald-600" />
            Configured Tool Licenses ({licenseData.items.length} Active Items)
          </h4>
          <button
            onClick={() =>
              handleAddPreset({
                toolName: 'Custom Enterprise Tool License',
                vendor: 'Vendor Name',
                category: 'GenAI Platform License',
                licenseModel: 'Per Seat / Month',
                unitCost: 50,
                quantity: 20,
                durationMonths: 36,
                notes: 'Custom enterprise software license.',
              })
            }
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Custom License
          </button>
        </div>

        <div className="space-y-3">
          {calc.itemCosts.map((item) => (
            <div
              key={item.id}
              className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="text"
                    value={item.toolName}
                    onChange={(e) =>
                      handleUpdateItem(item.id, { toolName: e.target.value })
                    }
                    className="font-bold text-slate-900 bg-white border border-slate-200 rounded px-2.5 py-1 text-xs w-full max-w-sm focus:ring-1 focus:ring-slate-400"
                  />
                  <input
                    type="text"
                    value={item.vendor}
                    onChange={(e) =>
                      handleUpdateItem(item.id, { vendor: e.target.value })
                    }
                    className="text-slate-500 bg-white border border-slate-200 rounded px-2 py-1 text-[11px] w-36 focus:ring-1 focus:ring-slate-400"
                    placeholder="Vendor"
                  />
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-medium block">
                      36-Month Cost
                    </span>
                    <span className="font-bold text-slate-900 font-mono-numbers text-sm">
                      {formatCurrency(item.calculatedCost, currency)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-white transition-colors"
                    title="Remove license item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-medium block mb-1">
                    Subscription Model Type
                  </label>
                  <select
                    value={item.licenseModel}
                    onChange={(e) =>
                      handleUpdateItem(item.id, {
                        licenseModel: e.target.value as LicenseModelType,
                      })
                    }
                    className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-[11px] font-medium text-slate-800 cursor-pointer"
                  >
                    <option value="Per Seat / Month">Per Seat / Month</option>
                    <option value="Platform Subscription Tier">Platform Subscription Tier</option>
                    <option value="Capacity / Reservation">Capacity / Reservation</option>
                    <option value="Flat Enterprise Annual">Flat Enterprise Annual</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-medium block mb-1">
                    Unit Rate ({item.licenseModel === 'Flat Enterprise Annual' ? '$/Year' : '$/Month'})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={item.unitCost}
                    onChange={(e) =>
                      handleUpdateItem(item.id, {
                        unitCost: Math.max(0, parseFloat(e.target.value) || 0),
                      })
                    }
                    className="w-full bg-white border border-slate-200 rounded px-2 py-1 font-mono-numbers text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-medium block mb-1">
                    {item.licenseModel === 'Platform Subscription Tier' ||
                    item.licenseModel === 'Flat Enterprise Annual'
                      ? 'Instances / Contract'
                      : 'Seats / Pods Quantity'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleUpdateItem(item.id, {
                        quantity: Math.max(1, parseInt(e.target.value) || 1),
                      })
                    }
                    className="w-full bg-white border border-slate-200 rounded px-2 py-1 font-mono-numbers text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-medium block mb-1">
                    Duration (Months)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={item.durationMonths}
                    onChange={(e) =>
                      handleUpdateItem(item.id, {
                        durationMonths: Math.max(1, parseInt(e.target.value) || 1),
                      })
                    }
                    className="w-full bg-white border border-slate-200 rounded px-2 py-1 font-mono-numbers text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={item.notes}
                  onChange={(e) =>
                    handleUpdateItem(item.id, { notes: e.target.value })
                  }
                  placeholder="License scope, entitlements, and integration notes..."
                  className="w-full bg-transparent border-b border-slate-200 text-slate-600 text-[11px] py-0.5 focus:border-slate-400 focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Enterprise License Scope: 3-Year Strategic Commitment</span>
          <span className="font-medium text-slate-800">
            Total LICENSE Pool:{' '}
            <span className="font-mono-numbers font-bold text-slate-900">
              {formatCurrency(calc.total, currency)}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
