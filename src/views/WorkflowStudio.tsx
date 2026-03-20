import React, { useState, useRef } from 'react';
import { Play, Plus, Search, Settings, Database, GitMerge, BrainCircuit, Terminal, FlaskConical, Layers, ZoomIn, ZoomOut, Maximize, X } from 'lucide-react';
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

const nodeTypes: Record<string, string[]> = {
  data: ['数据获取节点', '流数据连接节点', '特征工程节点', '数据过滤节点'],
  semantic: ['本体映射节点', '实体识别节点', '关系抽取节点'],
  reasoning: ['异常检测节点', '根因分析节点', '趋势预测节点'],
  decision: ['优化决策节点', '规则引擎节点', '多目标规划节点'],
  simulation: ['物理仿真节点', '业务推演节点', 'What-If分析节点'],
  execution: ['动作下发节点', 'API调用节点', '工单生成节点'],
  control: ['条件分支节点', '循环控制节点', '并行网关节点']
};

const initialNodes = [
  { id: 'n1', type: '数据获取节点', category: 'data', x: 50, y: 150 },
  { id: 'n2', type: '本体映射节点', category: 'semantic', x: 250, y: 150 },
  { id: 'n3', type: '异常检测节点', category: 'reasoning', x: 450, y: 100 },
  { id: 'n4', type: '优化决策节点', category: 'decision', x: 650, y: 150 },
  { id: 'n5', type: '动作下发节点', category: 'execution', x: 850, y: 150 },
];

const sampleEdges = [
  { from: 'n1', to: 'n2' },
  { from: 'n2', to: 'n3' },
  { from: 'n3', to: 'n4' },
  { from: 'n4', to: 'n5' },
];

