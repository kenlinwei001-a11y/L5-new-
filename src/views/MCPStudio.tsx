import { useState } from 'react';
import {
  Terminal,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Play,
  Settings,
  Code,
  FileText,
  FolderOpen,
  History,
  ChevronRight,
  Copy,
  Check,
  LayoutGrid,
  List,
  Database,
  Shield,
  TerminalSquare,
  MoreHorizontal,
  Send,
  Clock
} from 'lucide-react';
import { cn } from '../lib/utils';

// --- Mock Data ---
const TOOLS = [
  {
    id: 'tool-get-equipment-status',
    name: 'get_equipment_status',
    displayName: '获取设备状态',
    description: '获取指定设备的实时运行状态、温度、振动等传感器数据',
    version: 'v1.2.0',
    status: 'online',
    server: 'MES服务器',
    auth: 'OAuth2',
    calls: 12500,
    latency: '45ms',
    author: '设备管理团队',
    updatedAt: '2024-03-15'
  },
  {
    id: 'tool-update-work-order',
    name: 'update_work_order',
    displayName: '更新工单',
    description: '更新工单状态、实际产量、报工信息',
    version: 'v2.0.1',
    status: 'online',
    server: 'ERP服务器',
    auth: 'API密钥',
    calls: 3400,
    latency: '28ms',
    author: '生产计划组',
    updatedAt: '2024-03-18'
  },
  {
    id: 'tool-get-sensor-data',
    name: 'get_sensor_data',
    displayName: '获取传感器数据',
    description: '从IoT平台获取指定传感器的历史或实时数据',
    version: 'v1.5.0',
    status: 'offline',
    server: 'IoT中心',
    auth: 'mTLS',
    calls: 89000,
    latency: '-',
    author: 'IoT平台组',
    updatedAt: '2024-03-10'
  },
  {
    id: 'tool-run-simulation',
    name: 'run_simulation',
    displayName: '运行仿真',
    description: '调用仿真引擎执行What-if分析',
    version: 'v1.0.5',
    status: 'online',
    server: '仿真引擎',
    auth: 'JWT',
    calls: 450,
    latency: '5.2s',
    author: '仿真团队',
    updatedAt: '2024-03-20'
  },
  {
    id: 'tool-query-inventory',
    name: 'query_inventory',
    displayName: '查询库存',
    description: '查询指定物料的实时库存量、库位信息',
    version: 'v2.1.0',
    status: 'online',
    server: 'WMS服务器',
    auth: 'OAuth2',
    calls: 5600,
    latency: '32ms',
    author: '仓储管理组',
    updatedAt: '2024-03-19'
  }
];

const SCHEMA_JSON = `{
  "name": "get_equipment_status",
  "description": "获取指定设备的实时运行状态、温度、振动等传感器数据",
  "version": "1.2.0",
  "auth": {
    "type": "OAuth2",
    "scopes": ["equipment:read"]
  },
  "parameters": {
    "type": "object",
    "required": ["equipment_id"],
    "properties": {
      "equipment_id": {
        "type": "string",
        "description": "设备唯一标识符",
        "pattern": "^[A-Z]{2}-[0-9]{3}$"
      },
      "metrics": {
        "type": "array",
        "description": "需要获取的指标列表",
        "items": {
          "enum": ["temperature", "vibration", "current", "status"]
        },
        "default": ["status"]
      },
      "time_range": {
        "type": "string",
        "description": "数据时间范围",
        "enum": ["realtime", "last_hour", "last_day"],
        "default": "realtime"
      }
    }
  },
  "returns": {
    "type": "object",
    "properties": {
      "equipment_id": { "type": "string" },
      "status": {
        "type": "string",
        "enum": ["running", "stopped", "maintenance", "error"]
      },
      "temperature": { "type": "number", "unit": "celsius" },
      "vibration": { "type": "number", "unit": "mm/s" },
      "last_updated": { "type": "string", "format": "datetime" }
    }
  }
}`;

