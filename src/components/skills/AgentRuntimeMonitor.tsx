import { useState, useEffect } from 'react';
import {
  Cpu,
  Play,
  Pause,
  Square,
  Activity,
  Zap,
  GitBranch,
  Layers,
  Database,
  CheckCircle,
  AlertCircle,
  Clock,
  Terminal,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Settings,
  Eye,
  Filter
} from 'lucide-react';
import { cn } from '../../lib/utils';
import type { AgentRuntime, ExecutionContext } from '../../types/skills';

interface AgentRuntimeMonitorProps {
  runtime: AgentRuntime;
  execution?: ExecutionContext;
}

const statusConfig = {
  idle: { label: '空闲', color: 'bg-gray-100 text-gray-600', icon: Clock },
  running: { label: '运行中', color: 'bg-emerald-100 text-emerald-700', icon: Activity },
  paused: { label: '已暂停', color: 'bg-amber-100 text-amber-700', icon: Pause },
  error: { label: '错误', color: 'bg-rose-100 text-rose-700', icon: AlertCircle },
};

const stepStatusConfig = {
  pending: { color: 'bg-gray-200', label: '等待' },
  running: { color: 'bg-blue-400', label: '运行中' },
  success: { color: 'bg-emerald-400', label: '成功' },
  error: { color: 'bg-rose-400', label: '错误' },
  skipped: { color: 'bg-gray-300', label: '跳过' },
};

