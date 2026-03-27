import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Zap,
  GitMerge,
  User,
  Cpu,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Plus,
  Trash2,
  MousePointer2,
  Save,
  Download
} from 'lucide-react';
import { cn } from '../../lib/utils';
import type { SkillGraph, SkillNode, SkillEdge, NodeType } from '../../types/skills';

interface SkillGraphCanvasProps {
  graph: SkillGraph;
  readOnly?: boolean;
  onChange?: (graph: SkillGraph) => void;
}

const nodeIcons: Record<NodeType, React.ReactNode> = {
  input: <div className="w-3 h-3 rounded-full bg-emerald-400" />,
  output: <div className="w-3 h-3 rounded-full bg-rose-400" />,
  skill: <Zap size={14} />,
  router: <GitMerge size={14} />,
  merge: <div className="w-3 h-3 rotate-45 bg-amber-400" />,
  human: <User size={14} />,
  tool: <Cpu size={14} />,
};

const nodeColors: Record<NodeType, string> = {
  input: 'border-emerald-400 bg-emerald-50 text-emerald-700',
  output: 'border-rose-400 bg-rose-50 text-rose-700',
  skill: 'border-blue-400 bg-blue-50 text-blue-700',
  router: 'border-amber-400 bg-amber-50 text-amber-700',
  merge: 'border-purple-400 bg-purple-50 text-purple-700',
  human: 'border-indigo-400 bg-indigo-50 text-indigo-700',
  tool: 'border-gray-400 bg-gray-50 text-gray-700',
};

const nodeStatusColors = {
  idle: 'border-gray-300',
  running: 'border-blue-400 shadow-[0_0_0_3px_rgba(96,165,250,0.3)]',
  success: 'border-emerald-400 shadow-[0_0_0_3px_rgba(52,211,153,0.3)]',
  error: 'border-rose-400 shadow-[0_0_0_3px_rgba(251,113,133,0.3)]',
  waiting: 'border-amber-400 shadow-[0_0_0_3px_rgba(251,191,36,0.3)]',
};

