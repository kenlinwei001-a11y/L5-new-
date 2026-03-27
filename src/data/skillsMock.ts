import type {
  Skill,
  SkillGraph,
  Workflow,
  EvolutionStatus,
  ROIDashboard,
  AgentRuntime,
  ExecutionContext,
} from '../types/skills';

// ==================== Skills (按新规范) ====================

export const mockSkills: Skill[] = [
  {
    skill_id: 'oee_optimizer_v2',
    name: 'OEE智能优化',
    version: '2.1.0',
    domain: ['production', 'equipment'],
    capability_tags: ['optimization', 'scheduling', 'efficiency'],
    category: 'workflow',
    description: '基于设备数据自动分析OEE指标，生成排产优化方案，提升整体设备效率',
    author: '智能制造团队',
    created_at: '2024-01-15',
    updated_at: '2024-03-20',
    cost: 0.75,
    latency: 145,
    accuracy_score: 0.91,
    roi: '+15%产能提升',
    input_schema: {
      equipment_data: 'object',
      production_plan: 'object',
      historical_oee: 'object',
      constraints: 'object',
    },
    output_schema: {
      optimized_schedule: 'object',
      bottleneck_analysis: 'object',
      oee_prediction: 'number',
      expected_improvement: 'string',
    },
    trigger_conditions: {
      description: '当需要优化设备OEE、提升排产效率或识别产能瓶颈时触发',
      examples: [
        '帮我优化产线OEE',
        '设备利用率太低怎么提升',
        '生成下周排产方案',
        '分析一下产能瓶颈',
      ],
      keywords: ['OEE', '优化', '排产', '产能', '效率', '瓶颈', '利用率'],
    },
    gotchas: [
      {
        id: 'data_freshness',
        title: '设备数据时效性',
        description: '需要使用最近24小时内的设备数据，过时数据会导致分析结果不准确',
        severity: 'high',
        solution: '确保IoT数据通道正常，检查last_update时间戳',
      },
      {
        id: 'constraint_conflicts',
        title: '约束条件冲突',
        description: '人工排班和设备维护窗口可能存在时间冲突',
        severity: 'medium',
        solution: '在constraints中明确优先级规则',
      },
      {
        id: 'batch_size_limit',
        title: '批量处理限制',
        description: '单次优化最多支持50个订单，超出需要分批处理',
        severity: 'low',
        solution: '使用分批处理模式或联系管理员扩容',
      },
    ],
    files: {
      readme: `# OEE智能优化

## 描述
基于设备数据自动分析OEE（整体设备效率）指标，识别时间损失、速度损失和质量损失，运用遗传算法生成排产优化方案，提升设备综合效率。适用于离散制造和流程制造场景。

## 使用场景
1. 月度/周度排产规划与优化
2. 紧急订单插入影响评估与调整
3. 设备维护窗口最优时机计算
4. 产能瓶颈识别与缓解方案生成
5. 多品种小批量换线优化

## 初始化
1. 配置设备数据接入（MES/SCADA系统对接）
2. 定义班次日历与节假日安排
3. 设置工艺路线与标准工时
4. 配置约束条件（物料/人员/设备）
5. 验证OEE计算公式与基准值

## Gotchas
- 数据时效性要求24小时内，过时数据会导致分析结果不准确
- 人工排班和设备维护窗口可能存在时间冲突
- 单次优化最多支持50个订单，超出需要分批处理
- 换线时间未准确记录会导致OEE计算偏差
- 设备理论节拍需定期校准

## 核心工作流
1. 数据采集与清洗（状态/产量/质量数据）
2. OEE三要素计算（可用率×性能率×质量率）
3. 损失分析（识别六大损失类型）
4. 瓶颈设备识别与影响评估
5. 遗传算法优化求解
6. 排产方案生成与可视化
7. 结果验证与KPI预测

## 输入规范
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| equipment_data | object | 是 | 设备运行数据，含状态/产量/报警 |
| production_plan | object | 是 | 生产计划，含订单/数量/交期 |
| historical_oee | object | 否 | 历史OEE数据用于趋势分析 |
| constraints | object | 否 | 约束条件，含资源/时间/工艺限制 |

## 输出规范
| 参数 | 类型 | 说明 |
|------|------|------|
| optimized_schedule | object | 优化后排程方案，含开始/结束时间 |
| bottleneck_analysis | object | 瓶颈分析结果与改进建议 |
| oee_prediction | number | 预测OEE值（0-1） |
| expected_improvement | string | 预期改进幅度描述 |

## 依赖的Skill
- data_preprocessing_v2（数据预处理）
- production_data_connector_v1（生产数据连接器）
- scheduling_algorithm_lib_v3（排产算法库）

## 参考文档
- OEE白皮书 -  overall equipment effectiveness
- SEMI E10/E79 设备可靠性标准
- APICS排产与计划最佳实践指南`,
      config: '{"max_orders": 50, "algorithm": "genetic"}',
      script: `class SkillExecutor:
    def execute(self, event):
        # OEE优化逻辑
        equipment_data = event.get('equipment_data')
        production_plan = event.get('production_plan')
        # 执行OEE计算和优化
        return result`,
      script_lang: 'python',
      references: ['OEE_Calculation_Standard_v3.pdf', 'SEMI_E10_E79_Standard.pdf'],
    },
    installation: {
      installed: false,
    },
  },
  {
    skill_id: 'root_cause_analysis_v3',
    name: '质量根因分析',
    version: '3.0.2',
    domain: ['quality', 'production'],
    capability_tags: ['analysis', 'diagnosis', 'graph_reasoning'],
    category: 'data-analysis',
    description: '基于知识图谱和历史案例，快速定位质量问题的根本原因',
    author: '质量控制团队',
    created_at: '2023-11-08',
    updated_at: '2024-02-15',
    cost: 0.82,
    latency: 230,
    accuracy_score: 0.88,
    roi: '-30%诊断时间',
    input_schema: {
      sensor_data: 'object',
      quality_report: 'object',
      process_params: 'object',
    },
    output_schema: {
      root_causes: 'array',
      correlation_graph: 'object',
      recommendations: 'array',
    },
    trigger_conditions: {
      description: '当出现质量异常需要定位根因时触发',
      examples: [
        '分析一下这批不良品的原因',
        '为什么涂层厚度不均匀',
        '找出质量问题的根因',
      ],
      keywords: ['根因', '分析', '质量', '缺陷', '不良', '原因'],
    },
    gotchas: [
      {
        id: 'insufficient_data',
        title: '数据量不足',
        description: '需要至少3个相似历史案例才能进行图谱推理',
        severity: 'high',
        solution: '积累更多案例或降低置信度阈值',
      },
      {
        id: 'multi_root_causes',
        title: '多根因场景',
        description: '复杂问题可能存在多个根因，系统只返回置信度最高的3个',
        severity: 'medium',
        solution: '查看完整图谱获取所有可能根因',
      },
    ],
    files: {
      readme: `# 质量根因分析\n\n## 描述\n基于知识图谱和历史案例库，利用图神经网络推理技术，快速定位生产质量问题的根本原因。适用于各类制造业质量异常诊断场景。\n\n## 使用场景\n1. 锂电池极片涂布厚度不均匀根因分析\n2. 焊接虚焊缺陷快速定位\n3. 产品尺寸超差问题诊断\n4. 原材料批次异常追溯\n5. 工艺参数漂移影响评估\n\n## 初始化\n1. 配置知识图谱连接（Neo4j地址、用户名、密码）\n2. 导入历史案例库（至少100条标注案例）\n3. 设置相似度阈值（默认0.75）\n4. 验证图谱Schema与产线数据映射\n\n## Gotchas\n- 需要至少3个相似历史案例才能进行图谱推理\n- 复杂问题可能存在多个根因，系统只返回置信度最高的3个\n- 图谱更新后需要重新训练嵌入向量\n- 跨产品线案例不能直接复用\n\n## 核心工作流\n1. 质量数据标准化与特征提取\n2. 历史案例相似度匹配\n3. 知识图谱子图检索\n4. 图神经网络推理\n5. 根因排序与置信度计算\n6. 推荐方案生成\n\n## 输入规范\n| 参数 | 类型 | 必填 | 说明 |\n|------|------|------|------|\n| sensor_data | object | 是 | 传感器实时数据，包含温度/压力/流量等 |\n| quality_report | object | 是 | 质检报告，包含缺陷类型/数量/位置 |\n| process_params | object | 否 | 工艺参数设置值 |\n\n## 输出规范\n| 参数 | 类型 | 说明 |\n|------|------|------|\n| root_causes | array | 根因列表，按置信度排序 |\n| correlation_graph | object | 关联关系图谱子图 |\n| recommendations | array | 改进建议列表 |\n\n## 依赖的Skill\n- data_preprocessing_v2（数据预处理）\n- graph_query_engine_v1（图谱查询引擎）\n\n## 参考文档\n- ISO 9001:2015 质量管理体系要求\n- GB/T 19001-2016 质量管理原则\n- Knowledge Graph-based Root Cause Analysis in Manufacturing`,
      config: '{"similarity_threshold": 0.75, "max_cases": 50}',
      script: `class RootCauseAnalyzer:\n    def execute(self, event):\n        # 质量根因分析逻辑\n        sensor_data = event.get('sensor_data')\n        quality_report = event.get('quality_report')\n        # 执行图谱推理\n        return result`,
      script_lang: 'python',
      references: ['ISO_9001_2015.pdf', 'Knowledge_Graph_RCA_Manufacturing.pdf'],
    },
    installation: {
      installed: true,
      installed_at: '2024-03-01',
      installed_version: '3.0.0',
      path: '/skills/root_cause_analysis_v3',
    },
  },
  {
    skill_id: 'carbon_emission_tracker_v1',
    name: '碳排放追踪',
    version: '1.5.0',
    domain: ['sustainability', 'energy'],
    capability_tags: ['carbon', 'tracking', 'reporting'],
    category: 'carbon-energy',
    description: '实时追踪生产过程的碳排放，自动生成碳足迹报告',
    author: '能源管理团队',
    created_at: '2024-02-01',
    updated_at: '2024-03-10',
    cost: 0.65,
    latency: 120,
    accuracy_score: 0.94,
    roi: '合规+品牌增值',
    input_schema: {
      energy_consumption: 'object',
      production_volume: 'number',
      material_usage: 'object',
    },
    output_schema: {
      carbon_footprint: 'number',
      emission_report: 'object',
      reduction_suggestions: 'array',
    },
    trigger_conditions: {
      description: '需要计算碳排放、生成碳报告时触发',
      examples: [
        '计算本月碳排放',
        '生成碳足迹报告',
        '分析节能减排空间',
      ],
      keywords: ['碳排放', '碳足迹', '节能', '环保', 'ESG'],
    },
    gotchas: [
      {
        id: 'emission_factor_update',
        title: '排放因子时效性',
        description: '国家排放因子每年更新，使用过期的因子会导致计算偏差',
        severity: 'high',
        solution: '定期检查并更新emission_factors.json',
      },
      {
        id: 'missing_scope3_data',
        title: '范围三数据缺失',
        description: '供应链上游排放数据难以获取，导致Scope 3计算不完整',
        severity: 'medium',
        solution: '使用行业平均值估算或要求供应商提供数据',
      },
    ],
    files: {
      readme: `# 碳排放追踪\n\n## 描述\n实时追踪生产过程的碳排放数据，根据ISO 14064标准计算碳足迹，自动生成符合GHG Protocol的排放报告。支持范围一、范围二、范围三排放的完整核算。\n\n## 使用场景\n1. 月度碳排放核算与报告生成\n2. 产品全生命周期碳足迹计算\n3. 碳中和路径规划与模拟\n4. ESG合规报告自动化\n5. 供应链碳排放强度评估\n\n## 初始化\n1. 配置排放因子库（下载最新国家因子表）\n2. 设置组织边界与运营边界\n3. 接入能源计量系统（电/气/油/热）\n4. 建立物料BOM与排放因子映射\n5. 验证计算结果与历史数据对比\n\n## Gotchas\n- 国家排放因子每年更新，使用过期的因子会导致计算偏差\n- 范围三数据依赖供应商配合，可能存在数据缺失\n- 电力排放因子应使用区域电网因子而非全国平均\n- 生物质燃料燃烧排放需单独核算\n\n## 核心工作流\n1. 能源消耗数据采集与清洗\n2. 活动数据乘以排放因子计算直接排放\n3. 外购电力间接排放计算\n4. 供应链上游排放估算\n5. 排放汇总与分类统计\n6. 报告生成与趋势分析\n\n## 输入规范\n| 参数 | 类型 | 必填 | 说明 |\n|------|------|------|------|\n| energy_consumption | object | 是 | 能源消耗明细，含电/天然气/柴油等 |\n| production_volume | number | 是 | 产量，用于计算单位产品排放 |\n| material_usage | object | 否 | 原材料使用量，用于Scope 3计算 |\n\n## 输出规范\n| 参数 | 类型 | 说明 |\n|------|------|------|\n| carbon_footprint | number | 总碳排放量（吨CO2e） |\n| emission_report | object | 详细排放报告，按Scope分类 |\n| reduction_suggestions | array | 减排建议列表 |\n\n## 依赖的Skill\n- energy_data_collector_v1（能源数据采集）\n- emission_factor_db_v1（排放因子数据库）\n\n## 参考文档\n- ISO 14064-1:2018 温室气体核算与验证\n- GHG Protocol Corporate Standard\n- 生态环境部《企业温室气体排放核算方法与报告指南》`,
      config: '{"emission_factor_version": "2024v1", "grid_region": "east_china"}',
      script: `class CarbonEmissionTracker:\n    def execute(self, event):\n        # 碳排放计算逻辑\n        energy = event.get('energy_consumption')\n        # 计算排放\n        return result`,
      script_lang: 'python',
      references: ['ISO_14064_2018.pdf', 'GHG_Protocol_Corporate.pdf'],
    },
    installation: {
      installed: false,
    },
  },
  {
    skill_id: 'supply_chain_simulator_v2',
    name: '供应链仿真',
    version: '2.0.1',
    domain: ['supply_chain', 'logistics'],
    capability_tags: ['simulation', 'risk', 'monte_carlo'],
    category: 'workflow',
    description: '蒙特卡洛仿真评估供应链风险，生成应急预案',
    author: '供应链运营团队',
    created_at: '2023-09-20',
    updated_at: '2024-01-25',
    cost: 0.88,
    latency: 520,
    accuracy_score: 0.85,
    roi: '-20%缺货风险',
    input_schema: {
      supplier_data: 'object',
      inventory: 'object',
      demand_forecast: 'object',
    },
    output_schema: {
      risk_assessment: 'object',
      scenarios: 'array',
      contingency_plan: 'string',
    },
    trigger_conditions: {
      description: '评估供应链风险、制定应急预案时触发',
      examples: [
        '供应商中断风险评估',
        '生成应急预案',
        'what-if分析',
      ],
      keywords: ['供应链', '仿真', '风险', '应急', 'what-if'],
    },
    gotchas: [
      {
        id: 'long_runtime',
        title: '执行时间较长',
        description: '蒙特卡洛仿真需要运行10000次迭代，耗时约5分钟',
        severity: 'medium',
        solution: '使用异步模式或降低迭代次数',
      },
      {
        id: 'demand_volatility',
        title: '需求波动假设',
        description: '需求预测的不确定性分布假设直接影响仿真结果可靠性',
        severity: 'high',
        solution: '使用历史需求数据拟合真实分布，避免简单正态分布假设',
      },
      {
        id: 'supplier_correlation',
        title: '供应商相关性',
        description: '多个供应商同时中断的风险被低估，因为存在地域相关性',
        severity: 'high',
        solution: '建立供应商风险相关性矩阵',
      },
    ],
    files: {
      readme: `# 供应链仿真\n\n## 描述\n基于蒙特卡洛方法的供应链风险仿真系统，模拟各种中断场景下的供应链表现，量化评估缺货风险、库存成本和服务水平，自动生成应急预案建议。\n\n## 使用场景\n1. 关键供应商中断影响评估\n2. 安全库存水平优化\n3. 新供应商引入风险评估\n4. 需求激增场景压力测试\n5. 多层级供应链瓶颈识别\n\n## 初始化\n1. 导入供应商主数据（交付周期、合格率、产能）\n2. 配置库存策略参数（补货点、批量、提前期）\n3. 设置需求预测数据与置信区间\n4. 定义中断场景概率分布\n5. 运行基线仿真校准模型\n\n## Gotchas\n- 蒙特卡洛仿真需要运行10000次迭代，耗时约5分钟\n- 需求预测的不确定性分布假设直接影响结果可靠性\n- 多个供应商同时中断的风险被低估（地域相关性）\n- 仿真结果仅反映统计概率，不保证实际表现\n\n## 核心工作流\n1. 供应链网络建模（节点与流向）\n2. 参数分布设定（需求/交付/质量）\n3. 蒙特卡洛随机抽样\n4. 库存动态模拟（逐日/逐周）\n5. 关键指标统计（缺货率/成本/服务率）\n6. 敏感性分析与情景对比\n7. 应急预案生成\n\n## 输入规范\n| 参数 | 类型 | 必填 | 说明 |\n|------|------|------|------|\n| supplier_data | object | 是 | 供应商数据，含交付周期/合格率/产能 |\n| inventory | object | 是 | 当前库存状态与策略参数 |\n| demand_forecast | object | 是 | 需求预测值与置信区间 |\n\n## 输出规范\n| 参数 | 类型 | 说明 |\n|------|------|------|\n| risk_assessment | object | 综合风险评估结果 |\n| scenarios | array | 各种情景下的表现统计 |\n| contingency_plan | string | 应急预案建议文本 |\n\n## 依赖的Skill\n- demand_forecasting_v2（需求预测）\n- inventory_optimizer_v1（库存优化）\n\n## 参考文档\n- Supply Chain Operations Reference (SCOR) Model\n- Simchi-Levi《Designing and Managing the Supply Chain》\n- 蒙特卡洛方法在供应链风险分析中的应用研究`,
      config: '{"iterations": 10000, "confidence_level": 0.95}',
      script: `class SupplyChainSimulator:\n    def execute(self, event):\n        # 供应链仿真逻辑\n        supplier_data = event.get('supplier_data')\n        # 执行蒙特卡洛仿真\n        return result`,
      script_lang: 'python',
      references: ['SCOR_Model_12.0.pdf', 'Monte_Carlo_Supply_Chain.pdf'],
    },
    installation: {
      installed: false,
    },
  },
  {
    skill_id: 'equipment_health_diagnosis_v2',
    name: '设备健康诊断',
    version: '2.2.0',
    domain: ['equipment', 'maintenance'],
    capability_tags: ['health', 'diagnosis', 'predictive'],
    category: 'infrastructure',
    description: '基于振动、温度、电流数据评估设备健康状态',
    author: '设备管理团队',
    created_at: '2023-11-10',
    updated_at: '2024-02-28',
    cost: 0.71,
    latency: 180,
    accuracy_score: 0.89,
    roi: '-22%非计划停机',
    input_schema: {
      vibration_data: 'array',
      temperature: 'number',
      current_waveform: 'array',
    },
    output_schema: {
      health_score: 'number',
      fault_modes: 'array',
      remaining_life: 'number',
    },
    trigger_conditions: {
      description: '设备健康评估、故障预测时触发',
      examples: [
        '诊断这台设备的健康状况',
        '预测轴承剩余寿命',
        '分析异常振动原因',
      ],
      keywords: ['设备', '健康', '诊断', '故障', '预测', '振动'],
    },
    gotchas: [
      {
        id: 'sensor_calibration',
        title: '传感器校准',
        description: '振动传感器需要每月校准，未校准数据会导致误诊',
        severity: 'critical',
        solution: '检查传感器calibration_date',
      },
      {
        id: 'baseline_drift',
        title: '基线漂移',
        description: '设备长期运行后振动基线会发生自然漂移，固定阈值会误报',
        severity: 'high',
        solution: '定期更新健康基线或启用自适应阈值',
      },
      {
        id: 'load_variation',
        title: '负载变化干扰',
        description: '生产负载变化会影响振动幅值，与故障特征混淆',
        severity: 'medium',
        solution: '结合负载数据进行归一化处理',
      },
    ],
    files: {
      readme: `# 设备健康诊断\n\n## 描述\n基于多源传感器数据（振动、温度、电流）的设备健康状态评估系统。采用信号处理、特征提取和机器学习算法，实现故障早期预警、故障模式识别和剩余使用寿命预测。\n\n## 使用场景\n1. 旋转机械（电机/泵/风机）健康监测\n2. 轴承早期故障预警\n3. 润滑状态评估与换油建议\n4. 设备剩余寿命预测（RUL）\n5. 维护计划优化与备件准备\n\n## 初始化\n1. 配置传感器接入（振动采样率≥10kHz）\n2. 设置设备基础信息（型号/服役年限/历史维修记录）\n3. 建立健康基线（采集正常运行数据1周）\n4. 配置报警阈值（ISO 10816标准参考）\n5. 训练或加载故障诊断模型\n\n## Gotchas\n- 振动传感器需要每月校准，未校准数据会导致误诊\n- 设备长期运行后振动基线会发生自然漂移\n- 生产负载变化会影响振动幅值，与故障特征混淆\n- 高频采样数据量大，注意存储和传输带宽\n\n## 核心工作流\n1. 多通道信号采集与同步\n2. 信号预处理（滤波/降噪/归一化）\n3. 时频域特征提取（RMS/峰值/频谱）\n4. 健康指标计算与趋势分析\n5. 故障模式匹配与置信度评估\n6. 剩余寿命预测（基于退化模型）\n7. 诊断报告生成与维护建议\n\n## 输入规范\n| 参数 | 类型 | 必填 | 说明 |\n|------|------|------|------|\n| vibration_data | array | 是 | 振动时序数据，采样率≥10kHz |\n| temperature | number | 是 | 设备表面温度（摄氏度） |\n| current_waveform | array | 否 | 电流波形数据用于电气故障诊断 |\n\n## 输出规范\n| 参数 | 类型 | 说明 |\n|------|------|------|\n| health_score | number | 健康评分0-100 |\n| fault_modes | array | 识别的故障模式列表 |\n| remaining_life | number | 预测剩余寿命（天） |\n\n## 依赖的Skill\n- signal_processor_v1（信号处理）\n- feature_extractor_v2（特征提取）\n- failure_mode_library_v1（故障模式库）\n\n## 参考文档\n- ISO 10816 机械振动 - 通过非旋转部件测量评估机器振动\n- ISO 17359 机器状态监测与诊断\n- 齿轮和轴承故障诊断的振动分析技术`,
      config: '{"sampling_rate": 10240, "analysis_window": 4096}',
      script: `class EquipmentHealthDiagnosis:\n    def execute(self, event):\n        # 设备健康诊断逻辑\n        vibration = event.get('vibration_data')\n        # 执行信号分析和故障诊断\n        return result`,
      script_lang: 'python',
      references: ['ISO_10816_Mechanical_Vibration.pdf', 'Vibration_Analysis_Rotating_Machinery.pdf'],
    },
    installation: {
      installed: true,
      installed_at: '2024-02-15',
      installed_version: '2.0.0',
      path: '/skills/equipment_health_diagnosis_v2',
    },
  },
];

