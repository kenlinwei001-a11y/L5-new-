import { useState } from 'react';
import {
  GripVertical,
  Plus,
  Trash2,
  Settings,
  ChevronDown,
  ChevronRight,
  Code,
  Eye,
  Zap,
  GitMerge,
  User,
  Layers,
  RotateCcw,
  Clock,
  CheckCircle,
  AlertTriangle,
  Play,
  Save,
  Copy
} from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Workflow, WorkflowStep, Skill } from '../../types/skills';

interface WorkflowEditorProps {
  workflow: Workflow;
  availableSkills: Skill[];
  onChange?: (workflow: Workflow) => void;
}

const stepTypeConfig = {
  skill: { icon: Zap, label: '技能', color: 'bg-blue-100 text-blue-700', borderColor: 'border-blue-200' },
  condition: { icon: GitMerge, label: '条件', color: 'bg-amber-100 text-amber-700', borderColor: 'border-amber-200' },
  parallel: { icon: Layers, label: '并行', color: 'bg-purple-100 text-purple-700', borderColor: 'border-purple-200' },
  human: { icon: User, label: '人工', color: 'bg-indigo-100 text-indigo-700', borderColor: 'border-indigo-200' },
  loop: { icon: RotateCcw, label: '循环', color: 'bg-emerald-100 text-emerald-700', borderColor: 'border-emerald-200' },
  wait: { icon: Clock, label: '等待', color: 'bg-gray-100 text-gray-700', borderColor: 'border-gray-200' },
};

