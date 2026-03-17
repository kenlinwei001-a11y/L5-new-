import React, { useState } from 'react';
import { 
  Activity, 
  Server, 
  AlertTriangle, 
  Settings, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock,
  BarChart3,
  Wifi,
  Database
} from 'lucide-react';
import { cn } from '../lib/utils';

const MOCK_DEVICES = [
  { id: 'DEV-CNC-001', name: 'CNC加工中心-A', type: 'CNC', status: 'online', health: 'good', lastHeartbeat: '10s ago', protocol: 'OPC-UA' },
  { id: 'DEV-CNC-002', name: 'CNC加工中心-B', type: 'CNC', status: 'online', health: 'warning', lastHeartbeat: '12s ago', protocol: 'OPC-UA' },
  { id: 'DEV-ROB-001', name: '装配机器人-1', type: 'Robot', status: 'offline', health: 'error', lastHeartbeat: '5m ago', protocol: 'MQTT' },
  { id: 'DEV-AGV-001', name: '搬运AGV-1', type: 'AGV', status: 'online', health: 'good', lastHeartbeat: '2s ago', protocol: 'HTTP' },
];

const MOCK_ALERTS = [
  { id: 1, time: '10:23:45', device: 'DEV-ROB-001', type: 'Connection Lost', level: 'high', status: 'unread' },
  { id: 2, time: '09:15:20', device: 'DEV-CNC-002', type: 'High Temperature', level: 'medium', status: 'read' },
  { id: 3, time: '08:05:11', device: 'DEV-AGV-001', type: 'Battery Low', level: 'low', status: 'read' },
];