// ==================== Skill Graph ====================

export const mockSkillGraph: SkillGraph = {
  id: 'graph-001',
  name: '智能排产决策链',
  description: '从需求解析到最终排产方案的完整决策流程',
  version: '1.0.0',
  author: '智能制造团队',
  created_at: '2024-03-01',
  updated_at: '2024-03-20',
  parallel_enabled: true,
  max_concurrency: 4,
  timeout: 30000,
  business_goal: '提升排产效率30%，降低成本15%',
  expected_roi: 4.5,
  nodes: [
    {
      id: 'input',
      type: 'input',
      name: '需求输入',
      position: { x: 50, y: 200 },
      input_schema: { demand: 'number', deadline: 'string' },
    },
    {
      id: 'decompose',
      type: 'skill',
      name: '任务拆解',
      position: { x: 200, y: 200 },
      status: 'success',
    },
    {
      id: 'router',
      type: 'router',
      name: '复杂度判断',
      position: { x: 350, y: 200 },
      condition: 'complexity > 0.7',
      branches: [
        { label: '高复杂度', condition: 'complexity > 0.7', target: 'optimize-advanced' },
        { label: '低复杂度', condition: 'complexity <= 0.7', target: 'optimize-simple' },
      ],
    },
    {
      id: 'optimize-simple',
      type: 'skill',
      name: '快速排产',
      position: { x: 500, y: 100 },
      status: 'idle',
    },
    {
      id: 'optimize-advanced',
      type: 'skill',
      name: '智能排产',
      position: { x: 500, y: 300 },
      status: 'idle',
    },
    {
      id: 'merge',
      type: 'merge',
      name: '结果合并',
      position: { x: 650, y: 200 },
    },
    {
      id: 'output',
      type: 'output',
      name: '最终方案',
      position: { x: 800, y: 200 },
    },
  ],
  edges: [
    { id: 'e1', from: 'input', to: 'decompose', type: 'data' },
    { id: 'e2', from: 'decompose', to: 'router', type: 'data' },
    { id: 'e3', from: 'router', to: 'optimize-simple', type: 'control', condition: 'complexity <= 0.7' },
    { id: 'e4', from: 'router', to: 'optimize-advanced', type: 'control', condition: 'complexity > 0.7' },
    { id: 'e5', from: 'optimize-simple', to: 'merge', type: 'data' },
    { id: 'e6', from: 'optimize-advanced', to: 'merge', type: 'data' },
    { id: 'e7', from: 'merge', to: 'output', type: 'data' },
  ],
};

