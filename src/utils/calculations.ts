import {
  BuildCostState,
  RunStageState,
  RunConfigSetup,
  LicenseCostState,
  AssureCostState,
  ConsolidatedSummary,
} from '../types/cost-economics';

export function calculateBuildCosts(build: BuildCostState) {
  // 0. Development Agent Token & Context Loop Consumption (Claude Code, Copilot Agent, Cursor)
  const totalDevCodingDays =
    (build.devAgentTokens?.activeEngineersCount || 0) *
    (build.devAgentTokens?.deliveryDurationWeeks || 0) *
    (build.devAgentTokens?.activeCodingDaysPerWeek || 0);
  const devAgentTokensCost =
    totalDevCodingDays * (build.devAgentTokens?.dailyAgentTokenSpendUSD || 0);

  // 1. AI Setup & Knowledge Indexing
  const ocrParsingCost =
    build.setupAndIndexing.multimodalOcrParsingTokensM *
    build.setupAndIndexing.ocrModelRatePerM;
  const embeddingGenCost =
    build.setupAndIndexing.corpusEmbeddingTokensM *
    build.setupAndIndexing.embeddingModelRatePerM;
  const syntheticColdStartCost =
    build.setupAndIndexing.syntheticColdStartTokensM *
    build.setupAndIndexing.syntheticGeneratorRatePerM;
  const indexComputeCost = build.setupAndIndexing.vectorIndexBuildComputeUSD;
  const setupAndIndexingTotal =
    ocrParsingCost + embeddingGenCost + syntheticColdStartCost + indexComputeCost;

  // 2. Model Adaptation & Training Compute
  const modelAdaptationTotal = build.modelAdaptation.reduce(
    (sum, item) =>
      sum + item.gpuCount * item.hoursPerRun * item.hourlyRatePerGpu * item.totalRuns,
    0
  );

  // 3. Build Environments & Pipeline AI Work
  const promptEngCost =
    build.pipelineConsumption.promptEngineeringTokensM *
    build.pipelineConsumption.promptModelRatePerM;
  const agentSpikeCost =
    build.pipelineConsumption.agenticWorkflowSpikeTokensM *
    build.pipelineConsumption.agentModelRatePerM;
  const cicdPipelineCost =
    build.pipelineConsumption.cicdPipelineTestRuns *
    build.pipelineConsumption.tokensPerPipelineRunM *
    build.pipelineConsumption.pipelineModelRatePerM;
  const pipelineConsumptionTotal = promptEngCost + agentSpikeCost + cicdPipelineCost;

  // 4. Staging / UAT Sandbox Pre-Production Runtime
  const uatTokensMillions =
    (build.stagingRuntime.uatTestTransactionsTotal *
      build.stagingRuntime.avgTokensPerUatTest) /
    1_000_000;
  const uatTokensCost = uatTokensMillions * build.stagingRuntime.uatModelRatePerM;
  const stagingGpuCost =
    build.stagingRuntime.stagingGpuHostHours *
    build.stagingRuntime.stagingGpuRatePerHour;
  const stagingRuntimeTotal =
    uatTokensCost +
    build.stagingRuntime.stagingVectorDbClusterCostUSD +
    stagingGpuCost;

  // 5. Review Inputs & Acceptance Verification Gates
  const reviewPassesCost =
    build.reviewQualityGates.aiAssistedReviewPasses *
    build.reviewQualityGates.costPerReviewPassUSD;
  const acceptanceBenchmarkCost =
    build.reviewQualityGates.acceptanceBenchmarkRuns *
    build.reviewQualityGates.benchmarkTokensPerRunM *
    build.reviewQualityGates.evalModelRatePerM;
  const reviewQualityGatesTotal = reviewPassesCost + acceptanceBenchmarkCost;

  const total =
    devAgentTokensCost +
    setupAndIndexingTotal +
    modelAdaptationTotal +
    pipelineConsumptionTotal +
    stagingRuntimeTotal +
    reviewQualityGatesTotal;

  return {
    devAgentTokensCost,
    totalDevCodingDays,
    setupAndIndexingTotal,
    ocrParsingCost,
    embeddingGenCost,
    syntheticColdStartCost,
    indexComputeCost,
    modelAdaptationTotal,
    pipelineConsumptionTotal,
    promptEngCost,
    agentSpikeCost,
    cicdPipelineCost,
    stagingRuntimeTotal,
    uatTokensCost,
    stagingGpuCost,
    reviewQualityGatesTotal,
    reviewPassesCost,
    acceptanceBenchmarkCost,
    total,
  };
}