export default function WorkflowStudio() {
  const [activeCategory, setActiveCategory] = useState('data');
  const [nodes, setNodes] = useState(initialNodes);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  
  // Dragging & Panning State
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [transform, setTransform] = useState({ x: 40, y: 40, scale: 0.75 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleNodeMouseDown = (e: React.MouseEvent, node: any) => {
    e.stopPropagation();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mouseX = (e.clientX - rect.left - transform.x) / transform.scale;
    const mouseY = (e.clientY - rect.top - transform.y) / transform.scale;
    setDragOffset({ x: mouseX - node.x, y: mouseY - node.y });
    setDraggingNodeId(node.id);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    setPanStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingNodeId && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left - transform.x) / transform.scale;
      const mouseY = (e.clientY - rect.top - transform.y) / transform.scale;

      setNodes(prevNodes => 
        prevNodes.map(node => 
          node.id === draggingNodeId 
            ? { ...node, x: mouseX - dragOffset.x, y: mouseY - dragOffset.y }
            : node
        )
      );
    } else if (isPanning) {
      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;
      setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!canvasRef.current) return;
    const zoomSensitivity = 0.001;
    const delta = -e.deltaY * zoomSensitivity;
    const newScale = Math.min(Math.max(0.1, transform.scale + delta), 3);

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const scaleRatio = newScale / transform.scale;
    const newX = mouseX - (mouseX - transform.x) * scaleRatio;
    const newY = mouseY - (mouseY - transform.y) * scaleRatio;

    setTransform({ x: newX, y: newY, scale: newScale });
  };

  const handleZoomIn = () => setTransform(prev => ({ ...prev, scale: Math.min(3, prev.scale * 1.2) }));
  const handleZoomOut = () => setTransform(prev => ({ ...prev, scale: Math.max(0.1, prev.scale / 1.2) }));
  const handleFitView = () => setTransform({ x: 40, y: 40, scale: 0.75 });

  // Drag and drop from sidebar
  const handleDragStart = (e: React.DragEvent, nodeType: string, category: string) => {
    e.dataTransfer.setData('application/reactflow', JSON.stringify({ type: nodeType, category }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/reactflow');
    if (!data) return;

    const { type, category } = JSON.parse(data);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left - transform.x) / transform.scale;
    const y = (e.clientY - rect.top - transform.y) / transform.scale;

    const newNode = {
      id: `n${Date.now()}`,
      type,
      category,
      x,
      y
    };

    setNodes(nds => [...nds, newNode]);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 shrink-0 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <GitMerge size={18} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">工作流编排</h2>
            <p className="text-[10px] text-gray-500 font-mono">100+ 节点 • DAG 编排</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
            className={cn(
              "px-3 py-1.5 border font-medium rounded-lg flex items-center gap-2 transition-colors text-xs shadow-sm",
              isRightPanelOpen 
                ? "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100" 
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            )}
          >
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
        <div className="w-64 border-r border-gray-200 bg-gray-50/30 flex flex-col shrink-0 z-20">
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
                    {nodeTypes[cat.id]?.map((node, idx) => (
                      <div 
                        key={idx} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, node, cat.id)}
                        className="px-2 py-1.5 bg-white border border-gray-200 rounded text-[11px] text-gray-600 cursor-grab hover:border-indigo-300 hover:shadow-sm transition-all flex items-center justify-between"
                      >
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
        <div 
          className={cn("flex-1 relative bg-[#f8f9fa] overflow-hidden", isPanning ? "cursor-grabbing" : "cursor-grab")}
          ref={canvasRef}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {/* Grid Background */}
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={{ 
              backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', 
              backgroundSize: `${20 * transform.scale}px ${20 * transform.scale}px`,
              backgroundPosition: `${transform.x}px ${transform.y}px`
            }}
          ></div>
          
          {/* Transform Wrapper */}
          <div 
            className="absolute inset-0 origin-top-left pointer-events-none"
            style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})` }}
          >
            {/* SVG for Edges */}
            <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
              {sampleEdges.map((edge, idx) => {
                const fromNode = nodes.find(n => n.id === edge.from);
                const toNode = nodes.find(n => n.id === edge.to);
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
                    stroke="#94a3b8"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                  />
                );
              })}
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                </marker>
              </defs>
            </svg>

            {/* Nodes */}
            {nodes.map(node => {
              const cat = nodeCategories.find(c => c.id === node.category);
              return (
                <div 
                  key={node.id}
                  className={cn(
                    "absolute bg-white border rounded-lg shadow-sm w-40 transition-shadow pointer-events-auto",
                    draggingNodeId === node.id ? "cursor-grabbing shadow-lg border-indigo-400 z-10" : "cursor-grab border-gray-200 hover:shadow-md hover:border-indigo-300"
                  )}
                  style={{ left: node.x, top: node.y }}
                  onMouseDown={(e) => handleNodeMouseDown(e, node)}
                >
                  <div className={cn("h-1.5 w-full rounded-t-lg", cat?.bg)}></div>
                  <div className="p-2.5">
                    <div className="flex items-center gap-1.5 mb-1.5 pointer-events-none">
                      {cat && <cat.icon size={12} className={cat.color} />}
                      <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">{cat?.label.split(' ')[0]}</span>
                    </div>
                    <div className="text-xs font-mono text-gray-900 truncate pointer-events-none">{node.type}</div>
                  </div>
                  {/* Ports */}
                  <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-white border-2 border-gray-300 rounded-full pointer-events-none"></div>
                  <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-white border-2 border-gray-300 rounded-full pointer-events-none"></div>
                </div>
              );
            })}
          </div>

          {/* Zoom Controls */}
          <div className="absolute bottom-4 left-4 flex items-center bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden z-20">
            <button onClick={handleZoomOut} className="p-2 hover:bg-gray-50 text-gray-600 border-r border-gray-200" title="缩小"><ZoomOut size={16} /></button>
            <div className="px-3 py-2 text-xs font-mono text-gray-600 font-medium min-w-[60px] text-center">{Math.round(transform.scale * 100)}%</div>
            <button onClick={handleZoomIn} className="p-2 hover:bg-gray-50 text-gray-600 border-l border-gray-200" title="放大"><ZoomIn size={16} /></button>
            <button onClick={handleFitView} className="p-2 hover:bg-gray-50 text-gray-600 border-l border-gray-200" title="适应视图"><Maximize size={16} /></button>
          </div>
        </div>

        {/* Right Sidebar - Config */}
        {isRightPanelOpen && (
          <div className="w-72 border-l border-gray-200 bg-white flex flex-col shrink-0 z-20 animate-in slide-in-from-right-8 duration-200">
            <div className="p-3 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
              <h3 className="text-xs font-semibold text-gray-900">节点配置</h3>
              <button 
                onClick={() => setIsRightPanelOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-200 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase mb-1">节点类型</label>
                <div className="text-sm font-mono text-gray-900 bg-gray-50 px-2 py-1.5 rounded border border-gray-200">优化决策节点</div>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase mb-1">算法</label>
                <select className="w-full text-sm border border-gray-200 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500">
                  <option>遗传算法 (GA)</option>
                  <option>混合整数线性规划 (MILP)</option>
                  <option>强化学习 (RL)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase mb-1">输入数据</label>
                <div className="space-y-1">
                  <div className="text-xs bg-gray-50 border border-gray-200 rounded px-2 py-1 text-gray-600 font-mono">异常数据</div>
                  <div className="text-xs bg-gray-50 border border-gray-200 rounded px-2 py-1 text-gray-600 font-mono">历史案例</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
