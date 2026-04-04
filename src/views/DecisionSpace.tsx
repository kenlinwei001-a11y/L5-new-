import { useState } from 'react';
import { AlertTriangle, ArrowRight, CheckCircle2, Play, Activity, Thermometer, Zap, BrainCircuit, Network, Globe } from 'lucide-react';
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

const decisionDetails: Record<string, any> = {
  'AN-001': {
    reasoning: [
      { type: 'anomaly', icon: Thermometer, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200', text: '异常：设备温度异常升高 (92°C)' },
      { type: 'relation', icon: ArrowRight, color: 'text-gray-600', border: 'border-gray-300', text: '关联对象：设备A / 影响工单 ORD-2026-101 (客户: 宁德时代)' },
      { type: 'metric', icon: ArrowRight, color: 'text-gray-600', border: 'border-gray-300', text: '关键指标：良率预计下降 5%，交期延迟风险增加 30%' },
      { type: 'reasoning', icon: BrainCircuit, color: 'text-blue-600', border: 'border-blue-300', text: '因果推理：温度升高导致焊接稳定性下降，进而影响电池包密封性。' },
      { type: 'impact', icon: Globe, color: 'text-purple-600', border: 'border-purple-300', text: '全局影响：排产调整将导致后续 3 个订单顺延，需紧急采购 500kg 冷却液。' },
      { type: 'decision', icon: Zap, color: 'text-emerald-600', border: 'border-emerald-300', text: '决策建议：降低功率 10% + 转移 20% 负载至 EQ-002 + 触发紧急采购 + 自动通知受影响客户。' }
    ],
    execution: {
      title: '多系统协同执行方案',
      actions: [
        '调用 MES: 降低 EQ-001 焊接功率 10%，将 20% 负载转移至 EQ-002',
        '调用 ERP/APS: 重新计算排产，顺延 ORD-2026-102, 103, 104',
        '调用 SRM: 自动生成 500kg 冷却液紧急采购单',
        '调用 CRM: 生成客户延期预警通知草稿'
      ],
      risk: '中风险 (85% 置信度)',
      riskColor: 'text-orange-600'
    }
  },
  'AN-002': {
    reasoning: [
      { type: 'anomaly', icon: Activity, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200', text: '异常：涂布机负载异常波动 (0.85)' },
      { type: 'relation', icon: ArrowRight, color: 'text-gray-600', border: 'border-gray-300', text: '关联对象：设备 EQ-045 / 影响批次 BAT-Y-20260318' },
      { type: 'metric', icon: ArrowRight, color: 'text-gray-600', border: 'border-gray-300', text: '关键指标：涂布厚度均匀性下降，废品率上升 2%' },
      { type: 'reasoning', icon: BrainCircuit, color: 'text-blue-600', border: 'border-blue-300', text: '因果推理：浆料粘度变化导致泵送阻力不稳，引起负载波动。' },
      { type: 'impact', icon: Globe, color: 'text-purple-600', border: 'border-purple-300', text: '全局影响：废品率上升将导致当前批次物料消耗增加，可能引发后续批次缺料。' },
      { type: 'decision', icon: Zap, color: 'text-emerald-600', border: 'border-emerald-300', text: '决策建议：微调泵送压力 + 增加在线测厚频次 + 预警物料消耗。' }
    ],
    execution: {
      title: '质量控制与设备调整',
      actions: [
        '调用 SCADA: 微调 EQ-045 供料泵压力参数 (-5%)',
        '调用 QMS: 将在线测厚仪采样频次从 1次/分钟 提升至 3次/分钟',
        '调用 WMS: 锁定额外 5% 的正极材料作为当前批次备用'
      ],
      risk: '低风险 (92% 置信度)',
      riskColor: 'text-emerald-600'
    }
  }
};

export default function DecisionSpace() {
  const [selectedId, setSelectedId] = useState('AN-001');
  const selected = anomalies.find(a => a.id === selectedId);
  const details = decisionDetails[selectedId];

  return (
    <div className="h-full flex flex-col gap-6">
      <header>
        <h2 className="text-xl font-bold text-gray-900">决策空间</h2>
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
                    {details.reasoning.map((step: any, index: number) => {
                      const Icon = step.icon;
                      const isLast = index === details.reasoning.length - 1;
                      return (
                        <div key={index} className={cn("flex items-center gap-3 mb-3", index > 0 ? "pl-4 border-l ml-2" : "", step.border)}>
                          <Icon size={16} className={step.color} />
                          <span className={cn(index === 0 ? "text-gray-700" : index === details.reasoning.length - 1 ? step.color : "text-gray-600")}>{step.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Recommended Action */}
                <section>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">执行动作</h4>
                  <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="text-gray-900 font-semibold mb-2">{details.execution.title}</h5>
                        <ul className="space-y-2 text-sm text-gray-600 font-mono">
                          {details.execution.actions.map((action: string, index: number) => (
                            <li key={index}>• {action}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">风险评估</div>
                        <div className={cn("font-mono text-sm font-medium", details.execution.riskColor)}>{details.execution.risk}</div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex gap-3">
                      <button className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm">
                        <Play size={16} />
                        自动执行
                      </button>
                      <button className="px-6 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-lg border border-gray-300 transition-colors shadow-sm">
                        人工干预
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