export default function IoTDeviceManagement() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [selectedDevice, setSelectedDevice] = useState(MOCK_DEVICES[0]);

  const renderDashboard = () => (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">实时接入状态仪表板</h2>
        <div className="flex gap-2">
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            系统运行正常
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <span className="text-sm text-gray-500 font-medium">在线设备数</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">1,248</span>
            <span className="text-xs text-emerald-600 font-medium">↑ 12%</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <span className="text-sm text-gray-500 font-medium">数据采集率</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">99.9%</span>
            <span className="text-xs text-gray-400 font-medium">稳定</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <span className="text-sm text-gray-500 font-medium">实时数据流量</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">45.2</span>
            <span className="text-sm text-gray-500 font-medium">MB/s</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <span className="text-sm text-gray-500 font-medium">未处理告警</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-rose-600">3</span>
            <span className="text-xs text-rose-600 font-medium">需要关注</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Device Health */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity size={16} className="text-indigo-500" />
            设备健康度分布
          </h3>
          <div className="flex h-4 rounded-full overflow-hidden mb-4">
            <div className="bg-emerald-500 w-[85%]" title="良好 (85%)"></div>
            <div className="bg-amber-400 w-[10%]" title="警告 (10%)"></div>
            <div className="bg-rose-500 w-[5%]" title="异常 (5%)"></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> 良好 (1060)</div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span> 警告 (125)</div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span> 异常 (63)</div>
          </div>
        </div>

        {/* System Connection */}
        <div className="col-span-1 bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Server size={16} className="text-blue-500" />
            业务系统连接状态
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">MES 系统</span>
              <span className="flex items-center gap-1 text-xs text-emerald-600"><CheckCircle2 size={14} /> 已连接</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">ERP 系统</span>
              <span className="flex items-center gap-1 text-xs text-emerald-600"><CheckCircle2 size={14} /> 已连接</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">WMS 系统</span>
              <span className="flex items-center gap-1 text-xs text-amber-500"><Clock size={14} /> 延迟较高</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts & Logs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <AlertTriangle size={16} className="text-rose-500" />
            实时告警
          </h3>
          <button className="text-xs text-indigo-600 font-medium hover:text-indigo-700">查看全部</button>
        </div>
        <div className="divide-y divide-gray-100">
          {MOCK_ALERTS.map(alert => (
            <div key={alert.id} className={cn("p-3 flex items-center justify-between hover:bg-gray-50", alert.status === 'unread' ? 'bg-rose-50/30' : '')}>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  alert.level === 'high' ? 'bg-rose-500' : alert.level === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                )} />
                <span className="text-sm font-medium text-gray-900">{alert.device}</span>
                <span className="text-sm text-gray-600">{alert.type}</span>
              </div>
              <span className="text-xs text-gray-400">{alert.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDeviceConfig = () => (
    <div className="flex h-full overflow-hidden">
      {/* Device List */}
      <div className="w-1/3 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-900">设备列表</h3>
            <div className="flex gap-2">
              <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md" title="批量导入">
                <Database size={16} />
              </button>
              <button className="p-1.5 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md" title="添加设备">
                <Plus size={16} />
              </button>
            </div>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="搜索设备 ID 或名称..." 
              className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {MOCK_DEVICES.map(device => (
            <button
              key={device.id}
              onClick={() => setSelectedDevice(device)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between",
                selectedDevice.id === device.id ? "bg-indigo-50 border border-indigo-100" : "hover:bg-gray-50 border border-transparent"
              )}
            >
              <div>
                <div className="font-medium text-gray-900">{device.name}</div>
                <div className="text-xs text-gray-500">{device.id}</div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={cn(
                  "w-2 h-2 rounded-full",
                  device.status === 'online' ? 'bg-emerald-500' : 'bg-gray-400'
                )} />
                <span className="text-[10px] text-gray-400">{device.protocol}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Editor Panel */}
      <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">设备配置: {selectedDevice.name}</h3>
            <button className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium">
              保存配置
            </button>
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
                  <label className="block text-xs font-medium text-gray-700 mb-1">设备 ID</label>
                  <input type="text" value={selectedDevice.id} readOnly className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">设备名称</label>
                  <input type="text" defaultValue={selectedDevice.name} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">设备类型</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500">
                    <option value="CNC">CNC加工中心</option>
                    <option value="Robot">工业机器人</option>
                    <option value="AGV">AGV小车</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">所属产线</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500">
                    <option>Line-A (机加工)</option>
                    <option>Line-B (装配)</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Data Collection Config */}
            <section>
              <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Wifi size={16} className="text-gray-500" />
                数据采集配置
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">通信协议</label>
                  <select defaultValue={selectedDevice.protocol} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500">
                    <option value="OPC-UA">OPC-UA</option>
                    <option value="MQTT">MQTT</option>
                    <option value="HTTP">HTTP REST</option>
                    <option value="Modbus">Modbus TCP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">采集频率 (ms)</label>
                  <input type="number" defaultValue="1000" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">连接地址 (Endpoint)</label>
                  <input type="text" defaultValue="opc.tcp://192.168.1.100:4840" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-md hover:bg-indigo-100">
                  测试连接
                </button>
                <button className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100">
                  读取节点树
                </button>
              </div>
            </section>

            {/* Tag Mapping */}
            <section>
              <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Database size={16} className="text-gray-500" />
                数据标签与业务对象映射
              </h4>
              <div className="border border-gray-200 rounded-md overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500">
                    <tr>
                      <th className="px-4 py-2 font-medium">设备标签 (Tag)</th>
                      <th className="px-4 py-2 font-medium">数据类型</th>
                      <th className="px-4 py-2 font-medium">映射业务对象属性</th>
                      <th className="px-4 py-2 font-medium">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-4 py-2 font-mono text-xs">ns=2;s=SpindleSpeed</td>
                      <td className="px-4 py-2 text-gray-500">Double</td>
                      <td className="px-4 py-2">
                        <select className="w-full px-2 py-1 border border-gray-300 rounded text-xs">
                          <option>Equipment.Spindle.Speed</option>
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <button className="text-rose-500 hover:text-rose-600"><XCircle size={14} /></button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-mono text-xs">ns=2;s=Temperature</td>
                      <td className="px-4 py-2 text-gray-500">Double</td>
                      <td className="px-4 py-2">
                        <select className="w-full px-2 py-1 border border-gray-300 rounded text-xs">
                          <option>Equipment.Status.Temperature</option>
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
                    <Plus size={14} /> 添加映射
                  </button>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500">提示: 拖拽标签可快速映射到右侧的业务对象模型中。</p>
            </section>
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
          <h2 className="font-semibold text-gray-900 text-sm">IoT设备接入</h2>
        </div>
        <nav className="p-2 space-y-1">
          <button
            onClick={() => setActiveMenu('dashboard')}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
              activeMenu === 'dashboard' ? "bg-white text-indigo-600 shadow-sm font-medium" : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <BarChart3 size={16} />
            首页仪表板
          </button>
          <button
            onClick={() => setActiveMenu('config')}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
              activeMenu === 'config' ? "bg-white text-indigo-600 shadow-sm font-medium" : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <Settings size={16} />
            设备接入配置
          </button>
          <button
            onClick={() => setActiveMenu('alerts')}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
              activeMenu === 'alerts' ? "bg-white text-indigo-600 shadow-sm font-medium" : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <AlertTriangle size={16} />
            告警与日志
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {activeMenu === 'dashboard' && renderDashboard()}
        {activeMenu === 'config' && renderDeviceConfig()}
        {activeMenu === 'alerts' && (
          <div className="p-6 flex items-center justify-center h-full text-gray-500">
            告警与日志模块开发中...
          </div>
        )}
      </div>
    </div>
  );
}