// ==================== Workflow ====================

export const mockWorkflow: Workflow = {
  id: 'wf-001',
  name: '生产排产工作流',
  description: '从需求到最终排产方案的完整自动化流程',
  version: '1.2.0',
  author: '智能制造团队',
  status: 'active',
  created_at: '2024-02-01',
  updated_at: '2024-03-20',
  input: [
    { name: 'demand', type: 'number', required: true, description: '需求量' },
    { name: 'deadline', type: 'string', required: true, description: '交付日期' },
  ],
  output: [
    { name: 'schedule', type: 'object', required: true, description: '排产方案' },
  ],
  steps: [
    {
      id: 'decompose',
      type: 'skill',
      name: '任务拆解',
      skill_id: 'oee_optimizer_v2',
      depends_on: [],
    },
    {
      id: 'optimize',
      type: 'skill',
      name: '智能排产',
      skill_id: 'oee_optimizer_v2',
      depends_on: ['decompose'],
    },
  ],
  config: {
    parallel: true,
    max_concurrency: 4,
    timeout: 30000,
    retry_policy: {
      max_retries: 3,
      backoff: 'exponential',
      delay: 1000,
    },
  },
};

// ==================== Evolution Status ====================

export const mockEvolutionStatus: EvolutionStatus = {
  current_hit_rate: 0.82,
  current_success_rate: 0.91,
  current_latency: 145,
  hit_rate_trend: 'stable',
  success_rate_trend: 'up',
  issues: [
    {
      type: 'trigger',
      severity: 'medium',
      description: '触发阈值可能需要微调',
      evidence: ['最近30天部分查询未被正确路由'],
      impact: '用户可能需要多次尝试',
    },
  ],
  suggestions: [
    {
      id: 's1',
      type: 'prompt',
      title: '优化输出格式',
      description: '增加更多示例帮助用户理解输出',
      expected_improvement: '用户满意度+15%',
      confidence: 0.85,
      auto_applicable: true,
    },
  ],
  auto_optimize: false,
  optimization_history: [
    {
      timestamp: '2024-02-15',
      type: 'prompt',
      changes: '优化输出格式',
      before: { success_rate: 0.88, latency: 160 },
      after: { success_rate: 0.91, latency: 145 },
      applied_by: 'manual',
    },
  ],
};