const IMPLEMENTATION_CODE = `class EquipmentStatusTool:
    """获取设备状态的MCP工具实现"""

    def __init__(self, mes_client):
        self.mes = mes_client
        self.cache = CacheManager(ttl=30)

    async def execute(self, params: dict) -> dict:
        equipment_id = params.get('equipment_id')
        metrics = params.get('metrics', ['status'])

        # 验证设备ID格式
        if not self._validate_equipment_id(equipment_id):
            raise InvalidParameterError(f"Invalid equipment ID: {equipment_id}")

        # 检查缓存
        cache_key = f"eq_status:{equipment_id}"
        cached = await self.cache.get(cache_key)
        if cached and params.get('time_range') == 'realtime':
            return cached

        # 调用MES接口
        data = await self.mes.get_equipment_status(
            equipment_id=equipment_id,
            metrics=metrics
        )

        # 缓存结果
        await self.cache.set(cache_key, data, ttl=30)

        return {
            "equipment_id": equipment_id,
            "status": data['status'],
            "temperature": data.get('temperature'),
            "vibration": data.get('vibration'),
            "last_updated": data['timestamp']
        }`;

const README_MD = `# get_equipment_status

## 描述
获取指定设备的实时运行状态、温度、振动等传感器数据。

## 使用场景
- 设备健康状态监控
- 异常预警检查
- 设备性能分析

## 参数说明

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| equipment_id | string | 是 | 设备唯一标识符，格式: XX-NNN |
| metrics | array | 否 | 需要获取的指标列表 |
| time_range | string | 否 | 数据时间范围 |

## 返回值

\`\`\`json
{
  "equipment_id": "EQ-001",
  "status": "running",
  "temperature": 92.5,
  "vibration": 0.05,
  "last_updated": "2024-03-21T10:30:00Z"
}
\`\`\`

## 错误码
- 400: 参数错误
- 404: 设备不存在
- 503: MES服务暂不可用`;

// Code Block Component
function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <div className="absolute right-2 top-2">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded transition-colors"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? '已复制' : '复制'}
        </button>
      </div>
      <div className="bg-slate-900 text-slate-300 p-4 pt-10 overflow-x-auto rounded-b-lg">
        <pre className="text-sm font-mono">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

