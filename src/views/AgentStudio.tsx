import { useState } from 'react';
import { 
  Factory, Database, BrainCircuit, Cpu, Wrench, Zap, GitMerge, 
  MonitorPlay, PlayCircle, ArrowDown, ArrowRight, RefreshCw, 
  Layers, Box, Network, Activity, ShieldCheck
} from 'lucide-react';
import { cn } from '../lib/utils';

type ModuleKey = 'physical' | 'data' | 'reasoning' | 'agent' | 'mcp' | 'skill' | 'workflow' | 'simulation' | 'execution';

const moduleDetails: Record<ModuleKey, any> = {
  physical: {
    title: '企业物理/业务层',
    icon: Factory,
    color: 'text-slate-700',
    bgColor: 'bg-slate-100',
    borderColor: 'border-slate-300',
    description: 'IoT设备 / MES / ERP / PLM / QMS / SCADA / CRM / WMS / SRM / 碳排放计算系统 / 外部API',
    responsibilities: [
      '数据实时采集',
      '事件/状态上报'
    ],
    output: '原始时序数据、业务事件流',
    relations: '数据采集 -> 数据层建模'
  },
  data: {
    title: '数据层 / 对象建模层',
    icon: Database,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    description: '业务对象 & 语义层 (指标语义 & 本体)',
    responsibilities: [
      '对象实体：设备/产线/工单/产品/事件',
      '属性/状态/生命周期/行为规则',
      '指标定义、解释、条件、失效规则',
      '图谱 + 本体 + 业务语言统一'
    ],
    output: '标准化/结构化数据，Agent可直接理解',
    relations: 'IoT、MES、ERP数据接入 -> 业务对象层 + 语义层'
  },
  reasoning: {
    title: '推理 & 因果层',
    icon: Network,
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    description: '因果推理与决策上下文生成',
    responsibilities: [
      '异常 -> 关联对象 -> 关键指标 -> 推理链 -> 决策建议 -> 执行动作',
      '图数据库支撑Agent因果推理'
    ],
    output: '输出决策上下文 & 推理链',
    relations: '标准化数据 -> 推理层 -> 决策上下文/推理链 -> Agent层'
  },
  agent: {
    title: '智能体运行时',
    icon: Cpu,
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-300',
    description: '核心推理和决策执行',
    responsibilities: [
      '理解业务对象和指标',
      '执行决策逻辑和推理链',
      '调用Skill和MCP完成动作',
      '触发Workflow执行'
    ],
    output: '决策结果、动作触发、知识记录',
    relations: 'Agent根据推理链 & 决策逻辑调用MCP工具或触发Workflow'
  },
  mcp: {
    title: 'MCP 工具中心',
    icon: Wrench,
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300',
    description: '模块化控制与计算平台 (工具注册与执行)',
    responsibilities: [
      '封装数据查询/计算/动作/优化/仿真工具',
      '提供标准接口供Agent调用',
      '支持回写、联动、链式调用'
    ],
    output: 'Agent可直接调用的工具集合',
    relations: 'Agent -> MCP -> Skill。MCP封装Skill原子能力，提供统一标准接口。'
  },
  skill: {
    title: 'Skill (原子能力)',
    icon: Zap,
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
    description: '可复用原子操作能力',
    responsibilities: [
      '执行单个业务动作或计算',
      '封装决策逻辑、数据操作或仿真算法',
      '可被Workflow或Agent调用'
    ],
    output: '原子操作结果、数据更新、仿真输出',
    relations: '实际执行动作或计算，输出结果回写数据层/Agent记忆。可被多个Workflow/MCP/Agent共享。'
  },
  workflow: {
    title: '工作流编排',
    icon: GitMerge,
    color: 'text-rose-700',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-300',
    description: '流程编排和执行 (可视化有向无环图)',
    responsibilities: [
      '将Agent + MCP + Skill组合成可执行流程',
      '定义多步骤决策逻辑',
      '支持条件分支、循环、异常处理'
    ],
    output: '可视化执行流程图、可调度执行',
    relations: 'Agent可被Workflow调度，也可触发Workflow。Workflow串联多步决策。'
  },
  simulation: {
    title: '仿真与推演',
    icon: MonitorPlay,
    color: 'text-cyan-700',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    description: '仿真模型与推演',
    responsibilities: [
      '仿真模型（物理 + 业务模型）',
      'What-if场景生成',
      '批量仿真输出最优方案'
    ],
    output: '最优方案、风险评估，回写Agent推理链',
    relations: 'Agent或Workflow触发仿真场景，决策结果反馈Agent & Workflow。'
  },
  execution: {
    title: '执行 & 可视化层',
    icon: PlayCircle,
    color: 'text-teal-700',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    description: '执行与可视化层',
    responsibilities: [
      'MES / ERP / IoT 控制执行',
      '自动更新对象状态',
      '决策空间 / 推演实验室 / Agent Console',
      '因果链高亮 / 风险评估 / KPI显示',
      'Tool调用追踪 / Workflow执行状态'
    ],
    output: '物理世界动作、可视化审计、可解释性',
    relations: '自动执行MES/ERP/IoT操作，完成闭环：数据 → 推理 → 决策 → 执行 → 仿真/回写 → 学习 → 下一轮决策。'
  }
};

