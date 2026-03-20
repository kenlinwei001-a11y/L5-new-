import { useState } from 'react';
import { Store, Search, Star, Download, TrendingUp, Filter, Tag } from 'lucide-react';
import { cn } from '../lib/utils';

const skills = [
  {
    id: 'sk-001',
    name: 'OEE优化',
    category: '决策',
    rating: 4.8,
    downloads: 1250,
    author: '数据科学团队',
    description: '通过分析设备数据，自动生成排产优化方案，提升整体设备效率。',
    roi: '+15% 产能',
    tags: ['排产优化', '设备数据', '计算OEE']
  },
  {
    id: 'sk-002',
    name: '根因分析 (RCA)',
    category: '分析',
    rating: 4.9,
    downloads: 3400,
    author: '质量控制团队',
    description: '基于历史异常案例和传感器数据，快速定位质量问题的根本原因。',
    roi: '-30% 诊断时间',
    tags: ['质量控制', '异常检测', '图谱推理']
  },
  {
    id: 'sk-003',
    name: '参数自适应调整',
    category: '控制',
    rating: 4.5,
    downloads: 890,
    author: '工艺工程团队',
    description: '根据实时环境数据和产品规格，动态调整生产线工艺参数。',
    roi: '-5% 废品率',
    tags: ['闭环控制', '工艺参数', '实时调整']
  },
  {
    id: 'sk-004',
    name: '供应链 What-if 仿真',
    category: '仿真',
    rating: 4.7,
    downloads: 2100,
    author: '供应链运营团队',
    description: '模拟不同供应链中断场景下的库存和交付风险，生成应急预案。',
    roi: '-20% 缺货风险',
    tags: ['供应链', '风险评估', '蒙特卡洛']
  }
];

export default function SkillMarket() {
  const [activeCategory, setActiveCategory] = useState('全部');
  const categories = ['全部', '分析', '决策', '控制', '仿真'];

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 shrink-0 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center">
            <Store size={18} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">技能市场</h2>
            <p className="text-[10px] text-gray-500 font-mono">内部共享 • 版本管理 • ROI评估</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input 
              type="text" 
              placeholder="搜索技能..." 
              className="w-48 pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
          <button className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors text-xs shadow-sm">
            <Filter size={14} />
            筛选
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex border-b border-gray-200 bg-white px-4 py-2 gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-full transition-colors",
              activeCategory === cat
                ? "bg-teal-100 text-teal-800"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.filter(s => activeCategory === '全部' || s.category === activeCategory).map(skill => (
            <div key={skill.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{skill.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">作者: {skill.author}</p>
                  </div>
                  <span className={cn(
                    "px-2 py-1 rounded text-[10px] font-medium",
                    skill.category === '决策' ? "bg-emerald-100 text-emerald-700" :
                    skill.category === '分析' ? "bg-indigo-100 text-indigo-700" :
                    skill.category === '控制' ? "bg-rose-100 text-rose-700" :
                    "bg-amber-100 text-amber-700"
                  )}>
                    {skill.category}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{skill.description}</p>
                
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {skill.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px]">
                      <Tag size={10} />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-amber-500 font-medium">
                      <Star size={12} className="fill-current" />
                      {skill.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download size={12} />
                      {skill.downloads}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                    <TrendingUp size={12} />
                    {skill.roi}
                  </span>
                </div>
              </div>
              <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-200 flex justify-between items-center">
                <span className="text-xs font-mono text-gray-400">{skill.id}</span>
                <button className="px-4 py-1.5 bg-teal-600 text-white text-xs font-medium rounded-lg hover:bg-teal-700 transition-colors shadow-sm">
                  安装技能
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
