import { BrainCircuit, AlertTriangle, Link, Activity, GitCommit, Play } from 'lucide-react';
import { cn } from '../lib/utils';

const steps = [
  { id: '1', type: '异常', label: '设备温度异常升高', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  { id: '2', type: '关联对象', label: '设备A / 工单123', icon: Link, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' },
  { id: '3', type: '关键指标', label: '良率下降 5%', icon: Activity, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  { id: '4', type: '推理路径', label: '温度升高影响焊接稳定性', icon: BrainCircuit, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  { id: '5', type: '决策建议', label: '降低功率 + 排产调整', icon: GitCommit, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  { id: '6', type: '执行动作', label: '调用MES修改参数', icon: Play, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
];

export default function ReasoningGraph() {
  return (
    <div className="h-full flex flex-col gap-6">
      <header>
        <h2 className="text-xl font-bold text-gray-900">推理图谱 (Reasoning Graph)</h2>
        <p className="text-sm text-gray-500 mt-1">异常 → 关联对象 → 关键指标 → 推理路径 → 决策建议 → 执行动作</p>
      </header>

      <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm p-8 overflow-y-auto relative">
        <div className="max-w-3xl mx-auto relative">
          {/* Vertical Line */}
          <div className="absolute left-[39px] top-8 bottom-8 w-px bg-gray-200" />

          <div className="space-y-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="relative flex items-start gap-8 group">
                  {/* Node */}
                  <div className={cn(
                    "w-20 h-20 rounded-2xl flex items-center justify-center border relative z-10 transition-transform duration-300 group-hover:scale-110 shadow-sm",
                    step.bg, step.border, step.color
                  )}>
                    <Icon size={32} />
                  </div>

                  {/* Content Card */}
                  <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm p-6 transition-colors duration-300 hover:border-gray-300">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{step.type}</span>
                      <span className="font-mono text-[10px] text-gray-400">步骤 0{index + 1}</span>
                    </div>
                    <h3 className={cn("text-lg font-semibold mb-4", step.color)}>{step.label}</h3>
                    
                    {/* Mock Evidence/Details */}
                    <div className="bg-gray-50 rounded-lg p-4 font-mono text-xs text-gray-600 border border-gray-200">
                      <div className="flex justify-between mb-2 pb-2 border-b border-gray-200">
                        <span>置信度 (Confidence):</span>
                        <span className="text-emerald-600 font-medium">9{Math.floor(Math.random() * 9)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>执行耗时:</span>
                        <span>{Math.floor(Math.random() * 150) + 50}ms</span>
                      </div>
                      {step.type === '推理路径' && (
                        <div className="mt-4 pt-4 border-t border-gray-200 text-blue-600">
                          &gt; 分析历史数据...<br/>
                          &gt; 过去30天内发现 12 个相似案例。<br/>
                          &gt; 因果相关系数: 0.89
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
