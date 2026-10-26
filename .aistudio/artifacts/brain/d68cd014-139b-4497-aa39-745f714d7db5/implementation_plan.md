# AI Cost Economics Forecasting Platform

A specialized budget planning and cost forecasting workspace for AI Architects, Forward-Deployed Engineers, and AI Consultants during proposal stages (RFP, RFI, pilots, strategic/proactive proposals). It provides dedicated cost forecasting across the four core AI Cost Pools: **BUILD**, **RUN**, **LICENSE**, and **ASSURE**, with a consolidated executive financial roll-up.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The architectural framework and UX flows have been tailored directly to your clarified requirements:
> - **4 Independent Cost Pool Tabs**: Users can navigate between `BUILD`, `RUN`, `LICENSE`, and `ASSURE` in any order; filling all pools is optional.
> - **Consolidated Executive Roll-Up On Demand**: Rather than forced live recalculation, a dedicated "Consolidated AI Cost View" button allows users to review the complete multi-pool breakdown and 36-month economics whenever ready.
> - **Specialized BUILD, LICENSE & ASSURE Forms**: Grounded in AI-specific cost drivers (AI developer tooling, fine-tuning compute, enterprise platform licenses with standard subscription models, and AI SME risk assurance & evaluation tokens).
> - **Strict 8-Stage Sequential RUN Engine**: Features the sequential stages: (1) Execution Flow & Document Upload, (2) Demand & Usage Assumptions, (3) Workload Calculation, (4) Technical Consumption, (5) Production SLAs, (6) Price Consumption, (7) Lifecycle 3-Year Operating Cost, and (8) Decision Dashboard.
> - **Dedicated RUN Config Setup**: Out-of-pool configuration panel for "Price & Catalogue Data" and "RULES & Reference", cleanly decoupled from the cost pool tabs.
> - **Backend-Extensible Data Architecture**: Standardized TypeScript schemas for all 4 cost pools, catalog configurations, and scenario state for seamless future backend persistence and Excel/API integration.

---

## 1. Overview & Core Concept

During enterprise proposal cycles (RFPs, RFIs, prototype pilots, and strategic architectures), estimating the true cost of an AI initiative requires looking beyond raw inference tokens. This platform provides an end-to-end framework to calculate:
- **BUILD**: The cost of AI required by the engineering team to design, prototype, and build the AI application (coding assistants, training compute, synthetic data, prompt prototyping).
- **RUN**: The operational workload translated into technical consumption, priced through dynamic catalogues and lifecycle ramp-up curves over 36 months across 8 sequential steps.
- **LICENSE**: Enterprise platform and commercial AI tool licenses (ServiceNow Now Assist, Datadog LLM Observability, Microsoft Copilot, Pinecone, LangSmith) structured by subscription and seat models.
- **ASSURE**: Continuous and parallel AI testing spend to assess risks, red-teaming, RAG accuracy benchmarks, guardrail inference overhead, and regulatory compliance.

---

## 2. User Experience & Visual Design

### Key User Flows

