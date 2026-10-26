import React from 'react';
import { AssureCostState } from '../../types/cost-economics';
import { calculateAssureCosts, formatCurrency } from '../../utils/calculations';
import { ShieldAlert, Terminal, CheckCircle2, ShieldCheck, Scale, Users, Award } from 'lucide-react';

interface AssurePoolViewProps {
  assureData: AssureCostState;
  onChange: (data: AssureCostState) => void;
  currency: string;
}

export const AssurePoolView: React.FC<AssurePoolViewProps> = ({
  assureData,
  onChange,
  currency,
}) => {
  const calc = calculateAssureCosts(assureData);

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              ASSURE Cost Pool
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 font-medium">
              AI Risk Assurance, Red-Teaming, RAG Accuracy & Compliance
            </span>
          </div>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            Quantifies the AI compute, LLM-as-a-judge tokens, and specialized testing tool costs consumed to assess model vulnerability, monitor RAG grounding, enforce guardrails, and audit regulatory compliance (EU AI Act, NIST AI RMF). Excludes generic staff payroll to capture pure AI risk assurance spend.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-lg text-right shrink-0">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            Total ASSURE Cost
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono-numbers">
            {formatCurrency(calc.total, currency)}
          </div>
          <div className="text-[11px] text-slate-500">3-Year Risk Assurance Spend</div>
        </div>
      </div>

      {/* 5 Core AI Risk Assurance Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Area 1: Automated Adversarial Red-Teaming & Prompt Injection Testing */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-semibold text-slate-900">
                  Automated Adversarial Red-Teaming
                </h3>
              </div>
              <span className="text-xs font-mono-numbers font-semibold text-slate-800">
                {formatCurrency(calc.redTeamingTotal, currency)}
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              Automated attacker LLM simulation passes (PyRIT, Garak, prompt jailbreak suites) that execute fuzzing campaigns against the system before and after deployment.
            </p>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-md">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-medium block">
                    Annual Red-Team Runs
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={assureData.automatedRedTeaming.annualRuns}
                    onChange={(e) =>
                      onChange({
                        ...assureData,
                        automatedRedTeaming: {
                          ...assureData.automatedRedTeaming,
                          annualRuns: Math.max(1, parseInt(e.target.value) || 1),
                        },
                      })
                    }
                    className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 font-mono-numbers text-xs mt-0.5"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    x 3 years = {assureData.automatedRedTeaming.annualRuns * 3} lifetime runs
                  </span>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-medium block">
                    Attacker Tokens / Run (M)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={assureData.automatedRedTeaming.attackerModelTokensPerRunM}
                    onChange={(e) =>
                      onChange({
                        ...assureData,
                        automatedRedTeaming: {
                          ...assureData.automatedRedTeaming,
                          attackerModelTokensPerRunM: Math.max(0.5, parseFloat(e.target.value) || 0.5),
                        },
                      })
                    }
                    className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 font-mono-numbers text-xs mt-0.5"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Simulated penetration prompts
                  </span>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-medium block">
                    Attacker Model Rate ($/M)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.2"
                    value={assureData.automatedRedTeaming.ratePerMToken}
                    onChange={(e) =>
                      onChange({
                        ...assureData,
                        automatedRedTeaming: {
                          ...assureData.automatedRedTeaming,
                          ratePerMToken: Math.max(0, parseFloat(e.target.value) || 0),
                        },
                      })
                    }
                    className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 font-mono-numbers text-xs mt-0.5"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-medium block">
                    Scanner Tool Fee ($/Year)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={assureData.automatedRedTeaming.specializedScannerFeeAnnual}
                    onChange={(e) =>
                      onChange({
                        ...assureData,
                        automatedRedTeaming: {
                          ...assureData.automatedRedTeaming,
                          specializedScannerFeeAnnual: Math.max(0, parseFloat(e.target.value) || 0),
                        },
                      })
                    }
                    className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 font-mono-numbers text-xs mt-0.5"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 text-right text-[11px] text-slate-500">
            3-Year Red Teaming Total:{' '}
            <span className="font-semibold text-slate-900 font-mono-numbers">
              {formatCurrency(calc.redTeamingTotal, currency)}
            </span>
          </div>
        </div>

        {/* Area 2: Continuous Automated RAG Accuracy & Grounding Evaluation */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-semibold text-slate-900">
                  Continuous RAG Accuracy (LLM-as-a-Judge)
                </h3>
              </div>
              <span className="text-xs font-mono-numbers font-semibold text-slate-800">
                {formatCurrency(calc.continuousRagTotal, currency)}
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              Independent judge models evaluating production response faithfulness, context relevance, answer relevancy, and hallucination rates.
            </p>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-md">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-medium block">
                    Eval Queries / Month
                  </label>
                  <input
                    type="number"
                    min="100"
                    step="500"
                    value={assureData.continuousRagAccuracy.evalQueriesPerMonth}
                    onChange={(e) =>
                      onChange({
                        ...assureData,
                        continuousRagAccuracy: {
                          ...assureData.continuousRagAccuracy,
                          evalQueriesPerMonth: Math.max(10, parseInt(e.target.value) || 10),
                        },
                      })
                    }
                    className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 font-mono-numbers text-xs mt-0.5"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Sampled production questions scored
                  </span>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-medium block">
                    Judge Tokens / Query
                  </label>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    value={assureData.continuousRagAccuracy.judgeTokensPerQuery}
                    onChange={(e) =>
                      onChange({
                        ...assureData,
                        continuousRagAccuracy: {
                          ...assureData.continuousRagAccuracy,
                          judgeTokensPerQuery: Math.max(50, parseInt(e.target.value) || 50),
                        },
                      })
                    }
                    className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 font-mono-numbers text-xs mt-0.5"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Scoring rubric & critique tokens
                  </span>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-medium block">
                    Judge Model Rate ($/M)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.2"
                    value={assureData.continuousRagAccuracy.judgeModelRatePerM}
                    onChange={(e) =>
                      onChange({
                        ...assureData,
                        continuousRagAccuracy: {
                          ...assureData.continuousRagAccuracy,
                          judgeModelRatePerM: Math.max(0, parseFloat(e.target.value) || 0),
                        },
                      })
                    }
                    className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 font-mono-numbers text-xs mt-0.5"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-medium block">
                    Monitoring Horizon (Months)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={assureData.continuousRagAccuracy.triagingDurationMonths}
                    onChange={(e) =>
                      onChange({
                        ...assureData,
                        continuousRagAccuracy: {
                          ...assureData.continuousRagAccuracy,
                          triagingDurationMonths: Math.max(1, parseInt(e.target.value) || 1),
                        },
                      })
                    }
                    className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 font-mono-numbers text-xs mt-0.5"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 text-right text-[11px] text-slate-500">
            3-Year RAG Accuracy Eval:{' '}
            <span className="font-semibold text-slate-900 font-mono-numbers">
              {formatCurrency(calc.continuousRagTotal, currency)}
            </span>
          </div>
        </div>

        {/* Area 3: AI Safety Guardrails & Runtime Safety Filters Overhead */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-semibold text-slate-900">
                  Runtime Safety Guardrails & Output Filters
                </h3>
              </div>
              <span className="text-xs font-mono-numbers font-semibold text-slate-800">
                {formatCurrency(calc.guardrailsTotal, currency)}
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              Lightweight guardrail model passes (Llama Guard, NeMo Guardrails, Azure Content Safety) executed synchronously on incoming queries and outgoing responses.
            </p>

            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-md text-xs">
              <div>
                <label className="text-[10px] text-slate-500 uppercase font-medium block">
                  Scanned Tokens / Month (M)
                </label>
                <input
                  type="number"
                  min="1"
                  step="2"
                  value={assureData.guardrailsRuntime.monthlyInputScannedTokensM}
                  onChange={(e) =>
                    onChange({
                      ...assureData,
                      guardrailsRuntime: {
                        ...assureData.guardrailsRuntime,
                        monthlyInputScannedTokensM: Math.max(0.5, parseFloat(e.target.value) || 0.5),
                      },
                    })
                  }
                  className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 font-mono-numbers text-xs mt-0.5"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 uppercase font-medium block">
                  Guardrail Model Rate ($/M)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.05"
                  value={assureData.guardrailsRuntime.guardrailRatePerM}
                  onChange={(e) =>
                    onChange({
                      ...assureData,
                      guardrailsRuntime: {
                        ...assureData.guardrailsRuntime,
                        guardrailRatePerM: Math.max(0, parseFloat(e.target.value) || 0),
                      },
                    })
                  }
                  className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 font-mono-numbers text-xs mt-0.5"
                />
              </div>

              <div className="col-span-2">
                <label className="text-[10px] text-slate-500 uppercase font-medium block">
                  Dedicated Toxicity & Safety API Fee ($/Month)
                </label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={assureData.guardrailsRuntime.toxicitySafetyApiFeeMonthly}
                  onChange={(e) =>
                    onChange({
                      ...assureData,
                      guardrailsRuntime: {
                        ...assureData.guardrailsRuntime,
                        toxicitySafetyApiFeeMonthly: Math.max(0, parseFloat(e.target.value) || 0),
                      },
                    })
                  }
                  className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 font-mono-numbers text-xs mt-0.5"
                />
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 text-right text-[11px] text-slate-500">
            3-Year Guardrail Overhead:{' '}
            <span className="font-semibold text-slate-900 font-mono-numbers">
              {formatCurrency(calc.guardrailsTotal, currency)}
            </span>
          </div>
        </div>

        {/* Area 4: AI Regulatory & Compliance Auditing */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-semibold text-slate-900">
                  Regulatory Compliance & PII Audits
                </h3>
              </div>
              <span className="text-xs font-mono-numbers font-semibold text-slate-800">
                {formatCurrency(calc.complianceTotal, currency)}
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              Automated audit suites verifying conformance with the EU AI Act (high-risk conformity), NIST AI RMF, ISO 42001, and continuous PII redaction scanner passes.
            </p>

            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-md text-xs">
              <div>
                <label className="text-[10px] text-slate-500 uppercase font-medium block">
                  Annual Audit Cycles
                </label>
                <input
                  type="number"
                  min="1"
                  value={assureData.regulatoryComplianceAudits.auditCyclesPerYear}
                  onChange={(e) =>
                    onChange({
                      ...assureData,
                      regulatoryComplianceAudits: {
                        ...assureData.regulatoryComplianceAudits,
                        auditCyclesPerYear: Math.max(1, parseInt(e.target.value) || 1),
                      },
                    })
                  }
                  className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 font-mono-numbers text-xs mt-0.5"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 uppercase font-medium block">
                  AI Model Cost / Audit Cycle ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={assureData.regulatoryComplianceAudits.aiAuditModelCostPerCycle}
                  onChange={(e) =>
                    onChange({
                      ...assureData,
                      regulatoryComplianceAudits: {
                        ...assureData.regulatoryComplianceAudits,
                        aiAuditModelCostPerCycle: Math.max(0, parseFloat(e.target.value) || 0),
                      },
                    })
                  }
                  className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 font-mono-numbers text-xs mt-0.5"
                />
              </div>

              <div className="col-span-2">
                <label className="text-[10px] text-slate-500 uppercase font-medium block">
                  PII & Governance Scanner Annual Fee ($/Year)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={assureData.regulatoryComplianceAudits.piiScannerLicenseAnnual}
                  onChange={(e) =>
                    onChange({
                      ...assureData,
                      regulatoryComplianceAudits: {
                        ...assureData.regulatoryComplianceAudits,
                        piiScannerLicenseAnnual: Math.max(0, parseFloat(e.target.value) || 0),
                      },
                    })
                  }
                  className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 font-mono-numbers text-xs mt-0.5"
                />
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 text-right text-[11px] text-slate-500">
            3-Year Regulatory Compliance:{' '}
            <span className="font-semibold text-slate-900 font-mono-numbers">
              {formatCurrency(calc.complianceTotal, currency)}
            </span>
          </div>
        </div>

        {/* Area 5: AI-Assisted SME Triage & Risk Review (Full Width) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-semibold text-slate-900">
                AI Risk SME Review & Assurance Tooling
              </h3>
            </div>
            <span className="text-xs font-mono-numbers font-semibold text-slate-800">
              {formatCurrency(calc.smeTriageTotal, currency)}
            </span>
          </div>

          <p className="text-xs text-slate-500 mb-3">
            Tool platform cost for AI risk SMEs and human compliance officers conducting targeted root-cause analysis on flagged anomalies, edge cases, and policy violations.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3 bg-slate-50 border border-slate-200 rounded-md text-xs">
            <div>
              <label className="text-[10px] text-slate-500 uppercase font-medium block">
                Assisted SME Hours / Month
              </label>
              <input
                type="number"
                min="0"
                value={assureData.aiAssistedSmeTriage.monthlySmeHours}
                onChange={(e) =>
                  onChange({
                    ...assureData,
                    aiAssistedSmeTriage: {
                      ...assureData.aiAssistedSmeTriage,
                      monthlySmeHours: Math.max(0, parseInt(e.target.value) || 0),
                    },
                  })
                }
                className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 font-mono-numbers text-xs mt-0.5"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-500 uppercase font-medium block">
                AI Assurance Tool Cost ($/Hour)
              </label>
              <input
                type="number"
                min="0"
                value={assureData.aiAssistedSmeTriage.aiAssuranceToolCostPerHour}
                onChange={(e) =>
                  onChange({
                    ...assureData,
                    aiAssistedSmeTriage: {
                      ...assureData.aiAssistedSmeTriage,
                      aiAssuranceToolCostPerHour: Math.max(0, parseFloat(e.target.value) || 0),
                    },
                  })
                }
                className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 font-mono-numbers text-xs mt-0.5"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-500 uppercase font-medium block">
                Duration (Months)
              </label>
              <input
                type="number"
                min="1"
                value={assureData.aiAssistedSmeTriage.durationMonths}
                onChange={(e) =>
                  onChange({
                    ...assureData,
                    aiAssistedSmeTriage: {
                      ...assureData.aiAssistedSmeTriage,
                      durationMonths: Math.max(1, parseInt(e.target.value) || 1),
                    },
                  })
                }
                className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 font-mono-numbers text-xs mt-0.5"
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Risk Management Scope: Ongoing Parallel Assurance</span>
            <span className="font-medium text-slate-800">
              Total ASSURE Pool:{' '}
              <span className="font-mono-numbers font-bold text-slate-900">
                {formatCurrency(calc.total, currency)}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
