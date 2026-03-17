import React from 'react';
import { 
  Bot, GitMerge, Wrench, Zap, MonitorPlay, 
  Activity, ArrowRight, CheckCircle2, AlertCircle, 
  Clock, Cpu, Network, Layers, TerminalSquare,
  ArrowRightCircle, Play
} from 'lucide-react';
import { cn } from '../lib/utils';

interface AgentWorkspaceProps {
  onNavigate?: (tab: string) => void;
}

// --- Mock Data for Dashboard ---
const MODULE_STATS = [
  { id: 'agent', name: '智能体实例', count: 12, active: 5, icon: Bot, color: 'indigo' },
  { id: 'workflow', name: '工作流编排', count: 8, active: 3, icon: GitMerge, color: 'rose' },
  { id: 'tool', name: 'MCP 工具', count: 45, active: 45, icon: Wrench, color: 'amber' },
  { id: 'skill', name: '原子技能', count: 128, active: 128, icon: Zap, color: 'emerald' },
  { id: 'simulation', name: '推演任务', count: 4, active: 1, icon: MonitorPlay, color: 'cyan' },
];

const RECENT_ACTIVITIES = [
  { id: 1, type: 'agent', title: '生产调度优化Agent', action: '触发了重排程工作流', time: '2分钟前', status: 'success' },
  { id: 2, type: 'simulation', title: 'Q3产能满载推演', action: '推演完成，生成最优方案A', time: '15分钟前', status: 'success' },
  { id: 3, type: 'tool', title: 'ERP_Order_Query', action: '接口响应延迟超阈值 (>2s)', time: '1小时前', status: 'warning' },
  { id: 4, type: 'workflow', title: '主轴过热停机预案', action: '执行失败，等待人工介入', time: '2小时前', status: 'error' },
];

