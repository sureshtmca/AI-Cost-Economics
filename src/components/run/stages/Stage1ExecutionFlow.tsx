import React, { useState } from 'react';
import { Stage1FlowData, UploadedDoc, FlowNode } from '../../../types/cost-economics';
import { Upload, FileText, CheckCircle2, ArrowRight, ShieldCheck, GitFork, Cpu, Database, Eye } from 'lucide-react';

interface Stage1ExecutionFlowProps {
  data: Stage1FlowData;
  onChange: (data: Stage1FlowData) => void;
}

export const Stage1ExecutionFlow: React.FC<Stage1ExecutionFlowProps> = ({
  data,
  onChange,
}) => {
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(data.nodes[0] || null);
  const [isSimulatingUpload, setIsSimulatingUpload] = useState(false);

  const archetypes: Stage1FlowData['architectureArchetype'][] = [
    'Enterprise RAG Assistant',
    'Autonomous Agentic Workflow',
    'High-Throughput Document Processing',
    'Hybrid Fine-Tuned Specialist',
  ];

  const handleSimulateFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsSimulatingUpload(true);

    setTimeout(() => {
      const newDoc: UploadedDoc = {
        id: `doc-${Date.now()}`,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        fileType: file.name.endsWith('.pdf')
          ? 'PDF Document'
          : file.name.endsWith('.docx')
          ? 'Word Document'
          : 'Technical Spec / Diagram',
        uploadDate: 'Just now',
        status: 'Parsed',
        detectedArchetype: data.architectureArchetype,
      };

      onChange({
        ...data,
        uploadedDocs: [newDoc, ...data.uploadedDocs],
        isAnalyzed: true,
      });
      setIsSimulatingUpload(false);
    }, 600);
  };

  const handleArchetypeChange = (archetype: Stage1FlowData['architectureArchetype']) => {
    let updatedNodes = [...data.nodes];
    if (archetype === 'Autonomous Agentic Workflow') {
      updatedNodes = [
        { id: 'n1', name: 'User Task Ingestion', type: 'input', description: 'Structured tool prompt & session context parsing', latencyBudgetMs: 25, costImpact: 'Low' },
        { id: 'n2', name: 'Plan & Goal Decomposer', type: 'model', description: 'Zero-shot step planning and scratchpad allocation', latencyBudgetMs: 400, costImpact: 'Medium' },
        { id: 'n3', name: 'Dynamic Tool Router', type: 'router', description: 'Tool calling dispatch & parameter validation', latencyBudgetMs: 40, costImpact: 'Low' },
        { id: 'n4', name: 'Knowledge & Vector Retriever', type: 'retrieval', description: 'Episodic memory search & external API data retrieval', latencyBudgetMs: 85, costImpact: 'Medium' },
        { id: 'n5', name: 'Frontier Agent Reasoning Loop', type: 'agent', description: 'Multi-turn reflection, execution evaluation, tool re-invocation', latencyBudgetMs: 1400, costImpact: 'High' },
        { id: 'n6', name: 'Output Verification Guardrail', type: 'guardrail', description: 'Safety invariant checking and schema contract validation', latencyBudgetMs: 60, costImpact: 'Medium' },
        { id: 'n7', name: 'Final Task Deliverable', type: 'output', description: 'Final response artifact synthesis and user stream', latencyBudgetMs: 20, costImpact: 'Low' },
      ];
    } else if (archetype === 'High-Throughput Document Processing') {
      updatedNodes = [
        { id: 'n1', name: 'Batch Document Ingestion', type: 'input', description: 'Async queue parser for multi-page PDF & tables', latencyBudgetMs: 120, costImpact: 'Low' },
        { id: 'n2', name: 'OCR & Vision Chunking', type: 'model', description: 'Multimodal extraction of diagrams, forms, and handwritten text', latencyBudgetMs: 650, costImpact: 'High' },
        { id: 'n3', name: 'Entity Classification Router', type: 'router', description: 'Document type classifier & routing to specialized extraction prompts', latencyBudgetMs: 45, costImpact: 'Low' },
        { id: 'n4', name: 'Structured JSON Schema Extraction', type: 'model', description: 'Strict schema adherence using JSON mode and validation', latencyBudgetMs: 700, costImpact: 'High' },
        { id: 'n5', name: 'Confidence & Cross-Check Guardrail', type: 'guardrail', description: 'Rule-based validation & routing low-confidence fields to HITL', latencyBudgetMs: 35, costImpact: 'Medium' },
        { id: 'n6', name: 'Database Downstream Commit', type: 'output', description: 'Warehouse ingest and transactional webhooks', latencyBudgetMs: 15, costImpact: 'Low' },
      ];
    }

    onChange({
      ...data,
      architectureArchetype: archetype,
      nodes: updatedNodes,
    });
    setSelectedNode(updatedNodes[0]);
  };

  return (
    <div className="space-y-6">
      {/* Stage Header */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Stage 1: Solution Execution Flow & Input Document Ingestion
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload solution design documents (RFP/RFI specs, architecture diagrams, technical approaches) to establish or auto-derive the target AI system execution topology.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Architecture Archetype:</span>
            <select
              value={data.architectureArchetype}
              onChange={(e) =>
                handleArchetypeChange(e.target.value as Stage1FlowData['architectureArchetype'])
              }
              className="bg-white border border-slate-200 text-slate-800 text-xs font-semibold rounded-md px-2.5 py-1.5 focus:ring-1 focus:ring-slate-400 cursor-pointer"
            >
              {archetypes.map((arch) => (
                <option key={arch} value={arch}>
                  {arch}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Document Upload Zone */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-indigo-600" />
              Document Ingestion (RFP / RFI / Specs)
            </h4>
            <p className="text-[11px] text-slate-500 mb-3">
              Upload PDF, DOCX, TXT, or architecture diagram exports. The engine parses technical requirements and runtime constraints.
            </p>

            <label className="border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/20 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-colors text-center group block">
              <Upload className="w-6 h-6 text-slate-400 group-hover:text-indigo-600 transition-colors mb-2" />
              <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900">
                {isSimulatingUpload ? 'Parsing Document...' : 'Upload Architecture / RFP Document'}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">
                PDF, Word (.docx), Architecture PNG/SVG
              </span>
              <input
                type="file"
                onChange={handleSimulateFileUpload}
                className="hidden"
                disabled={isSimulatingUpload}
              />
            </label>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-700 block mb-2">
              Ingested Documents ({data.uploadedDocs.length})
            </span>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {data.uploadedDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate text-slate-800 font-medium text-[11px]">
                      {doc.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 text-[10px]">
                    <span className="text-slate-400">{doc.size}</span>
                    <span className="text-emerald-600 font-medium flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                      {doc.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Visual System Execution Flow Canvas */}
        <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <GitFork className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Derived AI Solution Execution Flow
                </h4>
              </div>
              <span className="text-[11px] text-slate-500 font-mono-numbers">
                {data.nodes.length} Stages · {data.architectureArchetype}
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Click any stage node below to inspect execution role, estimated latency budget, and token/compute cost contribution.
            </p>

            {/* Pipeline Stage Nodes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
              {data.nodes.map((node, index) => {
                const isSelected = selectedNode?.id === node.id;
                let badgeColor = 'bg-slate-100 text-slate-700';
                if (node.type === 'guardrail') badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
                if (node.type === 'model' || node.type === 'agent') badgeColor = 'bg-indigo-50 text-indigo-700 border-indigo-200';
                if (node.type === 'retrieval') badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';

                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`p-2.5 text-left rounded-lg border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-500'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="text-[10px] text-slate-400 font-mono-numbers mb-1">
                      0{index + 1}. {node.type.toUpperCase()}
                    </div>
                    <div className="text-xs font-semibold text-slate-800 line-clamp-1 mb-1">
                      {node.name}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono-numbers">
                      <span>{node.latencyBudgetMs}ms</span>
                      <span className={`px-1 py-0.2 rounded border text-[9px] ${badgeColor}`}>
                        {node.costImpact} Cost
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Node Inspector Drawer */}
            {selectedNode && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{selectedNode.name}</span>
                    <span className="text-[10px] uppercase font-semibold text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                      Role: {selectedNode.type}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-600 font-mono-numbers">
                    Latency Target: <strong>{selectedNode.latencyBudgetMs}ms</strong>
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {selectedNode.description}
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Execution flow feeds directly into Workload & Sizing calculations in Stage 3</span>
            <span className="text-slate-600 font-medium">Ready for Demand Profiling</span>
          </div>
        </div>
      </div>
    </div>
  );
};