export default function WorkflowEditor({ workflow, availableSkills, onChange }: WorkflowEditorProps) {
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [showDSL, setShowDSL] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());

  const toggleExpanded = (stepId: string) => {
    const newSet = new Set(expandedSteps);
    if (newSet.has(stepId)) {
      newSet.delete(stepId);
    } else {
      newSet.add(stepId);
    }
    setExpandedSteps(newSet);
  };

  const addStep = (type: WorkflowStep['type']) => {
    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      type,
      name: type === 'skill' ? '新技能步骤' : type === 'condition' ? '条件判断' : type === 'human' ? '人工审核' : type === 'parallel' ? '并行执行' : '等待',
      dependsOn: selectedStep ? [selectedStep] : [],
      ...(type === 'skill' && { skillId: '', skillName: '' }),
      ...(type === 'condition' && { condition: '', then: '', else: '' }),
      ...(type === 'human' && { humanConfig: { assignees: [], message: '', timeout: 3600 } }),
    };

    onChange?.({
      ...workflow,
      steps: [...workflow.steps, newStep],
    });
    setSelectedStep(newStep.id);
    setExpandedSteps(new Set(expandedSteps).add(newStep.id));
  };

  const deleteStep = (stepId: string) => {
    onChange?.({
      ...workflow,
      steps: workflow.steps.filter(s => s.id !== stepId),
    });
    if (selectedStep === stepId) {
      setSelectedStep(null);
    }
  };

  const updateStep = (stepId: string, updates: Partial<WorkflowStep>) => {
    onChange?.({
      ...workflow,
      steps: workflow.steps.map(s =>
        s.id === stepId ? { ...s, ...updates } : s
      ),
    });
  };

  const generateDSL = () => {
    return `workflow: ${workflow.name.toLowerCase().replace(/\s+/g, '_')}
version: "${workflow.version}"
description: "${workflow.description}"

input:
${workflow.input.map(p => `  ${p.name}:
    type: ${p.type}
    required: ${p.required}`).join('\n')}

steps:
${workflow.steps.map((step, idx) => {
      const indent = '  ';
      let dsl = `${indent}- id: ${step.id}\n`;
      if (step.type === 'skill') {
        dsl += `${indent}  skill: ${step.skillId || 'unknown'}\n`;
      } else if (step.type === 'condition') {
        dsl += `${indent}  condition: "${step.condition}"\n`;
        dsl += `${indent}  then: ${step.then}\n`;
        dsl += `${indent}  else: ${step.else}\n`;
      } else if (step.type === 'parallel') {
        dsl += `${indent}  parallel:\n`;
        dsl += `${indent}    - ${step.parallel?.join('\n    - ') || ''}\n`;
      } else if (step.type === 'human') {
        dsl += `${indent}  type: human\n`;
        dsl += `${indent}  message: "${step.humanConfig?.message}"\n`;
      }
      if (step.dependsOn.length > 0) {
        dsl += `${indent}  depends_on: [${step.dependsOn.join(', ')}]\n`;
      }
      return dsl;
    }).join('')}

output:
${workflow.output.map(p => `  - ${p.name}`).join('\n')}`;
  };

  const selectedStepData = workflow.steps.find(s => s.id === selectedStep);

  return (
    <div className="flex h-full bg-[#f5f5f7]">
      {/* Left Sidebar - Step Library */}
      <div className="w-60 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">步骤库</h3>
          <p className="text-xs text-gray-500 mt-1">拖拽或点击添加步骤</p>
        </div>
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          {Object.entries(stepTypeConfig).map(([type, config]) => {
            const Icon = config.icon;
            return (
              <button
                key={type}
                onClick={() => addStep(type as WorkflowStep['type'])}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left group"
              >
                <div className={`w-10 h-10 rounded-xl ${config.color} flex items-center justify-center`}>
                  <Icon size={18} />
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-900">{config.label}</span>
                  <p className="text-xs text-gray-500">点击添加</p>
                </div>
                <Plus size={16} className="ml-auto text-gray-400 opacity-0 group-hover:opacity-100" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Center - Workflow Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">{workflow.name}</h2>
              <p className="text-xs text-gray-500">v{workflow.version}</p>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setShowDSL(false)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm flex items-center gap-1.5 transition-colors",
                  !showDSL ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                )}
              >
                <Eye size={14} />
                可视化
              </button>
              <button
                onClick={() => setShowDSL(true)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm flex items-center gap-1.5 transition-colors",
                  showDSL ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                )}
              >
                <Code size={14} />
                DSL
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 flex items-center gap-1.5">
              <Save size={14} />
              保存
            </button>
            <button className="px-3 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 flex items-center gap-1.5">
              <Play size={14} />
              运行
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto p-6">
          {showDSL ? (
            <div className="max-w-3xl mx-auto">
              <div className="bg-gray-900 rounded-2xl overflow-hidden">
                <div className="px-4 py-3 bg-gray-800 flex items-center justify-between">
                  <span className="text-sm text-gray-400">workflow.yaml</span>
                  <button className="p-1.5 text-gray-400 hover:text-white">
                    <Copy size={14} />
                  </button>
                </div>
                <pre className="p-6 text-sm text-gray-300 font-mono whitespace-pre-wrap">
                  {generateDSL()}
                </pre>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-4">
              {workflow.steps.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <Layers size={48} className="mx-auto mb-4 opacity-30" />
                  <p>工作流为空，请从左侧添加步骤</p>
                </div>
              ) : (
                workflow.steps.map((step, index) => {
                  const config = stepTypeConfig[step.type];
                  const Icon = config.icon;
                  const isExpanded = expandedSteps.has(step.id);
                  const isSelected = selectedStep === step.id;

                  return (
                    <div key={step.id}>
                      {/* Connector */}
                      {index > 0 && (
                        <div className="flex justify-center my-2">
                          <div className="w-0.5 h-6 bg-gray-300" />
                        </div>
                      )}

                      {/* Step Card */}
                      <div
                        className={cn(
                          "bg-white rounded-2xl border-2 transition-all overflow-hidden",
                          config.borderColor,
                          isSelected && "ring-2 ring-blue-500 ring-offset-2"
                        )}
                        onClick={() => setSelectedStep(step.id)}
                      >
                        {/* Header */}
                        <div className="p-4 flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl ${config.color} flex items-center justify-center shrink-0`}>
                            <Icon size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <input
                              type="text"
                              value={step.name}
                              onChange={(e) => updateStep(step.id, { name: e.target.value })}
                              className="text-sm font-semibold text-gray-900 bg-transparent border-0 p-0 focus:ring-0 w-full"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <p className="text-xs text-gray-500">
                              {step.type === 'skill' && step.skillName}
                              {step.type === 'condition' && `条件: ${step.condition || '未设置'}`}
                              {step.dependsOn.length > 0 && ` ← 依赖: ${step.dependsOn.join(', ')}`}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleExpanded(step.id);
                              }}
                              className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                            >
                              {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteStep(step.id);
                              }}
                              className="p-2 hover:bg-rose-50 rounded-lg text-gray-400 hover:text-rose-500"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>

                        {/* Expanded Content */}
                        {isExpanded && (
                          <div className="px-4 pb-4 border-t border-gray-100">
                            <div className="pt-4 space-y-4">
                              {step.type === 'skill' && (
                                <>
                                  <div>
                                    <label className="text-xs font-medium text-gray-500 block mb-2">选择技能</label>
                                    <select
                                      value={step.skillId || ''}
                                      onChange={(e) => {
                                        const skill = availableSkills.find(s => s.id === e.target.value);
                                        updateStep(step.id, {
                                          skillId: e.target.value,
                                          skillName: skill?.name || ''
                                        });
                                      }}
                                      className="w-full px-3 py-2 bg-gray-50 rounded-xl text-sm border-0"
                                    >
                                      <option value="">选择技能...</option>
                                      {availableSkills.map(skill => (
                                        <option key={skill.id} value={skill.id}>{skill.name}</option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-xs font-medium text-gray-500 block mb-2">输入映射</label>
                                      <textarea
                                        placeholder={'{"source": "target"}'}
                                        className="w-full px-3 py-2 bg-gray-50 rounded-xl text-sm border-0 resize-none h-20"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-xs font-medium text-gray-500 block mb-2">输出映射</label>
                                      <textarea
                                        placeholder={'{"source": "target"}'}
                                        className="w-full px-3 py-2 bg-gray-50 rounded-xl text-sm border-0 resize-none h-20"
                                      />
                                    </div>
                                  </div>
                                </>
                              )}

                              {step.type === 'condition' && (
                                <>
                                  <div>
                                    <label className="text-xs font-medium text-gray-500 block mb-2">条件表达式</label>
                                    <input
                                      type="text"
                                      value={step.condition || ''}
                                      onChange={(e) => updateStep(step.id, { condition: e.target.value })}
                                      placeholder="如: ${context.complexity} > 0.7"
                                      className="w-full px-3 py-2 bg-gray-50 rounded-xl text-sm border-0"
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-xs font-medium text-gray-500 block mb-2">满足条件 (then)</label>
                                      <select
                                        value={step.then || ''}
                                        onChange={(e) => updateStep(step.id, { then: e.target.value })}
                                        className="w-full px-3 py-2 bg-gray-50 rounded-xl text-sm border-0"
                                      >
                                        <option value="">选择步骤...</option>
                                        {workflow.steps.filter(s => s.id !== step.id).map(s => (
                                          <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                      </select>
                                    </div>
                                    <div>
                                      <label className="text-xs font-medium text-gray-500 block mb-2">不满足条件 (else)</label>
                                      <select
                                        value={step.else || ''}
                                        onChange={(e) => updateStep(step.id, { else: e.target.value })}
                                        className="w-full px-3 py-2 bg-gray-50 rounded-xl text-sm border-0"
                                      >
                                        <option value="">选择步骤...</option>
                                        {workflow.steps.filter(s => s.id !== step.id).map(s => (
                                          <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                </>
                              )}

                              {step.type === 'human' && (
                                <>
                                  <div>
                                    <label className="text-xs font-medium text-gray-500 block mb-2">审核消息</label>
                                    <input
                                      type="text"
                                      value={step.humanConfig?.message || ''}
                                      onChange={(e) => updateStep(step.id, {
                                        humanConfig: { ...step.humanConfig, message: e.target.value }
                                      })}
                                      placeholder="请确认..."
                                      className="w-full px-3 py-2 bg-gray-50 rounded-xl text-sm border-0"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs font-medium text-gray-500 block mb-2">超时时间 (秒)</label>
                                    <input
                                      type="number"
                                      value={step.humanConfig?.timeout || 3600}
                                      onChange={(e) => updateStep(step.id, {
                                        humanConfig: { ...step.humanConfig, timeout: parseInt(e.target.value) }
                                      })}
                                      className="w-full px-3 py-2 bg-gray-50 rounded-xl text-sm border-0"
                                    />
                                  </div>
                                </>
                              )}

                              <div>
                                <label className="text-xs font-medium text-gray-500 block mb-2">错误处理</label>
                                <div className="flex gap-2">
                                  {['stop', 'continue', 'retry'].map((action) => (
                                    <button
                                      key={action}
                                      onClick={() => updateStep(step.id, { onError: action as any })}
                                      className={cn(
                                        "px-4 py-2 rounded-xl text-sm transition-colors",
                                        step.onError === action
                                          ? "bg-gray-900 text-white"
                                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                      )}
                                    >
                                      {action === 'stop' && '停止'}
                                      {action === 'continue' && '继续'}
                                      {action === 'retry' && '重试'}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Properties */}
      {selectedStepData && (
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">步骤配置</h3>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-2">步骤ID</label>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">{selectedStepData.id}</code>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-2">类型</label>
                <div className="flex items-center gap-2">
                  {(() => {
                    const Icon = stepTypeConfig[selectedStepData.type].icon;
                    return (
                      <>
                        <div className={`w-6 h-6 rounded-lg ${stepTypeConfig[selectedStepData.type].color} flex items-center justify-center`}>
                          <Icon size={12} />
                        </div>
                        <span className="text-sm">{stepTypeConfig[selectedStepData.type].label}</span>
                      </>
                    );
                  })()}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-2">依赖步骤</label>
                {selectedStepData.dependsOn.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {selectedStepData.dependsOn.map(depId => {
                      const dep = workflow.steps.find(s => s.id === depId);
                      return (
                        <span key={depId} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">
                          {dep?.name || depId}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">无依赖</p>
                )}
              </div>
              {selectedStepData.skillRef && (
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">技能信息</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">命中率</span>
                      <span className="font-medium">{selectedStepData.skillRef.hitRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">成功率</span>
                      <span className="font-medium">{selectedStepData.skillRef.successRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">平均延迟</span>
                      <span className="font-medium">{selectedStepData.skillRef.latency}ms</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
