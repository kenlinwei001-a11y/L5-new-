import { useState } from 'react';
import { FlaskConical, Play, Save, Settings, BarChart3, TrendingUp, TrendingDown, ArrowRight, Activity, Zap, Layers, Cpu, CheckCircle2, Plus } from 'lucide-react';
import { cn } from '../lib/utils';

const scenariosData: Record<string, any> = {
  'baseline': {
    id: 'baseline',
    name: '当前基线',
    status: 'active',
    power: 4.0,
    powerDiff: '0%',
    speed: 1.0,
    speedDiff: '0%',
    scheduling: '标准',
    buffer: '标准',
    metrics: [
      { label: '预计产能 (件/小时)', value: 450, unit: '' },
      { label: '能耗 (千瓦时/吨)', value: 124, unit: '' },
      { label: '良率预测 (%)', value: 99.1, unit: '%' },
      { label: '设备损耗风险', value: '低', unit: '' },
    ],
    recommendation: '当前生产状态稳定，各项指标处于正常区间。',
    confidence: '0.95',
    conclusion: '建议保持当前状态。'
  },
  'sc-1': {
    id: 'sc-1',
    name: '方案 A: 激进提产',
    status: 'simulated',
    power: 4.5,
    powerDiff: '+12.5%',
    speed: 1.2,
    speedDiff: '+20%',
    scheduling: '吞吐量最大化',
    buffer: '-10% (精益模式)',
    metrics: [
      { label: '预计产能 (件/小时)', value: 520, unit: '' },
      { label: '能耗 (千瓦时/吨)', value: 145, unit: '' },
      { label: '良率预测 (%)', value: 97.5, unit: '%' },
      { label: '设备损耗风险', value: '高', unit: '' },
    ],
    recommendation: '方案 A (激进提产) 预计可提升 15.5% 产能，但会导致能耗增加 16.9% 且设备损耗风险显著升高。良率预计下降 1.6%，可能导致返工成本抵消部分产能收益。',
    confidence: '0.82',
    conclusion: '不建议长期运行此方案。'
  },
  'sc-2': {
    id: 'sc-2',
    name: '方案 B: 节能优先',
    status: 'simulated',
    power: 3.5,
    powerDiff: '-12.5%',
    speed: 0.9,
    speedDiff: '-10%',
    scheduling: '成本最小化',
    buffer: '标准',
    metrics: [
      { label: '预计产能 (件/小时)', value: 420, unit: '' },
      { label: '能耗 (千瓦时/吨)', value: 105, unit: '' },
      { label: '良率预测 (%)', value: 99.5, unit: '%' },
      { label: '设备损耗风险', value: '极低', unit: '' },
    ],
    recommendation: '方案 B (节能优先) 预计可降低能耗 15.3%，良率微升至 99.5%，设备损耗风险极低。但产能将下降 6.7%，可能影响紧急订单交付。',
    confidence: '0.88',
    conclusion: '建议在订单压力较小时采用。'
  },
  'sc-3': {
    id: 'sc-3',
    name: '方案 C: 质量优先',
    status: 'draft',
    power: 4.2,
    powerDiff: '+5.0%',
    speed: 0.8,
    speedDiff: '-20%',
    scheduling: '交期优先',
    buffer: '+20% (安全模式)',
    metrics: [
      { label: '预计产能 (件/小时)', value: 400, unit: '' },
      { label: '能耗 (千瓦时/吨)', value: 130, unit: '' },
      { label: '良率预测 (%)', value: 99.9, unit: '%' },
      { label: '设备损耗风险', value: '低', unit: '' },
    ],
    recommendation: '方案 C (质量优先) 预计可将良率提升至 99.9%，几乎消除不良品。但产能下降 11.1%，且能耗略有上升。',
    confidence: '0.75',
    conclusion: '建议在生产高附加值或高精度要求产品时采用。'
  }
};

const scenarios = Object.values(scenariosData);

const baselineMetrics = scenariosData['baseline'].metrics;

