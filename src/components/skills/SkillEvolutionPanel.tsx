import { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  RotateCcw,
  Zap,
  Brain,
  GitBranch,
  ChevronRight,
  Play,
  Pause,
  Clock,
  BarChart3,
  Target,
  Lightbulb,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Skill, EvolutionStatus, EvolutionIssue, EvolutionSuggestion } from '../../types/skills';

interface SkillEvolutionPanelProps {
  skill: Skill;
  evolution: EvolutionStatus;
}

const severityConfig = {
  low: { color: 'bg-gray-100 text-gray-600', icon: AlertTriangle },
  medium: { color: 'bg-amber-100 text-amber-600', icon: AlertTriangle },
  high: { color: 'bg-orange-100 text-orange-600', icon: AlertTriangle },
  critical: { color: 'bg-rose-100 text-rose-600', icon: AlertTriangle },
};

const typeConfig = {
  trigger: { label: '触发器', color: 'bg-blue-100 text-blue-700' },
  prompt: { label: 'Prompt', color: 'bg-purple-100 text-purple-700' },
  schema: { label: 'Schema', color: 'bg-emerald-100 text-emerald-700' },
  performance: { label: '性能', color: 'bg-amber-100 text-amber-700' },
  split: { label: '拆分建议', color: 'bg-indigo-100 text-indigo-700' },
};

