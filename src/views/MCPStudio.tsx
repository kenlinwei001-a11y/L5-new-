import { useState } from 'react';
import { Terminal, Plus, Search, CheckCircle2, XCircle, Play, Settings, Code2, ShieldAlert, Database } from 'lucide-react';
import { cn } from '../lib/utils';

const tools = [
  { id: 'mcp-001', name: '获取设备状态', server: 'MES服务器', status: 'online', auth: 'OAuth2', calls: 12500 },
  { id: 'mcp-002', name: '更新工单', server: 'ERP服务器', status: 'online', auth: 'API 密钥', calls: 3400 },
  { id: 'mcp-003', name: '获取传感器数据', server: 'IoT中心', status: 'offline', auth: 'mTLS', calls: 89000 },
  { id: 'mcp-004', name: '运行仿真', server: '仿真引擎', status: 'online', auth: 'JWT', calls: 450 },
];

export default function MCPStudio() {
  const [activeTab, setActiveTab] = useState('registry');

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 shrink-0 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Terminal size={18} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">工具中心 (MCP)</h2>
            <p className="text-[10px] text-gray-500 font-mono">注册 • 测试 • 权限控制</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-gray-900 text-white font-medium rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors text-xs shadow-sm">
            <Plus size={14} />
            注册工具
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Navigation */}
        <div className="w-64 border-r border-gray-200 bg-gray-50/30 flex flex-col shrink-0">
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text" 
                placeholder="搜索工具..." 
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
          <nav className="flex-1 p-2 space-y-1">
            <button
              onClick={() => setActiveTab('registry')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                activeTab === 'registry' ? "bg-emerald-50 text-emerald-700 font-medium" : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <Database size={16} />
              工具注册表
            </button>
            <button
              onClick={() => setActiveTab('test')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                activeTab === 'test' ? "bg-emerald-50 text-emerald-700 font-medium" : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <Play size={16} />
              测试沙盒
            </button>
            <button
              onClick={() => setActiveTab('auth')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                activeTab === 'auth' ? "bg-emerald-50 text-emerald-700 font-medium" : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <ShieldAlert size={16} />
              权限控制
            </button>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-[#f8f9fa] p-6 overflow-y-auto">
          {activeTab === 'registry' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">MCP 工具列表</h3>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-500 font-mono">总计: 128</span>
                  <span className="px-2 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded text-xs font-mono">在线: 120</span>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50/50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                    <tr>
                      <th className="px-6 py-3 font-medium">工具名称</th>
                      <th className="px-6 py-3 font-medium">所属服务</th>
                      <th className="px-6 py-3 font-medium">状态</th>
                      <th className="px-6 py-3 font-medium">认证方式</th>
                      <th className="px-6 py-3 font-medium text-right">调用次数</th>
                      <th className="px-6 py-3 font-medium text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {tools.map((tool) => (
                      <tr key={tool.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                          <Code2 size={14} className="text-emerald-500" />
                          <span className="font-mono">{tool.name}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{tool.server}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                            tool.status === 'online' ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                          )}>
                            {tool.status === 'online' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                            {tool.status === 'online' ? '在线' : '离线'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 font-mono text-xs">{tool.auth}</td>
                        <td className="px-6 py-4 text-right text-gray-600 font-mono">{tool.calls.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-gray-400 hover:text-emerald-600 transition-colors">
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

          {activeTab === 'test' && (
            <div className="h-full flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">工具测试沙盒</h3>
              </div>
              <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
                  <div className="p-3 border-b border-gray-200 bg-gray-50/50 font-mono text-xs font-semibold text-gray-700">
                    请求内容 (JSON)
                  </div>
                  <div className="flex-1 p-4 bg-gray-900 text-green-400 font-mono text-sm overflow-y-auto">
                    <pre>
{`{
  "tool": "获取设备状态",
  "args": {
    "id": "EQ-001"
  }
}`}
                    </pre>
                  </div>
                  <div className="p-3 border-t border-gray-200 bg-gray-50/50 flex justify-end">
                    <button className="px-4 py-1.5 bg-emerald-600 text-white font-medium rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors text-xs shadow-sm">
                      <Play size={14} />
                      发送请求
                    </button>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
                  <div className="p-3 border-b border-gray-200 bg-gray-50/50 font-mono text-xs font-semibold text-gray-700">
                    响应内容
                  </div>
                  <div className="flex-1 p-4 bg-gray-50 text-gray-800 font-mono text-sm overflow-y-auto border-t border-gray-200">
                    <pre>
{`{
  "状态": "成功",
  "数据": {
    "编号": "EQ-001",
    "运行状态": "运行中",
    "温度": 92.5,
    "振动": 0.05,
    "上次维护时间": "2023-10-15"
  },
  "延迟_毫秒": 45
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'auth' && (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              权限控制面板开发中...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
