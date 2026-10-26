import React, { useState } from 'react';
import {
  CostPoolType,
  ProposalMetadata,
  BuildCostState,
  RunStageState,
  RunConfigSetup,
  LicenseCostState,
  AssureCostState,
} from './types/cost-economics';
import {
  initialProposalMetadata,
  initialBuildCostState,
  initialRunStageState,
  initialRunConfigSetup,
  initialLicenseCostState,
  initialAssureCostState,
} from './data/initialData';
import {
  calculateBuildCosts,
  calculateRunCosts,
  calculateLicenseCosts,
  calculateAssureCosts,
  calculateConsolidatedSummary,
} from './utils/calculations';
import { Header } from './components/Header';
import { PoolNav } from './components/PoolNav';
import { BuildPoolView } from './components/build/BuildPoolView';
import { RunPoolView } from './components/run/RunPoolView';
import { LicensePoolView } from './components/license/LicensePoolView';
import { AssurePoolView } from './components/assure/AssurePoolView';
import { ConsolidatedCostModal } from './components/consolidated/ConsolidatedCostModal';

export default function App() {
  const [activePool, setActivePool] = useState<CostPoolType>('RUN');
  const [metadata, setMetadata] = useState<ProposalMetadata>(initialProposalMetadata);
  const [buildData, setBuildData] = useState<BuildCostState>(initialBuildCostState);
  const [runState, setRunState] = useState<RunStageState>(initialRunStageState);
  const [runConfig, setRunConfig] = useState<RunConfigSetup>(initialRunConfigSetup);
  const [licenseData, setLicenseData] = useState<LicenseCostState>(initialLicenseCostState);
  const [assureData, setAssureData] = useState<AssureCostState>(initialAssureCostState);
  const [isConsolidatedOpen, setIsConsolidatedOpen] = useState(false);

  // Subtotal calculations for each pool
  const buildCalc = calculateBuildCosts(buildData);
  const runCalc = calculateRunCosts(runState, runConfig);
  const licenseCalc = calculateLicenseCosts(licenseData);
  const assureCalc = calculateAssureCosts(assureData);

  const consolidated = calculateConsolidatedSummary(
    buildData,
    runState,
    runConfig,
    licenseData,
    assureData
  );

  const handleResetDefaults = () => {
    if (window.confirm('Reset all proposal inputs to default enterprise presets?')) {
      setMetadata(initialProposalMetadata);
      setBuildData(initialBuildCostState);
      setRunState(initialRunStageState);
      setRunConfig(initialRunConfigSetup);
      setLicenseData(initialLicenseCostState);
      setAssureData(initialAssureCostState);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* App Header */}
      <Header
        metadata={metadata}
        onUpdateMetadata={setMetadata}
        onOpenConsolidated={() => setIsConsolidatedOpen(true)}
        onResetDefaults={handleResetDefaults}
        grandTotal={consolidated.grandTotal36Months}
      />

      {/* 4 Cost Pool Independent Navigation */}
      <PoolNav
        activePool={activePool}
        onSelectPool={setActivePool}
        buildTotal={buildCalc.total}
        runTotal={runCalc.expectedOperatingCost36Months}
        licenseTotal={licenseCalc.total}
        assureTotal={assureCalc.total}
        currency={metadata.currency}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activePool === 'BUILD' && (
          <BuildPoolView
            buildData={buildData}
            onChange={setBuildData}
            currency={metadata.currency}
          />
        )}

        {activePool === 'RUN' && (
          <RunPoolView
            runState={runState}
            config={runConfig}
            onChangeRunState={setRunState}
            onSaveConfig={setRunConfig}
            currency={metadata.currency}
            onOpenConsolidated={() => setIsConsolidatedOpen(true)}
          />
        )}

        {activePool === 'LICENSE' && (
          <LicensePoolView
            licenseData={licenseData}
            onChange={setLicenseData}
            currency={metadata.currency}
          />
        )}

        {activePool === 'ASSURE' && (
          <AssurePoolView
            assureData={assureData}
            onChange={setAssureData}
            currency={metadata.currency}
          />
        )}
      </main>

      {/* Global Consolidated AI Cost Modal */}
      <ConsolidatedCostModal
        isOpen={isConsolidatedOpen}
        onClose={() => setIsConsolidatedOpen(false)}
        metadata={metadata}
        buildData={buildData}
        runState={runState}
        runConfig={runConfig}
        licenseData={licenseData}
        assureData={assureData}
        currency={metadata.currency}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">AI Cost Economics</span>
            <span>·</span>
            <span>RFP / RFI & Strategic Proposal Budget Modeling</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Modular Backend Schema Ready</span>
            <span>·</span>
            <span>4 Cost Pools: BUILD · RUN · LICENSE · ASSURE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