export function calculateRunCosts(run: RunStageState, config: RunConfigSetup) {
  // Stage 2: Demand
  const monthlyRequests =
    run.stage2.monthlyActiveUsers *
    run.stage2.queriesPerUserPerDay *
    run.stage2.workingDaysPerMonth;

  // Stage 3: Workload
  const totalInputTokensMonthly = monthlyRequests * run.stage3.inputTokensPerQuery;
  const totalOutputTokensMonthly = monthlyRequests * run.stage3.outputTokensPerQuery;

  // Stage 4: Consumption
  const cacheHitPct = run.stage4.promptCacheHitRatePct / 100;
  const cachedInputTokensMonthly = totalInputTokensMonthly * cacheHitPct;
  const uncachedInputTokensMonthly = totalInputTokensMonthly * (1 - cacheHitPct);

  // Stage 5: Production multiplier
  const slaMultiplier = run.stage5.redundancyMultiplier * (1 + run.stage5.rateLimitSafetyBufferPct / 100);

  // Stage 6: Price consumption
  const inputMillions = uncachedInputTokensMonthly / 1_000_000;
  const cachedInputMillions = cachedInputTokensMonthly / 1_000_000;
  const outputMillions = totalOutputTokensMonthly / 1_000_000;

  const discountFactor = 1 - run.stage6.volumeDiscountPct / 100;

  const modelInferenceCostMonthly =
    (inputMillions * run.stage6.inputTokenPricePerM +
      cachedInputMillions * run.stage6.cachedInputTokenPricePerM +
      outputMillions * run.stage6.outputTokenPricePerM) *
    slaMultiplier *
    discountFactor;

  const vectorDbCostMonthly = run.stage4.vectorDbStorageGB * run.stage6.vectorDbCostPerGB;
  const gpuComputeCostMonthly = run.stage4.gpuHostingUnits * 730 * run.stage6.gpuUnitCostPerHour;

  // Human review share: sampling rate of requests reviewed by AI-assisted human SMEs
  // Estimated 3 minutes (0.05 hr) per audited sample
  const auditedQueriesMonthly = monthlyRequests * (config.rules.humanReviewAuditRatePct / 100);
  const humanReviewHoursMonthly = auditedQueriesMonthly * 0.05;
  const humanReviewBaseCostMonthly = humanReviewHoursMonthly * config.rules.humanReviewHourlyRateUSD;

  const baselineMonthlyCostUSD = modelInferenceCostMonthly + vectorDbCostMonthly + gpuComputeCostMonthly + humanReviewBaseCostMonthly;

  // Stage 7: Forecast Lifecycle (36 Months)
  // Year 1 reflects ramp factor
  const y1AnnualCost = baselineMonthlyCostUSD * 12 * run.stage7.y1RampFactor;
  // Year 2 reflects steady baseline plus year-2 growth
  const y2AnnualCost = baselineMonthlyCostUSD * 12 * (1 + run.stage7.y2GrowthPct / 100);
  // Year 3 reflects year-3 compounding growth
  const y3AnnualCost = y2AnnualCost * (1 + run.stage7.y3GrowthPct / 100);

  const expectedOperatingCost36Months = y1AnnualCost + y2AnnualCost + y3AnnualCost;

  const humanReviewSharePct = baselineMonthlyCostUSD > 0
    ? (humanReviewBaseCostMonthly / baselineMonthlyCostUSD) * 100
    : 0;

  // Architecture Cost Breakdown for Stage 8 Dashboard
  const foundationLlmShare = (modelInferenceCostMonthly / baselineMonthlyCostUSD) * 100;
  const vectorDbShare = (vectorDbCostMonthly / baselineMonthlyCostUSD) * 100;
  const computeHostingShare = (gpuComputeCostMonthly / baselineMonthlyCostUSD) * 100;
  const humanReviewShare = (humanReviewBaseCostMonthly / baselineMonthlyCostUSD) * 100;

  const costByArchitecture = [
    {
      archetype: 'Foundation Model Token Inference',
      sharePct: Math.round(foundationLlmShare * 10) / 10,
      amountUSD: Math.round(expectedOperatingCost36Months * (foundationLlmShare / 100)),
    },
    {
      archetype: 'Semantic Vector DB & Retrieval Corpus',
      sharePct: Math.round(vectorDbShare * 10) / 10,
      amountUSD: Math.round(expectedOperatingCost36Months * (vectorDbShare / 100)),
    },
    {
      archetype: 'GPU Hosting & Orchestration Compute',
      sharePct: Math.round(computeHostingShare * 10) / 10,
      amountUSD: Math.round(expectedOperatingCost36Months * (computeHostingShare / 100)),
    },
    {
      archetype: 'Human-in-the-Loop AI Audit & Review Share',
      sharePct: Math.round(humanReviewShare * 10) / 10,
      amountUSD: Math.round(expectedOperatingCost36Months * (humanReviewShare / 100)),
    },
  ];

  return {
    monthlyRequests,
    totalInputTokensMonthly,
    totalOutputTokensMonthly,
    cachedInputTokensMonthly,
    uncachedInputTokensMonthly,
    modelInferenceCostMonthly,
    vectorDbCostMonthly,
    gpuComputeCostMonthly,
    humanReviewBaseCostMonthly,
    baselineMonthlyCostUSD,
    y1AnnualCost,
    y2AnnualCost,
    y3AnnualCost,
    expectedOperatingCost36Months,
    humanReviewSharePct,
    costByArchitecture,
  };
}

