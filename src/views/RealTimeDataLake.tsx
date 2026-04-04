import React, { useState } from 'react';
import { 
  Table, 
  FileJson, 
  LineChart, 
  Search, 
  Filter, 
  Download, 
  Database
} from 'lucide-react';
import { cn } from '../lib/utils';

const MOCK_TABLES = [
  { id: 'TBL-001', name: 'raw_cnc_telemetry', type: 'Stream', rows: '1.2B', size: '4.5TB', quality: '98.5%' },
  { id: 'TBL-002', name: 'dim_equipment', type: 'Batch', rows: '1,248', size: '2.1MB', quality: '100%' },
  { id: 'TBL-003', name: 'fact_work_orders', type: 'Batch', rows: '450K', size: '1.2GB', quality: '99.2%' },
  { id: 'TBL-004', name: 'agg_hourly_oee', type: 'Materialized View', rows: '8.5K', size: '45MB', quality: '100%' },
];

const MOCK_DATA = [
  { timestamp: '2023-10-27 10:23:45.123', device_id: 'DEV-CNC-001', spindle_speed: 12000, temperature: 45.2, status: 'RUNNING' },
  { timestamp: '2023-10-27 10:23:46.124', device_id: 'DEV-CNC-001', spindle_speed: 12005, temperature: 45.3, status: 'RUNNING' },
  { timestamp: '2023-10-27 10:23:47.125', device_id: 'DEV-CNC-001', spindle_speed: 11995, temperature: 45.3, status: 'RUNNING' },
  { timestamp: '2023-10-27 10:23:48.126', device_id: 'DEV-CNC-001', spindle_speed: 12010, temperature: 45.4, status: 'RUNNING' },
  { timestamp: '2023-10-27 10:23:49.127', device_id: 'DEV-CNC-001', spindle_speed: 12000, temperature: 45.4, status: 'RUNNING' },
];

