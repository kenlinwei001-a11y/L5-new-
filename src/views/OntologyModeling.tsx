import { useState } from 'react';
import {
  Database,
  Plus,
  Search,
  Server,
  Table2,
  ChevronRight,
  FileText,
  Code,
  GitBranch,
  Network,
  Box,
  Settings,
  Copy,
  Check,
  LayoutGrid,
  List,
  MoreHorizontal,
  Link2,
  Layers,
  ArrowRight
} from 'lucide-react';
import { cn } from '../lib/utils';

// --- Mock Data ---
const DATA_SOURCES = [
  {
    id: 'mes',
    name: 'MES 制造执行系统',
    type: 'mysql',
    tables: 45,
    recognizedEntities: 12,
    status: 'connected',
    lastSync: '2分钟前'
  },
  {
    id: 'erp',
    name: 'ERP 企业资源计划',
    type: 'oracle',
    tables: 128,
    recognizedEntities: 18,
    status: 'connected',
    lastSync: '5分钟前'
  },
  {
    id: 'plm',
    name: 'PLM 产品生命周期',
    type: 'postgresql',
    tables: 34,
    recognizedEntities: 8,
    status: 'connected',
    lastSync: '10分钟前'
  },
  {
    id: 'qms',
    name: 'QMS 质量管理系统',
    type: 'sqlserver',
    tables: 28,
    recognizedEntities: 6,
    status: 'disconnected',
    lastSync: '1小时前'
  }
];

const ONTOLOGY_CLASSES = [
  { id: 'ProductionLine', label: '产线', category: '制造', properties: 8, relations: 4, instances: 12 },
  { id: 'Device', label: '设备', category: '制造', properties: 12, relations: 6, instances: 156 },
  { id: 'WorkOrder', label: '工单', category: '生产', properties: 10, relations: 5, instances: 5000 },
  { id: 'SalesOrder', label: '销售订单', category: '销售', properties: 14, relations: 3, instances: 12000 },
  { id: 'Supplier', label: '供应商', category: '供应链', properties: 9, relations: 2, instances: 320 },
  { id: 'Material', label: '物料', category: '供应链', properties: 15, relations: 4, instances: 4500 },
  { id: 'Product', label: '产品', category: '产品', properties: 11, relations: 3, instances: 85 },
  { id: 'QualityInspection', label: '质检记录', category: '质量', properties: 7, relations: 2, instances: 85000 },
];

const RELATIONS = [
  { id: 'contains', name: '包含', source: 'Factory', target: 'Workshop', count: 5 },
  { id: 'produces', name: '生产', source: 'ProductionLine', target: 'Product', count: 1250 },
  { id: 'consumes', name: '消耗', source: 'WorkOrder', target: 'Material', count: 8900 },
  { id: 'supplies', name: '供应', source: 'Supplier', target: 'Material', count: 320 },
  { id: 'inspects', name: '检验', source: 'QualityInspection', target: 'Product', count: 85000 },
  { id: 'generates', name: '产生', source: 'Device', target: 'Telemetry', count: 1200000 },
];

const ONTOLOGY_TTL = `@prefix : <http://example.org/manufacturing#> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix xml: <http://www.w3.org/XML/1998/namespace> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .

<http://example.org/manufacturing> rdf:type owl:Ontology ;
                                      rdfs:label "锂电池制造领域本体"@zh ;
                                      owl:versionInfo "1.0.0" .

### 制造类定义
:ProductionLine rdf:type owl:Class ;
                rdfs:label "产线"@zh ;
                rdfs:comment "生产车间中的一条生产线"@zh .

:Device rdf:type owl:Class ;
        rdfs:label "设备"@zh ;
        rdfs:comment "制造设备，如涂布机、辊压机等"@zh .

:WorkOrder rdf:type owl:Class ;
           rdfs:label "工单"@zh ;
           rdfs:comment "生产任务工单"@zh .

### 销售类定义
:SalesOrder rdf:type owl:Class ;
            rdfs:label "销售订单"@zh ;
            rdfs:comment "客户销售订单"@zh .

:Customer rdf:type owl:Class ;
          rdfs:label "客户"@zh .

### 供应链类定义
:Supplier rdf:type owl:Class ;
          rdfs:label "供应商"@zh .

:Material rdf:type owl:Class ;
          rdfs:label "物料"@zh .

### 关系定义
:contains rdf:type owl:ObjectProperty ;
          rdfs:domain :Factory ;
          rdfs:range :Workshop ;
          rdfs:label "包含"@zh .

:produces rdf:type owl:ObjectProperty ;
          rdfs:domain :ProductionLine ;
          rdfs:range :Product ;
          rdfs:label "生产"@zh .`;