```
┌────────────────────────────────────────────────────────────────────────┐
│ Top Navigation: Proposal Metadata & "View Consolidated AI Cost" Button │
├────────────────────────────────────────────────────────────────────────┤
│ 4 Cost Pool Tabs (Direct Access): [ BUILD ] [ RUN ] [ LICENSE ] [ ASSURE ]
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  [BUILD TAB]       [RUN TAB]                [LICENSE TAB]   [ASSURE]   │
│  • Copilot Seats   • 8 Sequential Stages    • Enterprise    • Red-Team │
│  • Fine-tuning GPU • Config (Price/Rules)     Tools Catalog • RAG Eval │
│  • Synthetic Data  • Doc Upload -> Dec. Dash • Seats/Tiers  • Guardrails│
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

1. **Workspace Header**:
   - Proposal title, client/target name, currency selector (USD, EUR, GBP), and proposal stage selector (RFP, RFI, Pilot, Proactive).
   - Dedicated primary action: **"Consolidated Cost Economics"** which triggers the executive roll-up view.
2. **Pool Navigation Bar**:
   - 4 tab controls: `BUILD`, `RUN`, `LICENSE`, `ASSURE`.
   - Each tab indicates its local completion status and estimated cost subtotal without forcing a sequential order.
3. **BUILD Pool View**:
   - AI Dev Tooling & Coding Assistants (seats, months, Copilot/Cursor/Claude tiers).
   - Fine-tuning & Adaptation Compute (GPU hours, instance types like H100/A100/L40S, LoRA/full tuning).
   - Synthetic Data & Data Prep (token volumes for frontier data generation, embeddings).
   - Architecture Prototyping & Prompt Spikes (API token experimentation budget).
4. **RUN Pool View (8 Strict Sequential Stages + Config Drawer)**:
   - Dedicated top-right control: **"Run Configuration"** (opens Price & Catalogue and RULES & Reference modal).
   - **Horizontal Stage Navigator** (Stages 1 through 8 strictly sequential with status locks):
     - **Stage 1**: Solution Execution Flow & Input Document Upload (sample architecture parser, diagram/doc ingestion, interactive execution flow diagram: User -> Guardrail -> Router -> Retrieval -> Foundation LLM -> Post-processing).
     - **Stage 2**: Demand, Usage and Value Assumptions (active users, queries/user/day, peak concurrency factor).
     - **Stage 3**: Execution Workload Calculation (prompt & completion tokens per transaction, context window lengths, embedding calls).
     - **Stage 4**: Technical Consumption Translation (aggregate monthly token volumes, cache hit rates, vector QPS, GPU hours).
     - **Stage 5**: Production & Service Requirements (SLA tier 99.9%, multi-region active-active overhead, rate limiting buffers).
     - **Stage 6**: Price Consumption (model price catalogue binding, on-demand vs committed tier rates).
     - **Stage 7**: Lifecycle Operating Cost Forecast (Month 1 to 36 projections, ramp-up curve, Y1, Y2, Y3 totals).
     - **Stage 8**: Decision Dashboard (Expected 36-month operating cost, baseline monthly cost USD, Human review share base cost, annual Y1/Y2/Y3 distribution, architecture archetype breakdown).
5. **LICENSE Pool View**:
   - Guided enterprise tool selection (ServiceNow GenAI, Datadog LLM Observability, MS Copilot, OpenAI Enterprise, Pinecone Dedicated, LangSmith).
   - License model guidance: Per-user/seat, Tiered platform subscription, Capacity-based reservation, Flat annual enterprise.
   - Dynamic line items with instant unit calculation.
6. **ASSURE Pool View**:
   - Automated Adversarial Red-Teaming (attacker model token runs, vulnerability test cycles).
   - Continuous Automated RAG Accuracy & Grounding (LLM-as-a-judge evaluation token volume).
   - AI Guardrails Runtime Overhead (safety filter tokens per transaction).
   - AI Regulatory & Compliance Audits (EU AI Act / NIST automated scanner passes).
   - AI-Assisted SME Risk Validation (specialist AI audit tooling cost).
7. **Consolidated AI Cost View (Modal / Executive Panel)**:
   - Summary Cards: Total AI Proposal Cost, RUN 36-Month Operating Cost, Baseline Monthly Cost, Human Review Share.
   - Pool-wise breakdown table and visual distribution bars.
   - 3-Year Capex (Build) vs Opex (Run + License + Assure) timeline.
   - Export proposal summary as Markdown/JSON.

### Visual Identity & Theme
- **Aesthetic Direction**: High-precision enterprise financial dashboard (clean slate palette, sharp borders, refined typography, zero gimmicky neon/slop).
- **Palette**: Deep slate `#0F172A` / `#1E293B` accents, crisp white and slate-50 background surfaces, subtle slate-200 borders, and focused indigo/blue semantic accents.
- **Typography**: `Plus Jakarta Sans` for clean titles, `tabular-nums` / `JetBrains Mono` for financial metrics and token calculations.