export default function AgentStudio() {
  const [selectedModule, setSelectedModule] = useState<ModuleKey>('agent');

  const renderModuleCard = (key: ModuleKey, customClasses?: string) => {
    const mod = moduleDetails[key];
    const isSelected = selectedModule === key;
    const Icon = mod.icon;

    return (
      <button
        onClick={() => setSelectedModule(key)}
        className={cn(
          "relative flex flex-col items-start justify-center p-2.5 rounded-lg border transition-all duration-300 text-left w-full group",
          isSelected 
            ? `bg-white border-${mod.color.split('-')[1]}-400 shadow-sm ring-1 ring-${mod.color.split('-')[1]}-400/20 z-10 scale-[1.01]` 
            : `bg-white border-slate-200 hover:border-${mod.color.split('-')[1]}-300 hover:shadow-sm hover:bg-slate-50/50`,
          customClasses
        )}
      >
        <div className="flex items-center gap-2 w-full mb-1">
          <div className={cn(
            "p-1 rounded transition-colors", 
            isSelected ? mod.bgColor : "bg-slate-100 group-hover:bg-slate-200/50",
            mod.color
          )}>
            <Icon size={14} strokeWidth={2.5} />
          </div>
          <h3 className={cn(
            "font-semibold text-xs tracking-wide transition-colors", 
            isSelected ? mod.color : "text-slate-700 group-hover:text-slate-900"
          )}>
            {mod.title}
          </h3>
        </div>
        <p className="text-[10px] text-slate-500 w-full line-clamp-2 leading-relaxed pl-7">
          {mod.description}
        </p>
      </button>
    );
  };

  const renderDataFlowArrow = (label: string) => (
    <div className="flex flex-col items-center justify-center my-1 text-slate-300">
      <div className="text-[9px] font-mono font-medium tracking-widest uppercase bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200/60 z-10 text-slate-400 scale-90">
        {label}
      </div>
      <div className="h-3 w-px bg-slate-200 -mt-1.5"></div>
      <ArrowDown size={12} className="text-slate-300 -mt-1" />
    </div>
  );

  return (
    <div className="h-full flex flex-col md:flex-row gap-4 bg-slate-50/50 p-4">
      {/* Left Pane: Architecture Diagram */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-white border border-slate-200/60 rounded-xl shadow-sm relative">
        <header className="mb-4 flex justify-between items-end pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-semibold text-slate-800 tracking-tight">工业级智能体中台功能架构</h2>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">全链路闭环：数据采集 → 对象建模 → 因果推理 → Agent决策 → 执行与仿真</p>
          </div>
          <div className="hidden lg:flex items-center gap-1 text-[9px] font-semibold text-emerald-600 bg-emerald-50/80 px-2 py-1 rounded-full border border-emerald-100 uppercase tracking-wider">
            <RefreshCw size={10} className="animate-spin-slow" />
            闭环决策链激活
          </div>
        </header>

        <div className="max-w-2xl mx-auto flex flex-col items-center relative pb-6">
          
          {/* Loop Indicator Background */}
          <div className="absolute left-0 top-12 bottom-12 w-6 border-l border-y border-dashed border-slate-200 rounded-l-xl -ml-2 hidden xl:flex items-center justify-center">
             <div className="absolute -left-2 bg-white text-slate-300 p-0.5">
                <ArrowDown size={12} />
             </div>
             <div className="absolute -left-4 top-1/2 -translate-y-1/2 -rotate-90 text-[8px] font-mono text-slate-400 tracking-widest whitespace-nowrap uppercase">
                闭环学习
             </div>
          </div>

          {/* Layer 1 */}
          <div className="w-full">{renderModuleCard('physical')}</div>
          {renderDataFlowArrow('数据采集 / 事件上报')}

          {/* Layer 2 */}
          <div className="w-full">{renderModuleCard('data')}</div>
          {renderDataFlowArrow('标准化 / 结构化')}

          {/* Layer 3 */}
          <div className="w-full">{renderModuleCard('reasoning')}</div>
          {renderDataFlowArrow('决策上下文 / 推理链')}

          {/* Layer 4: The Core Agent Layer */}
          <div className="w-full p-3 rounded-xl border border-indigo-100 bg-indigo-50/30 relative my-1">
            <div className="absolute -top-2 left-3 bg-indigo-50 text-indigo-700 text-[9px] font-bold px-2 py-0.5 rounded-full border border-indigo-200 uppercase tracking-wider">
              Agent / 推演层 (核心)
            </div>
            
            <div className="mb-3 mt-1.5">
              {renderModuleCard('agent', 'border-indigo-200 shadow-sm')}
            </div>

            <div className="flex items-center justify-center gap-1.5 mb-2 text-indigo-300">
              <ArrowDown size={12} />
              <span className="text-[9px] font-mono uppercase tracking-widest scale-90">调用 / 触发 / 编排</span>
              <ArrowDown size={12} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
              {renderModuleCard('mcp')}
              {renderModuleCard('skill')}
              {renderModuleCard('workflow')}
            </div>
            
            {/* Internal Relations */}
            <div className="mt-2 pt-2 border-t border-indigo-100 flex justify-center gap-4 text-[9px] text-indigo-500/70 font-mono uppercase tracking-wider scale-90">
               <span className="flex items-center gap-1"><RefreshCw size={8} /> MCP ↔ Skill</span>
               <span className="flex items-center gap-1"><RefreshCw size={8} /> Workflow ↔ MCP/Skill</span>
               <span className="flex items-center gap-1"><RefreshCw size={8} /> Agent ↔ Workflow</span>
            </div>
          </div>

          {renderDataFlowArrow('动作 / 结果')}

          {/* Layer 5 */}
          <div className="w-full">{renderModuleCard('simulation')}</div>
          {renderDataFlowArrow('决策回写 / 学习')}

          {/* Layer 6 */}
          <div className="w-full">{renderModuleCard('execution')}</div>

        </div>
      </div>

      {/* Right Pane: Details */}
      <div className="w-full md:w-72 lg:w-[300px] shrink-0 bg-white border border-slate-200/60 rounded-xl shadow-sm flex flex-col overflow-hidden">
        <div className={cn("p-4 border-b border-slate-100 bg-slate-50/50")}>
          <div className="flex items-center gap-2 mb-1.5">
            <div className={cn("p-1 rounded-md bg-white shadow-sm border border-slate-100", moduleDetails[selectedModule].color)}>
              {(() => {
                const Icon = moduleDetails[selectedModule].icon;
                return <Icon size={14} strokeWidth={2.5} />;
              })()}
            </div>
            <h3 className={cn("text-sm font-bold tracking-tight", moduleDetails[selectedModule].color)}>
              {moduleDetails[selectedModule].title}
            </h3>
          </div>
          <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
            {moduleDetails[selectedModule].description}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          <section>
            <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <ShieldCheck size={10} /> 核心职责
            </h4>
            <ul className="space-y-1.5">
              {moduleDetails[selectedModule].responsibilities.map((res: string, idx: number) => (
                <li key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                  <div className="w-1 h-1 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{res}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Box size={10} /> 输出 / 作用
            </h4>
            <div className="bg-slate-50 p-2 rounded-md border border-slate-100 text-[11px] text-slate-700 font-medium leading-relaxed">
              {moduleDetails[selectedModule].output}
            </div>
          </section>

          <section>
            <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Network size={10} /> 关联关系
            </h4>
            <div className="bg-blue-50/50 p-2.5 rounded-md border border-blue-100/50 text-[11px] text-blue-800 leading-relaxed">
              {moduleDetails[selectedModule].relations}
            </div>
          </section>
          
          {/* Interactive hints based on selection */}
          {selectedModule === 'agent' && (
            <div className="mt-3 p-2.5 bg-indigo-50/80 rounded-lg border border-indigo-100/50">
              <h5 className="text-[9px] font-bold text-indigo-800 mb-1 uppercase tracking-wider">💡 工业级特性：动态决策流</h5>
              <p className="text-[10px] text-indigo-700/80 leading-relaxed">Agent可生成临时Workflow，应对未知场景。通过推理链或历史决策上下文确定下一步动作，调用MCP工具执行动作。</p>
            </div>
          )}
          {selectedModule === 'workflow' && (
            <div className="mt-3 p-2.5 bg-rose-50/80 rounded-lg border border-rose-100/50">
              <h5 className="text-[9px] font-bold text-rose-800 mb-1 uppercase tracking-wider">💡 工业级特性：可视化与审计</h5>
              <p className="text-[10px] text-rose-700/80 leading-relaxed">Workflow Studio显示完整DAG，支持拖拽、条件分支。每条Skill执行、每次Agent决策可追溯。</p>
            </div>
          )}
          {selectedModule === 'skill' && (
            <div className="mt-3 p-2.5 bg-emerald-50/80 rounded-lg border border-emerald-100/50">
              <h5 className="text-[9px] font-bold text-emerald-800 mb-1 uppercase tracking-wider">💡 工业级特性：原子能力复用</h5>
              <p className="text-[10px] text-emerald-700/80 leading-relaxed">Skill库共享、MCP管理工具版本。Skill可被多个Workflow/MCP/Agent共享，实现全链路闭环。</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
