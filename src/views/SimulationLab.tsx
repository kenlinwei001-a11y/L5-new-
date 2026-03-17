import { useState } from 'react';
import { FlaskConical, Play, Save, Settings, BarChart3, TrendingUp, TrendingDown, ArrowRight, Activity, Zap, Layers, Cpu, CheckCircle2, Plus } from 'lucide-react';
import { cn } from '../lib/utils';

const scenarios = [
  { id: 'baseline', name: '当前基线 (Baseline)', status: 'active' },
  { id: 'sc-1', name: 'Scenario A: 激进提产', status: 'simulated' },
  { id: 'sc-2', name: 'Scenario B: 节能优先', status: 'simulated' },
  { id: 'sc-3', name: 'Scenario C: 质量优先', status: 'draft' },
];

const metrics = [
  { label: '预计产能 (Units/h)', baseline: 450, scA: 520, scB: 420, unit: '' },
  { label: '能耗 (kWh/t)', baseline: 124, scA: 145, scB: 105, unit: '' },
  { label: '良率预测 (%)', baseline: 99.1, scA: 97.5, scB: 99.5, unit: '%' },
  { label: '设备损耗风险', baseline: '低', scA: '高', scB: '极低', unit: '' },
];

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
            <h2 className="text-sm font-semibold text-gray-900">推演实验室 (Simulation Lab)</h2>
            <p className="text-[10px] text-gray-500 font-mono">What-if 场景生成与仿真验证</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors text-xs shadow-sm">
            <Save size={14} /> 保存方案
          </button>
          <button className="px-3 py-1.5 bg-cyan-600 text-white font-medium rounded-lg flex items-center gap-2 hover:bg-cyan-700 transition-colors text-xs shadow-sm">
            <Play size={14} /> 批量仿真 (Run Batch)
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Scenarios */}
        <div className="w-64 border-r border-gray-200 bg-gray-50/30 flex flex-col shrink-0">
          <div className="p-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">仿真场景 (Scenarios)</h3>
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
                <div className="text-[10px] text-gray-500 font-mono">ID: {sc.id.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle - Scenario Config */}
        <div className="flex-1 border-r border-gray-200 bg-white flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-gray-200 bg-gray-50/50">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Settings size={16} className="text-gray-500" />
              参数调节 (Parameter Tweaking) - {scenarios.find(s => s.id === activeScenario)?.name}
            </h3>
          </div>
          <div className="p-6 space-y-8">
            {/* Physics Models */}
            <section>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
                <Cpu size={14} /> 物理模型参数 (Physical Models)
              </h4>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-semibold text-gray-700">LaserWelder-T1 功率 (Power)</label>
                    <span className="text-xs font-mono text-cyan-600">4.5 kW (+12.5%)</span>
                  </div>
                  <input type="range" min="3.0" max="5.0" step="0.1" defaultValue="4.5" className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-600" />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
                    <span>3.0 kW (Min)</span>
                    <span>4.0 kW (Baseline)</span>
                    <span>5.0 kW (Max)</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-semibold text-gray-700">Line-A 传送带速度 (Speed)</label>
                    <span className="text-xs font-mono text-cyan-600">1.2 m/s (+20%)</span>
                  </div>
                  <input type="range" min="0.5" max="1.5" step="0.1" defaultValue="1.2" className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-600" />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
                    <span>0.5 m/s</span>
                    <span>1.0 m/s (Baseline)</span>
                    <span>1.5 m/s</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Business Models */}
            <section>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
                <Layers size={14} /> 业务模型参数 (Business Models)
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">排产策略 (Scheduling)</label>
                  <select className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                    <option>吞吐量最大化 (Max Throughput)</option>
                    <option>成本最小化 (Min Cost)</option>
                    <option>交期优先 (JIT Priority)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">库存缓冲 (Buffer)</label>
                  <select className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                    <option>-10% (精益模式)</option>
                    <option>标准 (Standard)</option>
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
              仿真结果对比 (Results)
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            
            {/* Comparison Table */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="p-3 font-semibold">指标 (Metric)</th>
                    <th className="p-3 font-semibold text-right">Baseline</th>
                    <th className="p-3 font-semibold text-right text-cyan-700">Scenario A</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {metrics.map((m, i) => {
                    const diff = typeof m.scA === 'number' && typeof m.baseline === 'number' ? m.scA - m.baseline : null;
                    const isPositive = diff !== null && diff > 0;
                    const isNegative = diff !== null && diff < 0;
                    
                    // Determine if increase is good or bad based on metric
                    const isGood = (m.label.includes('产能') || m.label.includes('良率')) ? isPositive : isNegative;
                    const isBad = (m.label.includes('产能') || m.label.includes('良率')) ? isNegative : isPositive;

                    return (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="p-3 font-medium text-gray-700">{m.label}</td>
                        <td className="p-3 text-right font-mono text-gray-500">{m.baseline}{m.unit}</td>
                        <td className="p-3 text-right font-mono font-bold text-gray-900 flex items-center justify-end gap-1">
                          {diff !== null && (
                            <span className={cn(
                              "text-[10px] flex items-center",
                              isGood ? "text-emerald-500" : isBad ? "text-red-500" : "text-gray-400"
                            )}>
                              {isPositive ? <TrendingUp size={10} /> : isNegative ? <TrendingDown size={10} /> : null}
                              {Math.abs(diff)}{m.unit}
                            </span>
                          )}
                          {m.scA}{m.unit}
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
                <h4 className="text-xs font-bold text-cyan-900 uppercase tracking-wider">Agent 评估建议</h4>
              </div>
              <p className="text-xs text-cyan-800 leading-relaxed mb-3">
                <strong>Scenario A (激进提产)</strong> 预计可提升 15.5% 产能，但会导致能耗增加 16.9% 且设备损耗风险显著升高。良率预计下降 1.6%，可能导致返工成本抵消部分产能收益。
              </p>
              <div className="bg-white/60 rounded p-2 text-[10px] text-cyan-700 font-mono border border-cyan-200/50">
                Confidence Score: 0.82<br/>
                Recommendation: NOT RECOMMENDED for long-term operation.
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