export default function SkillGraphCanvas({ graph, readOnly = false, onChange }: SkillGraphCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragNode, setDragNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectFrom, setConnectFrom] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);

  const handleNodeMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
    if (readOnly) return;
    e.stopPropagation();

    const node = graph.nodes.find(n => n.id === nodeId);
    if (!node) return;

    if (isConnecting && connectFrom && connectFrom !== nodeId) {
      // Create new edge
      const newEdge: SkillEdge = {
        id: `e-${Date.now()}`,
        from: connectFrom,
        to: nodeId,
        type: 'data',
      };
      const updatedGraph = {
        ...graph,
        edges: [...graph.edges, newEdge],
      };
      onChange?.(updatedGraph);
      setIsConnecting(false);
      setConnectFrom(null);
      return;
    }

    setSelectedNode(nodeId);
    setSelectedEdge(null);
    setIsDragging(true);
    setDragNode(nodeId);

    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: (e.clientX - rect.left - pan.x) / scale - node.position.x,
        y: (e.clientY - rect.top - pan.y) / scale - node.position.y,
      });
    }
  }, [graph, isConnecting, connectFrom, onChange, pan, scale, readOnly]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left - pan.x) / scale;
    const y = (e.clientY - rect.top - pan.y) / scale;
    setMousePos({ x, y });

    if (isDragging && dragNode && !readOnly) {
      const newX = x - dragOffset.x;
      const newY = y - dragOffset.y;

      const updatedGraph = {
        ...graph,
        nodes: graph.nodes.map(n =>
          n.id === dragNode
            ? { ...n, position: { x: newX, y: newY } }
            : n
        ),
      };
      onChange?.(updatedGraph);
    }

    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  }, [isDragging, dragNode, dragOffset, graph, onChange, isPanning, panStart, pan, scale, readOnly]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragNode(null);
    setIsPanning(false);
  }, []);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).dataset?.grid) {
      setSelectedNode(null);
      setSelectedEdge(null);

      if (e.button === 1 || (e.button === 0 && e.altKey)) {
        setIsPanning(true);
        setPanStart({
          x: e.clientX - pan.x,
          y: e.clientY - pan.y,
        });
      }
    }
  }, [pan]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setScale(prev => Math.max(0.3, Math.min(3, prev * delta)));
    }
  }, []);

  const addNode = useCallback((type: NodeType) => {
    if (readOnly) return;

    const newNode: SkillNode = {
      id: `${type}-${Date.now()}`,
      type,
      name: type === 'skill' ? '新技能' : type === 'router' ? '条件分支' : type === 'human' ? '人工审核' : type === 'merge' ? '合并' : type === 'tool' ? '外部工具' : type === 'input' ? '输入' : '输出',
      position: {
        x: (mousePos.x - pan.x / scale),
        y: (mousePos.y - pan.y / scale)
      },
    };

    const updatedGraph = {
      ...graph,
      nodes: [...graph.nodes, newNode],
    };
    onChange?.(updatedGraph);
    setSelectedNode(newNode.id);
  }, [graph, mousePos, onChange, pan, scale, readOnly]);

  const deleteNode = useCallback((nodeId: string) => {
    if (readOnly) return;

    const updatedGraph = {
      ...graph,
      nodes: graph.nodes.filter(n => n.id !== nodeId),
      edges: graph.edges.filter(e => e.from !== nodeId && e.to !== nodeId),
    };
    onChange?.(updatedGraph);
    setSelectedNode(null);
  }, [graph, onChange, readOnly]);

  const deleteEdge = useCallback((edgeId: string) => {
    if (readOnly) return;

    const updatedGraph = {
      ...graph,
      edges: graph.edges.filter(e => e.id !== edgeId),
    };
    onChange?.(updatedGraph);
    setSelectedEdge(null);
  }, [graph, onChange, readOnly]);

  const startConnecting = useCallback(() => {
    if (selectedNode) {
      setIsConnecting(true);
      setConnectFrom(selectedNode);
    }
  }, [selectedNode]);

  // Draw edges
  const renderEdges = () => {
    return graph.edges.map(edge => {
      const fromNode = graph.nodes.find(n => n.id === edge.from);
      const toNode = graph.nodes.find(n => n.id === edge.to);
      if (!fromNode || !toNode) return null;

      const x1 = fromNode.position.x + 80;
      const y1 = fromNode.position.y + 24;
      const x2 = toNode.position.x;
      const y2 = toNode.position.y + 24;

      const midX = (x1 + x2) / 2;
      const path = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;

      const isSelected = selectedEdge === edge.id;

      return (
        <g key={edge.id} className="cursor-pointer" onClick={() => setSelectedEdge(edge.id)}>
          <path
            d={path}
            fill="none"
            stroke={isSelected ? '#3b82f6' : '#9ca3af'}
            strokeWidth={isSelected ? 3 : 2}
            className="transition-all"
          />
          <path
            d={path}
            fill="none"
            stroke="transparent"
            strokeWidth={10}
          />
          {/* Arrow */}
          <polygon
            points={`${x2},${y2} ${x2-8},${y2-4} ${x2-8},${y2+4}`}
            fill={isSelected ? '#3b82f6' : '#9ca3af'}
          />
          {/* Label */}
          {edge.condition && (
            <text
              x={midX}
              y={(y1 + y2) / 2 - 5}
              textAnchor="middle"
              className="text-xs fill-gray-500"
            >
              {edge.condition}
            </text>
          )}
        </g>
      );
    });
  };

  // Connecting line
  const renderConnectingLine = () => {
    if (!isConnecting || !connectFrom) return null;

    const fromNode = graph.nodes.find(n => n.id === connectFrom);
    if (!fromNode) return null;

    const x1 = fromNode.position.x + 80;
    const y1 = fromNode.position.y + 24;
    const x2 = mousePos.x;
    const y2 = mousePos.y;

    return (
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#3b82f6"
        strokeWidth={2}
        strokeDasharray="5,5"
      />
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#f5f5f7]">
      {/* Toolbar */}
      <div className="h-14 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setScale(prev => Math.max(0.3, prev - 0.1))}
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white transition-colors text-gray-600"
            >
              -
            </button>
            <span className="w-12 text-center text-sm text-gray-600">{Math.round(scale * 100)}%</span>
            <button
              onClick={() => setScale(prev => Math.min(3, prev + 0.1))}
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white transition-colors text-gray-600"
            >
              +
            </button>
          </div>
          <div className="w-px h-6 bg-gray-200 mx-2" />
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm transition-colors",
              showGrid ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            网格
          </button>
        </div>

        <div className="flex items-center gap-2">
          {!readOnly && (
            <>
              <button
                onClick={startConnecting}
                disabled={!selectedNode}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition-colors",
                  isConnecting
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                )}
              >
                <Zap size={14} />
                {isConnecting ? '点击目标节点' : '连线'}
              </button>
              <div className="w-px h-6 bg-gray-200 mx-2" />
              <button
                onClick={() => addNode('skill')}
                className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 flex items-center gap-1.5"
              >
                <Plus size={14} />
                技能
              </button>
              <button
                onClick={() => addNode('router')}
                className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 flex items-center gap-1.5"
              >
                <GitMerge size={14} />
                分支
              </button>
              <button
                onClick={() => addNode('human')}
                className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 flex items-center gap-1.5"
              >
                <User size={14} />
                人工
              </button>
            </>
          )}
          <div className="w-px h-6 bg-gray-200 mx-2" />
          <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-600">
            <Play size={16} />
          </button>
          <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-600">
            <RotateCcw size={16} />
          </button>
          <button className="px-3 py-2 bg-gray-900 text-white rounded-lg text-sm flex items-center gap-1.5">
            <Save size={14} />
            保存
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-hidden relative">
        <div
          ref={canvasRef}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <div
            className="absolute inset-0 origin-top-left"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            }}
          >
            {/* Grid */}
            {showGrid && (
              <svg
                className="absolute inset-0 w-[3000px] h-[3000px] pointer-events-none"
                data-grid="true"
              >
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="1" fill="#e5e7eb" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            )}

            {/* Edges SVG */}
            <svg className="absolute inset-0 w-[3000px] h-[3000px] pointer-events-auto overflow-visible">
              {renderEdges()}
              {renderConnectingLine()}
            </svg>

            {/* Nodes */}
            {graph.nodes.map(node => (
              <div
                key={node.id}
                className={cn(
                  "absolute w-40 rounded-xl border-2 p-3 cursor-pointer transition-all select-none",
                  nodeColors[node.type],
                  node.status && nodeStatusColors[node.status],
                  selectedNode === node.id && "ring-2 ring-blue-500 ring-offset-2",
                  isConnecting && connectFrom === node.id && "animate-pulse"
                )}
                style={{
                  left: node.position.x,
                  top: node.position.y,
                }}
                onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 rounded-md bg-white/50 flex items-center justify-center">
                    {nodeIcons[node.type]}
                  </div>
                  <span className="text-xs font-medium truncate">{node.name}</span>
                </div>
                {node.skillRef && (
                  <div className="text-[10px] opacity-70 truncate">
                    {node.skillRef.id}
                  </div>
                )}
                {node.status && (
                  <div className="mt-2 flex items-center gap-1">
                    <span className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      node.status === 'running' && "bg-blue-400 animate-pulse",
                      node.status === 'success' && "bg-emerald-400",
                      node.status === 'error' && "bg-rose-400",
                      node.status === 'waiting' && "bg-amber-400",
                    )} />
                    <span className="text-[10px] opacity-70">
                      {node.status === 'running' && '运行中'}
                      {node.status === 'success' && '成功'}
                      {node.status === 'error' && '错误'}
                      {node.status === 'waiting' && '等待中'}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Properties Panel */}
        {(selectedNode || selectedEdge) && (
          <div className="absolute right-4 top-4 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 p-4">
            {selectedNode && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">节点属性</h3>
                  {!readOnly && (
                    <button
                      onClick={() => deleteNode(selectedNode)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                {(() => {
                  const node = graph.nodes.find(n => n.id === selectedNode);
                  if (!node) return null;
                  return (
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">名称</label>
                        <input
                          type="text"
                          value={node.name}
                          disabled={readOnly}
                          className="w-full px-3 py-1.5 bg-gray-50 rounded-lg text-sm border-0"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">类型</label>
                        <span className="text-sm">{node.type}</span>
                      </div>
                      {node.type === 'skill' && (
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">绑定技能</label>
                          <select
                            disabled={readOnly}
                            className="w-full px-3 py-1.5 bg-gray-50 rounded-lg text-sm border-0"
                          >
                            <option>选择技能...</option>
                          </select>
                        </div>
                      )}
                      {node.type === 'router' && (
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">条件</label>
                          <input
                            type="text"
                            value={node.condition || ''}
                            disabled={readOnly}
                            placeholder="如: complexity > 0.7"
                            className="w-full px-3 py-1.5 bg-gray-50 rounded-lg text-sm border-0"
                          />
                        </div>
                      )}
                      <div className="pt-3 border-t border-gray-100">
                        <label className="text-xs text-gray-500 block mb-1">位置</label>
                        <div className="text-xs text-gray-400">
                          X: {Math.round(node.position.x)}, Y: {Math.round(node.position.y)}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </>
            )}
            {selectedEdge && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">连线属性</h3>
                  {!readOnly && (
                    <button
                      onClick={() => deleteEdge(selectedEdge)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                {(() => {
                  const edge = graph.edges.find(e => e.id === selectedEdge);
                  if (!edge) return null;
                  return (
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">条件</label>
                        <input
                          type="text"
                          value={edge.condition || ''}
                          disabled={readOnly}
                          placeholder="可选条件"
                          className="w-full px-3 py-1.5 bg-gray-50 rounded-lg text-sm border-0"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">数据映射</label>
                        <textarea
                          disabled={readOnly}
                          placeholder={'{"source": "target"}'}
                          className="w-full px-3 py-1.5 bg-gray-50 rounded-lg text-sm border-0 resize-none h-20"
                        />
                      </div>
                    </div>
                  );
                })()}
              </>
            )}
          </div>
        )}

        {/* Legend */}
        <div className="absolute left-4 bottom-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 p-4">
          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">图例</h4>
          <div className="space-y-2">
            {Object.entries(nodeIcons).map(([type, icon]) => (
              <div key={type} className="flex items-center gap-2">
                <div className={cn("w-6 h-6 rounded-md flex items-center justify-center text-xs", nodeColors[type as NodeType].split(' ')[1])}>
                  {icon}
                </div>
                <span className="text-xs text-gray-600">
                  {type === 'input' && '输入'}
                  {type === 'output' && '输出'}
                  {type === 'skill' && '技能'}
                  {type === 'router' && '分支'}
                  {type === 'merge' && '合并'}
                  {type === 'human' && '人工'}
                  {type === 'tool' && '工具'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
