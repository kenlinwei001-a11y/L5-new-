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
  // 核心生产与计划
  { id: 'SYS-MES-01', name: '核心制造执行系统 (MES)', type: 'MES', status: 'connected', lastSync: '2m ago', protocol: 'REST API' },
  { id: 'SYS-ERP-01', name: '企业资源计划 (ERP)', type: 'ERP', status: 'connected', lastSync: '1h ago', protocol: 'SOAP' },
  { id: 'SYS-APS-01', name: '高级排程系统 (APS)', type: 'APS', status: 'connected', lastSync: '5m ago', protocol: 'GraphQL' },
  
  // 仓储与物流
  { id: 'SYS-WMS-01', name: '智能仓储系统 (WMS)', type: 'WMS', status: 'error', lastSync: '1d ago', protocol: 'REST API' },
  { id: 'SYS-WCS-01', name: '仓储控制系统 (WCS)', type: 'WCS', status: 'connected', lastSync: '1m ago', protocol: 'TCP/IP' },
  { id: 'SYS-AGV-01', name: 'AGV/AMR 调度系统', type: 'Logistics', status: 'connected', lastSync: '10s ago', protocol: 'MQTT' },
  
  // 质量与研发
  { id: 'SYS-QMS-01', name: '质量管理系统 (QMS)', type: 'QMS', status: 'connected', lastSync: '15m ago', protocol: 'REST API' },
  { id: 'SYS-LIMS-01', name: '实验室信息管理系统 (LIMS)', type: 'LIMS', status: 'connected', lastSync: '30m ago', protocol: 'REST API' },
  { id: 'SYS-PLM-01', name: '产品生命周期管理 (PLM)', type: 'PLM', status: 'connected', lastSync: '2h ago', protocol: 'OData' },
  { id: 'SYS-SPC-01', name: '统计过程控制系统 (SPC)', type: 'SPC', status: 'connected', lastSync: '1m ago', protocol: 'gRPC' },
  
  // 设备与资产管理
  { id: 'SYS-EAM-01', name: '企业资产管理系统 (EAM)', type: 'EAM', status: 'connected', lastSync: '10m ago', protocol: 'REST API' },
  { id: 'SYS-CMMS-01', name: '设备维修工单系统 (CMMS)', type: 'CMMS', status: 'connected', lastSync: '5m ago', protocol: 'REST API' },
  { id: 'SYS-MRO-01', name: '备品备件库存系统 (MRO)', type: 'Inventory', status: 'connected', lastSync: '1h ago', protocol: 'REST API' },
  { id: 'SYS-SCADA-01', name: '数据采集与监视控制 (SCADA)', type: 'IoT', status: 'connected', lastSync: '1s ago', protocol: 'OPC UA' },
  
  // 人力与排班
  { id: 'SYS-HRMS-01', name: '人力资源管理系统 (HRMS)', type: 'HR', status: 'connected', lastSync: '12h ago', protocol: 'REST API' },
  { id: 'SYS-WFM-PROD', name: '生产员工排程系统 (WFM-Prod)', type: 'WFM', status: 'connected', lastSync: '1h ago', protocol: 'REST API' },
  { id: 'SYS-WFM-MAINT', name: '维修人员排程系统 (WFM-Maint)', type: 'WFM', status: 'connected', lastSync: '1h ago', protocol: 'REST API' },
  
  // 供应链与客户
  { id: 'SYS-SRM-01', name: '供应商关系管理 (SRM)', type: 'SRM', status: 'connected', lastSync: '4h ago', protocol: 'REST API' },
  { id: 'SYS-CRM-01', name: '客户关系管理 (CRM)', type: 'CRM', status: 'connected', lastSync: '1h ago', protocol: 'REST API' },
  
  // 厂务与环境
  { id: 'SYS-EMS-01', name: '能源管理系统 (EMS)', type: 'EMS', status: 'connected', lastSync: '5m ago', protocol: 'MQTT' },
  { id: 'SYS-EHS-01', name: '环境健康安全系统 (EHS)', type: 'EHS', status: 'connected', lastSync: '1d ago', protocol: 'REST API' },
];

const MOCK_LOGS = [
  { id: 1, time: '10:23:45', system: 'SYS-MES-01', event: '工单状态同步成功', type: 'info' },
  { id: 2, time: '09:15:20', system: 'SYS-WMS-01', event: 'API 连接超时', type: 'error' },
  { id: 3, time: '08:05:11', system: 'SYS-ERP-01', event: '物料主数据拉取完成 (1200条)', type: 'success' },
  { id: 4, time: '07:30:00', system: 'SYS-CMMS-01', event: '涂布机维修工单状态更新', type: 'info' },
  { id: 5, time: '07:15:22', system: 'SYS-WFM-PROD', event: '早班人员排班数据同步完成', type: 'success' },
  { id: 6, time: '06:45:10', system: 'SYS-MRO-01', event: '备件库存低于安全阈值告警', type: 'error' },
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
                    <option value="MES">MES (制造执行)</option>
                    <option value="ERP">ERP (企业资源计划)</option>
                    <option value="WMS">WMS (智能仓储)</option>
                    <option value="WCS">WCS (仓储控制)</option>
                    <option value="APS">APS (高级排程)</option>
                    <option value="QMS">QMS (质量管理)</option>
                    <option value="LIMS">LIMS (实验室信息管理)</option>
                    <option value="PLM">PLM (产品生命周期)</option>
                    <option value="SPC">SPC (统计过程控制)</option>
                    <option value="EAM">EAM (企业资产管理)</option>
                    <option value="CMMS">CMMS (设备维修工单)</option>
                    <option value="Inventory">Inventory (备品备件库存)</option>
                    <option value="IoT">IoT/SCADA (数据采集与监视)</option>
                    <option value="HR">HRMS (人力资源)</option>
                    <option value="WFM">WFM (劳动力排程)</option>
                    <option value="SRM">SRM (供应商关系管理)</option>
                    <option value="CRM">CRM (客户关系管理)</option>
                    <option value="EMS">EMS (能源管理)</option>
                    <option value="EHS">EHS (环境健康安全)</option>
                    <option value="Logistics">Logistics (物流与AGV调度)</option>
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