export default function AgentWorkspace({ onNavigate }: AgentWorkspaceProps) {
  const handleNavigate = (id: string) => {
    if (onNavigate) {
      onNavigate(id);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 font-sans overflow-y-auto p-6">
      {/* Header */}
      <header className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 tracking-tight flex items-center gap-2">
          <Layers className="text-indigo-600" size={24} />
          智能体核心工作台
        </h2>
        <p className="text-sm text-gray-500 mt-1">L4 智能体/推演层全局运行状态与协同总览</p>
      </header>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {MODULE_STATS.map((stat) => {
          const Icon = stat.icon;
          const colorClasses = {
            indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
            rose: 'bg-rose-50 text-rose-600 border-rose-100',
            amber: 'bg-amber-50 text-amber-600 border-amber-100',
            emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
            cyan: 'bg-cyan-50 text-cyan-600 border-cyan-100',
          }[stat.color];

          return (
            <div 
              key={stat.id}
              onClick={() => handleNavigate(stat.id)}
              className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={cn("p-2 rounded-lg border", colorClasses)}>
                  <Icon size={20} />
                </div>
                <ArrowRight size={16} className="text-gray-300 group-hover:text-gray-600 transition-colors" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.name}</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">{stat.count}</span>
                <span className="text-xs text-gray-500">总计</span>
              </div>
              <div className="mt-2 text-[11px] text-gray-500 flex items-center gap-1">
                <Activity size={12} className={stat.active > 0 ? "text-emerald-500" : "text-gray-400"} />
                {stat.active} 运行中/活跃
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Architecture / Loop */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex-1">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2">
              <Network size={16} className="text-indigo-600" />
              智能体协同闭环 (Agent Collaboration Loop)
            </h3>
            
            <div className="relative h-64 bg-slate-50 rounded-xl border border-slate-100 p-6 flex flex-col items-center justify-center overflow-hidden">
              {/* Background decorative elements */}
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #cbd5e1 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
              
              <div className="relative w-full max-w-2xl flex items-center justify-between z-10">
                {/* Left: Workflow & Agent */}
                <div className="flex flex-col items-center gap-4">
                  <div 
                    onClick={() => handleNavigate('workflow')}
                    className="w-32 p-3 bg-white border-2 border-rose-200 rounded-xl shadow-sm flex flex-col items-center gap-2 cursor-pointer hover:border-rose-400 transition-colors"
                  >
                    <GitMerge size={24} className="text-rose-600" />
                    <span className="text-xs font-bold text-gray-700">Workflow 编排</span>
                  </div>
                  <ArrowRight size={20} className="text-gray-400 rotate-90" />
                  <div 
                    onClick={() => handleNavigate('agent')}
                    className="w-32 p-3 bg-indigo-600 text-white rounded-xl shadow-md flex flex-col items-center gap-2 cursor-pointer hover:bg-indigo-700 transition-colors relative"
                  >
                    <Bot size={24} />
                    <span className="text-xs font-bold">Agent 决策中枢</span>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                </div>

                {/* Middle Arrows */}
                <div className="flex flex-col items-center gap-2 flex-1 px-4">
                  <div className="w-full flex items-center">
                    <div className="h-px bg-indigo-200 flex-1 border-t border-dashed border-indigo-300"></div>
                    <div className="px-2 text-[10px] font-mono text-indigo-500 bg-indigo-50 rounded-full border border-indigo-100">调用/执行</div>
                    <div className="h-px bg-indigo-200 flex-1 border-t border-dashed border-indigo-300"></div>
                    <ArrowRight size={16} className="text-indigo-400" />
                  </div>
                  <div className="w-full flex items-center flex-row-reverse mt-8">
                    <div className="h-px bg-cyan-200 flex-1 border-t border-dashed border-cyan-300"></div>
                    <div className="px-2 text-[10px] font-mono text-cyan-600 bg-cyan-50 rounded-full border border-cyan-100">知识回写/优化</div>
                    <div className="h-px bg-cyan-200 flex-1 border-t border-dashed border-cyan-300"></div>
                    <ArrowRight size={16} className="text-cyan-400 rotate-180" />
                  </div>
                </div>

                {/* Right: Tools, Skills, Simulation */}
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4">
                    <div 
                      onClick={() => handleNavigate('tool')}
                      className="w-24 p-3 bg-white border-2 border-amber-200 rounded-xl shadow-sm flex flex-col items-center gap-2 cursor-pointer hover:border-amber-400 transition-colors"
                    >
                      <Wrench size={20} className="text-amber-600" />
                      <span className="text-[10px] font-bold text-gray-700">MCP 工具</span>
                    </div>
                    <div 
                      onClick={() => handleNavigate('skill')}
                      className="w-24 p-3 bg-white border-2 border-emerald-200 rounded-xl shadow-sm flex flex-col items-center gap-2 cursor-pointer hover:border-emerald-400 transition-colors"
                    >
                      <Zap size={20} className="text-emerald-600" />
                      <span className="text-[10px] font-bold text-gray-700">原子技能</span>
                    </div>
                  </div>
                  <div 
                    onClick={() => handleNavigate('simulation')}
                    className="w-full p-3 bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-xl shadow-sm flex items-center justify-center gap-2 cursor-pointer hover:border-cyan-400 transition-colors"
                  >
                    <MonitorPlay size={20} className="text-cyan-600" />
                    <span className="text-xs font-bold text-cyan-800">What-if 推演实验室</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Activity Feed */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex-1">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <TerminalSquare size={16} className="text-gray-500" />
                实时运行动态
              </h3>
              <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">查看全部</button>
            </div>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gray-100">
              {RECENT_ACTIVITIES.map((activity) => {
                const isSuccess = activity.status === 'success';
                const isWarning = activity.status === 'warning';
                const isError = activity.status === 'error';
                
                return (
                  <div key={activity.id} className="relative flex items-start gap-4">
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center shrink-0 z-10 ring-4 ring-white",
                      isSuccess ? "bg-emerald-100 text-emerald-600" :
                      isWarning ? "bg-amber-100 text-amber-600" :
                      "bg-rose-100 text-rose-600"
                    )}>
                      {isSuccess && <CheckCircle2 size={12} />}
                      {isWarning && <AlertCircle size={12} />}
                      {isError && <AlertCircle size={12} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-xs font-bold text-gray-900 truncate">{activity.title}</span>
                        <span className="text-[10px] text-gray-400 shrink-0 ml-2">{activity.time}</span>
                      </div>
                      <p className="text-[11px] text-gray-500">{activity.action}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <button 
                onClick={() => handleNavigate('agent')}
                className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Play size={14} /> 进入 Agent 控制台
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