export default function SkillEvolutionPanel({ skill, evolution }: SkillEvolutionPanelProps) {
  const [autoOptimize, setAutoOptimize] = useState(evolution.autoOptimize);
  const [selectedSuggestion, setSelectedSuggestion] = useState<EvolutionSuggestion | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const trendIcon = evolution.hitRateTrend === 'up'
    ? TrendingUp
    : evolution.hitRateTrend === 'down'
    ? TrendingDown
    : Clock;

  const trendColor = evolution.hitRateTrend === 'up'
    ? 'text-emerald-500'
    : evolution.hitRateTrend === 'down'
    ? 'text-rose-500'
    : 'text-gray-400';

  const handleApplySuggestion = (suggestion: EvolutionSuggestion) => {
    setSelectedSuggestion(suggestion);
    setShowApplyModal(true);
  };

  return (
    <div className="h-full flex flex-col bg-[#f5f5f7]">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">技能进化中心</h2>
            <p className="text-xs text-gray-500">{skill.name} · 自动优化与持续改进</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl">
            <span className="text-sm text-gray-600">自动优化</span>
            <button
              onClick={() => setAutoOptimize(!autoOptimize)}
              className={cn(
                "w-11 h-6 rounded-full transition-colors relative",
                autoOptimize ? "bg-emerald-500" : "bg-gray-300"
              )}
            >
              <div className={cn(
                "w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all shadow-sm",
                autoOptimize ? "left-5.5" : "left-0.5"
              )} />
            </button>
          </div>
          <button className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 flex items-center gap-2">
            <RotateCcw size={16} />
            立即分析
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Metrics Overview */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">当前命中率</span>
                <trendIcon size={18} className={trendColor} />
              </div>
              <div className="text-3xl font-semibold text-gray-900">{evolution.currentHitRate}%</div>
              <div className="text-xs text-gray-400 mt-1">
                {evolution.hitRateTrend === 'down' && '↓ 较上月下降'}
                {evolution.hitRateTrend === 'up' && '↑ 较上月提升'}
                {evolution.hitRateTrend === 'stable' && '→ 保持稳定'}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">执行成功率</span>
                <CheckCircle size={18} className="text-emerald-500" />
              </div>
              <div className="text-3xl font-semibold text-gray-900">{evolution.currentSuccessRate}%</div>
              <div className="text-xs text-gray-400 mt-1">{evolution.successRateTrend === 'stable' ? '保持稳定' : '需关注'}</div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">平均延迟</span>
                <Zap size={18} className="text-amber-500" />
              </div>
              <div className="text-3xl font-semibold text-gray-900">{evolution.currentLatency}<span className="text-lg text-gray-400">ms</span></div>
              <div className="text-xs text-gray-400 mt-1">较基准 +23%</div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">优化建议</span>
                <Lightbulb size={18} className="text-violet-500" />
              </div>
              <div className="text-3xl font-semibold text-gray-900">{evolution.suggestions.length}</div>
              <div className="text-xs text-gray-400 mt-1">{evolution.suggestions.filter(s => s.autoApplicable).length}个可自动应用</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Issues Panel */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-amber-500" />
                  检测到的问题
                </h3>
                <span className="px-2.5 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-medium">
                  {evolution.issues.length} 个
                </span>
              </div>
              <div className="divide-y divide-gray-100">
                {evolution.issues.map((issue, idx) => {
                  const config = severityConfig[issue.severity];
                  const Icon = config.icon;
                  return (
                    <div key={idx} className="p-5 hover:bg-gray-50/50">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-xl ${config.color} flex items-center justify-center shrink-0`}>
                          <Icon size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeConfig[issue.type].color}`}>
                              {typeConfig[issue.type].label}
                            </span>
                            <span className="text-xs text-gray-400 capitalize">{issue.severity}</span>
                          </div>
                          <p className="text-sm text-gray-900 mb-2">{issue.description}</p>
                          <p className="text-xs text-gray-500 mb-2">{issue.impact}</p>
                          <div className="space-y-1">
                            {issue.evidence.map((ev, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                                <div className="w-1 h-1 rounded-full bg-gray-300" />
                                {ev}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Suggestions Panel */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Brain size={18} className="text-violet-500" />
                  AI优化建议
                </h3>
                <span className="px-2.5 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">
                  {evolution.suggestions.length} 个
                </span>
              </div>
              <div className="divide-y divide-gray-100">
                {evolution.suggestions.map((suggestion) => (
                  <div key={suggestion.id} className="p-5 hover:bg-gray-50/50">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-gray-900">{suggestion.title}</span>
                          {suggestion.autoApplicable && (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs">可自动</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                        <div className="flex items-center gap-4 text-xs">
                          <span className="text-emerald-600 font-medium">{suggestion.expectedImprovement}</span>
                          <span className="text-gray-400">置信度: {Math.round(suggestion.confidence * 100)}%</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleApplySuggestion(suggestion)}
                        className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-medium hover:bg-gray-800 flex items-center gap-1 shrink-0"
                      >
                        应用
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Optimization History */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <BarChart3 size={18} className="text-blue-500" />
                优化历史
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {evolution.optimizationHistory.map((record, idx) => (
                <div key={idx} className="px-5 py-4 flex items-center justify-between hover:bg-gray-50/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                      <RotateCcw size={18} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{record.changes}</p>
                      <p className="text-xs text-gray-500">{record.timestamp} · {record.appliedBy === 'auto' ? '自动优化' : '手动优化'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-right">
                      <div className="text-gray-400 text-xs">优化前</div>
                      <div className="text-gray-600">{Math.round(record.before.successRate * 100)}% · {record.before.latency}ms</div>
                    </div>
                    <div className="text-emerald-500">→</div>
                    <div className="text-right">
                      <div className="text-gray-400 text-xs">优化后</div>
                      <div className="text-emerald-600 font-medium">{Math.round(record.after.successRate * 100)}% · {record.after.latency}ms</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && selectedSuggestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">应用优化建议</h3>
              <button onClick={() => setShowApplyModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={18} />
              </button>
            </div>
            <div className="p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-2">{selectedSuggestion.title}</h4>
              <p className="text-sm text-gray-600 mb-4">{selectedSuggestion.description}</p>

              {selectedSuggestion.preview && (
                <div className="mb-4">
                  <label className="text-xs font-medium text-gray-500 block mb-2">变更预览</label>
                  <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 font-mono whitespace-pre-wrap">
                    {selectedSuggestion.preview}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl">
                <Target size={18} className="text-emerald-500" />
                <span className="text-sm text-emerald-700">预期效果: {selectedSuggestion.expectedImprovement}</span>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowApplyModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-xl text-sm transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setShowApplyModal(false);
                  // Apply logic here
                }}
                className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm hover:bg-gray-800 flex items-center gap-2"
              >
                <CheckCircle size={16} />
                确认应用
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
