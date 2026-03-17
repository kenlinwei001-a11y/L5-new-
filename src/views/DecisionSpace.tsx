import { useState } from 'react';
import { AlertTriangle, ArrowRight, CheckCircle2, Play, Activity, Thermometer, Zap, BrainCircuit } from 'lucide-react';
import { cn } from '../lib/utils';

const anomalies = [
  {
    id: 'AN-001',
    equipment: 'EQ-001 (激光焊接机)',
    issue: '温度异常',
    value: '92°C',
    threshold: '> 90°C',
    time: '14:23:05',
    status: 'active',
    severity: '高风险'
  },
  {
    id: 'AN-002',
    equipment: 'EQ-045 (涂布机)',
    issue: '负载波动',
    value: '0.85',
    threshold: '> 0.80',
    time: '14:15:22',
    status: 'investigating',
    severity: '中风险'
  }
];

export default function DecisionSpace() {
  const [selectedId, setSelectedId] = useState('AN-001');
  const selected = anomalies.find(a => a.id === selectedId);

  return (
    <div className="h-full flex flex-col gap-6">
      <header>
        <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">决策空间 (Decision Space)</h2>
        <p className="text-sm text-gray-500 mt-1">智能体驱动的异常处理与执行</p>
      </header>

      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        {/* Left Pane: Anomaly List */}
        <div className="col-span-4 flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50/50">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">当前异常事件</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {anomalies.map((anomaly) => (
              <button
                key={anomaly.id}
                onClick={() => setSelectedId(anomaly.id)}
                className={cn(
                  "w-full text-left p-4 rounded-lg border transition-all duration-200",
                  selectedId === anomaly.id
                    ? "bg-gray-50 border-gray-300 ring-1 ring-gray-200 shadow-sm"
                    : "bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50/50"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-xs font-medium text-gray-900">{anomaly.id}</span>
                  <span className="font-mono text-[10px] text-gray-500">{anomaly.time}</span>
                </div>
                <div className="font-medium text-gray-900 text-sm mb-1">{anomaly.issue}</div>
                <div className="text-xs text-gray-500">{anomaly.equipment}</div>
                <div className="mt-3 flex items-center gap-2">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border",
                    anomaly.severity === '高风险' ? "bg-red-50 text-red-700 border-red-200" : "bg-orange-50 text-orange-700 border-orange-200"
                  )}>
                    {anomaly.severity}
                  </span>
                  <span className="font-mono text-xs text-gray-500">当前值: {anomaly.value}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Pane: Decision Details */}
        <div className="col-span-8 flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {selected ? (
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex justify-between items-start bg-gray-50/50">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle className="text-red-500" size={20} />
                    <h3 className="text-lg font-semibold text-gray-900">{selected.issue}</h3>
                  </div>
                  <p className="text-sm text-gray-500 font-mono">{selected.equipment} | 当前值: {selected.value} (阈值: {selected.threshold})</p>
                </div>
                <div className="px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-medium flex items-center gap-2">
                  <Activity size={14} />
                  Agent 推理中
                </div>
              </div>

              <div className="p-6 space-y-8">
                {/* Reasoning Path */}
                <section>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">推理路径</h4>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 font-mono text-sm">
                    <div className="flex items-center gap-3 text-gray-700 mb-3">
                      <Thermometer size={16} className="text-red-500" />
                      <span>异常：设备温度异常升高</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 mb-3 pl-4 border-l border-gray-300 ml-2">
                      <ArrowRight size={14} />
                      <span>关联对象：设备A / 工单123</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 mb-3 pl-4 border-l border-gray-300 ml-2">
                      <ArrowRight size={14} />
                      <span>关键指标：良率下降5%</span>
                    </div>
                    <div className="flex items-center gap-3 text-blue-600 mb-3 pl-4 border-l border-blue-300 ml-2">
                      <BrainCircuit size={16} />
                      <span>因果推理：温度升高影响焊接稳定性</span>
                    </div>
                    <div className="flex items-center gap-3 text-emerald-600 pl-4 border-l border-emerald-300 ml-2">
                      <Zap size={16} />
                      <span>决策建议：降低功率 + 排产调整</span>
                    </div>
                  </div>
                </section>

                {/* Recommended Action */}
                <section>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">执行动作</h4>
                  <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="text-gray-900 font-semibold mb-2">调用MES修改参数</h5>
                        <ul className="space-y-2 text-sm text-gray-600 font-mono">
                          <li>• 目标对象: EQ-001</li>
                          <li>• 执行动作: 降低焊接功率 10%</li>
                          <li>• 联动动作: 将 20% 负载转移至 EQ-002</li>
                        </ul>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">风险评估</div>
                        <div className="text-emerald-600 font-mono text-sm font-medium">低风险 (98% 置信度)</div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex gap-3">
                      <button className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm">
                        <Play size={16} />
                        自动执行
                      </button>
                      <button className="px-6 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-lg border border-gray-300 transition-colors shadow-sm">
                        人工干预 (Override)
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
              请选择一个异常事件查看详情
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
