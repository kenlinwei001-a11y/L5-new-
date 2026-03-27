import { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Check,
  X,
  ChevronLeft,
  FileText,
  Code,
  Settings,
  BookOpen,
  FolderOpen,
  Copy,
  CheckCircle,
  AlertCircle,
  GitBranch,
  Clock,
  Target,
  ExternalLink,
} from 'lucide-react';
import { cn } from '../lib/utils';
import type { Skill, SkillCategory } from '../types/skills';
import { mockSkills } from '../data/skillsMock';
import { skillCategoryLabels, skillCategoryConfig } from '../types/skills';

// Skill layer detection logic
function getSkillLayer(skillId: string): { name: string; color: string } {
  if (skillId.startsWith('atom_')) {
    return { name: '原子层', color: 'bg-slate-700' };
  }
  if (skillId.startsWith('domain_')) {
    return { name: '领域层', color: 'bg-slate-600' };
  }
  if (skillId.startsWith('scenario_')) {
    return { name: '场景层', color: 'bg-slate-500' };
  }
  return { name: '业务层', color: 'bg-slate-400' };
}

// Skill Card Component
function SkillCard({ skill, onClick, onInstall }: {
  skill: Skill;
  onClick: () => void;
  onInstall: (e: React.MouseEvent) => void;
}) {
  const isInstalled = skill.installation?.installed;
  const categoryStyle = skillCategoryConfig[skill.category];

  return (
    <div
      onClick={onClick}
      className="group bg-white border border-slate-200 hover:border-slate-300 transition-all cursor-pointer flex flex-col"
    >
      {/* Card Header */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 truncate group-hover:text-sky-700 transition-colors">
              {skill.name}
            </h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{skill.skill_id}</p>
          </div>
          <span className={cn(
            "px-2 py-0.5 text-xs font-medium border shrink-0",
            categoryStyle.bg,
            categoryStyle.text,
            categoryStyle.border
          )}>
            {skillCategoryLabels[skill.category]}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1">
        <p className="text-sm text-slate-600 line-clamp-2 mb-3">{skill.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {skill.capability_tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs">
              {tag}
            </span>
          ))}
          {skill.capability_tags.length > 3 && (
            <span className="px-2 py-0.5 bg-slate-50 text-slate-400 text-xs">
              +{skill.capability_tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Target size={12} />
              {(skill.accuracy_score * 100).toFixed(0)}%
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {skill.latency}ms
            </span>
          </div>

          {/* Install Button */}
          <button
            onClick={onInstall}
            className={cn(
              "px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 transition-colors",
              isInstalled
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                : "bg-slate-800 text-white hover:bg-slate-700"
            )}
          >
            {isInstalled ? (
              <>
                <Check size={12} />
                已安装
              </>
            ) : (
              <>
                <Download size={12} />
                安装
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Code Block Component with Copy Button
function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <div className="absolute right-2 top-2">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded transition-colors"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? '已复制' : '复制'}
        </button>
      </div>
      <div className="bg-slate-900 text-slate-300 p-4 pt-10 overflow-x-auto rounded-b-lg">
        <pre className="text-sm font-mono">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

// Skill Detail Component - GitHub Style File Browser
function SkillDetail({ skill, onClose, onInstall }: {
  skill: Skill;
  onClose: () => void;
  onInstall: () => void;
}) {
  const [activeTab, setActiveTab] = useState<'readme' | 'config' | 'script' | 'references' | 'assets'>('readme');
  const isInstalled = skill.installation?.installed;
  const layer = getSkillLayer(skill.skill_id);

  const tabs = [
    { id: 'readme', label: 'SKILL.md', icon: FileText },
    { id: 'config', label: 'config.json', icon: Settings },
    { id: 'script', label: `script.${skill.files.script_lang}`, icon: Code },
    { id: 'references', label: `references (${skill.files.references?.length || 0})`, icon: BookOpen },
    { id: 'assets', label: `assets (${skill.files.assets?.length || 0})`, icon: FolderOpen },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        {/* Top Bar */}
        <div className="flex items-center gap-4 px-4 py-3 border-b border-slate-100">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm"
          >
            <ChevronLeft size={16} />
            返回技能注册中心
          </button>
        </div>

        {/* Skill Info */}
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{skill.name}</h1>

          {/* Meta Info Row */}
          <div className="flex items-center gap-4 text-sm flex-wrap">
            <span className="font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              {skill.skill_id}
            </span>
            <span className="text-slate-500">
              v{skill.version}
            </span>
            <span className="text-slate-500">
              {skillCategoryLabels[skill.category]}
            </span>
            <span className={cn(
              "px-2 py-0.5 text-xs text-white rounded",
              layer.color
            )}>
              {layer.name}
            </span>

            {/* View Ontology Button */}
            <button
              className="flex items-center gap-1.5 text-sky-600 hover:text-sky-700 ml-auto"
              onClick={() => alert('跳转到本体图谱: ' + skill.domain[0])}
            >
              <GitBranch size={14} />
              查看语义图谱
              <ExternalLink size={12} />
            </button>
          </div>
        </div>

        {/* File Tabs */}
        <div className="flex items-center gap-1 px-4 border-t border-slate-200 bg-slate-50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-t-2 transition-colors",
                  activeTab === tab.id
                    ? "border-slate-800 bg-white text-slate-900"
                    : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-white">
        <div className="max-w-5xl mx-auto">
          {/* File Path Bar */}
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
            <span className="font-medium text-slate-900">{skill.skill_id}</span>
            <span className="text-slate-400">/</span>
            <span>
              {activeTab === 'readme' && 'SKILL.md'}
              {activeTab === 'config' && 'config.json'}
              {activeTab === 'script' && `script.${skill.files.script_lang}`}
              {activeTab === 'references' && 'references/'}
              {activeTab === 'assets' && 'assets/'}
            </span>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* README Tab */}
            {activeTab === 'readme' && (
              <div className="prose prose-slate max-w-none">
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200">
                    <span className="text-sm font-medium text-slate-700">SKILL.md</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(skill.files.readme)}
                      className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
                    >
                      <Copy size={12} />
                      复制
                    </button>
                  </div>
                  <div className="p-6">
                    <pre className="text-sm text-slate-800 whitespace-pre-wrap font-mono leading-relaxed">
                      {skill.files.readme}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* Config Tab */}
            {activeTab === 'config' && (
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200">
                  <span className="text-sm font-medium text-slate-700">config.json</span>
                </div>
                <CodeBlock
                  code={JSON.stringify(JSON.parse(skill.files.config || '{}'), null, 2)}
                  language="json"
                />
              </div>
            )}

            {/* Script Tab */}
            {activeTab === 'script' && (
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200">
                  <span className="text-sm font-medium text-slate-700">
                    script.{skill.files.script_lang}
                  </span>
                  <span className="text-xs text-slate-500">
                    {skill.files.script_lang === 'python' ? 'Python' : 'JavaScript'}
                  </span>
                </div>
                <CodeBlock code={skill.files.script} language={skill.files.script_lang} />
              </div>
            )}

            {/* References Tab */}
            {activeTab === 'references' && (
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                  <span className="text-sm font-medium text-slate-700">
                    参考文档 ({skill.files.references?.length || 0})
                  </span>
                </div>
                <div className="divide-y divide-slate-100">
                  {skill.files.references && skill.files.references.length > 0 ? (
                    skill.files.references.map((ref, idx) => (
                      <div key={idx} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50">
                        <span className="text-slate-400 text-sm w-6">{idx + 1}</span>
                        <BookOpen size={16} className="text-slate-400" />
                        <span className="text-sm text-slate-700 flex-1">{ref}</span>
                        <button className="text-sky-600 hover:text-sky-700 text-xs flex items-center gap-1">
                          <ExternalLink size={12} />
                          查看
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-slate-400 text-sm">
                      暂无参考文档
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Assets Tab */}
            {activeTab === 'assets' && (
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                  <span className="text-sm font-medium text-slate-700">
                    静态资源 ({skill.files.assets?.length || 0})
                  </span>
                </div>
                <div className="divide-y divide-slate-100">
                  {skill.files.assets && skill.files.assets.length > 0 ? (
                    skill.files.assets.map((asset, idx) => (
                      <div key={idx} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50">
                        <span className="text-slate-400 text-sm w-6">{idx + 1}</span>
                        <FolderOpen size={16} className="text-slate-400" />
                        <span className="text-sm text-slate-700 flex-1">{asset}</span>
                        <button className="text-sky-600 hover:text-sky-700 text-xs flex items-center gap-1">
                          <Download size={12} />
                          下载
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-slate-400 text-sm">
                      暂无静态资源
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer with Install Status */}
      <footer className="border-t border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center gap-4 text-sm">
            {isInstalled ? (
              <>
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <CheckCircle size={14} />
                  已安装 v{skill.installation?.installed_version}
                </span>
                <span className="text-slate-400">|</span>
                <span className="text-slate-500">{skill.installation?.path}</span>
              </>
            ) : (
              <span className="flex items-center gap-1.5 text-slate-500">
                <AlertCircle size={14} />
                未安装
              </span>
            )}
          </div>

          {!isInstalled && (
            <button
              onClick={onInstall}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 rounded"
            >
              <Download size={16} />
              安装此技能
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}

// Main Component
export default function SkillMarket() {
  const [skills, setSkills] = useState<Skill[]>(mockSkills);
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  // Filter skills
  const filteredSkills = skills.filter((skill) => {
    const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.skill_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle install
  const handleInstall = (skill: Skill, e?: React.MouseEvent) => {
    e?.stopPropagation();

    setSkills(prev => prev.map(s => {
      if (s.skill_id === skill.skill_id) {
        return {
          ...s,
          installation: {
            installed: true,
            installed_at: new Date().toISOString().split('T')[0],
            installed_version: s.version,
            path: `/skills/${s.skill_id}`,
          }
        };
      }
      return s;
    }));
  };

  const categories: Array<SkillCategory | 'all'> = [
    'all',
    'library-api',
    'validation',
    'data-analysis',
    'workflow',
    'scaffolding',
    'code-quality',
    'cicd',
    'runbook',
    'infrastructure',
    'carbon-energy',
  ];

  return (
    <div className="h-full flex flex-col bg-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">技能市场</h1>
            <p className="text-sm text-slate-500 mt-0.5">Skill Marketplace · {skills.length} 个技能</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="搜索技能..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-slate-400 rounded"
              />
            </div>

            <button className="p-2 bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded">
              <Filter size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Category Filter */}
      <div className="bg-white border-b border-slate-200 px-6 py-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors rounded",
                selectedCategory === cat
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {cat === 'all' ? '全部' : skillCategoryLabels[cat]}
              {cat !== 'all' && (
                <span className="ml-1.5 text-xs opacity-70">
                  {skills.filter(s => s.category === cat).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Skill Grid */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSkills.map((skill) => (
            <SkillCard
              key={skill.skill_id}
              skill={skill}
              onClick={() => setSelectedSkill(skill)}
              onInstall={(e) => handleInstall(skill, e)}
            />
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <Search size={48} className="mx-auto mb-4 opacity-30" />
            <p>没有找到匹配的技能</p>
          </div>
        )}
      </div>

      {/* Skill Detail Modal */}
      {selectedSkill && (
        <SkillDetail
          skill={selectedSkill}
          onClose={() => setSelectedSkill(null)}
          onInstall={() => handleInstall(selectedSkill)}
        />
      )}
    </div>
  );
}
