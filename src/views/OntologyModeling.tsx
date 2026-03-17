import { useState } from 'react';
import { Database, Plus, Search, Download, Upload, CheckCircle2, GitMerge, Settings, Link2, Layers, Cpu, AlertTriangle, Play, ChevronRight, ChevronDown, Box, Activity, FileText, Terminal, ShieldCheck, Tag } from 'lucide-react';
import { cn } from '../lib/utils';

// Mock Data
const entityTree = [
  {
    category: '设备',
    icon: Cpu,
    color: 'text-blue-500',
    items: [
      { id: 'EQ-001', name: '激光焊接机-T1', type: '设备' },
      { id: 'EQ-002', name: '涂布机-A', type: '设备' },
    ]
  },
  {
    category: '产品',
    icon: Box,
    color: 'text-emerald-500',
    items: [
      { id: 'PROD-101', name: '电芯-X', type: '产品' },
      { id: 'PROD-102', name: '电池包-Y', type: '产品' },
    ]
  },
  {
    category: '产线',
    icon: Layers,
    color: 'text-amber-500',
    items: [
      { id: 'LINE-A', name: '产线-A', type: '产线' },
    ]
  },
  {
    category: '工单',
    icon: FileText,
    color: 'text-purple-500',
    items: [
      { id: 'WO-2026', name: '工单-2026', type: '工单' },
    ]
  }
];

const initialNodes = [
  { id: 'LINE-A', label: '产线-A', type: '产线', x: 150, y: 100 },
  { id: 'EQ-001', label: '激光焊接机-T1', type: '设备', x: 150, y: 250 },
  { id: 'PROD-101', label: '电芯-X', type: '产品', x: 550, y: 250 },
  { id: 'WO-2026', label: '工单-2026', type: '工单', x: 550, y: 100 },
];

const initialEdges = [
  { 
    id: 'REL-20260317-001', 
    source: 'EQ-001', 
    target: 'PROD-101', 
    type: '因果', 
    label: '温度 > 90 → 良率 -= 5%',
    confidence: 0.9,
    condition: '温度 > 90',
    effect: '良率 -= 5%',
    lifecycle: '运行中, 空闲',
    version: 'v1.0',
    approval_status: 'approved',
    toolTemplate: '[\n  {\n    "tool_name": "adjust_temperature",\n    "input": {\n      "equipment_id": "EQ-001",\n      "value": 85\n    },\n    "trigger": "温度 > 90"\n  },\n  {\n    "tool_name": "notify_operator",\n    "input": {\n      "message": "激光焊接机-T1 温度异常，自动调整至85℃"\n    },\n    "trigger": "温度 > 90"\n  }\n]'
  },
  {
    id: 'REL-20260317-002',
    source: 'LINE-A',
    target: 'EQ-001',
    type: '归属',
    label: '包含',
    confidence: 1.0,
    condition: '',
    effect: '',
    lifecycle: '活跃',
    version: 'v1.0',
    approval_status: 'approved',
    toolTemplate: '[]'
  },
  {
    id: 'REL-20260317-003',
    source: 'WO-2026',
    target: 'PROD-101',
    type: '依赖',
    label: '生产',
    confidence: 1.0,
    condition: '状态 == "进行中"',
    effect: '库存 += 1',
    lifecycle: '活跃',
    version: 'v1.1',
    approval_status: 'pending',
    toolTemplate: '[\n  {\n    "tool_name": "update_inventory",\n    "input": {\n      "product_id": "PROD-101",\n      "amount": 1\n    },\n    "trigger": "状态 == \'已完成\'"\n  }\n]'
  }
];

const edgeColors: Record<string, string> = {
  '归属': '#3b82f6', // blue-500
  '因果': '#ef4444',    // red-500
  '依赖': '#f97316', // orange-500
  '关联': '#10b981', // emerald-500
  '时间': '#a855f7',   // purple-500
};