export default function RealTimeDataLake() {
  const [activeMenu, setActiveMenu] = useState('browser');
  const [selectedTable, setSelectedTable] = useState(MOCK_TABLES[0]);

  const renderBrowser = () => (
    <div className="flex h-full overflow-hidden">
      {/* Table List */}
      <div className="w-1/4 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="搜索数据表..." 
              className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {MOCK_TABLES.map(table => (
            <button
              key={table.id}
              onClick={() => setSelectedTable(table)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex flex-col gap-1",
                selectedTable.id === table.id ? "bg-indigo-50 border border-indigo-100" : "hover:bg-gray-50 border border-transparent"
              )}
            >
              <div className="font-medium text-gray-900 flex items-center gap-2">
                <Database size={14} className="text-gray-500" />
                {table.name}
              </div>
              <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                <span>{table.type}</span>
                <span>{table.rows} rows</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Data Viewer Panel */}
      <div className="flex-1 bg-gray-50 p-6 overflow-y-auto flex flex-col gap-6">
        {/* Table Meta */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{selectedTable.name}</h3>
            <div className="flex gap-4 mt-1 text-sm text-gray-500 font-mono">
              <span>Type: {selectedTable.type}</span>
              <span>Size: {selectedTable.size}</span>
              <span className="flex items-center gap-1">
                Quality: <span className={cn(
                  "font-semibold", 
                  parseFloat(selectedTable.quality) > 99 ? "text-emerald-600" : "text-amber-500"
                )}>{selectedTable.quality}</span>
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 flex items-center gap-1">
              <Filter size={14} /> 过滤
            </button>
            <button className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 flex items-center gap-1">
              <Download size={14} /> 导出
            </button>
          </div>
        </div>

        {/* Data Grid */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex-1 overflow-hidden flex flex-col">
          <div className="p-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">数据预览 (Top 100)</span>
            <span className="text-xs text-gray-500 font-mono">Auto-refresh: ON</span>
          </div>
          <div className="overflow-auto flex-1">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 sticky top-0 border-b border-gray-200 text-xs text-gray-500">
                <tr>
                  {Object.keys(MOCK_DATA[0]).map(key => (
                    <th key={key} className="px-4 py-2 font-medium">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-mono text-xs">
                {MOCK_DATA.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    {Object.values(row).map((val, j) => (
                      <td key={j} className="px-4 py-2 text-gray-600">
                        {typeof val === 'number' ? val.toFixed(1) : val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMetadata = () => (
    <div className="p-6 h-full overflow-y-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">元数据管理 (Metadata)</h2>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium">
            生成 Agent Schema
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">表结构: {selectedTable.name}</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">字段名</th>
              <th className="px-4 py-3 font-medium">数据类型</th>
              <th className="px-4 py-3 font-medium">描述</th>
              <th className="px-4 py-3 font-medium">单位</th>
              <th className="px-4 py-3 font-medium">可用性</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-3 font-mono text-xs text-gray-900">timestamp</td>
              <td className="px-4 py-3 text-blue-600 font-mono text-xs">TIMESTAMP</td>
              <td className="px-4 py-3 text-gray-600">数据采集时间</td>
              <td className="px-4 py-3 text-gray-500">-</td>
              <td className="px-4 py-3"><span className="text-emerald-600 text-xs font-medium">High</span></td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-3 font-mono text-xs text-gray-900">device_id</td>
              <td className="px-4 py-3 text-blue-600 font-mono text-xs">VARCHAR(50)</td>
              <td className="px-4 py-3 text-gray-600">设备唯一标识</td>
              <td className="px-4 py-3 text-gray-500">-</td>
              <td className="px-4 py-3"><span className="text-emerald-600 text-xs font-medium">High</span></td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-3 font-mono text-xs text-gray-900">spindle_speed</td>
              <td className="px-4 py-3 text-blue-600 font-mono text-xs">DOUBLE</td>
              <td className="px-4 py-3 text-gray-600">主轴转速</td>
              <td className="px-4 py-3 text-gray-500">RPM</td>
              <td className="px-4 py-3"><span className="text-emerald-600 text-xs font-medium">High</span></td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-3 font-mono text-xs text-gray-900">temperature</td>
              <td className="px-4 py-3 text-blue-600 font-mono text-xs">DOUBLE</td>
              <td className="px-4 py-3 text-gray-600">设备温度</td>
              <td className="px-4 py-3 text-gray-500">°C</td>
              <td className="px-4 py-3"><span className="text-amber-500 text-xs font-medium">Medium (2% Nulls)</span></td>
            </tr>
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
          <h2 className="text-base font-semibold text-gray-900">实时数据湖</h2>
        </div>
        <nav className="p-2 space-y-1">
          <button
            onClick={() => setActiveMenu('browser')}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
              activeMenu === 'browser' ? "bg-indigo-50 text-indigo-600 font-medium" : "text-gray-600 hover:bg-gray-50"
            )}
          >
            <Table size={16} />
            数据浏览器
          </button>
          <button
            onClick={() => setActiveMenu('metadata')}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
              activeMenu === 'metadata' ? "bg-indigo-50 text-indigo-600 font-medium" : "text-gray-600 hover:bg-gray-50"
            )}
          >
            <FileJson size={16} />
            元数据管理
          </button>
          <button
            onClick={() => setActiveMenu('mapping')}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
              activeMenu === 'mapping' ? "bg-indigo-50 text-indigo-600 font-medium" : "text-gray-600 hover:bg-gray-50"
            )}
          >
            <LineChart size={16} />
            指标映射与趋势
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {activeMenu === 'browser' && renderBrowser()}
        {activeMenu === 'metadata' && renderMetadata()}
        {activeMenu === 'mapping' && (
          <div className="p-6 flex items-center justify-center h-full text-gray-500">
            指标映射与趋势模块开发中...
          </div>
        )}
      </div>
    </div>
  );
}
