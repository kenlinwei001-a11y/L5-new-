import React, { useState } from 'react';
import { 
  Bot, Plus, Search, Settings, Cpu, BrainCircuit, Database, Wrench, 
  ShieldCheck, MonitorPlay, FileOutput, ArrowRight, Save, Play, CheckCircle2
} from 'lucide-react';
import { cn } from '../lib/utils';

const configuredAgents = [
  { id: 'a1', name: '产销匹配推演 Agent', desc: '判断瓶颈、选择策略、调用仿真对比方案', status: 'active' },
  { id: 'a2', name: '设备异常诊断 Agent', desc: '基于遥测数据和知识图谱定位根因', status: 'active' },
  { id: 'a3', name: '质量追溯分析 Agent', desc: '跨工序追溯质量缺陷源头', status: 'draft' },
];

const steps = [
  { id: 'intent', title: 'Step 1: Intent Parsing', desc: '意图解析 (LLM)', icon: BrainCircuit },
  { id: 'ontology', title: 'Step 2: Ontology Resolution', desc: '找对象 (语义解析)', icon: Database },
  { id: 'binding', title: 'Step 3: Data Binding', desc: '映射数据', icon: ArrowRight },
  { id: 'skill', title: 'Step 4: Skill Selection', desc: '选择技能 (MCP)', icon: Wrench },
  { id: 'constraint', title: 'Step 5: Constraint Injection', desc: '注入约束', icon: ShieldCheck },
  { id: 'simulation', title: 'Step 6: Simulation / Calculation', desc: '推演与计算', icon: MonitorPlay },
  { id: 'result', title: 'Step 7: Result Structuring', desc: '结果结构化', icon: FileOutput },
];

