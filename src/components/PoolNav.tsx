import React from 'react';
import { CostPoolType } from '../types/cost-economics';
import { Hammer, PlayCircle, KeyRound, ShieldAlert } from 'lucide-react';
import { formatCurrency } from '../utils/calculations';

interface PoolNavProps {
  activePool: CostPoolType;
  onSelectPool: (pool: CostPoolType) => void;
  buildTotal: number;
  runTotal: number;
  licenseTotal: number;
  assureTotal: number;
  currency: string;
}

export const PoolNav: React.FC<PoolNavProps> = ({
  activePool,
  onSelectPool,
  buildTotal,
  runTotal,
  licenseTotal,
  assureTotal,
  currency,
}) => {
  const pools: {
    id: CostPoolType;
    label: string;
    subtitle: string;
    subtotal: number;
    icon: React.ElementType;
    highlight: string;
  }[] = [
    {
      id: 'BUILD',
      label: 'BUILD Cost Pool',
      subtitle: 'Delivery AI Work, Setup, Indexing & Staging',
      subtotal: buildTotal,
      icon: Hammer,
      highlight: 'border-blue-600 text-blue-600',
    },
    {
      id: 'RUN',
      label: 'RUN Cost Pool',
      subtitle: '8-Stage Sequential Inference & Ops',
      subtotal: runTotal,
      icon: PlayCircle,
      highlight: 'border-indigo-600 text-indigo-600',
    },
    {
      id: 'LICENSE',
      label: 'LICENSE Cost Pool',
      subtitle: 'Enterprise Platform & Tool Subscriptions',
      subtotal: licenseTotal,
      icon: KeyRound,
      highlight: 'border-emerald-600 text-emerald-600',
    },
    {
      id: 'ASSURE',
      label: 'ASSURE Cost Pool',
      subtitle: 'AI Risk, Red-Teaming & Compliance',
      subtotal: assureTotal,
      icon: ShieldAlert,
      highlight: 'border-amber-600 text-amber-600',
    },
  ];

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 py-3">
          {pools.map((pool) => {
            const Icon = pool.icon;
            const isActive = activePool === pool.id;

            return (
              <button
                key={pool.id}
                onClick={() => onSelectPool(pool.id)}
                className={`text-left p-3.5 rounded-lg border transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive
                          ? 'text-indigo-300'
                          : 'text-slate-500 group-hover:text-slate-800'
                      }`}
                    />
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        isActive ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {pool.id}
                    </span>
                  </div>
                  <span
                    className={`font-mono-numbers text-xs font-semibold ${
                      isActive ? 'text-indigo-200' : 'text-slate-800'
                    }`}
                  >
                    {formatCurrency(pool.subtotal, currency)}
                  </span>
                </div>

                <div
                  className={`text-[11px] truncate leading-tight ${
                    isActive ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {pool.subtitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
