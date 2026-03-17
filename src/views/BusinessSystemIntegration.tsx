import React, { useState } from 'react';
import { 
  Server, 
  Settings, 
  Plus, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Activity,
  Link,
  RefreshCw,
  FileText
} from 'lucide-react';
import { cn } from '../lib/utils';

const MOCK_SYSTEMS = [
  { id: 'SYS-MES-01', name: '核心制造执行系统 (MES)', type: 'MES', status: 'connected', lastSync: '2m ago', protocol: 'REST API' },
  { id: 'SYS-ERP-01', name: '企业资源计划 (ERP)', type: 'ERP', status: 'connected', lastSync: '1h ago', protocol: 'SOAP' },
  { id: 'SYS-WMS-01', name: '智能仓储系统 (WMS)', type: 'WMS', status: 'error', lastSync: '1d ago', protocol: 'REST API' },
  { id: 'SYS-APS-01', name: '高级排程系统 (APS)', type: 'APS', status: 'connected', lastSync: '5m ago', protocol: 'GraphQL' },
];

const MOCK_LOGS = [
  { id: 1, time: '10:23:45', system: 'SYS-MES-01', event: '工单状态同步成功', type: 'info' },
  { id: 2, time: '09:15:20', system: 'SYS-WMS-01', event: 'API 连接超时', type: 'error' },
  { id: 3, time: '08:05:11', system: 'SYS-ERP-01', event: '物料主数据拉取完成 (1200条)', type: 'success' },
];

export default function BusinessSystemIntegration() {
  const [activeMenu, setActiveMenu] = useState('config');
  const [selectedSystem, setSelectedSystem] = useState(MOCK_SYSTEMS[0]);

  const renderConfig = () => (
    <div className="flex h-full overflow-hidden">
      {/* System List */}
      <div className="w-1/3 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-900">业务系统列表</h3>
            <button className="p-1.5 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md" title="添加系统">
              <Plus size={16} />
            </button>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="搜索系统名称..." 
              className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {MOCK_SYSTEMS.map(sys => (
            <button
              key={sys.id}
              onClick={() => setSelectedSystem(sys)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between",
                selectedSystem.id === sys.id ? "bg-indigo-50 border border-indigo-100" : "hover:bg-gray-50 border border-transparent"
              )}
            >
              <div>
                <div className="font-medium text-gray-900">{sys.name}</div>
                <div className="text-xs text-gray-500">{sys.id}</div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={cn(
                  "w-2 h-2 rounded-full",
                  sys.status === 'connected' ? 'bg-emerald-500' : 'bg-rose-500'
                )} />
                <span className="text-[10px] text-gray-400">{sys.protocol}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Editor Panel */}
      <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">系统接入配置: {selectedSystem.name}</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 font-medium flex items-center gap-1">
                <RefreshCw size={14} /> 测试连通性
              </button>
              <button className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium">
                保存配置
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-8">
            {/* Basic Info */}
            <section>
              <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Settings size={16} className="text-gray-500" />
                基本信息
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">系统 ID</label>
                  <input type="text" value={selectedSystem.id} readOnly className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">系统名称</label>
                  <input type="text" defaultValue={selectedSystem.name} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">系统类型</label>
                  <select defaultValue={selectedSystem.type} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500">
                    <option value="MES">MES</option>
                    <option value="ERP">ERP</option>
                    <option value="WMS">WMS</option>
                    <option value="APS">APS</option>
                  </select>
                </div>
              </div>
            </section>

            {/* API Config */}
            <section>
              <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Link size={16} className="text-gray-500" />
                接口配置
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">接入协议</label>
                  <select defaultValue={selectedSystem.protocol} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500">
                    <option value="REST API">REST API</option>
                    <option value="GraphQL">GraphQL</option>
                    <option value="SOAP">SOAP</option>
                    <option value="Webhook">Webhook</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">认证方式</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500">
                    <option value="OAuth2">OAuth 2.0</option>
                    <option value="API Key">API Key</option>
                    <option value="Basic">Basic Auth</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Base URL</label>
                  <input type="text" defaultValue="https://api.enterprise.com/v1/mes" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                </div>
              </div>
            </section>

            {/* Event Mapping */}
            <section>
              <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Activity size={16} className="text-gray-500" />
                业务事件捕捉映射
              </h4>
              <div className="border border-gray-200 rounded-md overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500">
                    <tr>
                      <th className="px-4 py-2 font-medium">业务事件</th>
                      <th className="px-4 py-2 font-medium">触发条件 / Endpoint</th>
                      <th className="px-4 py-2 font-medium">映射本体对象</th>
                      <th className="px-4 py-2 font-medium">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-4 py-2 font-medium text-gray-900">工单下发</td>
                      <td className="px-4 py-2 font-mono text-xs text-gray-500">POST /webhook/workorder/create</td>
                      <td className="px-4 py-2">
                        <select className="w-full px-2 py-1 border border-gray-300 rounded text-xs">
                          <option>WorkOrder.Create</option>
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <button className="text-rose-500 hover:text-rose-600"><XCircle size={14} /></button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium text-gray-900">工单完成</td>
                      <td className="px-4 py-2 font-mono text-xs text-gray-500">POST /webhook/workorder/complete</td>
                      <td className="px-4 py-2">
                        <select className="w-full px-2 py-1 border border-gray-300 rounded text-xs">
                          <option>WorkOrder.Complete</option>
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <button className="text-rose-500 hover:text-rose-600"><XCircle size={14} /></button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="p-2 bg-gray-50 border-t border-gray-200">
                  <button className="text-xs text-indigo-600 font-medium flex items-center gap-1 hover:text-indigo-700">
                    <Plus size={14} /> 添加事件映射
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLogs = () => (
    <div className="p-6 h-full overflow-y-auto">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">接入日志与告警</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100">
              导出报告
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {MOCK_LOGS.map(log => (
              <div key={log.id} className="p-3 rounded-lg border border-gray-100 bg-gray-50 flex items-start gap-3">
                {log.type === 'error' ? <XCircle size={16} className="text-rose-500 mt-0.5" /> : 
                 log.type === 'success' ? <CheckCircle2 size={16} className="text-emerald-500 mt-0.5" /> :
                 <Activity size={16} className="text-blue-500 mt-0.5" />}
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-900">{log.system}</span>
                    <span className="text-xs text-gray-500">{log.time}</span>
                  </div>
                  <p className="text-sm text-gray-600">{log.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-full w-full bg-white">
      {/* Sub-navigation */}
      <div className="w-48 border-r border-gray-200 bg-gray-50 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900 text-sm">业务系统接入</h2>
        </div>
        <nav className="p-2 space-y-1">
          <button
            onClick={() => setActiveMenu('config')}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
              activeMenu === 'config' ? "bg-white text-indigo-600 shadow-sm font-medium" : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <Settings size={16} />
            系统接入配置
          </button>
          <button
            onClick={() => setActiveMenu('logs')}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
              activeMenu === 'logs' ? "bg-white text-indigo-600 shadow-sm font-medium" : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <FileText size={16} />
            接入日志与告警
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {activeMenu === 'config' && renderConfig()}
        {activeMenu === 'logs' && renderLogs()}
      </div>
    </div>
  );
}