export default function AgentStudio() {
  const [agents, setAgents] = useState(configuredAgents);
  const [activeAgentId, setActiveAgentId] = useState('a1');
  const [activeStep, setActiveStep] = useState('intent');
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);

  const activeAgent = agents.find(a => a.id === activeAgentId) || agents[0];

  const handleCreateAgent = () => {
    const newId = `a${Date.now()}`;
    const newAgent = {
      id: newId,
      name: '新建智能体',
      desc: '请描述该智能体的功能与用途...',
      status: 'draft'
    };
    setAgents([newAgent, ...agents]);
    setActiveAgentId(newId);
    setActiveStep('intent');
    setIsEditing(true);
  };

  const updateActiveAgent = (updates: Partial<typeof activeAgent>) => {
    setAgents(agents.map(a => a.id === activeAgentId ? { ...a, ...updates } : a));
  };

  const handleSave = () => {
    setIsEditing(false);
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 3000);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative">
      {/* Header */}
      <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 shrink-0 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <Cpu size={18} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">智能体配置中心 (Agent Studio)</h2>
            <p className="text-[10px] text-gray-500 font-mono">基于 7 步逻辑的语义决策 Agent</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors text-xs shadow-sm">
            <Play size={14} className="text-emerald-600" />
            测试 Agent
          </button>
          <button 
            onClick={handleSave}
            className="px-3 py-1.5 bg-indigo-600 text-white font-medium rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors text-xs shadow-sm"
          >
            <Save size={14} />
            保存配置
          </button>
        </div>
      </div>

      {showSaveToast && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg shadow-lg animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 size={16} className="text-emerald-500" />
          <span className="text-sm font-medium">配置已保存！</span>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Agent List */}
        <div className="w-64 border-r border-gray-200 bg-gray-50/30 flex flex-col shrink-0 z-20">
          <div className="p-3 border-b border-gray-200 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700">已配置智能体</span>
            <button 
              onClick={handleCreateAgent}
              className="p-1 hover:bg-gray-200 rounded text-indigo-600 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text" 
                placeholder="搜索 Agent..." 
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {agents.map(agent => (
              <div 
                key={agent.id}
                onClick={() => {
                  setActiveAgentId(agent.id);
                  setIsEditing(false);
                }}
                className={cn(
                  "p-3 rounded-lg cursor-pointer border transition-all",
                  activeAgentId === agent.id 
                    ? "bg-indigo-50 border-indigo-200 shadow-sm" 
                    : "bg-white border-transparent hover:border-gray-200 hover:bg-gray-50"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Bot size={14} className={activeAgentId === agent.id ? "text-indigo-600" : "text-gray-500"} />
                    <span className={cn("text-xs font-bold", activeAgentId === agent.id ? "text-indigo-900" : "text-gray-700")}>
                      {agent.name}
                    </span>
                  </div>
                  {agent.status === 'active' && <CheckCircle2 size={12} className="text-emerald-500" />}
                </div>
                <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed">
                  {agent.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content - Agent Configuration */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-2">
              {isEditing ? (
                <input 
                  type="text" 
                  value={activeAgent.name}
                  onChange={(e) => updateActiveAgent({ name: e.target.value })}
                  className="text-xl font-bold text-gray-900 border-b border-indigo-300 focus:outline-none focus:border-indigo-600 bg-transparent px-1 py-0.5"
                  autoFocus
                />
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-gray-900">{activeAgent.name}</h1>
                  <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-indigo-600">
                    <Settings size={14} />
                  </button>
                </div>
              )}
              <span className={cn(
                "px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider",
                activeAgent.status === 'active' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
              )}>
                {activeAgent.status}
              </span>
            </div>
            {isEditing ? (
              <input 
                type="text" 
                value={activeAgent.desc}
                onChange={(e) => updateActiveAgent({ desc: e.target.value })}
                className="w-full text-sm text-gray-500 border-b border-indigo-300 focus:outline-none focus:border-indigo-600 bg-transparent px-1 py-0.5"
              />
            ) : (
              <p className="text-sm text-gray-500">{activeAgent.desc}</p>
            )}
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Steps Navigation */}
            <div className="w-64 border-r border-gray-100 bg-gray-50/50 p-4 overflow-y-auto">
              <div className="space-y-2 relative before:absolute before:inset-y-0 before:left-[19px] before:w-px before:bg-gray-200">
                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  const isActive = activeStep === step.id;
                  return (
                    <button
                      key={step.id}
                      onClick={() => setActiveStep(step.id)}
                      className={cn(
                        "relative flex items-start gap-3 w-full p-2 rounded-lg text-left transition-colors group",
                        isActive ? "bg-white shadow-sm ring-1 ring-gray-200 z-10" : "hover:bg-gray-100/80"
                      )}
                    >
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 border-2",
                        isActive ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-gray-300 text-gray-400 group-hover:border-indigo-400"
                      )}>
                        <Icon size={12} />
                      </div>
                      <div>
                        <div className={cn("text-xs font-bold", isActive ? "text-indigo-900" : "text-gray-700")}>
                          {step.title}
                        </div>
                        <div className="text-[10px] text-gray-500 mt-0.5">{step.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step Content */}
            <div className="flex-1 p-6 overflow-y-auto bg-gray-50/30">
              <div className="max-w-3xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    {React.createElement(steps.find(s => s.id === activeStep)?.icon || BrainCircuit, { size: 20 })}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{steps.find(s => s.id === activeStep)?.title}</h2>
                    <p className="text-xs text-gray-500">{steps.find(s => s.id === activeStep)?.desc}</p>
                  </div>
                </div>

                {/* Step specific content */}
                {activeStep === 'intent' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">系统提示词 (System Prompt)</label>
                      <textarea 
                        className="w-full h-32 p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono text-gray-600"
                        defaultValue="你是一个产销匹配推演专家。你的任务是解析用户的自然语言意图，提取出关键的生产需求、交期要求和产能约束条件。"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">意图分类模型</label>
                      <select className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                        <option>Gemini 1.5 Pro (推荐用于复杂推理)</option>
                        <option>Gemini 1.5 Flash (推荐用于快速分类)</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeStep === 'ontology' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">目标本体映射 (Target Ontology)</label>
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-2">
                        <div className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded shadow-sm">
                          <span className="text-sm font-medium text-gray-700">SalesOrder (销售订单)</span>
                          <span className="text-xs text-gray-500">提取: 交期, 数量, 产品型号</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded shadow-sm">
                          <span className="text-sm font-medium text-gray-700">ProductionLine (产线)</span>
                          <span className="text-xs text-gray-500">提取: 产能, 状态, OEE</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded shadow-sm">
                          <span className="text-sm font-medium text-gray-700">Material (物料)</span>
                          <span className="text-xs text-gray-500">提取: 库存量, 采购周期</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeStep === 'binding' && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 mb-4">配置如何将解析出的本体实体绑定到实际的业务系统数据源。</p>
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200 text-xs text-gray-500">
                          <th className="pb-2 font-medium">本体实体</th>
                          <th className="pb-2 font-medium">数据源 (Data Source)</th>
                          <th className="pb-2 font-medium">映射规则</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        <tr className="border-b border-gray-100">
                          <td className="py-3 font-medium text-gray-800">SalesOrder</td>
                          <td className="py-3 text-blue-600">ERP_Sales_DB</td>
                          <td className="py-3 text-gray-500 font-mono text-xs">SELECT * FROM orders WHERE ...</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 font-medium text-gray-800">ProductionLine</td>
                          <td className="py-3 text-emerald-600">MES_Equipment_API</td>
                          <td className="py-3 text-gray-500 font-mono text-xs">GET /api/v1/lines/:id/status</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {activeStep === 'skill' && (
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-gray-700 mb-2">可用技能 / MCP 工具</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 border border-indigo-200 bg-indigo-50 rounded-lg flex items-start gap-3">
                        <input type="checkbox" defaultChecked className="mt-1" />
                        <div>
                          <div className="text-sm font-bold text-indigo-900">瓶颈分析算法 (Bottleneck_Analyzer)</div>
                          <div className="text-xs text-indigo-700 mt-1">基于TOC理论识别产线瓶颈工序</div>
                        </div>
                      </div>
                      <div className="p-3 border border-indigo-200 bg-indigo-50 rounded-lg flex items-start gap-3">
                        <input type="checkbox" defaultChecked className="mt-1" />
                        <div>
                          <div className="text-sm font-bold text-indigo-900">排程优化器 (APS_Optimizer)</div>
                          <div className="text-xs text-indigo-700 mt-1">调用启发式算法生成排产方案</div>
                        </div>
                      </div>
                      <div className="p-3 border border-gray-200 bg-white hover:bg-gray-50 rounded-lg flex items-start gap-3">
                        <input type="checkbox" className="mt-1" />
                        <div>
                          <div className="text-sm font-bold text-gray-700">库存预测模型 (Inv_Predictor)</div>
                          <div className="text-xs text-gray-500 mt-1">预测未来7天物料消耗趋势</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeStep === 'constraint' && (
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-gray-700 mb-2">业务约束条件 (Hard/Soft Constraints)</label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 bg-white border border-rose-200 rounded-lg">
                        <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-bold rounded">硬约束</span>
                        <span className="text-sm text-gray-800">交期不可延迟 (Delivery Date &lt;= Deadline)</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white border border-amber-200 rounded-lg">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded">软约束</span>
                        <span className="text-sm text-gray-800">最小化换线次数 (Minimize Setup Time)</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white border border-amber-200 rounded-lg">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded">软约束</span>
                        <span className="text-sm text-gray-800">优先使用内部产能，其次考虑外包</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeStep === 'simulation' && (
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-gray-700 mb-2">仿真推演配置</label>
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-700">推演策略生成数量</span>
                        <input type="number" defaultValue={3} className="w-20 p-1.5 text-sm border border-gray-300 rounded text-center" />
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-700">仿真引擎</span>
                        <select className="p-1.5 text-sm border border-gray-300 rounded">
                          <option>离散事件仿真 (DES)</option>
                          <option>系统动力学 (SD)</option>
                        </select>
                      </div>
                      <div className="text-xs text-gray-500 bg-white p-3 rounded border border-gray-200">
                        Agent 将根据前置条件生成多种策略（如：加班、调线、外包），并调用仿真引擎对比各方案的 KPI（成本、准交率）。
                      </div>
                    </div>
                  </div>
                )}

                {activeStep === 'result' && (
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-gray-700 mb-2">输出结构 (JSON Schema)</label>
                    <textarea 
                      className="w-full h-48 p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono text-gray-600 bg-gray-50"
                      defaultValue={`{
  "best_strategy": "string (加班/调线/外包)",
  "confidence_score": "number",
  "kpi_impact": {
    "cost_increase": "number",
    "on_time_delivery_rate": "number"
  },
  "reasoning_chain": ["string"]
}`}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
