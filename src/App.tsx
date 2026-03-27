import { useState } from 'react';
import { 
  Activity, 
  BrainCircuit, 
  GitMerge, 
  Database, 
  Settings,
  Terminal,
  Cpu,
  FlaskConical,
  Workflow,
  ShieldCheck,
  Store,
  Factory,
  Briefcase,
  Network,
  HardDrive,
  Layers,
  LayoutTemplate
} from 'lucide-react';
import { cn } from './lib/utils';
import DecisionSpace from './views/DecisionSpace';
import SimulationLab from './views/SimulationLab';
import AgentMonitor from './views/AgentMonitor';
import WorkflowStudio from './views/WorkflowStudio';
import OntologyModeling from './views/OntologyModeling';
import MCPStudio from './views/MCPStudio';
import GovernanceCenter from './views/GovernanceCenter';
import SkillMarket from './views/SkillMarket';
import SkillsOS from './views/SkillsOS';
import PlaceholderView from './views/PlaceholderView';
import IoTDeviceManagement from './views/IoTDeviceManagement';
import BusinessSystemIntegration from './views/BusinessSystemIntegration';
import DataIntegrationHub from './views/DataIntegrationHub';
import RealTimeDataLake from './views/RealTimeDataLake';
import AgentStudio from './views/AgentStudio';
import AgentWorkspace from './views/AgentWorkspace';

const navGroups = [
  {
    layer: 'L1: 企业物理/业务层',
    items: [
      { id: 'iot', label: 'IoT设备接入', icon: Factory },
      { id: 'mes_erp', label: '业务系统接入', icon: Briefcase },
    ]
  },
  {
    layer: 'L2: 数据层',
    items: [
      { id: 'data_integration', label: '数据集成枢纽', icon: Network },
      { id: 'data_lake', label: '实时数据湖', icon: HardDrive },
    ]
  },
  {
    layer: 'L3: 对象建模/语义层',
    items: [
      { id: 'ontology', label: '本体与语义建模', icon: Database },
    ]
  },
  {
    layer: 'L4: 智能体/推演层',
    items: [
      { id: 'agent_workspace', label: '智能体核心工作台', icon: LayoutTemplate },
      { id: 'agent_studio', label: '智能体架构总览', icon: Layers },
      { id: 'agent', label: '智能体控制台', icon: Cpu },
      { id: 'workflow', label: '工作流编排', icon: Workflow },
      { id: 'tool', label: '工具中心 (MCP)', icon: Terminal },
      { id: 'simulation', label: '推演实验室', icon: FlaskConical },
      { id: 'skill', label: '技能市场', icon: Store },
    ]
  },
  {
    layer: 'L5: 执行 & 可视化层',
    items: [
      { id: 'decision', label: '决策空间', icon: BrainCircuit },
      { id: 'governance', label: '治理中心', icon: ShieldCheck },
    ]
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('agent_workspace');

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 bg-white flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-gray-200">
          <div className="w-8 h-8 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700">
            <Cpu size={18} />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">智能体中台</h1>
            <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Agent Data OS</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.layer}>
              <h3 className="px-3 text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                {group.layer}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs transition-all duration-200",
                        isActive 
                          ? "bg-gray-100 text-gray-900 font-semibold" 
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      )}
                    >
                      <Icon size={14} className={cn(isActive ? "text-gray-900" : "text-gray-400")} />
                      <span className="tracking-wide">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-3 py-2 text-xs text-gray-500 font-medium hover:text-gray-900 cursor-pointer transition-colors">
            <Settings size={14} />
            <span>系统配置</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden bg-gray-50">
        <div className="h-full overflow-y-auto relative z-10">
          {activeTab === 'iot' && <IoTDeviceManagement />}
          {activeTab === 'mes_erp' && <BusinessSystemIntegration />}
          {activeTab === 'data_integration' && <DataIntegrationHub />}
          {activeTab === 'data_lake' && <RealTimeDataLake />}
          {activeTab === 'decision' && <div className="p-6 h-full"><DecisionSpace /></div>}
          {activeTab === 'simulation' && <div className="p-6 h-full"><SimulationLab /></div>}
          {activeTab === 'agent' && <div className="p-6 h-full"><AgentMonitor /></div>}
          {activeTab === 'agent_studio' && <div className="p-6 h-full"><AgentStudio /></div>}
          {activeTab === 'agent_workspace' && <div className="h-full"><AgentWorkspace onNavigate={setActiveTab} /></div>}
          {activeTab === 'workflow' && <div className="p-6 h-full"><WorkflowStudio /></div>}
          {activeTab === 'ontology' && <div className="p-6 h-full"><OntologyModeling /></div>}
          {activeTab === 'tool' && <div className="p-6 h-full"><MCPStudio /></div>}
          {activeTab === 'governance' && <div className="p-6 h-full"><GovernanceCenter /></div>}
          {activeTab === 'skill' && <div className="h-full"><SkillsOS /></div>}
        </div>
      </main>
    </div>
  );
}
