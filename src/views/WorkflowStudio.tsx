import { useState } from 'react';
import {
  GitMerge,
  Plus,
  Search,
  Play,
  Settings,
  Code,
  FolderOpen,
  History,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  MoreHorizontal,
  LayoutGrid,
  List,
  GitBranch,
  Terminal,
  Boxes,
  Save,
  PlayCircle,
  ArrowLeft
} from 'lucide-react';
import { cn } from '../lib/utils';
import { CodeBlock } from '../components/CodeBlock';

// --- Mock Data ---
const WORKFLOWS = [
  {
    id: 'wf-sales-production',
    name: '产销协同优化工作流',
    description: '基于订单波动自动调整生产计划，实现产销协同优化',
    version: 'v2.1.0',
    status: 'active',
    runs: 1289,
    lastRun: '2分钟前',
    author: '系统管理员',
    updatedAt: '2024-03-20',
    nodes: 7,
    edges: 6
  },
  {
    id: 'wf-predictive-maintenance',
    name: '设备预测性维护工作流',
    description: '监控设备状态并自动生成维保工单',
    version: 'v1.5.2',
    status: 'active',
    runs: 456,
    lastRun: '15分钟前',
    author: '设备管理组',
    updatedAt: '2024-03-18',
    nodes: 12,
    edges: 11
  },
  {
    id: 'wf-supply-chain-risk',
    name: '供应链风险预警工作流',
    description: '识别供应链潜在风险并推荐替代方案',
    version: 'v1.0.0',
    status: 'draft',
    runs: 0,
    lastRun: '-',
    author: '供应链团队',
    updatedAt: '2024-03-15',
    nodes: 5,
    edges: 4
  },
  {
    id: 'wf-auto-scheduling',
    name: '自动排产优化流程',
    description: '基于APS算法自动生成最优排产方案',
    version: 'v3.0.1',
    status: 'active',
    runs: 3456,
    lastRun: '刚刚',
    author: '生产计划组',
    updatedAt: '2024-03-21',
    nodes: 9,
    edges: 8
  }
];

const WORKFLOW_RUNS = [
  { id: 'run-001', workflowId: 'wf-sales-production', status: 'success', trigger: '定时触发', duration: '45s', startedAt: '2024-03-21 10:30:00' },
  { id: 'run-002', workflowId: 'wf-sales-production', status: 'success', trigger: '手动触发', duration: '52s', startedAt: '2024-03-21 09:15:00' },
  { id: 'run-003', workflowId: 'wf-sales-production', status: 'failed', trigger: 'API调用', duration: '12s', startedAt: '2024-03-21 08:45:00' },
  { id: 'run-004', workflowId: 'wf-predictive-maintenance', status: 'running', trigger: '定时触发', duration: '-', startedAt: '2024-03-21 10:25:00' },
];

const NODE_CATEGORIES = [
  { id: 'data', label: '数据节点', icon: Boxes, count: 15 },
  { id: 'semantic', label: '语义节点', icon: GitBranch, count: 10 },
  { id: 'reasoning', label: '推理节点', icon: Terminal, count: 20 },
  { id: 'decision', label: '决策节点', icon: GitMerge, count: 20 },
  { id: 'execution', label: '执行节点', icon: Play, count: 10 },
];

const WORKFLOW_YAML = `name: 产销协同优化工作流
version: "2.1.0"
description: 基于订单波动自动调整生产计划

triggers:
  - type: schedule
    cron: "0 */2 * * *"
  - type: webhook
    endpoint: /api/v1/workflow/sales-production

nodes:
  - id: order-input
    type: data-source
    config:
      source: ERP_Sales_DB
      query: "SELECT * FROM sales_orders WHERE status='confirmed'"

  - id: semantic-mapping
    type: ontology-mapping
    depends_on: [order-input]
    config:
      target_entity: SalesOrder
      mapping_rules:
        - field: order_no
          maps_to: orderId
        - field: delivery_date
          maps_to: requiredDate

  - id: bottleneck-detection
    type: reasoning
    depends_on: [semantic-mapping]
    config:
      algorithm: constraint_analysis
      threshold: 0.85

  - id: agent-decision
    type: agent
    depends_on: [bottleneck-detection]
    config:
      agent_id: sales-production-optimizer
      action: optimize_schedule

  - id: schedule-output
    type: execution
    depends_on: [agent-decision]
    config:
      action: update_aps_schedule
      notify: [生产计划组]`;