export default function SimulationLab() {
  const [activeScenario, setActiveScenario] = useState('sc-1');

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 shrink-0 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-600 flex items-center justify-center">
            <FlaskConical size={18} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">推演实验室</h2>
            <p className="text-[10px] text-gray-500 font-mono">场景生成与仿真验证</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors text-xs shadow-sm">
            <Save size={14} /> 保存方案
          </button>
          <button className="px-3 py-1.5 bg-cyan-600 text-white font-medium rounded-lg flex items-center gap-2 hover:bg-cyan-700 transition-colors text-xs shadow-sm">
            <Play size={14} /> 批量仿真
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Scenarios */}
        <div className="w-64 border-r border-gray-200 bg-gray-50/30 flex flex-col shrink-0">
          <div className="p-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">仿真场景</h3>
            <button className="text-cyan-600 hover:text-cyan-700"><Plus size={14} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {scenarios.map(sc => (
              <div 
                key={sc.id}
                onClick={() => setActiveScenario(sc.id)}
                className={cn(
                  "p-3 rounded-lg border cursor-pointer transition-all",
                  activeScenario === sc.id 
                    ? "bg-cyan-50 border-cyan-200 ring-1 ring-cyan-100 shadow-sm" 
                    : "bg-white border-gray-200 hover:border-cyan-300 hover:shadow-sm"
                )}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold text-gray-900">{sc.name}</span>
                  {sc.status === 'active' && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
                  {sc.status === 'simulated' && <CheckCircle2 size={12} className="text-cyan-600" />}
                  {sc.status === 'draft' && <span className="w-2 h-2 rounded-full bg-gray-300"></span>}
                </div>
                <div className="text-[10px] text-gray-500 font-mono">编号: {sc.id.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle - Scenario Config */}
        <div className="flex-1 border-r border-gray-200 bg-white flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-gray-200 bg-gray-50/50">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Settings size={16} className="text-gray-500" />
              参数调节 - {scenariosData[activeScenario]?.name}
            </h3>
          </div>
          <div className="p-6 space-y-8">
            {/* Physics Models */}
            <section>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
                <Cpu size={14} /> 物理模型参数
              </h4>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-semibold text-gray-700">激光焊接机-T1 功率</label>
                    <span className="text-xs font-mono text-cyan-600">{scenariosData[activeScenario]?.power} 千瓦 ({scenariosData[activeScenario]?.powerDiff})</span>
                  </div>
                  <input type="range" min="3.0" max="5.0" step="0.1" value={scenariosData[activeScenario]?.power} readOnly className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-600" />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
                    <span>3.0 千瓦 (最小值)</span>
                    <span>4.0 千瓦 (基线)</span>
                    <span>5.0 千瓦 (最大值)</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-semibold text-gray-700">产线-A 传送带速度</label>
                    <span className="text-xs font-mono text-cyan-600">{scenariosData[activeScenario]?.speed} 米/秒 ({scenariosData[activeScenario]?.speedDiff})</span>
                  </div>
                  <input type="range" min="0.5" max="1.5" step="0.1" value={scenariosData[activeScenario]?.speed} readOnly className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-600" />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
                    <span>0.5 米/秒</span>
                    <span>1.0 米/秒 (基线)</span>
                    <span>1.5 米/秒</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Business Models */}
            <section>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
                <Layers size={14} /> 业务模型参数
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">排产策略</label>
                  <select value={scenariosData[activeScenario]?.scheduling} readOnly className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                    <option>标准</option>
                    <option>吞吐量最大化</option>
                    <option>成本最小化</option>
                    <option>交期优先</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">库存缓冲</label>
                  <select value={scenariosData[activeScenario]?.buffer} readOnly className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                    <option>-10% (精益模式)</option>
                    <option>标准</option>
                    <option>+20% (安全模式)</option>
                  </select>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Right - Simulation Results */}
        <div className="w-96 bg-[#f8f9fa] flex flex-col shrink-0">
          <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <BarChart3 size={16} className="text-cyan-600" />
              仿真结果对比
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            
            {/* Comparison Table */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="p-3 font-semibold">指标</th>
                    <th className="p-3 font-semibold text-right">基线</th>
                    <th className="p-3 font-semibold text-right text-cyan-700">当前方案</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {scenariosData[activeScenario]?.metrics.map((m: any, i: number) => {
                    const baselineVal = baselineMetrics[i].value;
                    const diff = typeof m.value === 'number' && typeof baselineVal === 'number' ? m.value - baselineVal : null;
                    const isPositive = diff !== null && diff > 0;
                    const isNegative = diff !== null && diff < 0;
                    
                    // Determine if increase is good or bad based on metric
                    const isGood = (m.label.includes('产能') || m.label.includes('良率')) ? isPositive : isNegative;
                    const isBad = (m.label.includes('产能') || m.label.includes('良率')) ? isNegative : isPositive;

                    return (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="p-3 font-medium text-gray-700">{m.label}</td>
                        <td className="p-3 text-right font-mono text-gray-500">{baselineVal}{m.unit}</td>
                        <td className="p-3 text-right font-mono font-bold text-gray-900 flex items-center justify-end gap-1">
                          {diff !== null && diff !== 0 && (
                            <span className={cn(
                              "text-[10px] flex items-center",
                              isGood ? "text-emerald-500" : isBad ? "text-red-500" : "text-gray-400"
                            )}>
                              {isPositive ? <TrendingUp size={10} /> : isNegative ? <TrendingDown size={10} /> : null}
                              {Math.abs(diff).toFixed(2)}{m.unit}
                            </span>
                          )}
                          {m.value}{m.unit}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* AI Recommendation */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={16} className="text-cyan-600" />
                <h4 className="text-xs font-bold text-cyan-900 uppercase tracking-wider">智能体评估建议</h4>
              </div>
              <p className="text-xs text-cyan-800 leading-relaxed mb-3">
                <strong>{scenariosData[activeScenario]?.name}</strong>: {scenariosData[activeScenario]?.recommendation}
              </p>
              <div className="bg-white/60 rounded p-2 text-[10px] text-cyan-700 font-mono border border-cyan-200/50">
                置信度: {scenariosData[activeScenario]?.confidence}<br/>
                结论: {scenariosData[activeScenario]?.conclusion}
              </div>
            </div>

            {/* Action Button */}
            <button className="w-full py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm flex items-center justify-center gap-2">
              <Activity size={16} />
              应用此方案至生产环境
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
