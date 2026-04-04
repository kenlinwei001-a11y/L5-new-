import { useState } from 'react';
import {
  Store,
  Grid3X3,
  Plus
} from 'lucide-react';
import { cn } from '../lib/utils';
import SkillMarket from './SkillMarket';

export default function SkillsOS() {
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div className="h-full flex bg-[#f5f5f7]">
      {/* Sidebar Navigation */}
      {showSidebar && (
        <div className="w-72 bg-white border-r border-gray-200 flex flex-col shrink-0">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white">
                <Grid3X3 size={20} />
              </div>
              <div>
                <h1 className="text-base font-semibold text-gray-900">Skills OS</h1>
                <p className="text-xs text-gray-500">智能技能管理平台</p>
              </div>
            </div>
          </div>

          {/* Navigation - Only Skill Market */}
          <div className="flex-1 p-4 space-y-1 overflow-y-auto">
            <button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all bg-gray-900 text-white shadow-lg shadow-gray-200"
            >
              <Store size={20} />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">技能市场</div>
                <div className="text-xs text-gray-400 truncate">
                  浏览与管理 Skills
                </div>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100">
            <button className="w-full flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800">
              <Plus size={16} />
              创建新 Skill
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* View Header */}
        <div className="h-14 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
            >
              <Grid3X3 size={18} />
            </button>
            <Store size={18} className="text-gray-400" />
            <h2 className="text-base font-semibold text-gray-900">技能市场</h2>
          </div>
        </div>

        {/* View Content - Only Skill Market */}
        <div className="flex-1 overflow-hidden">
          <SkillMarket />
        </div>
      </div>
    </div>
  );
}