// Workflow Detail Component
function WorkflowDetail({ workflow, onClose }: { workflow: typeof WORKFLOWS[0]; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'yaml' | 'nodes' | 'runs' | 'settings'>('yaml');
  const [viewMode, setViewMode] = useState<'code' | 'visual'>('code');

  const tabs = [
    { id: 'yaml', label: 'workflow.yaml', icon: Code },
    { id: 'nodes', label: `nodes (${workflow.nodes})`, icon: FolderOpen },
    { id: 'runs', label: `runs (${WORKFLOW_RUNS.filter(r => r.workflowId === workflow.id).length})`, icon: History },
    { id: 'settings', label: 'config.json', icon: Settings },
  ] as const;

  const runs = WORKFLOW_RUNS.filter(r => r.workflowId === workflow.id);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Header */}
      <header className="border-b border-slate-200">
        {/* Breadcrumb */}
        <div className="px-4 py-2 border-b border-slate-100 flex items-center gap-2 text-sm text-slate-600">
          <GitMerge size={14} className="text-slate-400" />
          <span className="hover:text-slate-900 cursor-pointer">工作流编排</span>
          <ChevronRight size={14} className="text-slate-300" />
          <span className="font-medium text-slate-900">{workflow.name}</span>
        </div>

        {/* Title Row */}
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-800 text-white flex items-center justify-center">
                <GitMerge size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{workflow.name}</h1>
                <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                  <span className="font-mono">{workflow.id}</span>
                  <span>•</span>
                  <span>{workflow.version}</span>
                  <span>•</span>
                  <span className={cn(
                    "px-1.5 py-0.5 text-xs rounded",
                    workflow.status === 'active'
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  )}>
                    {workflow.status === 'active' ? '已启用' : '草稿'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-3 py-2 border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft size={14} />
                返回
              </button>
              <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50">
                <Settings size={14} />
                设置
              </button>
              <button className="flex items-center gap-2 px-3 py-2 bg-slate-800 text-white text-sm font-medium hover:bg-slate-700">
                <PlayCircle size={14} />
                运行工作流
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
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
              </button>
            );
          })}
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-slate-50">
        <div className="max-w-5xl mx-auto p-6">
          {/* File Path Bar */}
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 border border-slate-200 text-sm text-slate-600 rounded-t-lg">
            <span className="font-medium text-slate-900">{workflow.id}</span>
            <span className="text-slate-400">/</span>
            <span>
              {activeTab === 'yaml' && 'workflow.yaml'}
              {activeTab === 'nodes' && 'nodes/'}
              {activeTab === 'runs' && 'runs/'}
              {activeTab === 'settings' && 'config.json'}
            </span>
          </div>

          {/* YAML Tab */}
          {activeTab === 'yaml' && (
            <div className="bg-white border border-t-0 border-slate-200 rounded-b-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-slate-700">workflow.yaml</span>
                  <div className="flex items-center bg-slate-100 rounded p-0.5">
                    <button
                      onClick={() => setViewMode('code')}
                      className={cn(
                        "px-3 py-1 text-xs font-medium rounded transition-colors",
                        viewMode === 'code'
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      )}
                    >
                      代码
                    </button>
                    <button
                      onClick={() => setViewMode('visual')}
                      className={cn(
                        "px-3 py-1 text-xs font-medium rounded transition-colors",
                        viewMode === 'visual'
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      )}
                    >
                      可视化
                    </button>
                  </div>
                </div>
              </div>
              {viewMode === 'code' ? (
                <CodeBlock code={WORKFLOW_YAML} language="yaml" />
              ) : (
                <div className="p-8 bg-slate-50 min-h-[400px] flex items-center justify-center">
                  <div className="text-center text-slate-400">
                    <LayoutGrid size={48} className="mx-auto mb-4 opacity-30" />
                    <p>可视化视图开发中</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Nodes Tab */}
          {activeTab === 'nodes' && (
            <div className="bg-white border border-t-0 border-slate-200 rounded-b-lg">
              <div className="divide-y divide-slate-100">
                {NODE_CATEGORIES.map((cat) => (
                  <div key={cat.id} className="p-4 hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <cat.icon size={18} className="text-slate-500" />
                      <div className="flex-1">
                        <div className="font-medium text-slate-900">{cat.label}</div>
                        <div className="text-xs text-slate-500">{cat.count} 个节点</div>
                      </div>
                      <ChevronRight size={16} className="text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Runs Tab */}
          {activeTab === 'runs' && (
            <div className="bg-white border border-t-0 border-slate-200 rounded-b-lg">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">运行ID</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">状态</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">触发方式</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">耗时</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">开始时间</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {runs.length > 0 ? runs.map((run) => (
                    <tr key={run.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono text-slate-600">{run.id}</td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          "flex items-center gap-1.5 text-xs",
                          run.status === 'success' ? "text-emerald-600" :
                          run.status === 'failed' ? "text-rose-600" :
                          "text-blue-600"
                        )}>
                          {run.status === 'success' && <CheckCircle2 size={14} />}
                          {run.status === 'failed' && <XCircle size={14} />}
                          {run.status === 'running' && <Clock size={14} className="animate-spin" />}
                          {run.status === 'success' ? '成功' : run.status === 'failed' ? '失败' : '运行中'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{run.trigger}</td>
                      <td className="px-4 py-3 text-slate-600">{run.duration}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{run.startedAt}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                        暂无运行记录
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-white border border-t-0 border-slate-200 rounded-b-lg">
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">工作流名称</label>
                  <input
                    type="text"
                    defaultValue={workflow.name}
                    className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:border-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">描述</label>
                  <textarea
                    defaultValue={workflow.description}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:border-slate-400"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700 mb-2">超时时间 (秒)</label>
                    <input
                      type="number"
                      defaultValue={300}
                      className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:border-slate-400"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700 mb-2">重试次数</label>
                    <input
                      type="number"
                      defaultValue={3}
                      className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:border-slate-400"
                    />
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <button className="px-4 py-2 bg-slate-800 text-white text-sm font-medium hover:bg-slate-700">
                    保存配置
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Main Component
export default function WorkflowStudio() {
  const workflows = WORKFLOWS;
  const [selectedWorkflow, setSelectedWorkflow] = useState<typeof WORKFLOWS[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const filteredWorkflows = workflows.filter(wf =>
    wf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    wf.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <header className="border-b border-slate-200">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 text-sm text-slate-600">
          <GitMerge size={16} className="text-slate-400" />
          <span className="font-medium text-slate-900">Workflow Studio</span>
        </div>

        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-800 text-white flex items-center justify-center">
                <GitMerge size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">工作流编排</h1>
                <p className="text-sm text-slate-500">DAG 工作流设计与编排管理</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-2 bg-slate-800 text-white text-sm font-medium hover:bg-slate-700">
                <Plus size={14} />
                新建工作流
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-slate-50">
        <div className="max-w-6xl mx-auto p-6">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="text"
                  placeholder="搜索工作流..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 w-64 bg-white border border-slate-200 text-sm focus:outline-none focus:border-slate-400 rounded"
                />
              </div>
              <button className="flex items-center gap-1 px-3 py-2 bg-white border border-slate-200 text-sm text-slate-600 hover:bg-slate-50">
                <List size={14} />
                状态
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-2 border",
                  viewMode === 'list'
                    ? "bg-slate-100 border-slate-300 text-slate-900"
                    : "bg-white border-slate-200 text-slate-400 hover:text-slate-600"
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
                    : "bg-white border-slate-200 text-slate-400 hover:text-slate-600"
                )}
              >
                <LayoutGrid size={16} />
              </button>
            </div>
          </div>

          {/* Workflow List */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">工作流名称</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">版本</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">状态</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">节点数</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">运行次数</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">最后运行</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredWorkflows.map((wf) => (
                  <tr
                    key={wf.id}
                    className="hover:bg-slate-50 cursor-pointer"
                    onClick={() => setSelectedWorkflow(wf)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <GitMerge size={18} className="text-slate-500" />
                        <div>
                          <div className="font-medium text-sky-600 hover:underline">{wf.name}</div>
                          <div className="text-xs text-slate-500 font-mono">{wf.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-mono text-xs">{wf.version}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "px-2 py-0.5 text-xs rounded",
                        wf.status === 'active'
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      )}>
                        {wf.status === 'active' ? '已启用' : '草稿'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{wf.nodes} 节点 / {wf.edges} 连接</td>
                    <td className="px-4 py-3 text-slate-600">{wf.runs.toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{wf.lastRun}</td>
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
      </div>

      {/* Workflow Detail Modal */}
      {selectedWorkflow && (
        <WorkflowDetail
          workflow={selectedWorkflow}
          onClose={() => setSelectedWorkflow(null)}
        />
      )}
    </div>
  );
}