// Tool Detail Component
function ToolDetail({ tool, onClose }: { tool: typeof TOOLS[0]; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'readme' | 'schema' | 'code' | 'test'>('readme');

  const tabs = [
    { id: 'readme', label: 'README.md', icon: FileText },
    { id: 'schema', label: 'schema.json', icon: Database },
    { id: 'code', label: 'implementation.py', icon: Code },
    { id: 'test', label: '测试沙盒', icon: TerminalSquare },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Header */}
      <header className="border-b border-slate-200">
        {/* Breadcrumb */}
        <div className="px-4 py-2 border-b border-slate-100 flex items-center gap-2 text-sm text-slate-600">
          <Terminal size={14} className="text-slate-400" />
          <span className="hover:text-slate-900 cursor-pointer">MCP工具中心</span>
          <ChevronRight size={14} className="text-slate-300" />
          <span className="font-medium text-slate-900">{tool.name}</span>
        </div>

        {/* Title Row */}
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-800 text-white flex items-center justify-center">
                <Terminal size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{tool.displayName}</h1>
                <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                  <span className="font-mono">{tool.name}</span>
                  <span>•</span>
                  <span>{tool.version}</span>
                  <span className={cn(
                    "px-1.5 py-0.5 text-xs rounded",
                    tool.status === 'online'
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  )}>
                    {tool.status === 'online' ? '在线' : '离线'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50">
                <Settings size={14} />
                设置
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
            <span className="font-medium text-slate-900">{tool.id}</span>
            <span className="text-slate-400">/</span>
            <span>
              {activeTab === 'readme' && 'README.md'}
              {activeTab === 'schema' && 'schema.json'}
              {activeTab === 'code' && 'implementation.py'}
              {activeTab === 'test' && 'sandbox/'}
            </span>
          </div>

          {/* README Tab */}
          {activeTab === 'readme' && (
            <div className="bg-white border border-t-0 border-slate-200 rounded-b-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200">
                <span className="text-sm font-medium text-slate-700">README.md</span>
              </div>
              <div className="p-6">
                <pre className="text-sm text-slate-800 whitespace-pre-wrap font-mono">
                  {README_MD}
                </pre>
              </div>
            </div>
          )}

          {/* Schema Tab */}
          {activeTab === 'schema' && (
            <div className="bg-white border border-t-0 border-slate-200 rounded-b-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200">
                <span className="text-sm font-medium text-slate-700">schema.json</span>
                <span className="text-xs text-slate-500">JSON Schema</span>
              </div>
              <CodeBlock code={SCHEMA_JSON} language="json" />
            </div>
          )}

          {/* Code Tab */}
          {activeTab === 'code' && (
            <div className="bg-white border border-t-0 border-slate-200 rounded-b-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200">
                <span className="text-sm font-medium text-slate-700">implementation.py</span>
                <span className="text-xs text-slate-500">Python</span>
              </div>
              <CodeBlock code={IMPLEMENTATION_CODE} language="python" />
            </div>
          )}

          {/* Test Tab */}
          {activeTab === 'test' && (
            <div className="bg-white border border-t-0 border-slate-200 rounded-b-lg">
              <div className="grid grid-cols-2 gap-0">
                {/* Request */}
                <div className="border-r border-slate-200">
                  <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">请求参数</span>
                    <button className="px-3 py-1 bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 flex items-center gap-1">
                      <Send size={12} />
                      发送
                    </button>
                  </div>
                  <div className="p-4">
                    <textarea
                      className="w-full h-64 p-3 bg-slate-900 text-green-400 font-mono text-sm rounded resize-none focus:outline-none"
                      defaultValue={`{
  "equipment_id": "EQ-001",
  "metrics": ["temperature", "vibration"],
  "time_range": "realtime"
}`}
                    />
                  </div>
                </div>

                {/* Response */}
                <div>
                  <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">响应结果</span>
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock size={12} />
                      45ms
                    </span>
                  </div>
                  <div className="p-4">
                    <pre className="w-full h-64 p-3 bg-slate-50 text-slate-700 font-mono text-sm rounded overflow-auto">
{`{
  "equipment_id": "EQ-001",
  "status": "running",
  "temperature": 92.5,
  "vibration": 0.05,
  "last_updated": "2024-03-21T10:30:00Z"
}`}
                    </pre>
                  </div>
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
export default function MCPStudio() {
  const [tools] = useState(TOOLS);
  const [selectedTool, setSelectedTool] = useState<typeof TOOLS[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = tools.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <header className="border-b border-slate-200">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 text-sm text-slate-600">
          <Terminal size={16} className="text-slate-400" />
          <span className="font-medium text-slate-900">MCP Studio</span>
        </div>

        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-800 text-white flex items-center justify-center">
                <Terminal size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">MCP工具中心</h1>
                <p className="text-sm text-slate-500">模型上下文协议工具注册与测试</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-2 bg-slate-800 text-white text-sm font-medium hover:bg-slate-700">
                <Plus size={14} />
                注册工具
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-slate-50">
        <div className="max-w-6xl mx-auto p-6">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 border border-slate-200">
              <div className="text-sm text-slate-500">工具总数</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">45</div>
            </div>
            <div className="bg-white p-4 border border-slate-200">
              <div className="text-sm text-slate-500">在线</div>
              <div className="text-2xl font-bold text-emerald-600 mt-1">42</div>
            </div>
            <div className="bg-white p-4 border border-slate-200">
              <div className="text-sm text-slate-500">离线</div>
              <div className="text-2xl font-bold text-rose-600 mt-1">3</div>
            </div>
            <div className="bg-white p-4 border border-slate-200">
              <div className="text-sm text-slate-500">总调用次数</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">110K</div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="搜索工具..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-64 bg-white border border-slate-200 text-sm focus:outline-none focus:border-slate-400 rounded"
              />
            </div>
          </div>

          {/* Tool List */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">工具名称</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">状态</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">认证方式</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">延迟</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">调用次数</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTools.map((tool) => (
                  <tr
                    key={tool.id}
                    className="hover:bg-slate-50 cursor-pointer"
                    onClick={() => setSelectedTool(tool)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Terminal size={18} className="text-slate-500" />
                        <div>
                          <div className="font-medium text-sky-600 hover:underline">{tool.displayName}</div>
                          <div className="text-xs text-slate-500 font-mono">{tool.name}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{tool.server}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "flex items-center gap-1.5 text-xs",
                        tool.status === 'online' ? "text-emerald-600" : "text-rose-600"
                      )}>
                        <span className={cn(
                          "w-2 h-2 rounded-full",
                          tool.status === 'online' ? "bg-emerald-500" : "bg-rose-500"
                        )} />
                        {tool.status === 'online' ? '在线' : '离线'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-mono text-xs">{tool.auth}</td>
                    <td className="px-4 py-3 text-slate-600">{tool.latency}</td>
                    <td className="px-4 py-3 text-slate-600">{tool.calls.toLocaleString()}</td>
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

      {/* Tool Detail Modal */}
      {selectedTool && (
        <ToolDetail
          tool={selectedTool}
          onClose={() => setSelectedTool(null)}
        />
      )}
    </div>
  );
}