export default function OntologyModeling() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['设备', '产品', '产线', '工单']);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>('REL-20260317-001');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const selectedEdge = initialEdges.find(e => e.id === selectedEdgeId);

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Top Toolbar */}
      <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 shrink-0 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
            <Database size={18} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">本体建模 (Ontology Studio)</h2>
            <p className="text-[10px] text-gray-500 font-mono">实体关系与规则建模</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input 
              type="text" 
              placeholder="搜索实体或关系..." 
              className="w-64 pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
          <div className="h-4 w-px bg-gray-300 mx-1"></div>
          <button className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors text-xs shadow-sm">
            <CheckCircle2 size={14} className="text-emerald-600" />
            规则校验
          </button>
          <button className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors text-xs shadow-sm">
            <Download size={14} />
            导入/导出JSON/CSV
          </button>
          <button className="px-3 py-1.5 bg-purple-600 text-white font-medium rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors text-xs shadow-sm">
            <Plus size={14} />
            新建关系
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Ontology Tree */}
        <div className="w-64 border-r border-gray-200 bg-gray-50/30 flex flex-col shrink-0">
          <div className="p-3 border-b border-gray-200 bg-gray-50/80">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">对象列表 (本体树)</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {entityTree.map((category) => (
              <div key={category.category} className="mb-2">
                <button 
                  onClick={() => toggleCategory(category.category)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 rounded text-sm text-gray-700 font-medium transition-colors"
                >
                  {expandedCategories.includes(category.category) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <category.icon size={14} className={category.color} />
                  {category.category}
                </button>
                {expandedCategories.includes(category.category) && (
                  <div className="ml-6 mt-1 space-y-1">
                    {category.items.map(item => (
                      <div 
                        key={item.id}
                        draggable
                        className="flex items-center gap-2 px-2 py-1.5 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 rounded text-xs text-gray-600 cursor-grab active:cursor-grabbing transition-all"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                        {item.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Middle - Canvas */}
        <div className="flex-1 bg-[#f8f9fa] relative overflow-hidden flex flex-col">
          <div className="absolute top-4 left-4 flex gap-2 z-10">
            <div className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm text-xs font-medium text-gray-600 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div> 归属
            </div>
            <div className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm text-xs font-medium text-gray-600 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div> 因果
            </div>
            <div className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm text-xs font-medium text-gray-600 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div> 依赖
            </div>
            <div className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm text-xs font-medium text-gray-600 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div> 关联
            </div>
            <div className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm text-xs font-medium text-gray-600 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div> 时间
            </div>
          </div>

          {/* SVG Canvas */}
          <div className="flex-1 w-full h-full relative cursor-crosshair">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                {Object.entries(edgeColors).map(([type, color]) => (
                  <marker key={`arrowhead-${type}`} id={`arrowhead-${type}`} markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill={color} />
                  </marker>
                ))}
                <marker id="arrowhead-selected" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#7c3aed" />
                </marker>
              </defs>
              
              {/* Edges */}
              {initialEdges.map(edge => {
                const sourceNode = initialNodes.find(n => n.id === edge.source);
                const targetNode = initialNodes.find(n => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;

                const isSelected = selectedEdgeId === edge.id;
                const edgeColor = edgeColors[edge.type] || '#9ca3af';
                
                // Calculate path (simple straight line for now, adjusting for node size)
                const dx = targetNode.x - sourceNode.x;
                const dy = targetNode.y - sourceNode.y;
                const angle = Math.atan2(dy, dx);
                const nodeRadius = 60; // Approximate radius to edge of node
                
                const startX = sourceNode.x + Math.cos(angle) * nodeRadius;
                const startY = sourceNode.y + Math.sin(angle) * nodeRadius;
                const endX = targetNode.x - Math.cos(angle) * nodeRadius;
                const endY = targetNode.y - Math.sin(angle) * nodeRadius;

                const midX = (startX + endX) / 2;
                const midY = (startY + endY) / 2;

                return (
                  <g key={edge.id} className="pointer-events-auto cursor-pointer" onClick={() => { setSelectedEdgeId(edge.id); setSelectedNodeId(null); }}>
                    {/* Invisible wider path for easier clicking */}
                    <line x1={startX} y1={startY} x2={endX} y2={endY} stroke="transparent" strokeWidth="15" />
                    
                    {/* Actual visible line */}
                    <line 
                      x1={startX} y1={startY} x2={endX} y2={endY} 
                      stroke={isSelected ? '#7c3aed' : edgeColor} 
                      strokeWidth={isSelected ? "3" : "2"}
                      strokeDasharray={edge.type === '依赖' ? "5,5" : "none"}
                      markerEnd={`url(#${isSelected ? 'arrowhead-selected' : `arrowhead-${edge.type}`})`}
                      className="transition-all duration-200"
                    />
                    
                    {/* Edge Label */}
                    <g transform={`translate(${midX}, ${midY})`}>
                      <rect x="-80" y="-12" width="160" height="24" rx="12" fill={isSelected ? '#f3e8ff' : '#ffffff'} stroke={isSelected ? '#d8b4fe' : edgeColor} strokeWidth="1.5" />
                      <text x="0" y="4" textAnchor="middle" fontSize="10" fontWeight="600" fill={isSelected ? '#6d28d9' : edgeColor} className="pointer-events-none">
                        {edge.label}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>

            {/* Nodes (HTML overlay for better styling) */}
            {initialNodes.map(node => (
              <div 
                key={node.id}
                className={cn(
                  "absolute transform -translate-x-1/2 -translate-y-1/2 w-32 bg-white rounded-xl border-2 shadow-sm flex flex-col items-center p-3 cursor-pointer transition-all hover:shadow-md pointer-events-auto",
                  selectedNodeId === node.id ? "border-purple-500 ring-4 ring-purple-100" : 
                  node.type === '设备' ? "border-blue-200" :
                  node.type === '产品' ? "border-emerald-200" :
                  node.type === '产线' ? "border-amber-200" : "border-purple-200"
                )}
                style={{ left: node.x, top: node.y }}
                onClick={() => { setSelectedNodeId(node.id); setSelectedEdgeId(null); }}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center mb-2",
                  node.type === '设备' ? "bg-blue-50 text-blue-600" :
                  node.type === '产品' ? "bg-emerald-50 text-emerald-600" :
                  node.type === '产线' ? "bg-amber-50 text-amber-600" : "bg-purple-50 text-purple-600"
                )}>
                  {node.type === '设备' ? <Cpu size={16} /> :
                   node.type === '产品' ? <Box size={16} /> :
                   node.type === '产线' ? <Layers size={16} /> : <FileText size={16} />}
                </div>
                <div className="text-xs font-bold text-gray-900 text-center leading-tight">{node.label}</div>
                <div className="text-[9px] text-gray-500 mt-1 uppercase tracking-wider">{node.type}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar - Properties & Rules */}
        {selectedEdge && (
          <div className="w-80 border-l border-gray-200 bg-white flex flex-col shrink-0 shadow-[-4px_0_15px_rgba(0,0,0,0.03)] z-20">
            <div className="p-4 border-b border-gray-200 bg-gray-50/80 flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Link2 size={16} className="text-purple-600" />
                关系属性 & 规则
              </h3>
              <div className="text-[10px] font-mono text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
                {selectedEdge.id}
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">关系类型</label>
                  <select 
                    className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    defaultValue={selectedEdge.type}
                  >
                    <option value="归属">归属 (Ownership)</option>
                    <option value="关联">关联 (Association)</option>
                    <option value="因果">因果 (Causal)</option>
                    <option value="依赖">依赖 (Dependency)</option>
                    <option value="时间">时间 (Temporal)</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-gray-700">信任度/置信度</label>
                    <span className="text-xs font-mono text-purple-600">{selectedEdge.confidence}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="1" step="0.05" 
                    defaultValue={selectedEdge.confidence}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">生命周期约束</label>
                  <select 
                    className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    defaultValue={selectedEdge.lifecycle}
                  >
                    <option value="活跃">活跃</option>
                    <option value="空闲">空闲</option>
                    <option value="已退役">已退役</option>
                    <option value="运行中, 空闲">运行中, 空闲</option>
                  </select>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Rules */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                  <GitMerge size={14} />
                  规则定义
                </h4>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">条件表达式</label>
                  <div className="relative">
                    <textarea 
                      rows={2}
                      defaultValue={selectedEdge.condition}
                      className="w-full text-sm font-mono border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      placeholder="例如: 温度 > 90"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">影响/结果</label>
                  <textarea 
                    rows={2}
                    defaultValue={selectedEdge.effect}
                    className="w-full text-sm font-mono border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="例如: 良率 -= 5%"
                  />
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Tool Template */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                    <Terminal size={14} />
                    MCP Tool 调用模板
                  </h4>
                  <button className="text-[10px] text-purple-600 font-medium hover:underline">自动生成</button>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-3 relative group">
                  <code className="text-[10px] font-mono text-green-400 whitespace-pre block overflow-x-auto">
                    {selectedEdge.toolTemplate || '[]'}
                  </code>
                  <button className="absolute top-2 right-2 p-1.5 bg-gray-800 text-gray-400 rounded hover:text-white hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play size={12} />
                  </button>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Metadata */}
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Tag size={12} />
                  版本: <span className="font-mono text-gray-700">{selectedEdge.version}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={12} className={selectedEdge.approval_status === 'approved' ? 'text-emerald-500' : 'text-amber-500'} />
                  <span className={selectedEdge.approval_status === 'approved' ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}>
                    {selectedEdge.approval_status === 'approved' ? '已审批' : '待审批'}
                  </span>
                </div>
              </div>

            </div>
            
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-3">
              <button className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                取消
              </button>
              <button className="flex-1 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors shadow-sm">
                保存修改
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