export default function AgentRuntimeMonitor({ runtime, execution }: AgentRuntimeMonitorProps) {
  const [activeTab, setActiveTab] = useState<'execution' | 'config' | 'logs'>('execution');
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [isRunning, setIsRunning] = useState(runtime.status === 'running');

  const toggleExpanded = (stepId: string) => {
    const newSet = new Set(expandedSteps);
    if (newSet.has(stepId)) {
      newSet.delete(stepId);
    } else {
      newSet.add(stepId);
    }
    setExpandedSteps(newSet);
  };

  const status = statusConfig[runtime.status];
  const StatusIcon = status.icon;

  return (
    <div className="h-full flex flex-col bg-[#f5f5f7]">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white">
              <Cpu size={24} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{runtime.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${status.color}`}>
                  <StatusIcon size={12} />
                  {status.label}
                </span>
                <span className="text-xs text-gray-400">Runtime ID: {runtime.id}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {runtime.status === 'running' ? (
              <>
                <button
                  onClick={() => setIsRunning(false)}
                  className="px-4 py-2 bg-amber-100 text-amber-700 rounded-xl text-sm font-medium hover:bg-amber-200 flex items-center gap-2"
                >
                  <Pause size={16} />
                  暂停
                </button>
                <button className="px-4 py-2 bg-rose-100 text-rose-700 rounded-xl text-sm font-medium hover:bg-rose-200 flex items-center gap-2">
                  <Square size={16} />
                  停止
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsRunning(true)}
                className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 flex items-center gap-2"
              >
                <Play size={16} fill="currentColor" />
                启动
              </button>
            )}
            <button className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600">
              <Settings size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-6 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-1">
          {[
            { id: 'execution', label: '执行链', icon: Activity },
            { id: 'config', label: '配置', icon: Settings },
            { id: 'logs', label: '日志', icon: Terminal },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors",
                  activeTab === tab.id
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'execution' && execution && (
            <div className="space-y-6">
              {/* Execution Flow */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-gray-900">执行流程</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock size={14} />
                    耗时: {Math.round(
                      (new Date().getTime() - new Date(execution.startedAt).getTime()) / 1000
                    )}s
                  </div>
                </div>

                <div className="space-y-4">
                  {Object.entries(execution.stepResults).map(([stepId, result], idx, arr) => {
                    const isExpanded = expandedSteps.has(stepId);
                    const config = stepStatusConfig[result.status];

                    return (
                      <div key={stepId}>
                        {idx > 0 && (
                          <div className="flex justify-center my-2">
                            <ArrowRight size={16} className="text-gray-300 rotate-90" />
                          </div>
                        )}
                        <div
                          className={cn(
                            "border rounded-2xl overflow-hidden transition-all",
                            result.status === 'running' ? 'border-blue-300 shadow-[0_0_0_3px_rgba(147,197,253,0.3)]' : 'border-gray-200'
                          )}
                        >
                          <div
                            className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50"
                            onClick={() => toggleExpanded(stepId)}
                          >
                            <div className={cn("w-3 h-3 rounded-full", config.color)} />

                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">{idx + 1}</span>
                            </div>

                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{result.stepId}</h4>
                              <p className="text-xs text-gray-500">
                                {config.label} · {result.latency}ms
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              {result.status === 'running' && (
                                <RefreshCw size={16} className="text-blue-500 animate-spin" />
                              )}
                              {result.status === 'success' && (
                                <CheckCircle size={16} className="text-emerald-500" />
                              )}
                              {result.status === 'error' && (
                                <AlertCircle size={16} className="text-rose-500" />
                              )}
                              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50/50">
                              <div className="pt-4 space-y-3">
                                <div>
                                  <label className="text-xs font-medium text-gray-500 block mb-1">输入</label>
                                  <pre className="bg-gray-100 rounded-xl p-3 text-xs text-gray-700 overflow-auto">
                                    {JSON.stringify(result.input, null, 2)}
                                  </pre>
                                </div>
                                {result.output && (
                                  <div>
                                    <label className="text-xs font-medium text-gray-500 block mb-1">输出</label>
                                    <pre className="bg-emerald-50 rounded-xl p-3 text-xs text-gray-700 overflow-auto">
                                      {JSON.stringify(result.output, null, 2)}
                                    </pre>
                                  </div>
                                )}
                                {result.error && (
                                  <div>
                                    <label className="text-xs font-medium text-gray-500 block mb-1">错误</label>
                                    <div className="bg-rose-50 rounded-xl p-3 text-xs text-rose-700">
                                      {result.error}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Runtime Metrics */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-gray-100">
                  <div className="text-xs text-gray-400 mb-1">意图解析</div>
                  <div className="text-lg font-semibold text-gray-900">GPT-4</div>
                  <div className="text-xs text-gray-500">Temperature: {runtime.intentParser.temperature}</div>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100">
                  <div className="text-xs text-gray-400 mb-1">Skill路由</div>
                  <div className="text-lg font-semibold text-gray-900 capitalize">{runtime.skillRouter.strategy}</div>
                  <div className="text-xs text-gray-500">Threshold: {runtime.skillRouter.threshold}</div>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100">
                  <div className="text-xs text-gray-400 mb-1">执行策略</div>
                  <div className="text-lg font-semibold text-gray-900">{runtime.executor.parallel ? '并行' : '串行'}</div>
                  <div className="text-xs text-gray-500">并发: {runtime.executor.maxConcurrency}</div>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100">
                  <div className="text-xs text-gray-400 mb-1">内存类型</div>
                  <div className="text-lg font-semibold text-gray-900 capitalize">{runtime.memory.type}</div>
                  <div className="text-xs text-gray-500">Max: {runtime.memory.maxContextLength} tokens</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'config' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Zap size={18} className="text-amber-500" />
                  Intent Parser 配置
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-gray-500 block mb-2">模型</label>
                    <input
                      type="text"
                      value={runtime.intentParser.model}
                      className="w-full px-3 py-2 bg-gray-50 rounded-xl text-sm border-0"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 block mb-2">Temperature</label>
                    <input
                      type="number"
                      value={runtime.intentParser.temperature}
                      step={0.1}
                      className="w-full px-3 py-2 bg-gray-50 rounded-xl text-sm border-0"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 block mb-2">Max Tokens</label>
                    <input
                      type="number"
                      value={runtime.intentParser.maxTokens}
                      className="w-full px-3 py-2 bg-gray-50 rounded-xl text-sm border-0"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <GitBranch size={18} className="text-blue-500" />
                  Skill Router 配置
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-gray-500 block mb-2">策略</label>
                    <select className="w-full px-3 py-2 bg-gray-50 rounded-xl text-sm border-0">
                      <option>hybrid</option>
                      <option>embedding</option>
                      <option>rules</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 block mb-2">Top-K</label>
                    <input
                      type="number"
                      value={runtime.skillRouter.topK}
                      className="w-full px-3 py-2 bg-gray-50 rounded-xl text-sm border-0"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 block mb-2">阈值</label>
                    <input
                      type="number"
                      value={runtime.skillRouter.threshold}
                      step={0.01}
                      className="w-full px-3 py-2 bg-gray-50 rounded-xl text-sm border-0"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Layers size={18} className="text-emerald-500" />
                  Planner 配置
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500 block mb-2">策略</label>
                    <select className="w-full px-3 py-2 bg-gray-50 rounded-xl text-sm border-0">
                      <option>llm</option>
                      <option>simple</option>
                      <option>mcts</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 block mb-2">最大深度</label>
                    <input
                      type="number"
                      value={runtime.planner.maxDepth}
                      className="w-full px-3 py-2 bg-gray-50 rounded-xl text-sm border-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && execution && (
            <div className="bg-gray-900 rounded-3xl overflow-hidden">
              <div className="px-4 py-3 bg-gray-800 flex items-center justify-between">
                <span className="text-sm text-gray-400">Runtime Logs</span>
                <button className="text-gray-400 hover:text-white">
                  <RefreshCw size={14} />
                </button>
              </div>
              <div className="p-4 space-y-2 max-h-96 overflow-auto">
                {execution.logs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm">
                    <span className="text-gray-500 shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span className={cn(
                      "px-1.5 rounded text-xs font-medium shrink-0",
                      log.level === 'error' && "bg-rose-500/20 text-rose-400",
                      log.level === 'warn' && "bg-amber-500/20 text-amber-400",
                      log.level === 'info' && "bg-blue-500/20 text-blue-400",
                      log.level === 'debug' && "bg-gray-700 text-gray-400"
                    )}>
                      {log.level.toUpperCase()}
                    </span>
                    {log.stepId && (
                      <span className="text-purple-400 shrink-0">[{log.stepId}]</span>
                    )}
                    <span className="text-gray-300">{log.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
