export type CostPoolType = 'BUILD' | 'RUN' | 'LICENSE' | 'ASSURE';

export type ProposalStage = 'RFP Response' | 'RFI Exploration' | 'Customer Pilot' | 'Strategic Proposal' | 'Proactive Pitch';
export type CurrencyCode = 'USD' | 'EUR' | 'GBP';

export interface ProposalMetadata {
  title: string;
  clientName: string;
  stage: ProposalStage;
  currency: CurrencyCode;
  version: string;
  author: string;
  updatedAt: string;
}

// BUILD Cost Pool Types (Delivery Effort, AI Setup & Indexing, Training Compute, Pipeline, and Review)
export interface DevAgentTokenConsumption {
  activeEngineersCount: number;
  deliveryDurationWeeks: number;
  activeCodingDaysPerWeek: number;
  dailyAgentTokenSpendUSD: number;
  agentToolProfile: 'Standard Interactive Assistant ($15-$25/day)' | 'Autonomous Multi-Turn Agent ($35-$70/day)' | 'Heavy Multi-Agent Factory Swarm ($90-$150/day)';
  notes: string;
}

export interface AiSetupIndexing {
  corpusRawDocumentsCount: number;
  multimodalOcrParsingTokensM: number;
  ocrModelRatePerM: number;
  corpusEmbeddingTokensM: number;
  embeddingModelRatePerM: number;
  syntheticColdStartTokensM: number;
  syntheticGeneratorRatePerM: number;
  vectorIndexBuildComputeUSD: number;
}

export interface ModelAdaptationComputeItem {
  id: string;
  adaptationType: string;
  gpuClusterType: string;
  gpuCount: number;
  hoursPerRun: number;
  hourlyRatePerGpu: number;
  totalRuns: number;
}

export interface BuildPipelineConsumption {
  promptEngineeringTokensM: number;
  promptModelRatePerM: number;
  agenticWorkflowSpikeTokensM: number;
  agentModelRatePerM: number;
  cicdPipelineTestRuns: number;
  tokensPerPipelineRunM: number;
  pipelineModelRatePerM: number;
}

export interface StagingEnvironmentRuntime {
  uatPilotDurationMonths: number;
  uatTestTransactionsTotal: number;
  avgTokensPerUatTest: number;
  uatModelRatePerM: number;
  stagingVectorDbClusterCostUSD: number;
  stagingGpuHostHours: number;
  stagingGpuRatePerHour: number;
}

export interface ReviewAndQualityGates {
  aiAssistedReviewPasses: number;
  costPerReviewPassUSD: number;
  acceptanceBenchmarkRuns: number;
  benchmarkTokensPerRunM: number;
  evalModelRatePerM: number;
}

export interface BuildCostState {
  devAgentTokens: DevAgentTokenConsumption;
  setupAndIndexing: AiSetupIndexing;
  modelAdaptation: ModelAdaptationComputeItem[];
  pipelineConsumption: BuildPipelineConsumption;
  stagingRuntime: StagingEnvironmentRuntime;
  reviewQualityGates: ReviewAndQualityGates;
  notes: string;
}

// RUN 8 Stages Types
export interface UploadedDoc {
  id: string;
  name: string;
  size: string;
  fileType: string;
  uploadDate: string;
  status: 'Parsed' | 'Analyzing' | 'Ready';
  detectedArchetype?: string;
}

export interface FlowNode {
  id: string;
  name: string;
  type: 'input' | 'guardrail' | 'router' | 'retrieval' | 'model' | 'agent' | 'output';
  description: string;
  latencyBudgetMs: number;
  costImpact: 'Low' | 'Medium' | 'High';
}

export interface Stage1FlowData {
  uploadedDocs: UploadedDoc[];
  architectureArchetype: 'Enterprise RAG Assistant' | 'Autonomous Agentic Workflow' | 'High-Throughput Document Processing' | 'Hybrid Fine-Tuned Specialist';
  nodes: FlowNode[];
  isAnalyzed: boolean;
}

export interface Stage2DemandData {
  monthlyActiveUsers: number;
  queriesPerUserPerDay: number;
  workingDaysPerMonth: number;
  peakConcurrencyMultiplier: number;
  businessValueSummary: string;
}

export interface Stage3WorkloadData {
  inputTokensPerQuery: number;
  outputTokensPerQuery: number;
  contextChunksPerQuery: number;
  vectorSearchesPerQuery: number;
  agentToolLoops: number;
}

export interface Stage4ConsumptionData {
  primaryModelTier: 'Frontier Reasoning (GPT-4o/Claude 3.5 Sonnet)' | 'High-Speed Flash (Gemini 2.0/Claude 3.5 Haiku)' | 'Self-Hosted Llama 3.3 70B';
  promptCacheHitRatePct: number;
  vectorDbStorageGB: number;
  monthlyEmbeddingOpsMillions: number;
  gpuHostingUnits: number;
}