const SCHEMA_JSON = `{
  "ontology": {
    "name": "锂电池制造领域本体",
    "version": "1.0.0",
    "namespace": "http://example.org/manufacturing"
  },
  "classes": [
    {
      "id": "ProductionLine",
      "label": "产线",
      "category": "制造",
      "properties": [
        { "name": "line_code", "type": "string", "required": true },
        { "name": "capacity_per_hour", "type": "integer" },
        { "name": "current_status", "type": "enum", "values": ["running", "stopped", "maintenance"] }
      ]
    },
    {
      "id": "Device",
      "label": "设备",
      "category": "制造",
      "properties": [
        { "name": "device_code", "type": "string", "required": true },
        { "name": "device_type", "type": "string" },
        { "name": "installation_date", "type": "date" }
      ]
    },
    {
      "id": "WorkOrder",
      "label": "工单",
      "category": "生产",
      "properties": [
        { "name": "wo_number", "type": "string", "required": true },
        { "name": "planned_qty", "type": "integer" },
        { "name": "actual_qty", "type": "integer" }
      ]
    }
  ],
  "relations": [
    {
      "id": "contains",
      "name": "包含",
      "domain": "Factory",
      "range": "Workshop"
    },
    {
      "id": "produces",
      "name": "生产",
      "domain": "ProductionLine",
      "range": "Product"
    }
  ]
}`;

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