---

## 3. Key Product Decisions & Trade-Offs

- **Non-Sequential Pools with Strict Sequential RUN Pipeline**:
  - *Decision*: Allow free tab switching between BUILD, RUN, LICENSE, and ASSURE, while locking the internal 8 stages of RUN into strict progression.
  - *Why*: In real RFP planning, architects work on license quotes or developer build estimates while the detailed runtime architecture is still being refined. However, RUN modeling mathematically depends on preceding steps (e.g. Workload -> Consumption -> Price -> Forecast).
- **Decoupled RUN Configuration Modal**:
  - *Decision*: Place Price & Catalogue and RULES & Reference into a dedicated config drawer/modal accessible from the RUN tab.
  - *Why*: Keeps the main 8-stage operational flow focused on the specific proposal while allowing global unit prices and token multipliers to be calibrated without polluting the cost pools.
- **Extendible Backend-Ready Domain Model**:
  - *Decision*: Implement strong typed interfaces (`ProposalState`, `BuildCostItem`, `RunStageData`, `LicenseCostItem`, `AssureCostItem`, `CatalogueConfig`).
  - *Why*: Fulfills the user's explicit requirement that this UI is immediately extendible to backend APIs, database persistence, and Excel ingestion.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        App State Store & Hooks                         │
│  - Active Pool (BUILD | RUN | LICENSE | ASSURE)                        │
│  - Proposal Metadata (Client, RFP/RFI Stage, Currency)                 │
│  - Pool States: buildData, runData, licenseData, assureData           │
│  - RunConfig: priceCatalogue, rulesAndReference                        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       ▼                            ▼                            ▼
┌──────────────┐             ┌──────────────┐             ┌──────────────┐
│  BUILD Pool  │             │   RUN Pool   │             │ LICENSE Pool │
│ Form Engine  │             │ (8-Stage Seq)│             │ Catalog & Form
└──────────────┘             └──────┬───────┘             └──────────────┘
                                    │
                                    ├── Stage 1: Flow & Doc Upload
                                    ├── Stage 2: Demand & Assumptions
                                    ├── Stage 3: Workload Engine
                                    ├── Stage 4: Consumption Matrix
                                    ├── Stage 5: Production SLAs
                                    ├── Stage 6: Price Consumption
                                    ├── Stage 7: 36-Mo Lifecycle
                                    └── Stage 8: Decision Dashboard
                                    │
                                    ▼
                             ┌──────────────┐
                             │  ASSURE Pool │
                             │  Risk Form   │
                             └──────────────┘
                                    │
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │   Consolidated AI Cost Economics Modal & Export Engine  │
       │   - Total AI Cost & Pool-wise Breakdown                 │
       │   - RUN: 36-Mo Expected, Baseline/Mo, Human Review %    │
       │   - Y1, Y2, Y3 Annual Splits & Cost by Architecture     │
       └─────────────────────────────────────────────────────────┘
```

### Core Data Models
```typescript
interface CostPoolSummary {
  buildTotal: number;
  run36MonthTotal: number;
  runBaselineMonthly: number;
  runHumanReviewShare: number;
  licenseTotal: number;
  assureTotal: number;
  grandTotal: number;
  annualForecast: { y1: number; y2: number; y3: number };
}
```

---

## 5. Verification Plan

1. **Component Verification**:
   - Verify tab navigation across BUILD, RUN, LICENSE, ASSURE.
   - Verify non-sequential access to all 4 cost pool tabs.
   - Verify strict sequential progression within RUN (Stages 1 through 8).
   - Test Document Upload & Sample Architecture parser in Stage 1.
   - Verify RUN Config modal (Price & Catalogue data, RULES & Reference).
   - Verify on-demand "Consolidated AI Cost Economics" view and metrics.
2. **Build Verification**:
   - Run `compile_applet` to ensure zero TypeScript or bundling errors.