export function calculateLicenseCosts(license: LicenseCostState) {
  const itemCosts = license.items.map((item) => {
    let cost = 0;
    if (item.licenseModel === 'Per Seat / Month') {
      cost = item.unitCost * item.quantity * item.durationMonths;
    } else if (item.licenseModel === 'Platform Subscription Tier') {
      cost = item.unitCost * item.durationMonths;
    } else if (item.licenseModel === 'Capacity / Reservation') {
      cost = item.unitCost * item.quantity * item.durationMonths;
    } else if (item.licenseModel === 'Flat Enterprise Annual') {
      cost = item.unitCost * (item.durationMonths / 12);
    }
    return { ...item, calculatedCost: cost };
  });

  const total = itemCosts.reduce((sum, item) => sum + item.calculatedCost, 0);

  return {
    itemCosts,
    total,
  };
}

export function calculateAssureCosts(assure: AssureCostState) {
  // Red teaming: 3 years
  const redTeamingTokensCost =
    assure.automatedRedTeaming.annualRuns *
    3 *
    assure.automatedRedTeaming.attackerModelTokensPerRunM *
    assure.automatedRedTeaming.ratePerMToken;
  const redTeamingScannerCost = assure.automatedRedTeaming.specializedScannerFeeAnnual * 3;
  const redTeamingTotal = redTeamingTokensCost + redTeamingScannerCost;

  // Continuous RAG accuracy
  const monthlyJudgeTokensMillions =
    (assure.continuousRagAccuracy.evalQueriesPerMonth *
      assure.continuousRagAccuracy.judgeTokensPerQuery) /
    1_000_000;
  const monthlyRagJudgeCost = monthlyJudgeTokensMillions * assure.continuousRagAccuracy.judgeModelRatePerM;
  const continuousRagTotal = monthlyRagJudgeCost * assure.continuousRagAccuracy.triagingDurationMonths;

  // Guardrails runtime overhead: 36 months
  const monthlyGuardrailTokensCost =
    assure.guardrailsRuntime.monthlyInputScannedTokensM *
    assure.guardrailsRuntime.guardrailRatePerM;
  const monthlyGuardrailsTotal =
    monthlyGuardrailTokensCost + assure.guardrailsRuntime.toxicitySafetyApiFeeMonthly;
  const guardrailsTotal = monthlyGuardrailsTotal * 36;

  // Compliance audits: 3 years
  const complianceAuditCost =
    assure.regulatoryComplianceAudits.auditCyclesPerYear *
    3 *
    assure.regulatoryComplianceAudits.aiAuditModelCostPerCycle;
  const piiScannerCost = assure.regulatoryComplianceAudits.piiScannerLicenseAnnual * 3;
  const complianceTotal = complianceAuditCost + piiScannerCost;

  // AI-assisted SME triage
  const monthlySmeAiToolCost =
    assure.aiAssistedSmeTriage.monthlySmeHours *
    assure.aiAssistedSmeTriage.aiAssuranceToolCostPerHour;
  const smeTriageTotal = monthlySmeAiToolCost * assure.aiAssistedSmeTriage.durationMonths;

  const total = redTeamingTotal + continuousRagTotal + guardrailsTotal + complianceTotal + smeTriageTotal;

  return {
    redTeamingTotal,
    redTeamingTokensCost,
    redTeamingScannerCost,
    continuousRagTotal,
    guardrailsTotal,
    complianceTotal,
    smeTriageTotal,
    total,
  };
}

