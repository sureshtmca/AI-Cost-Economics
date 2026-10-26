import React from 'react';
import { ProposalMetadata, CurrencyCode, ProposalStage } from '../types/cost-economics';
import { Layers, PieChart, FileDown, RefreshCw } from 'lucide-react';
import { formatCurrency } from '../utils/calculations';

interface HeaderProps {
  metadata: ProposalMetadata;
  onUpdateMetadata: (metadata: ProposalMetadata) => void;
  onOpenConsolidated: () => void;
  onResetDefaults: () => void;
  grandTotal: number;
}

export const Header: React.FC<HeaderProps> = ({
  metadata,
  onUpdateMetadata,
  onOpenConsolidated,
  onResetDefaults,
  grandTotal,
}) => {
  const stages: ProposalStage[] = [
    'RFP Response',
    'RFI Exploration',
    'Customer Pilot',
    'Strategic Proposal',
    'Proactive Pitch',
  ];

  const currencies: CurrencyCode[] = ['USD', 'EUR', 'GBP'];

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar Contract: 3 zones separated by gap-8 */}
        <div className="h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              <Layers className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
                AI Cost Economics
              </span>
              <span className="hidden sm:inline text-xs text-slate-500 ml-2 font-normal">
                Forecasting & Budget Planner
              </span>
            </div>
          </div>

          {/* Zone 2: Clean single-line proposal meta controls */}
          <div className="hidden lg:flex items-center gap-4 text-xs text-slate-600 whitespace-nowrap">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md">
              <span className="text-slate-400 font-medium">Stage:</span>
              <select
                value={metadata.stage}
                onChange={(e) =>
                  onUpdateMetadata({
                    ...metadata,
                    stage: e.target.value as ProposalStage,
                  })
                }
                className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
              >
                {stages.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md">
              <span className="text-slate-400 font-medium">Currency:</span>
              <select
                value={metadata.currency}
                onChange={(e) =>
                  onUpdateMetadata({
                    ...metadata,
                    currency: e.target.value as CurrencyCode,
                  })
                }
                className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
              >
                {currencies.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Total Est:</span>
              <span className="font-semibold text-slate-900 font-mono-numbers text-sm">
                {formatCurrency(grandTotal, metadata.currency)}
              </span>
            </div>
          </div>

          {/* Zone 3: Primary action button & utilities */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onResetDefaults}
              title="Reset to default benchmark presets"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenConsolidated}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all whitespace-nowrap cursor-pointer active:scale-98"
            >
              <PieChart className="w-4 h-4 text-indigo-300" />
              <span>Consolidated AI Cost View</span>
            </button>
          </div>
        </div>

        {/* Secondary Title & Client Bar */}
        <div className="py-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-1 min-w-[280px]">
            <span className="text-slate-400 font-medium">Proposal:</span>
            <input
              type="text"
              value={metadata.title}
              onChange={(e) =>
                onUpdateMetadata({ ...metadata, title: e.target.value })
              }
              className="font-medium text-slate-900 bg-transparent hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-slate-300 rounded px-1.5 py-0.5 w-full max-w-md transition-colors"
              placeholder="Proposal Title"
            />
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Client:</span>
              <input
                type="text"
                value={metadata.clientName}
                onChange={(e) =>
                  onUpdateMetadata({ ...metadata, clientName: e.target.value })
                }
                className="font-medium text-slate-700 bg-transparent hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-slate-300 rounded px-1.5 py-0.5 transition-colors"
                placeholder="Client / Organization"
              />
            </div>
            <span className="text-slate-300">·</span>
            <span className="text-slate-400">Ver: {metadata.version}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
