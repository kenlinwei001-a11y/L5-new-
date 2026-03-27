import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Target,
  BarChart3,
  PieChart,
  ArrowRight,
  Users,
  Activity,
  Zap,
  ChevronDown,
  Download,
  Filter
} from 'lucide-react';
import { cn } from '../../lib/utils';
import type { ROIDashboard as ROIDashboardType, ROIMetrics } from '../../types/skills';

interface ROIDashboardProps {
  dashboard: ROIDashboardType;
}

const periodConfig = {
  day: '今日',
  week: '本周',
  month: '本月',
  quarter: '本季度',
};

function formatNumber(num: number): string {
  if (num >= 100000000) {
    return (num / 100000000).toFixed(1) + '亿';
  }
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万';
  }
  return num.toLocaleString();
}

function SkillROICard({ metrics, rank }: { metrics: ROIMetrics; rank?: number }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {rank && (
            <div className={cn(
              "w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold",
              rank === 1 ? "bg-amber-100 text-amber-700" :
              rank === 2 ? "bg-gray-200 text-gray-700" :
              rank === 3 ? "bg-orange-100 text-orange-700" :
              "bg-gray-100 text-gray-500"
            )}>
              {rank}
            </div>
          )}
          <div>
            <h4 className="font-semibold text-gray-900">{metrics.skillId}</h4>
            <p className="text-xs text-gray-500">{metrics.period}</p>
          </div>
        </div>
        <div className={cn(
          "px-2.5 py-1 rounded-full text-xs font-medium",
          metrics.roi >= 4 ? "bg-emerald-100 text-emerald-700" :
          metrics.roi >= 2 ? "bg-blue-100 text-blue-700" :
          "bg-amber-100 text-amber-700"
        )}>
          ROI {metrics.roi}x
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs text-gray-400 mb-1">成本节省</div>
          <div className="text-lg font-semibold text-emerald-600">
            ¥{formatNumber(metrics.costSavings)}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">收入增长</div>
          <div className="text-lg font-semibold text-blue-600">
            ¥{formatNumber(metrics.revenueIncrease)}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Activity size={14} />
          {metrics.totalCalls.toLocaleString()} 次调用
        </div>
        <div className="flex items-center gap-1">
          <Users size={14} />
          {metrics.uniqueUsers} 用户
        </div>
      </div>

      {/* Attribution Chain */}
      {metrics.attributionChain.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-400 mb-2">贡献链路</div>
          <div className="flex items-center gap-2 overflow-x-auto">
            {metrics.attributionChain.map((node, idx) => (
              <div key={idx} className="flex items-center gap-2 shrink-0">
                <div className="px-2.5 py-1 bg-gray-50 rounded-lg text-xs">
                  <span className="font-medium text-gray-700">{node.skillName}</span>
                  <span className="text-gray-400 ml-1">({Math.round(node.contribution * 100)}%)</span>
                </div>
                {idx < metrics.attributionChain.length - 1 && (
                  <ArrowRight size={14} className="text-gray-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ROIDashboard({ dashboard }: ROIDashboardProps) {
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'quarter'>('month');
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'attribution'>('overview');

  const tabs = [
    { id: 'overview', label: '总览', icon: PieChart },
    { id: 'skills', label: '技能排名', icon: BarChart3 },
    { id: 'attribution', label: '贡献归因', icon: Target },
  ];

  return (
    <div className="h-full flex flex-col bg-[#f5f5f7]">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white">
            <TrendingUp size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Skill ROI 评估</h2>
            <p className="text-xs text-gray-500">业务价值与收益分析</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            {(Object.keys(periodConfig) as Array<keyof typeof periodConfig>).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-sm transition-colors",
                  period === p
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                {periodConfig[p]}
              </button>
            ))}
          </div>
          <button className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600">
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-6 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors",
                  activeTab === tab.id
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-emerald-100">总ROI</span>
                    <TrendingUp size={20} className="text-emerald-200" />
                  </div>
                  <div className="text-4xl font-bold">{dashboard.summary.totalRoi}x</div>
                  <div className="text-emerald-100 text-sm mt-1">平均投资回报率</div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-500">总节省成本</span>
                    <DollarSign size={20} className="text-emerald-500" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    ¥{formatNumber(dashboard.summary.totalSavings)}
                  </div>
                  <div className="text-gray-400 text-sm mt-1">累计成本降低</div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-500">收入增长</span>
                    <TrendingUp size={20} className="text-blue-500" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    ¥{formatNumber(dashboard.summary.totalRevenue)}
                  </div>
                  <div className="text-gray-400 text-sm mt-1">技能驱动收入</div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-500">活跃技能</span>
                    <Zap size={20} className="text-amber-500" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{dashboard.summary.totalSkills}</div>
                  <div className="text-gray-400 text-sm mt-1">生产环境运行中</div>
                </div>
              </div>

              {/* Trend Chart */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-gray-900">ROI趋势</h3>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-gray-600">ROI</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="text-gray-600">调用量</span>
                    </div>
                  </div>
                </div>
                <div className="h-64 flex items-end justify-between gap-3">
                  {dashboard.trends.daily.map((point, idx) => {
                    const maxRoi = Math.max(...dashboard.trends.daily.map(d => d.roi));
                    const height = (point.roi / maxRoi) * 100;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full flex items-end justify-center gap-1" style={{ height: 200 }}>
                          <div
                            className="w-4 bg-emerald-500 rounded-t-lg opacity-80"
                            style={{ height: `${height * 0.6}%` }}
                          />
                          <div
                            className="w-4 bg-blue-500 rounded-t-lg opacity-60"
                            style={{ height: `${(point.calls / 200) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400">
                          {point.date.slice(5)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Performers */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp size={18} className="text-emerald-500" />
                    表现最佳
                  </h3>
                  <div className="space-y-3">
                    {dashboard.topPerformers.slice(0, 3).map((metric, idx) => (
                      <SkillROICard key={metric.skillId} metrics={metric} rank={idx + 1} />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingDown size={18} className="text-amber-500" />
                    需关注
                  </h3>
                  <div className="space-y-3">
                    {dashboard.needsAttention.map((metric) => (
                      <SkillROICard key={metric.skillId} metrics={metric} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">全部技能排名</h3>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-600 flex items-center gap-1">
                    <Filter size={14} />
                    筛选
                  </button>
                  <button className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-600 flex items-center gap-1">
                    按ROI排序
                    <ChevronDown size={14} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[...dashboard.topPerformers, ...dashboard.needsAttention].map((metric, idx) => (
                  <SkillROICard key={metric.skillId} metrics={metric} rank={idx + 1} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'attribution' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-6">Shapley 价值归因</h3>
                <div className="flex items-center justify-center py-12">
                  <div className="text-center text-gray-400">
                    <Target size={48} className="mx-auto mb-4 opacity-30" />
                    <p>归因分析图开发中</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-6">贡献链路分析</h3>
                <div className="space-y-4">
                  {dashboard.topPerformers[0]?.attributionChain.map((node, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{node.skillName}</h4>
                        <p className="text-sm text-gray-500">{node.impact}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-semibold text-gray-900">
                          {Math.round(node.contribution * 100)}%
                        </div>
                        <div className="text-xs text-gray-400">边际贡献</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