export interface Stage5ProductionData {
  slaTier: '99.5% Standard SLA' | '99.9% High Availability' | '99.99% Multi-Region Failover';
  redundancyMultiplier: number;
  p95LatencyBudgetMs: number;
  provisionedThroughput: boolean;
  rateLimitSafetyBufferPct: number;
}

export interface Stage6PriceData {
  selectedCatalogueId: string;
  inputTokenPricePerM: number;
  cachedInputTokenPricePerM: number;
  outputTokenPricePerM: number;
  vectorDbCostPerGB: number;
  gpuUnitCostPerHour: number;
  volumeDiscountPct: number;
}

export interface Stage7ForecastData {
  rampUpTrajectory: 'Standard S-Curve' | 'Fast Ramp (Pilot to Enterprise)' | 'Steady Linear';
  y1RampFactor: number; // e.g. 0.65 average
  y2GrowthPct: number;  // e.g. 40%
  y3GrowthPct: number;  // e.g. 25%
}

export interface Stage8DashboardData {
  expectedOperatingCost36Months: number;
  currentBaselineCostPerMonthUSD: number;
  humanReviewShareBaseCostUSD: number;
  humanReviewSharePct: number;
  annualOperatingCostY1: number;
  annualOperatingCostY2: number;
  annualOperatingCostY3: number;
  costByArchitecture: {
    archetype: string;
    sharePct: number;
    amountUSD: number;
  }[];
}

export interface RunStageState {
  currentStage: number; // 1 to 8 strictly sequential
  stage1: Stage1FlowData;
  stage2: Stage2DemandData;
  stage3: Stage3WorkloadData;
  stage4: Stage4ConsumptionData;
  stage5: Stage5ProductionData;
  stage6: Stage6PriceData;
  stage7: Stage7ForecastData;
  stage8: Stage8DashboardData;
}

// RUN Configuration Setup (Price & Catalogue + RULES & Reference)
export interface ModelCatalogueEntry {
  id: string;
  name: string;
  provider: string;
  tier: string;
  inputPricePerM: number;
  cachedInputPricePerM: number;
  outputPricePerM: number;
  gpuHourlyRate: number;
  vectorDbPricePerGB: number;
  contextWindow: string;
}

export interface RulesAndReference {
  defaultTokenBufferPct: number;
  defaultPeakConcurrency: number;
  defaultCacheHitAssumptionPct: number;
  humanReviewAuditRatePct: number;
  humanReviewHourlyRateUSD: number;
  failoverRedundancyRate: number;
  defaultSlaBufferPct: number;
}

export interface RunConfigSetup {
  catalogues: ModelCatalogueEntry[];
  rules: RulesAndReference;
}

// LICENSE Cost Pool Types
export type LicenseModelType = 'Per Seat / Month' | 'Platform Subscription Tier' | 'Capacity / Reservation' | 'Flat Enterprise Annual';

export interface LicenseItem {
  id: string;
  toolName: string;
  vendor: string;
  category: 'LLM Observability' | 'GenAI Platform License' | 'Enterprise Copilot' | 'Vector DB Enterprise' | 'Model Gateway & Security';
  licenseModel: LicenseModelType;
  unitCost: number;
  quantity: number;
  durationMonths: number;
  notes: string;
}

export interface LicenseCostState {
  items: LicenseItem[];
  notes: string;
}

// ASSURE Cost Pool Types (AI risk assessment, red-teaming, RAG accuracy, compliance)
export interface AssureCostState {
  automatedRedTeaming: {
    annualRuns: number;
    attackerModelTokensPerRunM: number;
    ratePerMToken: number;
    specializedScannerFeeAnnual: number;
  };
  continuousRagAccuracy: {
    evalQueriesPerMonth: number;
    judgeTokensPerQuery: number;
    judgeModelRatePerM: number;
    triagingDurationMonths: number;
  };
  guardrailsRuntime: {
    monthlyInputScannedTokensM: number;
    guardrailRatePerM: number;
    toxicitySafetyApiFeeMonthly: number;
  };
  regulatoryComplianceAudits: {
    auditCyclesPerYear: number;
    aiAuditModelCostPerCycle: number;
    piiScannerLicenseAnnual: number;
  };
  aiAssistedSmeTriage: {
    monthlySmeHours: number;
    aiAssuranceToolCostPerHour: number;
    durationMonths: number;
  };
  notes: string;
}

// Consolidated Cost Economic Summary
export interface ConsolidatedSummary {
  buildTotal: number;
  run36MonthsTotal: number;
  runBaselineMonthly: number;
  runHumanReviewBaseCost: number;
  runAnnualY1: number;
  runAnnualY2: number;
  runAnnualY3: number;
  licenseTotal: number;
  assureTotal: number;
  grandTotal36Months: number;
  capexShare: number; // Build
  opexShare: number;  // Run + License + Assure
}
