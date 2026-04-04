import { useState } from 'react';
import { ShieldCheck, Database, FileText, Activity, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '../lib/utils';

const tabs = [
  { id: 'data', label: '数据质量', icon: Database },
  { id: 'permissions', label: '权限管理', icon: ShieldCheck },
  { id: 'audit', label: '审计日志', icon: FileText },
  { id: 'behavior', label: 'Agent行为监管', icon: Activity },
];

export default function GovernanceCenter() {
  const [activeTab, setActiveTab] = useState('behavior');

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="h-14 border-b border-gray-200 flex items-center px-4 shrink-0 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">治理中心</h2>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white px-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2",
              activeTab === tab.id
                ? "border-rose-500 text-rose-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {activeTab === 'behavior' && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="text-sm text-gray-500 mb-1">合规调用率</div>
                <div className="text-2xl font-semibold text-emerald-600">99.8%</div>
                <div className="text-xs text-gray-400 mt-2">过去 24 小时</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="text-sm text-gray-500 mb-1">拦截高危操作</div>
                <div className="text-2xl font-semibold text-rose-600">12</div>
                <div className="text-xs text-gray-400 mt-2">需人工复核</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="text-sm text-gray-500 mb-1">活跃 Agent</div>
                <div className="text-2xl font-semibold text-gray-900">45</div>
                <div className="text-xs text-gray-400 mt-2">运行中</div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-900">近期高危行为拦截记录</h3>
                <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">查看全部</button>
              </div>
              <div className="divide-y divide-gray-200">
                {[
                  { id: 'evt-001', agent: 'Planner-01', action: 'UPDATE_SCHEDULE', risk: 'HIGH', status: 'BLOCKED', time: '10:23:45', reason: '超出权限范围：尝试修改锁定订单' },
                  { id: 'evt-002', agent: 'Executor-03', action: 'SHUTDOWN_EQ', risk: 'CRITICAL', status: 'PENDING_REVIEW', time: '09:15:22', reason: '高危指令：停机操作需人工确认' },
                  { id: 'evt-003', agent: 'Analyst-02', action: 'READ_SENSITIVE_DATA', risk: 'MEDIUM', status: 'ALLOWED', time: '08:45:10', reason: '已授权：临时提权访问' },
                ].map(record => (
                  <div key={record.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      {record.status === 'BLOCKED' ? <XCircle className="text-rose-500" size={20} /> : 
                       record.status === 'PENDING_REVIEW' ? <AlertTriangle className="text-amber-500" size={20} /> :
                       <CheckCircle2 className="text-emerald-500" size={20} />}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">{record.action}</span>
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-mono font-medium",
                            record.risk === 'CRITICAL' ? "bg-rose-100 text-rose-700" :
                            record.risk === 'HIGH' ? "bg-orange-100 text-orange-700" :
                            "bg-amber-100 text-amber-700"
                          )}>{record.risk}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          <span className="font-mono text-indigo-600">{record.agent}</span> • {record.reason}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono text-gray-400">{record.time}</div>
                      <button className="mt-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium">查看详情</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {activeTab !== 'behavior' && (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            {tabs.find(t => t.id === activeTab)?.label} 模块开发中...
          </div>
        )}
      </div>
    </div>
  );
}
