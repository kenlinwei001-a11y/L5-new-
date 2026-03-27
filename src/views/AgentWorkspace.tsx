import { useState } from 'react';
import {
  Bot,
  GitMerge,
  Wrench,
  Zap,
  MonitorPlay,
  Activity,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Cpu,
  Network,
  Layers,
  TerminalSquare,
  Play,
  LayoutGrid,
  List,
  GitBranch,
  Settings,
  Search,
  Plus,
  MoreHorizontal,
  Filter,
  ChevronRight,
  Box,
  Radio,
  FileCode,
  History,
  BarChart3
} from 'lucide-react';
import { cn } from '../lib/utils';

interface AgentWorkspaceProps {
  onNavigate?: (tab: string) => void;
}

// --- Mock Data ---
const MODULE_STATS = [
  { id: 'agent', name: '智能体实例', count: 12, active: 5, icon: Bot, color: 'slate' },
  { id: 'workflow', name: '工作流编排', count: 8, active: 3, icon: GitMerge, color: 'slate' },
  { id: 'tool', name: 'MCP 工具', count: 45, active: 45, icon: Wrench, color: 'slate' },
  { id: 'skill', name: '原子技能', count: 128, active: 128, icon: Zap, color: 'slate' },
  { id: 'simulation', name: '推演任务', count: 4, active: 1, icon: MonitorPlay, color: 'slate' },
];

const RECENT_ACTIVITIES = [
  { id: 1, type: 'agent', title: '生产调度优化Agent', action: '触发了重排程工作流', time: '2分钟前', status: 'success' },
  { id: 2, type: 'simulation', title: 'Q3产能满载推演', action: '推演完成，生成最优方案A', time: '15分钟前', status: 'success' },
  { id: 3, type: 'tool', title: 'ERP_Order_Query', action: '接口响应延迟超阈值 (>2s)', time: '1小时前', status: 'warning' },
  { id: 4, type: 'workflow', title: '主轴过热停机预案', action: '执行失败，等待人工介入', time: '2小时前', status: 'error' },
];

const AGENTS = [
  { id: 'agent-001', name: '生产调度优化Agent', desc: '基于产销匹配的智能排程决策', status: 'running', lastRun: '2分钟前', type: 'planner', tasks: 156 },
  { id: 'agent-002', name: '设备异常诊断Agent', desc: '基于遥测数据和知识图谱定位根因', status: 'running', lastRun: '5分钟前', type: 'diagnostic', tasks: 89 },
  { id: 'agent-003', name: '质量追溯分析Agent', desc: '跨工序追溯质量缺陷源头', status: 'idle', lastRun: '1小时前', type: 'analyst', tasks: 234 },
  { id: 'agent-004', name: '物料短缺预警Agent', desc: '实时监控库存并预测短缺风险', status: 'running', lastRun: '刚刚', type: 'monitor', tasks: 567 },
  { id: 'agent-005', name: '能源优化Agent', desc: '分析能耗数据并提供节能建议', status: 'idle', lastRun: '3小时前', type: 'analyst', tasks: 45 },
];

const WORKFLOWS = [
  { id: 'wf-001', name: '产销匹配推演流程', nodes: 7, runs: 1289, status: 'active', updated: '2天前' },
  { id: 'wf-002', name: '设备故障处理SOP', nodes: 12, runs: 456, status: 'active', updated: '1周前' },
  { id: 'wf-003', name: '质量异常响应流程', nodes: 5, runs: 234, status: 'draft', updated: '3天前' },
  { id: 'wf-004', name: '自动排产优化流程', nodes: 9, runs: 3456, status: 'active', updated: '5小时前' },
];