export function calculateConsolidatedSummary(
  build: BuildCostState,
  run: RunStageState,
  config: RunConfigSetup,
  license: LicenseCostState,
  assure: AssureCostState
): ConsolidatedSummary {
  const buildCalc = calculateBuildCosts(build);
  const runCalc = calculateRunCosts(run, config);
  const licenseCalc = calculateLicenseCosts(license);
  const assureCalc = calculateAssureCosts(assure);

  const grandTotal36Months =
    buildCalc.total +
    runCalc.expectedOperatingCost36Months +
    licenseCalc.total +
    assureCalc.total;

  const capexShare = grandTotal36Months > 0 ? (buildCalc.total / grandTotal36Months) * 100 : 0;
  const opexTotal = runCalc.expectedOperatingCost36Months + licenseCalc.total + assureCalc.total;
  const opexShare = grandTotal36Months > 0 ? (opexTotal / grandTotal36Months) * 100 : 0;

  return {
    buildTotal: Math.round(buildCalc.total),
    run36MonthsTotal: Math.round(runCalc.expectedOperatingCost36Months),
    runBaselineMonthly: Math.round(runCalc.baselineMonthlyCostUSD),
    runHumanReviewBaseCost: Math.round(runCalc.humanReviewBaseCostMonthly),
    runAnnualY1: Math.round(runCalc.y1AnnualCost),
    runAnnualY2: Math.round(runCalc.y2AnnualCost),
    runAnnualY3: Math.round(runCalc.y3AnnualCost),
    licenseTotal: Math.round(licenseCalc.total),
    assureTotal: Math.round(assureCalc.total),
    grandTotal36Months: Math.round(grandTotal36Months),
    capexShare: Math.round(capexShare * 10) / 10,
    opexShare: Math.round(opexShare * 10) / 10,
  };
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  const symbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';
  return `${symbol}${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

export function formatNumber(val: number): string {
  return val.toLocaleString('en-US');
}