// Ontology Detail Component
function OntologyDetail({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'ttl' | 'schema' | 'classes' | 'relations'>('ttl');

  const tabs = [
    { id: 'ttl', label: 'ontology.ttl', icon: FileText },
    { id: 'schema', label: 'schema.json', icon: Code },
    { id: 'classes', label: `classes (${ONTOLOGY_CLASSES.length})`, icon: Box },
    { id: 'relations', label: `relations (${RELATIONS.length})`, icon: Network },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Header */}
      <header className="border-b border-slate-200">
        {/* Breadcrumb */}
        <div className="px-4 py-2 border-b border-slate-100 flex items-center gap-2 text-sm text-slate-600">
          <Database size={14} className="text-slate-400" />
          <span className="hover:text-slate-900 cursor-pointer">本体与语义建模</span>
          <ChevronRight size={14} className="text-slate-300" />
          <span className="font-medium text-slate-900">锂电池制造领域本体</span>
        </div>

        {/* Title Row */}
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-800 text-white flex items-center justify-center">
                <Database size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">锂电池制造领域本体</h1>
                <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                  <span className="font-mono">manufacturing-ontology</span>
                  <span>•</span>
                  <span>v1.0.0</span>
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
            <span className="font-medium text-slate-900">manufacturing-ontology</span>
            <span className="text-slate-400">/</span>
            <span>
              {activeTab === 'ttl' && 'ontology.ttl'}
              {activeTab === 'schema' && 'schema.json'}
              {activeTab === 'classes' && 'classes/'}
              {activeTab === 'relations' && 'relations/'}
            </span>
          </div>

          {/* TTL Tab */}
          {activeTab === 'ttl' && (
            <div className="bg-white border border-t-0 border-slate-200 rounded-b-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200">
                <span className="text-sm font-medium text-slate-700">ontology.ttl</span>
                <span className="text-xs text-slate-500">Turtle</span>
              </div>
              <CodeBlock code={ONTOLOGY_TTL} language="turtle" />
            </div>
          )}

          {/* Schema Tab */}
          {activeTab === 'schema' && (
            <div className="bg-white border border-t-0 border-slate-200 rounded-b-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200">
                <span className="text-sm font-medium text-slate-700">schema.json</span>
                <span className="text-xs text-slate-500">JSON</span>
              </div>
              <CodeBlock code={SCHEMA_JSON} language="json" />
            </div>
          )}

          {/* Classes Tab */}
          {activeTab === 'classes' && (
            <div className="bg-white border border-t-0 border-slate-200 rounded-b-lg">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">类名</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">标签</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">分类</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">属性数</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">关系数</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">实例数</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ONTOLOGY_CLASSES.map((cls) => (
                    <tr key={cls.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Box size={16} className="text-slate-500" />
                          <span className="font-mono text-sky-600">{cls.id}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-900">{cls.label}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs">{cls.category}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{cls.properties}</td>
                      <td className="px-4 py-3 text-slate-600">{cls.relations}</td>
                      <td className="px-4 py-3 text-slate-600">{cls.instances.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Relations Tab */}
          {activeTab === 'relations' && (
            <div className="bg-white border border-t-0 border-slate-200 rounded-b-lg">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">关系名</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">标签</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">域 (Domain)</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">范围 (Range)</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">实例数</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {RELATIONS.map((rel) => (
                    <tr key={rel.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <GitBranch size={16} className="text-slate-500" />
                          <span className="font-mono text-sky-600">{rel.id}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-900">{rel.name}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs">{rel.source}</span>
                      </td>
                      <td className="px-4 py-3">
                        <ArrowRight size={14} className="inline text-slate-400 mx-2" />
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs">{rel.target}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{rel.count.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Main Component
export default function OntologyModeling() {
  const [dataSources] = useState(DATA_SOURCES);
  const [showDetail, setShowDetail] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSources = dataSources.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <header className="border-b border-slate-200">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 text-sm text-slate-600">
          <Database size={16} className="text-slate-400" />
          <span className="font-medium text-slate-900">Ontology Modeling</span>
        </div>

        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-800 text-white flex items-center justify-center">
                <Database size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">本体与语义建模</h1>
                <p className="text-sm text-slate-500">数据源映射与本体定义管理</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDetail(true)}
                className="flex items-center gap-2 px-3 py-2 border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50"
              >
                <Layers size={14} />
                查看本体定义
              </button>
              <button className="flex items-center gap-2 px-3 py-2 bg-slate-800 text-white text-sm font-medium hover:bg-slate-700">
                <Plus size={14} />
                添加数据源
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
              <div className="text-sm text-slate-500">数据源</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">4</div>
            </div>
            <div className="bg-white p-4 border border-slate-200">
              <div className="text-sm text-slate-500">已识别实体</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">44</div>
            </div>
            <div className="bg-white p-4 border border-slate-200">
              <div className="text-sm text-slate-500">本体类</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">8</div>
            </div>
            <div className="bg-white p-4 border border-slate-200">
              <div className="text-sm text-slate-500">关系定义</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">6</div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="搜索数据源..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-64 bg-white border border-slate-200 text-sm focus:outline-none focus:border-slate-400 rounded"
              />
            </div>
          </div>

          {/* Data Source List */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">数据源名称</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">类型</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">表数量</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">识别实体</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">状态</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">最后同步</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSources.map((source) => (
                  <tr key={source.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Server size={18} className="text-slate-500" />
                        <div>
                          <div className="font-medium text-sky-600 hover:underline cursor-pointer">
                            {source.name}
                          </div>
                          <div className="text-xs text-slate-500 font-mono">{source.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-mono">
                        {source.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{source.tables}</td>
                    <td className="px-4 py-3 text-slate-600">{source.recognizedEntities}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "flex items-center gap-1.5 text-xs",
                        source.status === 'connected' ? "text-emerald-600" : "text-rose-600"
                      )}>
                        <span className={cn(
                          "w-2 h-2 rounded-full",
                          source.status === 'connected' ? "bg-emerald-500" : "bg-rose-500"
                        )} />
                        {source.status === 'connected' ? '已连接' : '断开'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{source.lastSync}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Box size={16} className="text-slate-500" />
                本体类分布
              </h3>
              <div className="space-y-3">
                {['制造', '生产', '销售', '供应链', '产品', '质量'].map((cat) => (
                  <div key={cat} className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">{cat}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-slate-100">
                        <div
                          className="h-full bg-slate-600"
                          style={{ width: `${Math.random() * 60 + 40}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 w-8">
                        {Math.floor(Math.random() * 10 + 2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Network size={16} className="text-slate-500" />
                关系拓扑概览
              </h3>
              <div className="text-sm text-slate-600 space-y-2">
                <p>包含关系: 5</p>
                <p>生产关系: 1,250</p>
                <p>消耗关系: 8,900</p>
                <p>供应关系: 320</p>
                <p className="pt-2 border-t border-slate-100 mt-2">
                  <button
                    onClick={() => setShowDetail(true)}
                    className="text-sky-600 hover:text-sky-700"
                  >
                    查看完整图谱 →
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ontology Detail Modal */}
      {showDetail && <OntologyDetail onClose={() => setShowDetail(false)} />}
    </div>
  );
}
