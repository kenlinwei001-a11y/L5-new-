import React, { useState } from 'react';
import { 
  Database, 
  CalendarClock, 
  AlertTriangle, 
  Play, 
  Square, 
  RefreshCw, 
  GitCommit, 
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { cn } from '../lib/utils';

const MOCK_PIPELINES = [
  { id: 'PL-001', name: 'CNC 实时状态采集', source: 'IoT-CNC', target: 'DataLake-Raw', status: 'running', latency: '12ms', successRate: '99.9%' },
  { id: 'PL-002', name: 'ERP 每日工单同步', source: 'SYS-ERP', target: 'DataLake-Structured', status: 'stopped', latency: '-', successRate: '100%' },
  { id: 'PL-003', name: 'AGV 轨迹流处理', source: 'IoT-AGV', target: 'DataLake-Stream', status: 'error', latency: '540ms', successRate: '85.2%' },
];

const MOCK_TASKS = [
  { id: 'TSK-001', name: '每日数据清洗', schedule: '0 2 * * *', lastRun: '2023-10-27 02:00:00', status: 'success' },
  { id: 'TSK-002', name: '指标聚合计算 (小时级)', schedule: '0 * * * *', lastRun: '2023-10-27 10:00:00', status: 'success' },
  { id: 'TSK-003', name: '异常数据重试', schedule: '*/15 * * * *', lastRun: '2023-10-27 10:15:00', status: 'failed' },
];

export default function DataIntegrationHub() {
  const [activeMenu, setActiveMenu] = useState('pipeline');

  const renderPipeline = () => (
    <div className="p-6 h-full overflow-y-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">数据流管线图</h2>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium">
            新建管线
          </button>
        </div>
      </div>

      {/* Pipeline Visualizer Mock */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">可视化管线编排</h3>
        <div className="flex items-center justify-center gap-4 p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center border border-blue-200 shadow-sm">
              <Database size={24} />
            </div>
            <span className="text-xs font-medium text-gray-600">数据源</span>
          </div>
          <ArrowRight className="text-gray-400" />
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center border border-amber-200 shadow-sm">
              <GitCommit size={24} />
            </div>
            <span className="text-xs font-medium text-gray-600">转换</span>
          </div>
          <ArrowRight className="text-gray-400" />
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-200 shadow-sm">
              <Database size={24} />
            </div>
            <span className="text-xs font-medium text-gray-600">目标</span>
          </div>
        </div>
      </div>

      {/* Pipeline List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">数据接入状态</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">管线名称</th>
              <th className="px-4 py-3 font-medium">源 {'->'} 目标</th>
              <th className="px-4 py-3 font-medium">状态</th>
              <th className="px-4 py-3 font-medium">延迟</th>
              <th className="px-4 py-3 font-medium">成功率</th>
              <th className="px-4 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {MOCK_PIPELINES.map(pl => (
              <tr key={pl.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{pl.name}</td>
                <td className="px-4 py-3 text-gray-500 text-xs font-mono">{pl.source} {'->'} {pl.target}</td>
                <td className="px-4 py-3">
                  <span className={cn(
                    "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
                    pl.status === 'running' ? "bg-emerald-50 text-emerald-700" :
                    pl.status === 'stopped' ? "bg-gray-100 text-gray-700" :
                    "bg-rose-50 text-rose-700"
                  )}>
                    {pl.status === 'running' ? <Play size={12} /> : pl.status === 'stopped' ? <Square size={12} /> : <AlertTriangle size={12} />}
                    {pl.status === 'running' ? '运行中' : pl.status === 'stopped' ? '已停止' : '异常'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 font-mono text-xs">{pl.latency}</td>
                <td className="px-4 py-3 text-gray-600 font-mono text-xs">{pl.successRate}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="text-indigo-600 hover:text-indigo-800 text-xs font-medium">编辑</button>
                    <button className="text-gray-600 hover:text-gray-800 text-xs font-medium">日志</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTasks = () => (
    <div className="p-6 h-full overflow-y-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">任务调度</h2>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium">
            新建任务
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">任务名称</th>
              <th className="px-4 py-3 font-medium">Cron 表达式</th>
              <th className="px-4 py-3 font-medium">上次运行时间</th>
              <th className="px-4 py-3 font-medium">状态</th>
              <th className="px-4 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {MOCK_TASKS.map(task => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{task.name}</td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{task.schedule}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{task.lastRun}</td>
                <td className="px-4 py-3">
                  <span className={cn(
                    "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
                    task.status === 'success' ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                  )}>
                    {task.status === 'success' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    {task.status === 'success' ? '成功' : '失败'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="text-indigo-600 hover:text-indigo-800 text-xs font-medium flex items-center gap-1">
                      <Play size={12} /> 手动触发
                    </button>
                    <button className="text-gray-600 hover:text-gray-800 text-xs font-medium">日志</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="flex h-full w-full bg-gray-50">
      {/* Sub-navigation */}
      <div className="w-48 border-r border-gray-200 bg-white flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">数据集成枢纽</h2>
        </div>
        <nav className="p-2 space-y-1">
          <button
            onClick={() => setActiveMenu('pipeline')}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
              activeMenu === 'pipeline' ? "bg-indigo-50 text-indigo-600 font-medium" : "text-gray-600 hover:bg-gray-50"
            )}
          >
            <Database size={16} />
            数据源与管线
          </button>
          <button
            onClick={() => setActiveMenu('tasks')}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
              activeMenu === 'tasks' ? "bg-indigo-50 text-indigo-600 font-medium" : "text-gray-600 hover:bg-gray-50"
            )}
          >
            <CalendarClock size={16} />
            任务调度
          </button>
          <button
            onClick={() => setActiveMenu('alerts')}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
              activeMenu === 'alerts' ? "bg-indigo-50 text-indigo-600 font-medium" : "text-gray-600 hover:bg-gray-50"
            )}
          >
            <AlertTriangle size={16} />
            异常告警
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {activeMenu === 'pipeline' && renderPipeline()}
        {activeMenu === 'tasks' && renderTasks()}
        {activeMenu === 'alerts' && (
          <div className="p-6 flex items-center justify-center h-full text-gray-500">
            异常告警模块开发中...
          </div>
        )}
      </div>
    </div>
  );
}
