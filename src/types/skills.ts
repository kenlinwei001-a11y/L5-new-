// Skill System Core Types - Industrial Standard
// Architecture: Skill Graph + Workflow + Evolution + ROI + Agent Runtime

// ==================== Skill Category (10 Categories) ====================

export type SkillCategory =
  | 'library-api'      // 库与 API 参考
  | 'validation'       // 产品验证
  | 'data-analysis'    // 数据获取与分析
  | 'workflow'         // 业务流程与自动化
  | 'scaffolding'      // 代码脚手架与模板
  | 'code-quality'     // 代码质量与审查
  | 'cicd'             // CI/CD 与部署
  | 'runbook'          // 运维手册
  | 'infrastructure'   // 基础设施运维
  | 'carbon-energy';   // 碳排放与能源管理

export const skillCategoryLabels: Record<SkillCategory, string> = {
  'library-api': '库与 API 参考',
  'validation': '产品验证',
  'data-analysis': '数据获取与分析',
  'workflow': '业务流程与自动化',
  'scaffolding': '代码脚手架与模板',
  'code-quality': '代码质量与审查',
  'cicd': 'CI/CD 与部署',
  'runbook': '运维手册',
  'infrastructure': '基础设施运维',
  'carbon-energy': '碳排放与能源管理',
};