export default function AgentWorkspace({ onNavigate }: AgentWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'workflows' | 'tasks' | 'analytics'>('overview');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const handleNavigate = (id: string) => {
    if (onNavigate) {
      onNavigate(id);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'agents', label: 'Agents', icon: Bot, count: 12 },
    { id: 'workflows', label: 'Workflows', icon: GitMerge, count: 8 },
    { id: 'tasks', label: 'Tasks', icon: CheckCircle2, count: 23 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ] as const;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* GitHub-Style Header */}
      <header className="border-b border-slate-200">
        {/* Top Bar */}
        <div className="px-4 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Layers size={16} className="text-slate-400" />
            <span className="hover:text-slate-900 cursor-pointer">智能体中台</span>
            <ChevronRight size={14} className="text-slate-300" />
            <span className="font-medium text-slate-900">Agent Workspace</span>
          </div>
        </div>

        {/* Title Row */}
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-800 text-white flex items-center justify-center">
                <Bot size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">智能体核心工作台</h1>
                <p className="text-sm text-slate-500">L4 智能体/推演层全局运行状态与协同总览</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-2 bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 transition-colors">
                <Plus size={14} />
                新建 Agent
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 border-t border-slate-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium border-t-2 transition-colors",
                  activeTab === tab.id
                    ? "border-slate-800 text-slate-900"
                    : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <Icon size={14} />
                {tab.label}
                {tab.count && (
                  <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-slate-50">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Stats Grid - GitHub Style */}
            <div className="grid grid-cols-5 gap-4">
              {MODULE_STATS.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.id}
                    onClick={() => handleNavigate(stat.id)}
                    className="bg-white p-4 border border-slate-200 hover:border-slate-300 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Icon size={18} className="text-slate-600" />
                      <ArrowRight size={14} className="text-slate-300 group-hover:text-slate-600 transition-colors" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{stat.count}</div>
                    <div className="text-sm text-slate-500">{stat.name}</div>
                    <div className="mt-2 text-xs text-slate-400 flex items-center gap-1">
                      <Radio size={10} className={stat.active > 0 ? "text-emerald-500" : "text-slate-300"} />
                      {stat.active} 运行中
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Left: Agent Collaboration Loop */}
              <div className="col-span-2 bg-white border border-slate-200">
                <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <Network size={16} className="text-slate-500" />
                    智能体协同闭环
                  </h3>
                  <button className="text-sm text-sky-600 hover:text-sky-700">查看架构图</button>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between">
                    {/* Workflow */}
                    <div
                      onClick={() => handleNavigate('workflow')}
                      className="w-36 p-4 bg-white border-2 border-slate-200 hover:border-slate-400 transition-colors cursor-pointer text-center"
                    >
                      <GitMerge size={24} className="mx-auto mb-2 text-slate-600" />
                      <div className="text-sm font-medium text-slate-900">工作流编排</div>
                      <div className="text-xs text-slate-500 mt-1">8 个编排</div>
                    </div>

                    {/* Arrow */}
                    <div className="flex-1 px-4 flex items-center justify-center">
                      <div className="w-full flex items-center">
                        <div className="h-px bg-slate-300 flex-1"></div>
                        <ArrowRight size={16} className="text-slate-400" />
                      </div>
                    </div>

                    {/* Agent Core */}
                    <div
                      onClick={() => handleNavigate('agent')}
                      className="w-40 p-4 bg-slate-800 text-white cursor-pointer hover:bg-slate-700 transition-colors text-center relative"
                    >
                      <Bot size={28} className="mx-auto mb-2" />
                      <div className="text-sm font-bold">智能体决策中枢</div>
                      <div className="text-xs text-slate-300 mt-1">12 个实例</div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-white"></div>
                    </div>

                    {/* Arrow */}
                    <div className="flex-1 px-4 flex items-center justify-center">
                      <div className="w-full flex items-center">
                        <div className="h-px bg-slate-300 flex-1 border-t border-dashed"></div>
                        <ArrowRight size={16} className="text-slate-400" />
                      </div>
                    </div>

                    {/* Tools & Skills */}
                    <div className="space-y-3">
                      <div
                        onClick={() => handleNavigate('tool')}
                        className="w-32 p-3 bg-white border border-slate-200 hover:border-slate-400 transition-colors cursor-pointer flex items-center gap-2"
                      >
                        <Wrench size={16} className="text-slate-600" />
                        <div>
                          <div className="text-xs font-medium text-slate-900">MCP 工具</div>
                          <div className="text-[10px] text-slate-500">45 个</div>
                        </div>
                      </div>
                      <div
                        onClick={() => handleNavigate('skill')}
                        className="w-32 p-3 bg-white border border-slate-200 hover:border-slate-400 transition-colors cursor-pointer flex items-center gap-2"
                      >
                        <Zap size={16} className="text-slate-600" />
                        <div>
                          <div className="text-xs font-medium text-slate-900">原子技能</div>
                          <div className="text-[10px] text-slate-500">128 个</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Simulation Lab */}
                  <div className="mt-6 p-4 bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MonitorPlay size={20} className="text-slate-600" />
                      <div>
                        <div className="text-sm font-medium text-slate-900">What-if 推演实验室</div>
                        <div className="text-xs text-slate-500">蒙特卡洛仿真与策略对比</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleNavigate('simulation')}
                      className="px-3 py-1.5 text-sm text-sky-600 hover:text-sky-700 border border-sky-200 hover:border-sky-300 transition-colors"
                    >
                      进入实验室
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Recent Activity */}
              <div className="bg-white border border-slate-200">
                <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <History size={16} className="text-slate-500" />
                    实时运行动态
                  </h3>
                  <button className="text-xs text-sky-600 hover:text-sky-700">查看全部</button>
                </div>

                <div className="divide-y divide-slate-100">
                  {RECENT_ACTIVITIES.map((activity) => (
                    <div key={activity.id} className="p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-2 h-2 mt-1.5 shrink-0",
                          activity.status === 'success' ? "bg-emerald-500" :
                          activity.status === 'warning' ? "bg-amber-500" :
                          "bg-rose-500"
                        )} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-slate-900">{activity.title}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{activity.action}</div>
                          <div className="text-xs text-slate-400 mt-1">{activity.time}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-slate-200">
                  <button
                    onClick={() => handleNavigate('agent')}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Play size={14} />
                    进入智能体控制台
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Agents Tab */}
        {activeTab === 'agents' && (
          <div className="max-w-7xl mx-auto p-6">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type="text"
                    placeholder="搜索 Agents..."
                    className="pl-9 pr-4 py-2 w-64 border border-slate-200 text-sm focus:outline-none focus:border-slate-400"
                  />
                </div>
                <button className="flex items-center gap-1 px-3 py-2 border border-slate-200 text-sm text-slate-600 hover:bg-slate-50">
                  <Filter size={14} />
                  筛选
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "p-2 border",
                    viewMode === 'list'
                      ? "bg-slate-100 border-slate-300 text-slate-900"
                      : "border-slate-200 text-slate-400 hover:text-slate-600"
                  )}
                >
                  <List size={16} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "p-2 border",
                    viewMode === 'grid'
                      ? "bg-slate-100 border-slate-300 text-slate-900"
                      : "border-slate-200 text-slate-400 hover:text-slate-600"
                  )}
                >
                  <LayoutGrid size={16} />
                </button>
              </div>
            </div>

            {/* Agent List */}
            <div className="bg-white border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Agent 名称</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">状态</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">类型</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">任务数</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">最后运行</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {AGENTS.map((agent) => (
                    <tr key={agent.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Bot size={18} className="text-slate-500" />
                          <div>
                            <div className="font-medium text-slate-900">{agent.name}</div>
                            <div className="text-xs text-slate-500">{agent.desc}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          "flex items-center gap-1.5 text-xs",
                          agent.status === 'running' ? "text-emerald-600" : "text-slate-500"
                        )}>
                          <span className={cn(
                            "w-2 h-2 rounded-full",
                            agent.status === 'running' ? "bg-emerald-500" : "bg-slate-300"
                          )} />
                          {agent.status === 'running' ? '运行中' : '空闲'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs">
                          {agent.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{agent.tasks}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{agent.lastRun}</td>
                      <td className="px-4 py-3">
                        <button className="p-1 hover:bg-slate-200 text-slate-400">
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Workflows Tab */}
        {activeTab === 'workflows' && (
          <div className="max-w-7xl mx-auto p-6">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type="text"
                    placeholder="搜索 Workflows..."
                    className="pl-9 pr-4 py-2 w-64 border border-slate-200 text-sm focus:outline-none focus:border-slate-400"
                  />
                </div>
                <button className="flex items-center gap-1 px-3 py-2 border border-slate-200 text-sm text-slate-600 hover:bg-slate-50">
                  <Filter size={14} />
                  状态
                </button>
              </div>
              <button className="flex items-center gap-2 px-3 py-2 bg-slate-800 text-white text-sm font-medium hover:bg-slate-700">
                <Plus size={14} />
                新建 Workflow
              </button>
            </div>

            {/* Workflow List */}
            <div className="bg-white border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Workflow 名称</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">节点数</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">运行次数</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">状态</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">更新时间</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {WORKFLOWS.map((wf) => (
                    <tr key={wf.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => handleNavigate('workflow')}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <GitMerge size={18} className="text-slate-500" />
                          <div>
                            <div className="font-medium text-sky-600 hover:underline">{wf.name}</div>
                            <div className="text-xs text-slate-500 font-mono">{wf.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{wf.nodes} 个节点</td>
                      <td className="px-4 py-3 text-slate-600">{wf.runs.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          "px-2 py-0.5 text-xs",
                          wf.status === 'active'
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        )}>
                          {wf.status === 'active' ? '已启用' : '草稿'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{wf.updated}</td>
                      <td className="px-4 py-3">
                        <button className="p-1 hover:bg-slate-200 text-slate-400">
                          <Settings size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="max-w-7xl mx-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-sm font-medium text-slate-900 border-b-2 border-slate-800">运行中 (8)</button>
                <button className="px-3 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-900">已完成 (45)</button>
                <button className="px-3 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-900">失败 (2)</button>
              </div>
              <button onClick={() => handleNavigate('agent')} className="text-sm text-sky-600 hover:text-sky-700">
                进入控制台 →
              </button>
            </div>

            <div className="bg-white border border-slate-200">
              <div className="p-8 text-center text-slate-500">
                <CheckCircle2 size={48} className="mx-auto mb-4 opacity-30" />
                <p>请在智能体控制台查看任务详情</p>
                <button
                  onClick={() => handleNavigate('agent')}
                  className="mt-4 px-4 py-2 bg-slate-800 text-white text-sm font-medium hover:bg-slate-700"
                >
                  前往控制台
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="max-w-7xl mx-auto p-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Agent 调用趋势</h3>
                <div className="h-48 flex items-end justify-between gap-2">
                  {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                    <div key={i} className="flex-1 bg-slate-200 hover:bg-slate-300 transition-colors" style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-slate-500">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-4">技能调用分布</h3>
                <div className="space-y-3">
                  {[
                    { name: 'OEE智能优化', count: 234, pct: 35 },
                    { name: '质量根因分析', count: 189, pct: 28 },
                    { name: '设备健康诊断', count: 156, pct: 23 },
                    { name: '其他', count: 98, pct: 14 },
                  ].map((item) => (
                    <div key={item.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-700">{item.name}</span>
                        <span className="text-slate-500">{item.count}</span>
                      </div>
                      <div className="h-2 bg-slate-100">
                        <div className="h-full bg-slate-600" style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
