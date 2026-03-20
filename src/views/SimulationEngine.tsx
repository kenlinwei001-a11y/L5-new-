import { useState } from 'react';
import { FlaskConical, Play, BarChart3, Settings2, ArrowRight, TrendingUp, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';

const scenarios = [
  { id: 'sim1', name: '产能提升推演', type: '业务模型', status: 'ready' },
  { id: 'sim2', name: '设备故障影响仿真', type: '物理模型', status: 'running' },
  { id: 'sim3', name: '排产优化 (多目标)', type: '强化学习', status: 'completed' },
];

const scenarioDetails: Record<string, any> = {
  sim1: {
    variables: [
      { name: '订单量', change: '+10%', icon: TrendingUp, colorClass: 'text-emerald-600' },
      { name: '设备温度', change: '-5%', icon: ArrowRight, colorClass: 'text-blue-600', iconClass: 'rotate-45' }
    ],
    objectives: [
      { name: 'Max: 利润 + 交付率', weight: '0.7' },
      { name: 'Min: 成本 + 碳排', weight: '0.3' }
    ],
    results: `{
  "scenario": "产能提升",
  "options": [
    {
      "plan": "增加班次",
      "profit": 120000,
      "risk": 0.2,
      "recommendation": "最优方案"
    },
    {
      "plan": "外包生产",
      "profit": 85000,
      "risk": 0.05,
      "recommendation": "备选方案"
    }
  ]
}`,
    suggestion: '基于当前状态和强化学习模型推演，建议采用 "增加班次" 方案。该方案在满足订单增加10%的前提下，预期利润最大化，且风险在可控范围内 (0.2)。'
  },
  sim2: {
    variables: [
      { name: '主轴转速', change: '+15%', icon: TrendingUp, colorClass: 'text-emerald-600' },
      { name: '润滑油压', change: '-20%', icon: ArrowRight, colorClass: 'text-orange-600', iconClass: 'rotate-45' }
    ],
    objectives: [
      { name: 'Max: 设备稼动率', weight: '0.8' },
      { name: 'Min: 故障停机时间', weight: '0.2' }
    ],
    results: `{
  "scenario": "设备故障影响",
  "options": [
    {
      "plan": "预防性维护",
      "downtime": "2小时",
      "cost": 5000,
      "recommendation": "最优方案"
    },
    {
      "plan": "事后维修",
      "downtime": "12小时",
      "cost": 35000,
      "recommendation": "高风险方案"
    }
  ]
}`,
    suggestion: '物理模型仿真显示，若不干预，设备将在48小时内发生主轴故障。强烈建议立即执行 "预防性维护" 方案，可避免高昂的事后维修成本及长时间停机。'
  },
  sim3: {
    variables: [
      { name: '紧急插单', change: '+3单', icon: TrendingUp, colorClass: 'text-emerald-600' },
      { name: '可用人员', change: '-2人', icon: ArrowRight, colorClass: 'text-orange-600', iconClass: 'rotate-45' }
    ],
    objectives: [
      { name: 'Max: 准时交付率 (OTD)', weight: '0.6' },
      { name: 'Min: 换线时间', weight: '0.4' }
    ],
    results: `{
  "scenario": "排产优化",
  "options": [
    {
      "plan": "动态重排产",
      "otd": "98.5%",
      "changeover": "45分钟",
      "recommendation": "最优方案"
    },
    {
      "plan": "按原计划执行",
      "otd": "82.0%",
      "changeover": "30分钟",
      "recommendation": "延期风险高"
    }
  ]
}`,
    suggestion: '强化学习智能体通过多目标寻优，生成了 "动态重排产" 方案。该方案能有效吸收紧急插单冲击，保障98.5%的准时交付率，换线时间增加在可接受范围内。'
  }
};

export default function SimulationEngine() {
  const [selectedSim, setSelectedSim] = useState('sim1');
  const currentDetails = scenarioDetails[selectedSim];

  return (
    <div className="h-full flex flex-col gap-6">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">仿真推演系统</h2>
          <p className="text-sm text-gray-500 mt-1">What-if 场景模拟与多目标优化</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg flex items-center gap-2 transition-colors text-sm shadow-sm">
            <FlaskConical size={16} />
            新建仿真任务
          </button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        {/* Left Pane: Scenario List */}
        <div className="col-span-3 flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50/50">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">仿真场景列表</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {scenarios.map((sim) => (
              <button
                key={sim.id}
                onClick={() => setSelectedSim(sim.id)}
                className={cn(
                  "w-full text-left p-4 rounded-lg border transition-all duration-200",
                  selectedSim === sim.id
                    ? "bg-gray-50 border-gray-300 ring-1 ring-gray-200 shadow-sm"
                    : "bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50/50"
                )}
              >
                <div className="font-medium text-gray-900 text-sm mb-1">{sim.name}</div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-gray-500 font-mono">{sim.type}</span>
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border",
                    sim.status === 'ready' ? "bg-blue-50 text-blue-700 border-blue-200" :
                    sim.status === 'running' ? "bg-orange-50 text-orange-700 border-orange-200 animate-pulse" :
                    "bg-emerald-50 text-emerald-700 border-emerald-200"
                  )}>
                    {sim.status === 'ready' ? '准备就绪' : sim.status === 'running' ? '运行中' : '已完成'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Pane: Simulation Details */}
        <div className="col-span-9 flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden relative">
          <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center z-10">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">What-if 机制配置</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-300 flex items-center gap-2 transition-colors text-xs shadow-sm">
                <Settings2 size={14} />
                参数设置
              </button>
              <button className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg flex items-center gap-2 transition-colors text-xs shadow-sm">
                <Play size={14} />
                运行仿真
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 z-10">
            <div className="max-w-4xl mx-auto space-y-8">
              
              {/* Variable Changes */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900 mb-4 flex items-center gap-2">
                    <Settings2 size={16} className="text-blue-600" />
                    改变变量
                  </h4>
                  <div className="space-y-4 font-mono text-sm">
                    {currentDetails.variables.map((v: any, idx: number) => {
                      const Icon = v.icon;
                      return (
                        <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded border border-gray-200">
                          <span className="text-gray-700">{v.name}</span>
                          <div className={cn("flex items-center gap-2 font-medium", v.colorClass)}>
                            <Icon size={14} className={v.iconClass} />
                            <span>{v.change}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart3 size={16} className="text-purple-600" />
                    多目标优化
                  </h4>
                  <div className="space-y-4 font-mono text-sm">
                    {currentDetails.objectives.map((obj: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded border border-gray-200">
                        <span className="text-gray-700">{obj.name}</span>
                        <span className="text-purple-600 font-bold">权重: {obj.weight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Simulation Results */}
              <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900 mb-6 flex items-center gap-2">
                  <FlaskConical size={16} className="text-blue-600" />
                  推演结果评估
                </h4>
                
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden font-mono text-sm shadow-sm">
                  <div className="flex bg-gray-50 border-b border-gray-200 text-xs text-gray-500">
                    <div className="px-4 py-2 border-r border-gray-200 bg-white text-gray-900 font-medium">output.json</div>
                  </div>
                  <div className="p-4 text-gray-800 bg-gray-50/30">
                    <pre className="text-blue-700">
{currentDetails.results}
                    </pre>
                  </div>
                </div>

                <div className="mt-6 flex items-start gap-4 bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <AlertTriangle className="text-orange-600 shrink-0 mt-0.5" size={16} />
                  <div>
                    <div className="text-sm font-medium text-orange-900 mb-1">系统建议</div>
                    <div className="text-xs text-orange-800 leading-relaxed">
                      {currentDetails.suggestion}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
