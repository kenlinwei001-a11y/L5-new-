import { useState } from 'react';
import { Play, Plus, Search, Settings, ShieldAlert, Activity, Database, GitMerge, BrainCircuit, Terminal, FlaskConical, Cpu, Layers } from 'lucide-react';
import { cn } from '../lib/utils';

const nodeCategories = [
  { id: 'data', label: '数据节点 (15)', icon: Database, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'semantic', label: '语义节点 (10)', icon: Layers, color: 'text-purple-600', bg: 'bg-purple-50' },
  { id: 'reasoning', label: '推理节点 (20)', icon: BrainCircuit, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { id: 'decision', label: '决策节点 (20)', icon: GitMerge, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 'simulation', label: '仿真节点 (15)', icon: FlaskConical, color: 'text-amber-600', bg: 'bg-amber-50' },
  { id: 'execution', label: '执行节点 (10)', icon: Terminal, color: 'text-rose-600', bg: 'bg-rose-50' },
  { id: 'control', label: '控制节点 (10)', icon: Settings, color: 'text-slate-600', bg: 'bg-slate-50' },
];

const sampleNodes = [
  { id: 'n1', type: 'DataFetchNode', category: 'data', x: 100, y: 150 },
  { id: 'n2', type: 'OntologyMappingNode', category: 'semantic', x: 350, y: 150 },
  { id: 'n3', type: 'AnomalyDetectionNode', category: 'reasoning', x: 600, y: 100 },
  { id: 'n4', type: 'OptimizationNode', category: 'decision', x: 850, y: 150 },
  { id: 'n5', type: 'ActionDispatchNode', category: 'execution', x: 1100, y: 150 },
];

const sampleEdges = [
  { from: 'n1', to: 'n2' },
  { from: 'n2', to: 'n3' },
  { from: 'n3', to: 'n4' },
  { from: 'n4', to: 'n5' },
];

export default function WorkflowStudio() {
  const [activeCategory, setActiveCategory] = useState('data');

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 shrink-0 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <GitMerge size={18} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Workflow Studio</h2>
            <p className="text-[10px] text-gray-500 font-mono">100+ Nodes • DAG Builder</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors text-xs shadow-sm">
            <Settings size={14} />
            节点配置
          </button>
          <button className="px-3 py-1.5 bg-gray-900 text-white font-medium rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors text-xs shadow-sm">
            <Play size={14} />
            实时调试
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Nodes */}
        <div className="w-64 border-r border-gray-200 bg-gray-50/30 flex flex-col shrink-0">
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text" 
                placeholder="搜索 100+ 节点..." 
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-4">
            {nodeCategories.map(cat => (
              <div key={cat.id}>
                <div 
                  className="flex items-center gap-2 px-2 py-1.5 text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 rounded-md"
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <cat.icon size={14} className={cat.color} />
                  {cat.label}
                </div>
                {activeCategory === cat.id && (
                  <div className="mt-1 space-y-1 pl-6 pr-2">
                    {/* Mock nodes for the category */}
                    {['DataFetchNode', 'StreamJoinNode', 'FeatureEngineeringNode', 'DataFilterNode'].map((node, idx) => (
                      <div key={idx} className="px-2 py-1.5 bg-white border border-gray-200 rounded text-[11px] text-gray-600 cursor-grab hover:border-indigo-300 hover:shadow-sm transition-all flex items-center justify-between">
                        <span className="font-mono">{node}</span>
                        <Plus size={12} className="text-gray-400" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative bg-[#f8f9fa] overflow-hidden">
          {/* Grid Background */}
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          {/* SVG for Edges */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {sampleEdges.map((edge, idx) => {
              const fromNode = sampleNodes.find(n => n.id === edge.from);
              const toNode = sampleNodes.find(n => n.id === edge.to);
              if (!fromNode || !toNode) return null;
              
              const startX = fromNode.x + 160; // node width approx
              const startY = fromNode.y + 20; // node height approx / 2
              const endX = toNode.x;
              const endY = toNode.y + 20;
              
              return (
                <path 
                  key={idx}
                  d={`M ${startX} ${startY} C ${startX + 50} ${startY}, ${endX - 50} ${endY}, ${endX} ${endY}`}
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
              );
            })}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#cbd5e1" />
              </marker>
            </defs>
          </svg>

          {/* Nodes */}
          {sampleNodes.map(node => {
            const cat = nodeCategories.find(c => c.id === node.category);
            return (
              <div 
                key={node.id}
                className="absolute bg-white border border-gray-200 rounded-lg shadow-sm w-40 cursor-pointer hover:shadow-md hover:border-indigo-300 transition-all"
                style={{ left: node.x, top: node.y }}
              >
                <div className={cn("h-1.5 w-full rounded-t-lg", cat?.bg)}></div>
                <div className="p-2.5">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    {cat && <cat.icon size={12} className={cat.color} />}
                    <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">{cat?.id}</span>
                  </div>
                  <div className="text-xs font-mono text-gray-900 truncate">{node.type}</div>
                </div>
                {/* Ports */}
                <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-white border-2 border-gray-300 rounded-full"></div>
                <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-white border-2 border-gray-300 rounded-full"></div>
              </div>
            );
          })}
        </div>

        {/* Right Sidebar - Config */}
        <div className="w-72 border-l border-gray-200 bg-white flex flex-col shrink-0">
          <div className="p-3 border-b border-gray-200 bg-gray-50/50">
            <h3 className="text-xs font-semibold text-gray-900">节点配置</h3>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-[10px] font-medium text-gray-500 uppercase mb-1">Node Type</label>
              <div className="text-sm font-mono text-gray-900 bg-gray-50 px-2 py-1.5 rounded border border-gray-200">OptimizationNode</div>
            </div>
            <div>
              <label className="block text-[10px] font-medium text-gray-500 uppercase mb-1">Algorithm</label>
              <select className="w-full text-sm border border-gray-200 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500">
                <option>GA (Genetic Algorithm)</option>
                <option>MILP (Mixed Integer)</option>
                <option>RL (Reinforcement Learning)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-medium text-gray-500 uppercase mb-1">Input Data</label>
              <div className="space-y-1">
                <div className="text-xs bg-gray-50 border border-gray-200 rounded px-2 py-1 text-gray-600 font-mono">anomaly_data</div>
                <div className="text-xs bg-gray-50 border border-gray-200 rounded px-2 py-1 text-gray-600 font-mono">historical_cases</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