export const skillCategoryConfig: Record<SkillCategory, { bg: string; text: string; border: string }> = {
  'library-api': { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' },
  'validation': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
  'data-analysis': { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-300' },
  'workflow': { bg: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-300' },
  'scaffolding': { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-300' },
  'code-quality': { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300' },
  'cicd': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
  'runbook': { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' },
  'infrastructure': { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' },
  'carbon-energy': { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-300' },
};

// ==================== Base Skill Types ====================

export interface Skill {
  // Basic Fields
  skill_id: string;           // 唯一标识符 snake_case_v{n}
  name: string;               // 中文名称
  version: string;            // 语义化版本号
  domain: string[];           // 所属领域标签
  capability_tags: string[];  // 能力标签
  category: SkillCategory;    // 10大分类

  // Description
  description: string;        // 功能描述
  author: string;             // 作者
  created_at: string;         // 创建时间
  updated_at: string;         // 更新时间

  // Performance Metrics
  cost: number;               // 执行成本评分 0.0-1.0
  latency: number;            // 预期执行延迟(ms)
  accuracy_score: number;     // 模型准确度 0.0-1.0

  // Business ROI
  roi: string;                // ROI描述
  business_metrics?: BusinessMetrics;

  // Input/Output Schema
  input_schema: Record<string, string>;   // 输入参数定义
  output_schema: Record<string, string>;  // 输出参数定义

  // Trigger Conditions
  trigger_conditions: TriggerConditions;

  // Gotchas (坑点)
  gotchas: Gotcha[];

  // Files
  files: SkillFiles;

  // Scenario Bindings
  scenario_bindings?: ScenarioBinding[];

  // Installation Status
  installation?: InstallationStatus;

  // Evolution
  eval_logs?: EvalLog[];
  evolution_status?: EvolutionStatus;
}

// ==================== Skill Detail Types ====================

export interface TriggerConditions {
  description: string;        // 何时触发该技能的详细描述
  examples: string[];         // 触发示例话术（3-5个）
  keywords: string[];         // 关键词列表
}

export interface Gotcha {
  id: string;                 // 坑点唯一标识 snake_case
  title: string;              // 坑点标题
  description: string;        // 详细描述
  severity: 'low' | 'medium' | 'high' | 'critical';
  solution: string;           // 解决方案
}

export interface SkillFiles {
  readme: string;             // SKILL.md - 核心规则文档
  config: string;             // 配置参数（JSON格式）
  script: string;             // 确定性执行脚本代码
  script_lang: 'python' | 'javascript';
  references?: string[];      // 参考文献/标准文件列表
  assets?: string[];          // 静态模板文件列表
  helpers?: string[];         // 辅助脚本列表
}

export interface ScenarioBinding {
  scenario_id: string;        // 场景ID
  input_mappings: ParamMapping[];
  output_mappings: ParamMapping[];
}

export interface ParamMapping {
  skill_param: string;        // 技能参数名
  scenario_param: string;     // 场景L4参数名
  atom_id?: string;           // 原子业务语义ID
  transform?: string;         // 可选转换函数
}

export interface InstallationStatus {
  installed: boolean;         // 是否已安装
  installed_at?: string;      // 安装时间
  installed_version?: string; // 安装的版本
  path?: string;              // 安装路径
  config?: Record<string, any>; // 安装配置
}

// ==================== Business Metrics ====================

export interface BusinessMetrics {
  usage_count: number;
  total_value: number;
  roi: number;
  cost_reduction?: number;
  efficiency_gain?: number;
  time_saved?: number;
  profit_contribution?: number;
}

// ==================== Evaluation & Evolution ====================

export interface EvalLog {
  id: string;
  query: string;
  hit: boolean;
  success: boolean;
  latency: number;
  timestamp: string;
  user_feedback?: number;
  error?: string;
}

export interface EvolutionStatus {
  current_hit_rate: number;
  current_success_rate: number;
  current_latency: number;
  hit_rate_trend: 'up' | 'down' | 'stable';
  success_rate_trend: 'up' | 'down' | 'stable';
  issues: EvolutionIssue[];
  suggestions: EvolutionSuggestion[];
  auto_optimize: boolean;
  last_optimized_at?: string;
  optimization_history: OptimizationRecord[];
}

export interface EvolutionIssue {
  type: 'trigger' | 'prompt' | 'schema' | 'performance' | 'split';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  evidence: string[];
  impact: string;
}

export interface EvolutionSuggestion {
  id: string;
  type: 'trigger' | 'prompt' | 'examples' | 'split' | 'merge';
  title: string;
  description: string;
  expected_improvement: string;
  confidence: number;
  auto_applicable: boolean;
  preview?: string;
}

export interface OptimizationRecord {
  timestamp: string;
  type: string;
  changes: string;
  before: Record<string, number>;
  after: Record<string, number>;
  applied_by: 'auto' | 'manual';
}

// ==================== Skill Graph Types ====================

export type NodeType = 'skill' | 'router' | 'merge' | 'human' | 'tool' | 'input' | 'output';

export interface SkillNode {
  id: string;
  type: NodeType;
  name: string;
  position: { x: number; y: number };
  skill_id?: string;
  skill_ref?: Skill;
  condition?: string;
  branches?: { label: string; condition: string; target: string }[];
  approval_type?: 'single' | 'majority' | 'unanimous';
  message?: string;
  tool_config?: {
    endpoint: string;
    method: string;
    headers?: Record<string, string>;
  };
  input_schema?: Record<string, any>;
  output_schema?: Record<string, any>;
  status?: 'idle' | 'running' | 'success' | 'error' | 'waiting';
  output?: any;
  error?: string;
}

export interface SkillEdge {
  id: string;
  from: string;
  to: string;
  mapping?: Record<string, string>;
  condition?: string;
  type?: 'data' | 'control' | 'error';
  label?: string;
}

export interface SkillGraph {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  created_at: string;
  updated_at: string;
  nodes: SkillNode[];
  edges: SkillEdge[];
  parallel_enabled: boolean;
  max_concurrency: number;
  timeout: number;
  business_goal?: string;
  expected_roi?: number;
}

// ==================== Workflow Types ====================

export interface Workflow {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  input: WorkflowParameter[];
  output: WorkflowParameter[];
  steps: WorkflowStep[];
  graph?: SkillGraph;
  config: WorkflowConfig;
  status: 'draft' | 'active' | 'deprecated';
  created_at: string;
  updated_at: string;
}

export interface WorkflowParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'datetime';
  required: boolean;
  default?: any;
  description?: string;
}

export type StepType = 'skill' | 'parallel' | 'condition' | 'human' | 'loop' | 'wait';

export interface WorkflowStep {
  id: string;
  type: StepType;
  name: string;
  skill_id?: string;
  skill_name?: string;
  depends_on: string[];
  input_mapping?: Record<string, string>;
  output_mapping?: Record<string, string>;
  condition?: string;
  then?: string;
  else?: string;
  parallel?: string[];
  human_config?: {
    assignees: string[];
    message: string;
    timeout: number;
  };
  loop?: {
    condition: string;
    max_iterations: number;
    step: WorkflowStep;
  };
  on_error?: 'stop' | 'continue' | 'retry';
  retry_count?: number;
}

export interface WorkflowConfig {
  parallel: boolean;
  max_concurrency: number;
  timeout: number;
  retry_policy: {
    max_retries: number;
    backoff: 'fixed' | 'exponential';
    delay: number;
  };
}

// ==================== ROI Types ====================

export interface ROIMetrics {
  skill_id: string;
  period: string;
  total_calls: number;
  unique_users: number;
  avg_latency: number;
  success_rate: number;
  cost_savings: number;
  revenue_increase: number;
  time_saved: number;
  error_reduction: number;
  roi: number;
  payback_period: number;
  npv: number;
  contribution_score: number;
  attribution_chain: AttributionNode[];
}

export interface AttributionNode {
  skill_id: string;
  skill_name: string;
  contribution: number;
  impact: string;
}

export interface ROIDashboard {
  summary: {
    total_skills: number;
    total_roi: number;
    total_savings: number;
    total_revenue: number;
  };
  top_performers: ROIMetrics[];
  needs_attention: ROIMetrics[];
  trends: {
    daily: ROITrendPoint[];
    weekly: ROITrendPoint[];
    monthly: ROITrendPoint[];
  };
}

export interface ROITrendPoint {
  date: string;
  calls: number;
  roi: number;
  savings: number;
}

// ==================== Agent Runtime Types ====================

export interface AgentRuntime {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'paused' | 'error';
  intent_parser: IntentParserConfig;
  skill_router: SkillRouterConfig;
  planner: PlannerConfig;
  executor: ExecutorConfig;
  memory: MemoryConfig;
  evaluator: EvaluatorConfig;
}

export interface IntentParserConfig {
  model: string;
  temperature: number;
  max_tokens: number;
}

export interface SkillRouterConfig {
  strategy: 'embedding' | 'rules' | 'hybrid';
  top_k: number;
  threshold: number;
}

export interface PlannerConfig {
  strategy: 'simple' | 'mcts' | 'llm';
  max_depth: number;
}

export interface ExecutorConfig {
  parallel: boolean;
  max_concurrency: number;
  timeout: number;
}

export interface MemoryConfig {
  type: 'short' | 'long' | 'hybrid';
  max_context_length: number;
}

export interface EvaluatorConfig {
  enabled: boolean;
  metrics: string[];
}

// ==================== Execution Types ====================

export interface ExecutionContext {
  id: string;
  workflow_id?: string;
  graph_id?: string;
  input: Record<string, any>;
  output?: Record<string, any>;
  status: 'pending' | 'running' | 'paused' | 'completed' | 'failed';
  current_step?: string;
  step_results: Record<string, StepResult>;
  started_at: string;
  completed_at?: string;
  logs: ExecutionLog[];
}

export interface StepResult {
  step_id: string;
  status: 'pending' | 'running' | 'success' | 'error' | 'skipped';
  input: any;
  output?: any;
  error?: string;
  latency: number;
  started_at: string;
  completed_at?: string;
}

export interface ExecutionLog {
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  step_id?: string;
  message: string;
  data?: any;
}