// ==================== ROI Dashboard ====================

export const mockROIDashboard: ROIDashboard = {
  summary: {
    total_skills: 34,
    total_roi: 4.2,
    total_savings: 12500000,
    total_revenue: 4800000,
  },
  top_performers: [],
  needs_attention: [],
  trends: {
    daily: [],
    weekly: [],
    monthly: [],
  },
};

// ==================== Agent Runtime ====================

export const mockAgentRuntime: AgentRuntime = {
  id: 'runtime-001',
  name: '生产决策Agent',
  status: 'running',
  intent_parser: {
    model: 'gpt-4',
    temperature: 0.2,
    max_tokens: 500,
  },
  skill_router: {
    strategy: 'hybrid',
    top_k: 3,
    threshold: 0.75,
  },
  planner: {
    strategy: 'llm',
    max_depth: 5,
  },
  executor: {
    parallel: true,
    max_concurrency: 4,
    timeout: 30000,
  },
  memory: {
    type: 'hybrid',
    max_context_length: 8000,
  },
  evaluator: {
    enabled: true,
    metrics: ['success_rate', 'latency'],
  },
};

// ==================== Execution Context ====================

export const mockExecutionContext: ExecutionContext = {
  id: 'exec-001',
  workflow_id: 'wf-001',
  input: { demand: 5000, deadline: '2024-04-01' },
  status: 'running',
  current_step: 'optimize',
  step_results: {
    decompose: {
      step_id: 'decompose',
      status: 'success',
      input: { demand: 5000 },
      output: { tasks: 12 },
      latency: 120,
      started_at: '2024-03-20T10:00:00Z',
      completed_at: '2024-03-20T10:00:02Z',
    },
  },
  started_at: '2024-03-20T10:00:00Z',
  logs: [
    { timestamp: '2024-03-20T10:00:00Z', level: 'info', message: 'Workflow started' },
  ],
};
