import React, { useState, useMemo } from 'react';
import { 
  Database, Plus, Search, CheckCircle2, GitMerge, Link2, Layers, Cpu, 
  ChevronRight, ChevronDown, Box, FileText, Terminal, Play,
  Wand2, Save, Server, Table2, Sparkles, ArrowRight, Network, Settings,
  Activity, ShieldCheck, Wrench, Users, Headset, Truck, FileSpreadsheet, AlertTriangle,
  Trash2, Edit3, X
} from 'lucide-react';
import { cn } from '../lib/utils';

type TabKey = 'discovery' | 'mapping' | 'relations' | 'instances';

// --- Expanded Mock Data for Lithium Battery Manufacturing ---
const DATA_SOURCES = [
  { 
    id: 'mes', name: 'MES 制造执行系统', type: 'mysql', icon: Server, color: 'text-blue-500',
    tables: [
      { 
        id: 'mes_production_line', name: 'production_line', rows: 12, recognizedAs: 'ProductionLine', confidence: 95,
        reasons: ['表名 production_line 强语义匹配', '包含典型特征字段 capacity_per_hour'],
        fields: [
          { name: 'id', type: 'varchar(32)', comment: '主键' },
          { name: 'line_code', type: 'varchar(50)', comment: '产线编码 (如: 涂布一线)' },
          { name: 'capacity_per_hour', type: 'int', comment: '小时产能 (PPM)' },
          { name: 'current_status', type: 'varchar(20)', comment: '当前状态 (运行/停机/待机)' },
          { name: 'workshop_id', type: 'varchar(32)', comment: '所属车间' },
        ]
      },
      { 
        id: 'mes_device_master', name: 'device_master', rows: 156, recognizedAs: 'Device', confidence: 92,
        reasons: ['表名 device_master 匹配设备主数据', '包含 device_code, model_number'],
        fields: [
          { name: 'id', type: 'varchar(32)', comment: '主键' },
          { name: 'device_code', type: 'varchar(50)', comment: '设备编号 (如: COAT-001)' },
          { name: 'device_type', type: 'varchar(50)', comment: '设备类型 (涂布机/辊压机/卷绕机)' },
          { name: 'installation_date', type: 'date', comment: '安装日期' },
          { name: 'status', type: 'varchar(20)', comment: '设备状态' },
        ]
      },
      { 
        id: 'mes_work_order', name: 'work_order', rows: 5000, recognizedAs: 'WorkOrder', confidence: 88,
        reasons: ['表名 work_order 匹配工单实体', '包含 planned_qty, actual_qty'],
        fields: [
          { name: 'id', type: 'varchar(32)', comment: '主键' },
          { name: 'wo_number', type: 'varchar(50)', comment: '工单号' },
          { name: 'product_id', type: 'varchar(32)', comment: '产品ID (如: LFP-100Ah电芯)' },
          { name: 'planned_qty', type: 'int', comment: '计划生产数量' },
          { name: 'actual_qty', type: 'int', comment: '实际产出数量' },
          { name: 'status', type: 'varchar(20)', comment: '工单状态 (下达/执行中/完工)' },
        ]
      },
      { 
        id: 'mes_process_route', name: 'process_route', rows: 45, recognizedAs: 'ProcessRoute', confidence: 94,
        reasons: ['表名 process_route 匹配工艺路线', '包含 step_sequence, standard_time'],
        fields: [
          { name: 'id', type: 'varchar(32)', comment: '主键' },
          { name: 'route_code', type: 'varchar(50)', comment: '路线编码 (如: NCM-811-标准工艺)' },
          { name: 'step_sequence', type: 'int', comment: '工序序号 (10, 20, 30...)' },
          { name: 'step_name', type: 'varchar(50)', comment: '工序名称 (搅拌/涂布/辊压/分切)' },
          { name: 'standard_time', type: 'decimal(8,2)', comment: '标准工时(秒)' },
        ]
      },
    ]
  },
  { 
    id: 'erp', name: 'ERP 企业资源计划', type: 'oracle', icon: Database, color: 'text-indigo-500',
    tables: [
      { 
        id: 'erp_sales_order', name: 'sales_order', rows: 12000, recognizedAs: 'SalesOrder', confidence: 85,
        reasons: ['表名 sales_order 匹配销售订单', '包含 customer_id, total_amount'],
        fields: [
          { name: 'id', type: 'varchar(32)', comment: '主键' },
          { name: 'order_no', type: 'varchar(50)', comment: '订单编号' },
          { name: 'customer_id', type: 'varchar(32)', comment: '客户ID (如: 某新能源车企)' },
          { name: 'total_amount', type: 'decimal(10,2)', comment: '订单总金额' },
          { name: 'delivery_date', type: 'date', comment: '交货日期' },
        ]
      },
      { 
        id: 'erp_purchase_order', name: 'purchase_order', rows: 8500, recognizedAs: 'PurchaseOrder', confidence: 87,
        reasons: ['表名 purchase_order 匹配采购订单', '包含 supplier_id, material_code'],
        fields: [
          { name: 'id', type: 'varchar(32)', comment: '主键' },
          { name: 'po_number', type: 'varchar(50)', comment: '采购单号' },
          { name: 'supplier_id', type: 'varchar(32)', comment: '供应商ID (如: 某碳酸锂供应商)' },
          { name: 'material_code', type: 'varchar(50)', comment: '采购物料编码' },
          { name: 'expected_arrival', type: 'date', comment: '预计到货日期' },
        ]
      },
      { 
        id: 'erp_inventory', name: 'inventory_ledger', rows: 45000, recognizedAs: 'Inventory', confidence: 89,
        reasons: ['表名 inventory_ledger 匹配库存台账', '包含 material_code, current_stock'],
        fields: [
          { name: 'id', type: 'varchar(32)', comment: '主键' },
          { name: 'material_code', type: 'varchar(50)', comment: '物料编码 (如: 正极材料/铝箔)' },
          { name: 'warehouse_id', type: 'varchar(32)', comment: '仓库ID' },
          { name: 'current_stock', type: 'decimal(10,2)', comment: '当前库存量' },
          { name: 'unit', type: 'varchar(10)', comment: '计量单位 (kg/卷/pcs)' },
        ]
      },
      { 
        id: 'erp_supplier', name: 'supplier_master', rows: 320, recognizedAs: 'Supplier', confidence: 93,
        reasons: ['表名 supplier_master 匹配供应商档案', '包含 credit_level, contact_info'],
        fields: [
          { name: 'id', type: 'varchar(32)', comment: '主键' },
          { name: 'supplier_code', type: 'varchar(50)', comment: '供应商编码' },
          { name: 'supplier_name', type: 'varchar(100)', comment: '供应商名称' },
          { name: 'credit_level', type: 'varchar(10)', comment: '信用等级 (A/B/C/D)' },
          { name: 'contact_info', type: 'varchar(100)', comment: '联系方式' },
        ]
      },
    ]
  },
  { 
    id: 'plm', name: 'PLM 产品生命周期 (BOM)', type: 'postgresql', icon: Layers, color: 'text-purple-500',
    tables: [
      { 
        id: 'plm_bom_master', name: 'bom_master', rows: 340, recognizedAs: 'BOM', confidence: 96,
        reasons: ['表名 bom_master 强语义匹配', '包含 product_code, version'],
        fields: [
          { name: 'id', type: 'varchar(32)', comment: '主键' },
          { name: 'bom_no', type: 'varchar(50)', comment: 'BOM编号' },
          { name: 'product_code', type: 'varchar(50)', comment: '成品编码 (如: NCM-811电池包)' },
          { name: 'version', type: 'varchar(10)', comment: 'BOM版本 (如: V1.2)' },
          { name: 'is_active', type: 'boolean', comment: '是否生效' },
        ]
      },
      { 
        id: 'plm_material_spec', name: 'material_spec', rows: 1200, recognizedAs: 'MaterialSpec', confidence: 82,
        reasons: ['表名 material_spec 匹配物料规格', '包含 thickness, width 等物理属性'],
        fields: [
          { name: 'id', type: 'varchar(32)', comment: '主键' },
          { name: 'material_code', type: 'varchar(50)', comment: '物料编码' },
          { name: 'thickness_um', type: 'decimal(8,2)', comment: '厚度(微米) - 极片关键参数' },
          { name: 'width_mm', type: 'decimal(8,2)', comment: '宽度(毫米)' },
          { name: 'weight_tolerance', type: 'decimal(5,2)', comment: '面密度公差(%)' },
        ]
      },
    ]
  },
  { 
    id: 'qms', name: 'QMS 质量管理系统', type: 'sqlserver', icon: ShieldCheck, color: 'text-emerald-500',
    tables: [
      { 
        id: 'qms_inspection', name: 'inspection_record', rows: 85000, recognizedAs: 'QualityInspection', confidence: 91,
        reasons: ['表名 inspection_record 匹配质检记录', '包含 result, defect_code'],
        fields: [
          { name: 'id', type: 'varchar(32)', comment: '主键' },
          { name: 'batch_no', type: 'varchar(50)', comment: '电芯批次号' },
          { name: 'step_name', type: 'varchar(50)', comment: '工序 (如: 化成/分容/OCV测试)' },
          { name: 'internal_resistance', type: 'decimal(8,2)', comment: '内阻测试值(mΩ)' },
          { name: 'voltage_drop', type: 'decimal(8,2)', comment: '压降测试值(mV)' },
          { name: 'result', type: 'varchar(10)', comment: '判定结果 (OK/NG)' },
        ]
      },
      { 
        id: 'qms_spc', name: 'spc_control_data', rows: 450000, recognizedAs: 'SPCData', confidence: 95,
        reasons: ['表名 spc_control_data 匹配统计过程控制', '包含 cp, cpk, ucl, lcl'],
        fields: [
          { name: 'id', type: 'varchar(32)', comment: '主键' },
          { name: 'parameter_id', type: 'varchar(50)', comment: '管控参数 (如: 涂布面密度)' },
          { name: 'cpk_value', type: 'decimal(5,2)', comment: '过程能力指数 CPK' },
          { name: 'ucl', type: 'decimal(8,2)', comment: '控制上限 (Upper Control Limit)' },
          { name: 'lcl', type: 'decimal(8,2)', comment: '控制下限 (Lower Control Limit)' },
          { name: 'is_out_of_control', type: 'boolean', comment: '是否失控' },
        ]
      }
    ]
  },
  { 
    id: 'scada', name: 'SCADA / IoT 物联平台', type: 'timescaledb', icon: Activity, color: 'text-amber-500',
    tables: [
      { 
        id: 'iot_telemetry', name: 'telemetry_data', rows: 999999, recognizedAs: 'Telemetry', confidence: 98,
        reasons: ['表名 telemetry_data 匹配时序遥测数据', '包含 timestamp, value'],
        fields: [
          { name: 'time', type: 'timestamp', comment: '时间戳' },
          { name: 'device_id', type: 'varchar(32)', comment: '设备ID' },
          { name: 'sensor_tag', type: 'varchar(50)', comment: '测点标签 (如: oven_temp_zone1)' },
          { name: 'value', type: 'float', comment: '采集值' },
          { name: 'unit', type: 'varchar(10)', comment: '单位 (℃, MPa, m/min)' },
        ]
      }
    ]
  },
  { 
    id: 'crm', name: 'CRM 客户关系管理', type: 'salesforce', icon: Users, color: 'text-rose-500',
    tables: [
      { 
        id: 'crm_customer', name: 'customer_profile', rows: 850, recognizedAs: 'Customer', confidence: 94,
        reasons: ['表名 customer_profile 匹配客户档案', '包含 industry, account_manager'],
        fields: [
          { name: 'id', type: 'varchar(32)', comment: '主键' },
          { name: 'customer_name', type: 'varchar(100)', comment: '客户名称 (如: 某造车新势力)' },
          { name: 'industry', type: 'varchar(50)', comment: '所属行业 (乘用车/储能/两轮车)' },
          { name: 'account_manager', type: 'varchar(50)', comment: '客户经理' },
          { name: 'risk_level', type: 'varchar(20)', comment: '风险评级' },
        ]
      },
      { 
        id: 'crm_complaint', name: 'after_sales_ticket', rows: 3200, recognizedAs: 'CustomerComplaint', confidence: 97,
        reasons: ['表名 after_sales_ticket 匹配售后客诉', '包含 issue_type, battery_pack_sn'],
        fields: [
          { name: 'id', type: 'varchar(32)', comment: '主键' },
          { name: 'ticket_no', type: 'varchar(50)', comment: '客诉工单号' },
          { name: 'customer_id', type: 'varchar(32)', comment: '关联客户' },
          { name: 'battery_pack_sn', type: 'varchar(50)', comment: '电池包SN码 (用于追溯)' },
          { name: 'issue_type', type: 'varchar(50)', comment: '问题分类 (如: 压差大/漏液/热失控)' },
          { name: 'resolution_status', type: 'varchar(20)', comment: '处理状态 (新建/分析中/已结案)' },
        ]
      }
    ]
  },
  { 
    id: 'eam', name: 'EAM 设备资产管理', type: 'sqlserver', icon: Wrench, color: 'text-orange-500',
    tables: [
      { 
        id: 'eam_maintenance', name: 'maintenance_order', rows: 15000, recognizedAs: 'MaintenanceOrder', confidence: 96,
        reasons: ['表名 maintenance_order 匹配维修工单', '包含 maint_type, est_time'],
        fields: [
          { name: 'id', type: 'varchar(32)', comment: '主键' },
          { name: 'work_order_no', type: 'varchar(50)', comment: '维修工单号' },
          { name: 'device_id', type: 'varchar(32)', comment: '关联设备' },
          { name: 'maint_type', type: 'varchar(20)', comment: '维修类型 (预防性/纠正性)' },
          { name: 'est_time', type: 'decimal(5,1)', comment: '预计工时(小时)' },
          { name: 'status', type: 'varchar(20)', comment: '状态 (待分配/执行中/已完成)' },
        ]
      },
      { 
        id: 'eam_failure', name: 'equipment_failure_log', rows: 45000, recognizedAs: 'EquipmentFailure', confidence: 98,
        reasons: ['表名 equipment_failure_log 匹配故障记录', '包含 err_code, level'],
        fields: [
          { name: 'id', type: 'varchar(32)', comment: '主键' },
          { name: 'alarm_id', type: 'varchar(50)', comment: '报警编号' },
          { name: 'device_id', type: 'varchar(32)', comment: '发生设备' },
          { name: 'err_code', type: 'varchar(50)', comment: '故障代码 (如: ERR-SPINDLE-01)' },
          { name: 'level', type: 'varchar(10)', comment: '严重程度 (Critical/Warning)' },
          { name: 'time', type: 'timestamp', comment: '发生时间' },
        ]
      }
    ]
  },
  { 
    id: 'wms', name: 'WMS 仓储管理系统', type: 'mysql', icon: Box, color: 'text-teal-500',
    tables: [
      { 
        id: 'wms_spare_part', name: 'spare_part_inventory', rows: 8500, recognizedAs: 'SparePart', confidence: 95,
        reasons: ['表名 spare_part_inventory 匹配备件库存', '包含 qty_on_hand, bin_location'],
        fields: [
          { name: 'id', type: 'varchar(32)', comment: '主键' },
          { name: 'part_no', type: 'varchar(50)', comment: '备件编号 (如: SP-ROLLER-05)' },
          { name: 'part_name', type: 'varchar(100)', comment: '备件名称 (如: 涂布辊)' },
          { name: 'qty_on_hand', type: 'int', comment: '现有库存量' },
          { name: 'bin_location', type: 'varchar(50)', comment: '库位 (如: A-01-05)' },
        ]
      }
    ]
  },
  { 
    id: 'hrms', name: 'HRMS 人力资源管理', type: 'oracle', icon: Users, color: 'text-pink-500',
    tables: [
      { 
        id: 'hrms_employee', name: 'employee_roster', rows: 12000, recognizedAs: 'Technician', confidence: 88,
        reasons: ['表名 employee_roster 匹配员工花名册', '包含 certification, current_shift'],
        fields: [
          { name: 'id', type: 'varchar(32)', comment: '主键' },
          { name: 'employee_no', type: 'varchar(50)', comment: '工号' },
          { name: 'emp_name', type: 'varchar(50)', comment: '姓名' },
          { name: 'department', type: 'varchar(50)', comment: '部门 (如: 设备维修部)' },
          { name: 'certification', type: 'varchar(50)', comment: '技能认证级别 (如: 高级维修工)' },
          { name: 'current_shift', type: 'varchar(20)', comment: '当前班次 (白班/夜班)' },
        ]
      }
    ]
  }
];

const TEMPLATES = [
  { 
    id: 'tpl_factory', name: '工厂模板 (Factory)', category: '制造资源',
    structure: `{\n  "entity": "Factory",\n  "attributes": [\n    "factory_id", \n    "name", \n    "location",\n    "capacity"\n  ],\n  "relations": [\n    {"type": "contains", "target": "Workshop"}\n  ],\n  "behaviors": [\n    "calculate_overall_oee"\n  ]\n}`,
    mappings: [
      { source: 'factory_code', target: 'factory_id', status: 'mapped', auto: true },
      { source: 'factory_name', target: 'name', status: 'mapped', auto: true },
      { source: 'address', target: 'location', status: 'mapped', auto: true },
    ]
  },
  { 
    id: 'tpl_workshop', name: '车间模板 (Workshop)', category: '制造资源',
    structure: `{\n  "entity": "Workshop",\n  "attributes": [\n    "workshop_id", \n    "type", \n    "manager"\n  ],\n  "relations": [\n    {"type": "belongs_to", "target": "Factory"},\n    {"type": "contains", "target": "ProductionLine"}\n  ],\n  "behaviors": [\n    "monitor_environment"\n  ]\n}`,
    mappings: [
      { source: 'ws_code', target: 'workshop_id', status: 'mapped', auto: true },
      { source: 'ws_type', target: 'type', status: 'mapped', auto: true },
      { source: 'manager_id', target: 'manager', status: 'mapped', auto: true },
    ]
  },
  { 
    id: 'tpl_line', name: '产线模板 (ProductionLine)', category: '制造资源',
    structure: `{\n  "entity": "ProductionLine",\n  "attributes": [\n    "line_id", \n    "capacity", \n    "status",\n    "location"\n  ],\n  "relations": [\n    {"type": "belongs_to", "target": "Workshop"},\n    {"type": "contains", "target": "Device"},\n    {"type": "executes", "target": "WorkOrder"}\n  ],\n  "behaviors": [\n    "calculate_capacity",\n    "optimize_schedule"\n  ]\n}`,
    mappings: [
      { source: 'line_code', target: 'line_id', status: 'mapped', auto: true },
      { source: 'capacity_per_hour', target: 'capacity', status: 'mapped', auto: true },
      { source: 'current_status', target: 'status', status: 'mapped', auto: true },
      { source: 'workshop_id', target: 'location', status: 'unmapped', auto: false },
    ]
  },
  { 
    id: 'tpl_device', name: '设备模板 (Device)', category: '制造资源',
    structure: `{\n  "entity": "Device",\n  "attributes": [\n    "device_id", \n    "type", \n    "install_date",\n    "status"\n  ],\n  "relations": [\n    {"type": "belongs_to", "target": "ProductionLine"},\n    {"type": "generates", "target": "Telemetry"},\n    {"type": "requires", "target": "MaintenanceOrder"}\n  ],\n  "behaviors": [\n    "predict_maintenance",\n    "report_fault"\n  ]\n}`,
    mappings: [
      { source: 'device_code', target: 'device_id', status: 'mapped', auto: true },
      { source: 'device_type', target: 'type', status: 'mapped', auto: true },
      { source: 'installation_date', target: 'install_date', status: 'mapped', auto: true },
      { source: 'status', target: 'status', status: 'mapped', auto: true },
    ]
  },
  { 
    id: 'tpl_material', name: '物料模板 (Material)', category: '产品定义',
    structure: `{\n  "entity": "Material",\n  "attributes": [\n    "material_id", \n    "name", \n    "type",\n    "supplier"\n  ],\n  "relations": [\n    {"type": "supplied_by", "target": "Supplier"},\n    {"type": "consumed_by", "target": "Batch"}\n  ],\n  "behaviors": [\n    "check_inventory"\n  ]\n}`,
    mappings: [
      { source: 'material_code', target: 'material_id', status: 'mapped', auto: true },
      { source: 'material_name', target: 'name', status: 'mapped', auto: true },
      { source: 'category', target: 'type', status: 'mapped', auto: true },
    ]
  },
  { 
    id: 'tpl_product', name: '产品模板 (Product)', category: '产品定义',
    structure: `{\n  "entity": "Product",\n  "attributes": [\n    "product_id", \n    "model", \n    "capacity_ah"\n  ],\n  "relations": [\n    {"type": "defined_by", "target": "BOM"},\n    {"type": "produced_by", "target": "WorkOrder"}\n  ],\n  "behaviors": [\n    "track_lifecycle"\n  ]\n}`,
    mappings: [
      { source: 'product_code', target: 'product_id', status: 'mapped', auto: true },
      { source: 'model_name', target: 'model', status: 'mapped', auto: true },
      { source: 'nominal_capacity', target: 'capacity_ah', status: 'mapped', auto: true },
    ]
  },
  { 
    id: 'tpl_bom', name: 'BOM模板 (BillOfMaterial)', category: '产品定义',
    structure: `{\n  "entity": "BOM",\n  "attributes": [\n    "bom_id", \n    "product_code", \n    "version",\n    "active"\n  ],\n  "relations": [\n    {"type": "defines", "target": "Product"},\n    {"type": "requires", "target": "MaterialSpec"}\n  ],\n  "behaviors": [\n    "version_control",\n    "explode_bom"\n  ]\n}`,
    mappings: [
      { source: 'bom_no', target: 'bom_id', status: 'mapped', auto: true },
      { source: 'product_code', target: 'product_code', status: 'mapped', auto: true },
      { source: 'version', target: 'version', status: 'mapped', auto: true },
      { source: 'is_active', target: 'active', status: 'mapped', auto: true },
    ]
  },
  { 
    id: 'tpl_so', name: '销售订单模板 (SalesOrder)', category: '生产执行',
    structure: `{\n  "entity": "SalesOrder",\n  "attributes": [\n    "so_id", \n    "customer", \n    "delivery_date"\n  ],\n  "relations": [\n    {"type": "includes", "target": "Product"},\n    {"type": "fulfilled_by", "target": "WorkOrder"}\n  ],\n  "behaviors": [\n    "track_delivery"\n  ]\n}`,
    mappings: [
      { source: 'order_no', target: 'so_id', status: 'mapped', auto: true },
      { source: 'customer_id', target: 'customer', status: 'mapped', auto: true },
      { source: 'delivery_date', target: 'delivery_date', status: 'mapped', auto: true },
    ]
  },
  { 
    id: 'tpl_wo', name: '工单模板 (WorkOrder)', category: '生产执行',
    structure: `{\n  "entity": "WorkOrder",\n  "attributes": [\n    "wo_id", \n    "product_id", \n    "planned_qty",\n    "actual_qty",\n    "status"\n  ],\n  "relations": [\n    {"type": "fulfills", "target": "SalesOrder"},\n    {"type": "produces", "target": "Product"},\n    {"type": "generates", "target": "Batch"}\n  ],\n  "behaviors": [\n    "track_progress",\n    "calculate_yield"\n  ]\n}`,
    mappings: [
      { source: 'wo_number', target: 'wo_id', status: 'mapped', auto: true },
      { source: 'product_id', target: 'product_id', status: 'mapped', auto: true },
      { source: 'planned_qty', target: 'planned_qty', status: 'mapped', auto: true },
      { source: 'actual_qty', target: 'actual_qty', status: 'mapped', auto: true },
      { source: 'status', target: 'status', status: 'mapped', auto: true },
    ]
  },
  { 
    id: 'tpl_batch', name: '批次模板 (Batch)', category: '生产执行',
    structure: `{\n  "entity": "Batch",\n  "attributes": [\n    "batch_id", \n    "step", \n    "qty"\n  ],\n  "relations": [\n    {"type": "belongs_to", "target": "WorkOrder"},\n    {"type": "processed_on", "target": "Device"},\n    {"type": "consumes", "target": "Material"},\n    {"type": "consumes", "target": "Batch"}\n  ],\n  "behaviors": [\n    "trace_genealogy"\n  ]\n}`,
    mappings: [
      { source: 'batch_no', target: 'batch_id', status: 'mapped', auto: true },
      { source: 'process_step', target: 'step', status: 'mapped', auto: true },
      { source: 'quantity', target: 'qty', status: 'mapped', auto: true },
    ]
  },
  { 
    id: 'tpl_quality', name: '质检模板 (QualityInspection)', category: '质量管理',
    structure: `{\n  "entity": "QualityInspection",\n  "attributes": [\n    "inspection_id", \n    "batch_no", \n    "step",\n    "resistance",\n    "voltage_drop",\n    "result"\n  ],\n  "relations": [\n    {"type": "inspects", "target": "Batch"},\n    {"type": "triggers", "target": "CustomerComplaint"}\n  ],\n  "behaviors": [\n    "evaluate_pass_fail",\n    "generate_spc_alert"\n  ]\n}`,
    mappings: [
      { source: 'id', target: 'inspection_id', status: 'mapped', auto: true },
      { source: 'batch_no', target: 'batch_no', status: 'mapped', auto: true },
      { source: 'step_name', target: 'step', status: 'mapped', auto: true },
      { source: 'internal_resistance', target: 'resistance', status: 'mapped', auto: true },
      { source: 'voltage_drop', target: 'voltage_drop', status: 'mapped', auto: true },
      { source: 'result', target: 'result', status: 'mapped', auto: true },
    ]
  },
  { 
    id: 'tpl_telemetry', name: '时序遥测模板 (Telemetry)', category: '设备与维护',
    structure: `{\n  "entity": "Telemetry",\n  "attributes": [\n    "timestamp", \n    "sensor_tag", \n    "value"\n  ],\n  "relations": [\n    {"type": "measured_on", "target": "Device"}\n  ],\n  "behaviors": [\n    "aggregate_data"\n  ]\n}`,
    mappings: [
      { source: 'time', target: 'timestamp', status: 'mapped', auto: true },
      { source: 'sensor_tag', target: 'sensor_tag', status: 'mapped', auto: true },
      { source: 'value', target: 'value', status: 'mapped', auto: true },
    ]
  },
  { 
    id: 'tpl_fault', name: '故障事件模板 (EquipmentFailure)', category: '设备与维护',
    structure: `{\n  "entity": "EquipmentFailure",\n  "attributes": [\n    "fault_id", \n    "error_code", \n    "severity",\n    "timestamp"\n  ],\n  "relations": [\n    {"type": "occurs_on", "target": "Device"},\n    {"type": "triggers", "target": "MaintenanceOrder"}\n  ],\n  "behaviors": [\n    "analyze_root_cause"\n  ]\n}`,
    mappings: [
      { source: 'alarm_id', target: 'fault_id', status: 'mapped', auto: true },
      { source: 'err_code', target: 'error_code', status: 'mapped', auto: true },
      { source: 'level', target: 'severity', status: 'mapped', auto: true },
      { source: 'time', target: 'timestamp', status: 'mapped', auto: true },
    ]
  },
  { 
    id: 'tpl_maintenance', name: '维修工单模板 (MaintenanceOrder)', category: '设备与维护',
    structure: `{\n  "entity": "MaintenanceOrder",\n  "attributes": [\n    "mo_id", \n    "type", \n    "status",\n    "estimated_hours"\n  ],\n  "relations": [\n    {"type": "resolves", "target": "EquipmentFailure"},\n    {"type": "consumes", "target": "SparePart"},\n    {"type": "assigned_to", "target": "Technician"}\n  ],\n  "behaviors": [\n    "track_repair_time"\n  ]\n}`,
    mappings: [
      { source: 'work_order_no', target: 'mo_id', status: 'mapped', auto: true },
      { source: 'maint_type', target: 'type', status: 'mapped', auto: true },
      { source: 'status', target: 'status', status: 'mapped', auto: true },
      { source: 'est_time', target: 'estimated_hours', status: 'mapped', auto: true },
    ]
  },
  { 
    id: 'tpl_sparepart', name: '备件模板 (SparePart)', category: '设备与维护',
    structure: `{\n  "entity": "SparePart",\n  "attributes": [\n    "part_id", \n    "name", \n    "stock_qty",\n    "location"\n  ],\n  "relations": [\n    {"type": "consumed_by", "target": "MaintenanceOrder"}\n  ],\n  "behaviors": [\n    "check_availability"\n  ]\n}`,
    mappings: [
      { source: 'part_no', target: 'part_id', status: 'mapped', auto: true },
      { source: 'part_name', target: 'name', status: 'mapped', auto: true },
      { source: 'qty_on_hand', target: 'stock_qty', status: 'mapped', auto: true },
      { source: 'bin_location', target: 'location', status: 'mapped', auto: true },
    ]
  },
  { 
    id: 'tpl_technician', name: '技术员模板 (Technician)', category: '组织与人员',
    structure: `{\n  "entity": "Technician",\n  "attributes": [\n    "emp_id", \n    "name", \n    "skill_level",\n    "shift"\n  ],\n  "relations": [\n    {"type": "executes", "target": "MaintenanceOrder"}\n  ],\n  "behaviors": [\n    "assign_task"\n  ]\n}`,
    mappings: [
      { source: 'employee_no', target: 'emp_id', status: 'mapped', auto: true },
      { source: 'emp_name', target: 'name', status: 'mapped', auto: true },
      { source: 'certification', target: 'skill_level', status: 'mapped', auto: true },
      { source: 'current_shift', target: 'shift', status: 'mapped', auto: true },
    ]
  },
  { 
    id: 'tpl_customer', name: '客户模板 (Customer)', category: '销售与客户',
    structure: `{\n  "entity": "Customer",\n  "attributes": [\n    "customer_id", \n    "name", \n    "region",\n    "tier"\n  ],\n  "relations": [\n    {"type": "places", "target": "SalesOrder"}\n  ],\n  "behaviors": [\n    "calculate_satisfaction"\n  ]\n}`,
    mappings: [
      { source: 'cust_code', target: 'customer_id', status: 'mapped', auto: true },
      { source: 'cust_name', target: 'name', status: 'mapped', auto: true },
      { source: 'sales_region', target: 'region', status: 'mapped', auto: true },
      { source: 'priority', target: 'tier', status: 'mapped', auto: true },
    ]
  },
];

const SCENARIOS_DATA: Record<string, { name: string, nodes: any[], edges: any[] }> = {
  failure_impact: {
    name: '设备故障影响评估 (COATER-01)',
    nodes: [
      { id: 'FAIL-001', label: '主轴卡死 (当前故障)', type: 'EquipmentFailure', x: 0, y: -100 },
      { id: 'COATER-01', label: '涂布机-01', type: 'Device', x: -150, y: 0 },
      { id: 'LINE-1', label: '涂布一线 (受影响产线)', type: 'ProductionLine', x: -300, y: 0 },
      { id: 'MAINT-NEW', label: '维修单-更换主轴', type: 'MaintenanceOrder', x: 150, y: 0 },
      { id: 'MAINT-HIST', label: '历史维修单 (3个月前)', type: 'MaintenanceOrder', x: -150, y: 150 },
      { id: 'SP-ROLLER-05', label: '备件-涂布辊 (库存:充足)', type: 'SparePart', x: 150, y: 150 },
      { id: 'WH-SPARE', label: 'A栋备件仓 (库位:A-12)', type: 'Workshop', x: 300, y: 150 },
      { id: 'SUPP-MECH', label: '机械供应商 (L/T:3天, 成本:高)', type: 'Supplier', x: 150, y: 250 },
      { id: 'TECH-ZHANG', label: '张三 (高级维修工)', type: 'Technician', x: 300, y: 0 },
    ],
    edges: [
      { id: 'e1', source: 'FAIL-001', target: 'COATER-01', label: '发生于' },
      { id: 'e2', source: 'COATER-01', target: 'LINE-1', label: '属于' },
      { id: 'e3', source: 'FAIL-001', target: 'MAINT-NEW', label: '触发' },
      { id: 'e4', source: 'COATER-01', target: 'MAINT-HIST', label: '拥有历史' },
      { id: 'e5', source: 'MAINT-NEW', target: 'SP-ROLLER-05', label: '消耗' },
      { id: 'e6', source: 'SP-ROLLER-05', target: 'WH-SPARE', label: '存储于' },
      { id: 'e7', source: 'SP-ROLLER-05', target: 'SUPP-MECH', label: '由...供应' },
      { id: 'e8', source: 'MAINT-NEW', target: 'TECH-ZHANG', label: '分配给' },
    ]
  },
  line_schedule: {
    name: '产线排产计划 (LINE-A)',
    nodes: [
      { id: 'LINE-A', label: '涂布一线 (OEE:85%)', type: 'ProductionLine', x: -200, y: 0 },
      { id: 'WO-0318', label: 'WO-20260318-01', type: 'WorkOrder', x: 0, y: 0 },
      { id: 'PROD-LFP', label: 'Cell-LFP-280Ah', type: 'Product', x: 200, y: -100 },
      { id: 'SO-202603', label: 'SO-202603 (加急)', type: 'SalesOrder', x: 200, y: 100 },
      { id: 'CUST-TESLA', label: '特斯拉 (VIP客户)', type: 'Customer', x: 0, y: 150 },
      { id: 'MAT-SLURRY', label: 'LFP浆料 (库存:充足)', type: 'Material', x: -200, y: 150 },
      { id: 'SHIFT-A', label: '白班班组 (缺1人)', type: 'Batch', x: -200, y: -150 },
      { id: 'COATER-01', label: '涂布机-01 (运行中)', type: 'Device', x: -400, y: 0 },
    ],
    edges: [
      { id: 'e1', source: 'WO-0318', target: 'LINE-A', label: '分配给' },
      { id: 'e2', source: 'WO-0318', target: 'PROD-LFP', label: '生产' },
      { id: 'e3', source: 'WO-0318', target: 'SO-202603', label: '履行' },
      { id: 'e4', source: 'SO-202603', target: 'CUST-TESLA', label: '由...下达' },
      { id: 'e5', source: 'WO-0318', target: 'MAT-SLURRY', label: '需要' },
      { id: 'e6', source: 'LINE-A', target: 'SHIFT-A', label: '由...操作' },
      { id: 'e7', source: 'COATER-01', target: 'LINE-A', label: '属于' },
    ]
  },
  quality_trace: {
    name: '质量追溯 (LOT-C-001)',
    nodes: [
      { id: 'LOT-C-001', label: 'LOT-C-001 (异常批次)', type: 'Batch', x: 0, y: 0 },
      { id: 'QI-001', label: '面密度偏低 (NG)', type: 'QualityInspection', x: -200, y: -100 },
      { id: 'COATER-01', label: '涂布机-01', type: 'Device', x: 200, y: -100 },
      { id: 'TEL-TEMP', label: '烘箱温度 (波动)', type: 'Telemetry', x: 400, y: -100 },
      { id: 'MAT-ANODE', label: '负极浆料 (LOT-A-09)', type: 'Material', x: -200, y: 100 },
      { id: 'SUPP-LITHIUM', label: '天齐锂业', type: 'Supplier', x: -400, y: 100 },
      { id: 'TECH-LI', label: '李四 (操作工)', type: 'Technician', x: 200, y: 100 },
      { id: 'WO-0315', label: '生产工单-0315', type: 'WorkOrder', x: 0, y: 150 },
    ],
    edges: [
      { id: 'e1', source: 'LOT-C-001', target: 'QI-001', label: '由...检验' },
      { id: 'e2', source: 'LOT-C-001', target: 'COATER-01', label: '加工于' },
      { id: 'e3', source: 'COATER-01', target: 'TEL-TEMP', label: '产生' },
      { id: 'e4', source: 'LOT-C-001', target: 'MAT-ANODE', label: '消耗' },
      { id: 'e5', source: 'MAT-ANODE', target: 'SUPP-LITHIUM', label: '由...供应' },
      { id: 'e6', source: 'LOT-C-001', target: 'TECH-LI', label: '由...操作' },
      { id: 'e7', source: 'LOT-C-001', target: 'WO-0315', label: '属于' },
    ]
  },
  supply_chain: {
    name: '供应链协同 (MAT-CATHODE)',
    nodes: [
      { id: 'MAT-CATHODE', label: '正极材料 (NCM811)', type: 'Material', x: 0, y: 0 },
      { id: 'SUPP-SHANSHAN', label: '杉杉股份 (核心供应商)', type: 'Supplier', x: -200, y: -100 },
      { id: 'PO-202603', label: '采购单-03 (在途)', type: 'WorkOrder', x: 200, y: -100 },
      { id: 'LOGISTICS-01', label: '顺丰冷链 (预计明天达)', type: 'Telemetry', x: 400, y: -100 },
      { id: 'WH-RAW', label: '原料仓 (库容:80%)', type: 'Workshop', x: -200, y: 100 },
      { id: 'QI-INCOMING', label: 'IQC检验标准', type: 'QualityInspection', x: 200, y: 100 },
      { id: 'PROD-NCM', label: 'Cell-NCM-100Ah', type: 'Product', x: 0, y: 150 },
    ],
    edges: [
      { id: 'e1', source: 'MAT-CATHODE', target: 'SUPP-SHANSHAN', label: '由...供应' },
      { id: 'e2', source: 'PO-202603', target: 'MAT-CATHODE', label: '采购' },
      { id: 'e3', source: 'PO-202603', target: 'LOGISTICS-01', label: '由...追踪' },
      { id: 'e4', source: 'MAT-CATHODE', target: 'WH-RAW', label: '存储于' },
      { id: 'e5', source: 'MAT-CATHODE', target: 'QI-INCOMING', label: '需要' },
      { id: 'e6', source: 'PROD-NCM', target: 'MAT-CATHODE', label: '消耗' },
    ]
  },
  energy_consumption: {
    name: '能耗异常分析 (OVEN-03)',
    nodes: [
      { id: 'OVEN-03', label: '烘烤箱-03 (能耗飙升)', type: 'Device', x: 0, y: 0 },
      { id: 'TEL-ELEC', label: '电表-03 (150kWh)', type: 'Telemetry', x: -200, y: -100 },
      { id: 'TEL-TEMP', label: '内部温度 (偏低)', type: 'Telemetry', x: -200, y: 100 },
      { id: 'LINE-B', label: '烘烤二线', type: 'ProductionLine', x: 200, y: -100 },
      { id: 'WS-BAKING', label: '烘烤车间', type: 'Workshop', x: 400, y: -100 },
      { id: 'WO-0310', label: '工单-0310', type: 'WorkOrder', x: 200, y: 100 },
      { id: 'PROD-LFP', label: '单耗基准 (1.2kWh/pcs)', type: 'Product', x: 400, y: 100 },
    ],
    edges: [
      { id: 'e1', source: 'OVEN-03', target: 'TEL-ELEC', label: '由...监控' },
      { id: 'e2', source: 'OVEN-03', target: 'TEL-TEMP', label: '由...监控' },
      { id: 'e3', source: 'OVEN-03', target: 'LINE-B', label: '属于' },
      { id: 'e4', source: 'LINE-B', target: 'WS-BAKING', label: '位于' },
      { id: 'e5', source: 'WO-0310', target: 'OVEN-03', label: '执行于' },
      { id: 'e6', source: 'WO-0310', target: 'PROD-LFP', label: '生产' },
    ]
  },
  maintenance_plan: {
    name: '预防性维护排程 (WINDER-02)',
    nodes: [
      { id: 'WINDER-02', label: '卷绕机-02 (运行:500h)', type: 'Device', x: 0, y: 0 },
      { id: 'PM-202604', label: '4月月度保养 (计划)', type: 'MaintenanceOrder', x: -200, y: -100 },
      { id: 'TECH-WANG', label: '王五 (排班:周二)', type: 'Technician', x: 200, y: -100 },
      { id: 'SP-BEARING', label: '备件-轴承 (库存:0)', type: 'SparePart', x: -200, y: 100 },
      { id: 'PO-SPARE', label: '采购单-轴承 (在途)', type: 'WorkOrder', x: -400, y: 100 },
      { id: 'LINE-WIND', label: '卷绕产线 (排产满)', type: 'ProductionLine', x: 200, y: 100 },
    ],
    edges: [
      { id: 'e1', source: 'PM-202604', target: 'WINDER-02', label: '维护' },
      { id: 'e2', source: 'PM-202604', target: 'TECH-WANG', label: '分配给' },
      { id: 'e3', source: 'PM-202604', target: 'SP-BEARING', label: '需要' },
      { id: 'e4', source: 'PO-SPARE', target: 'SP-BEARING', label: '补充' },
      { id: 'e5', source: 'WINDER-02', target: 'LINE-WIND', label: '属于' },
    ]
  },
  yield_analysis: {
    name: '良率波动诊断 (CELL-BATCH-05)',
    nodes: [
      { id: 'CELL-BATCH-05', label: '电芯批次-05 (良率88%)', type: 'Batch', x: 0, y: 0 },
      { id: 'QI-CAPACITY', label: '容量测试 (低容)', type: 'QualityInspection', x: -200, y: -100 },
      { id: 'FORMATION-01', label: '化成柜-01', type: 'Device', x: 200, y: -100 },
      { id: 'TEL-VOLTAGE', label: '化成电压曲线 (异常)', type: 'Telemetry', x: 400, y: -100 },
      { id: 'WO-0319', label: 'WO-20260319', type: 'WorkOrder', x: -200, y: 100 },
      { id: 'MAT-ELECTROLYTE', label: '电解液 (LOT-E-12)', type: 'Material', x: 200, y: 100 },
    ],
    edges: [
      { id: 'e1', source: 'CELL-BATCH-05', target: 'QI-CAPACITY', label: '由...检验' },
      { id: 'e2', source: 'CELL-BATCH-05', target: 'FORMATION-01', label: '加工于' },
      { id: 'e3', source: 'FORMATION-01', target: 'TEL-VOLTAGE', label: '产生' },
      { id: 'e4', source: 'CELL-BATCH-05', target: 'WO-0319', label: '属于' },
      { id: 'e5', source: 'CELL-BATCH-05', target: 'MAT-ELECTROLYTE', label: '消耗' },
    ]
  },
  inventory_warning: {
    name: '备件库存预警 (SP-ROLLER-05)',
    nodes: [
      { id: 'SP-ROLLER-05', label: '备件-涂布辊 (库存:1)', type: 'SparePart', x: 0, y: 0 },
      { id: 'SUPP-ROLLER', label: '辊轴供应商 (L/T:15天)', type: 'Supplier', x: -200, y: -100 },
      { id: 'WH-SPARE', label: '备件仓 (安全库存:3)', type: 'Workshop', x: 200, y: -100 },
      { id: 'MAINT-URGENT', label: '紧急抢修单 (需1个)', type: 'MaintenanceOrder', x: -200, y: 100 },
      { id: 'COATER-02', label: '涂布机-02 (待修)', type: 'Device', x: 0, y: 150 },
      { id: 'PO-AUTO', label: '自动触发采购单', type: 'WorkOrder', x: 200, y: 100 },
    ],
    edges: [
      { id: 'e1', source: 'SP-ROLLER-05', target: 'SUPP-ROLLER', label: '由...供应' },
      { id: 'e2', source: 'SP-ROLLER-05', target: 'WH-SPARE', label: '存储于' },
      { id: 'e3', source: 'MAINT-URGENT', target: 'SP-ROLLER-05', label: '需要' },
      { id: 'e4', source: 'MAINT-URGENT', target: 'COATER-02', label: '维护' },
      { id: 'e5', source: 'PO-AUTO', target: 'SP-ROLLER-05', label: '补充' },
    ]
  },
  customer_complaint: {
    name: '客户投诉溯源 (CUST-TESLA-001)',
    nodes: [
      { id: 'CUST-TESLA', label: '特斯拉 (投诉:续航短)', type: 'Customer', x: 0, y: 0 },
      { id: 'SO-202601', label: 'SO-202601 (历史订单)', type: 'SalesOrder', x: -200, y: -100 },
      { id: 'PROD-LFP', label: 'Cell-LFP-280Ah', type: 'Product', x: 200, y: -100 },
      { id: 'LOT-C-001', label: 'LOT-C-001 (发货批次)', type: 'Batch', x: -200, y: 100 },
      { id: 'QI-001', label: '出货检验 (当时OK)', type: 'QualityInspection', x: 0, y: 150 },
      { id: 'MAT-CATHODE', label: '正极材料 (追溯源头)', type: 'Material', x: 200, y: 100 },
      { id: 'SUPP-SHANSHAN', label: '杉杉股份 (材料供应商)', type: 'Supplier', x: 400, y: 100 },
      { id: 'LINE-1', label: '涂布一线 (生产线)', type: 'ProductionLine', x: -400, y: 100 },
    ],
    edges: [
      { id: 'e1', source: 'SO-202601', target: 'CUST-TESLA', label: '由...下达' },
      { id: 'e2', source: 'SO-202601', target: 'PROD-LFP', label: '包含' },
      { id: 'e3', source: 'LOT-C-001', target: 'PROD-LFP', label: '是...的实例' },
      { id: 'e4', source: 'LOT-C-001', target: 'QI-001', label: '由...检验' },
      { id: 'e5', source: 'LOT-C-001', target: 'MAT-CATHODE', label: '消耗' },
      { id: 'e6', source: 'MAT-CATHODE', target: 'SUPP-SHANSHAN', label: '由...供应' },
      { id: 'e7', source: 'LOT-C-001', target: 'LINE-1', label: '加工于' },
    ]
  },
  worker_schedule: {
    name: '关键岗位人员排班 (TECH-ZHANG)',
    nodes: [
      { id: 'TECH-ZHANG', label: '张三 (高级涂布工)', type: 'Technician', x: 0, y: 0 },
      { id: 'SHIFT-NIGHT', label: '夜班 (疲劳度高)', type: 'Batch', x: -200, y: -100 },
      { id: 'LINE-1', label: '涂布一线', type: 'ProductionLine', x: 200, y: -100 },
      { id: 'WS-COATING', label: '涂布车间', type: 'Workshop', x: 400, y: -100 },
      { id: 'CERT-01', label: '特种作业证 (下月过期)', type: 'QualityInspection', x: -200, y: 100 },
      { id: 'MAINT-TASK', label: '临时维修任务', type: 'MaintenanceOrder', x: 200, y: 100 },
      { id: 'COATER-01', label: '涂布机-01', type: 'Device', x: 400, y: 100 },
    ],
    edges: [
      { id: 'e1', source: 'TECH-ZHANG', target: 'SHIFT-NIGHT', label: '分配给' },
      { id: 'e2', source: 'SHIFT-NIGHT', target: 'LINE-1', label: '操作' },
      { id: 'e3', source: 'LINE-1', target: 'WS-COATING', label: '位于' },
      { id: 'e4', source: 'TECH-ZHANG', target: 'CERT-01', label: '持有' },
      { id: 'e5', source: 'MAINT-TASK', target: 'TECH-ZHANG', label: '分配给' },
      { id: 'e6', source: 'MAINT-TASK', target: 'COATER-01', label: '维护' },
    ]
  },
  material_shortage: {
    name: '物料短缺影响评估 (MAT-ANODE)',
    nodes: [
      { id: 'MAT-ANODE', label: '负极材料 (缺口:5吨)', type: 'Material', x: 0, y: 0 },
      { id: 'BOM-LFP', label: 'BOM-LFP-280', type: 'BOM', x: -200, y: -100 },
      { id: 'PROD-LFP', label: 'Cell-LFP-280Ah', type: 'Product', x: 200, y: -100 },
      { id: 'WO-0320', label: 'WO-20260320 (停工待料)', type: 'WorkOrder', x: -200, y: 100 },
      { id: 'SO-202605', label: 'SO-202605 (违约风险)', type: 'SalesOrder', x: 0, y: 150 },
      { id: 'SUPP-ANODE', label: '负极供应商 (交期延误)', type: 'Supplier', x: 200, y: 100 },
      { id: 'LINE-3', label: '涂布三线 (受影响产线)', type: 'ProductionLine', x: 400, y: 100 },
      { id: 'LOGISTICS-02', label: '跨省物流 (在途:2天)', type: 'Telemetry', x: 400, y: 0 },
    ],
    edges: [
      { id: 'e1', source: 'BOM-LFP', target: 'MAT-ANODE', label: '需要' },
      { id: 'e2', source: 'BOM-LFP', target: 'PROD-LFP', label: '定义' },
      { id: 'e3', source: 'WO-0320', target: 'PROD-LFP', label: '生产' },
      { id: 'e4', source: 'WO-0320', target: 'SO-202605', label: '履行' },
      { id: 'e5', source: 'MAT-ANODE', target: 'SUPP-ANODE', label: '由...供应' },
      { id: 'e6', source: 'WO-0320', target: 'LINE-3', label: '分配给' },
      { id: 'e7', source: 'SUPP-ANODE', target: 'LOGISTICS-02', label: '通过...运输' },
    ]
  },
  order_delay: {
    name: '订单延期风险预测 (SO-202604)',
    nodes: [
      { id: 'SO-202604', label: 'SO-202604 (订单)', type: 'SalesOrder', x: 0, y: 0 },
      { id: 'WO-0321', label: 'WO-20260321', type: 'WorkOrder', x: -200, y: -100 },
      { id: 'LINE-2', label: '涂布二线', type: 'ProductionLine', x: 200, y: -100 },
      { id: 'FAIL-002', label: '烘箱温度异常', type: 'EquipmentFailure', x: 0, y: 150 },
      { id: 'CUST-BYD', label: '比亚迪 (客户)', type: 'Customer', x: -200, y: 150 },
      { id: 'MAINT-URGENT', label: '紧急抢修单', type: 'MaintenanceOrder', x: 200, y: 150 },
      { id: 'SP-HEATER', label: '加热管备件 (库存:0)', type: 'SparePart', x: 400, y: 150 },
    ],
    edges: [
      { id: 'e1', source: 'WO-0321', target: 'SO-202604', label: '履行' },
      { id: 'e2', source: 'WO-0321', target: 'LINE-2', label: '分配给' },
      { id: 'e3', source: 'FAIL-002', target: 'LINE-2', label: '影响' },
      { id: 'e4', source: 'SO-202604', target: 'CUST-BYD', label: '由...下达' },
      { id: 'e5', source: 'FAIL-002', target: 'MAINT-URGENT', label: '触发' },
      { id: 'e6', source: 'MAINT-URGENT', target: 'SP-HEATER', label: '需要' },
    ]
  },
  equipment_upgrade: {
    name: '设备技改停机评估 (LINE-2)',
    nodes: [
      { id: 'LINE-2', label: '涂布二线', type: 'ProductionLine', x: 0, y: 0 },
      { id: 'COATER-02', label: '涂布机-02', type: 'Device', x: -200, y: -100 },
      { id: 'MAINT-UPGRADE', label: '技改工单-01', type: 'MaintenanceOrder', x: 200, y: -100 },
      { id: 'TECH-LI', label: '李四 (工程师)', type: 'Technician', x: 0, y: 150 },
      { id: 'WO-0325', label: '受影响生产工单', type: 'WorkOrder', x: -200, y: 150 },
      { id: 'SP-SENSOR', label: '新型传感器备件', type: 'SparePart', x: 200, y: 150 },
    ],
    edges: [
      { id: 'e1', source: 'COATER-02', target: 'LINE-2', label: '属于' },
      { id: 'e2', source: 'MAINT-UPGRADE', target: 'COATER-02', label: '升级' },
      { id: 'e3', source: 'MAINT-UPGRADE', target: 'TECH-LI', label: '分配给' },
      { id: 'e4', source: 'MAINT-UPGRADE', target: 'WO-0325', label: '延迟' },
      { id: 'e5', source: 'MAINT-UPGRADE', target: 'SP-SENSOR', label: '安装' },
    ]
  },
  process_optimization: {
    name: '工艺参数优化验证 (RECIPE-002)',
    nodes: [
      { id: 'RECIPE-002', label: '工艺配方-002', type: 'BOM', x: 0, y: 0 },
      { id: 'PROD-NCM', label: 'Cell-NCM-100Ah', type: 'Product', x: -200, y: -100 },
      { id: 'LOT-TEST-01', label: '实验批次-01', type: 'Batch', x: 200, y: -100 },
      { id: 'QI-PERFORMANCE', label: '性能测试', type: 'QualityInspection', x: 0, y: 150 },
      { id: 'LINE-LAB', label: '实验产线', type: 'ProductionLine', x: -200, y: 150 },
      { id: 'MAT-NEW-ADDITIVE', label: '新型添加剂', type: 'Material', x: 200, y: 150 },
    ],
    edges: [
      { id: 'e1', source: 'RECIPE-002', target: 'PROD-NCM', label: '定义' },
      { id: 'e2', source: 'LOT-TEST-01', target: 'RECIPE-002', label: '使用' },
      { id: 'e3', source: 'LOT-TEST-01', target: 'QI-PERFORMANCE', label: '由...检验' },
      { id: 'e4', source: 'LOT-TEST-01', target: 'LINE-LAB', label: '加工于' },
      { id: 'e5', source: 'RECIPE-002', target: 'MAT-NEW-ADDITIVE', label: '包含' },
    ]
  },
  supplier_evaluation: {
    name: '供应商质量评估 (SUPP-LITHIUM)',
    nodes: [
      { id: 'SUPP-LITHIUM', label: '天齐锂业', type: 'Supplier', x: 0, y: 0 },
      { id: 'MAT-LITHIUM', label: '碳酸锂', type: 'Material', x: -200, y: -100 },
      { id: 'QI-INCOMING', label: '来料检验', type: 'QualityInspection', x: 200, y: -100 },
      { id: 'LOT-RAW-05', label: '原料批次-05', type: 'Batch', x: 0, y: 150 },
      { id: 'PO-202602', label: '历史采购单', type: 'WorkOrder', x: -200, y: 150 },
      { id: 'LOGISTICS-03', label: '物流时效 (平均3天)', type: 'Telemetry', x: 200, y: 150 },
    ],
    edges: [
      { id: 'e1', source: 'MAT-LITHIUM', target: 'SUPP-LITHIUM', label: '由...供应' },
      { id: 'e2', source: 'LOT-RAW-05', target: 'MAT-LITHIUM', label: '是...的实例' },
      { id: 'e3', source: 'LOT-RAW-05', target: 'QI-INCOMING', label: '由...检验' },
      { id: 'e4', source: 'PO-202602', target: 'SUPP-LITHIUM', label: '采购自' },
      { id: 'e5', source: 'SUPP-LITHIUM', target: 'LOGISTICS-03', label: '由...评估' },
    ]
  },
  logistics_tracking: {
    name: '成品发货物流追踪 (SHIP-009)',
    nodes: [
      { id: 'SHIP-009', label: '发货单-009', type: 'SalesOrder', x: 0, y: 0 },
      { id: 'CUST-NIO', label: '蔚来汽车', type: 'Customer', x: -200, y: -100 },
      { id: 'PROD-PACK', label: 'Battery-Pack-100kWh', type: 'Product', x: 200, y: -100 },
      { id: 'FAC-SHANGHAI', label: '上海临港工厂', type: 'Factory', x: 0, y: 150 },
      { id: 'LOGISTICS-04', label: '冷链运输 (温度:22℃)', type: 'Telemetry', x: -200, y: 150 },
      { id: 'WH-FINISHED', label: '成品仓 (出库)', type: 'Workshop', x: 200, y: 150 },
    ],
    edges: [
      { id: 'e1', source: 'SHIP-009', target: 'CUST-NIO', label: '交付给' },
      { id: 'e2', source: 'SHIP-009', target: 'PROD-PACK', label: '包含' },
      { id: 'e3', source: 'SHIP-009', target: 'FAC-SHANGHAI', label: '发货自' },
      { id: 'e4', source: 'SHIP-009', target: 'LOGISTICS-04', label: '由...追踪' },
      { id: 'e5', source: 'SHIP-009', target: 'WH-FINISHED', label: '离开自' },
    ]
  },
  environmental_monitor: {
    name: '车间环境温湿度监控 (WS-CLEANROOM)',
    nodes: [
      { id: 'WS-CLEANROOM', label: '注液无尘车间', type: 'Workshop', x: 0, y: 0 },
      { id: 'TEL-TEMP', label: '温湿度传感器', type: 'Telemetry', x: -200, y: -100 },
      { id: 'LOT-INJECT-01', label: '注液批次-01', type: 'Batch', x: 200, y: -100 },
      { id: 'QI-MOISTURE', label: '水分检测', type: 'QualityInspection', x: 0, y: 150 },
      { id: 'DEVICE-HVAC', label: '空调机组 (高负荷)', type: 'Device', x: -200, y: 150 },
      { id: 'MAINT-HVAC', label: '空调维保工单', type: 'MaintenanceOrder', x: 200, y: 150 },
    ],
    edges: [
      { id: 'e1', source: 'TEL-TEMP', target: 'WS-CLEANROOM', label: '监控' },
      { id: 'e2', source: 'LOT-INJECT-01', target: 'WS-CLEANROOM', label: '加工于' },
      { id: 'e3', source: 'LOT-INJECT-01', target: 'QI-MOISTURE', label: '由...检验' },
      { id: 'e4', source: 'DEVICE-HVAC', target: 'WS-CLEANROOM', label: '控制环境' },
      { id: 'e5', source: 'MAINT-HVAC', target: 'DEVICE-HVAC', label: '维护' },
    ]
  },
  tool_lifespan: {
    name: '模具寿命预警管理 (TOOL-PUNCH-01)',
    nodes: [
      { id: 'TOOL-PUNCH-01', label: '冲压模具-01', type: 'SparePart', x: 0, y: 0 },
      { id: 'PUNCH-MACHINE', label: '冲压机-05 (产线:L-006)', type: 'Device', x: -200, y: -100 },
      { id: 'LOT-PUNCH-02', label: '冲压批次-02 (数量:10000)', type: 'Batch', x: 200, y: -100 },
      { id: 'QI-DIMENSION', label: '尺寸检测 (毛刺增多)', type: 'QualityInspection', x: 0, y: 150 },
      { id: 'MAINT-TOOL', label: '模具修磨工单 (耗时:8h)', type: 'MaintenanceOrder', x: -200, y: 150 },
      { id: 'SP-NEW-TOOL', label: '备用模具 (库存:1, 成本:¥2w)', type: 'SparePart', x: 200, y: 150 },
    ],
    edges: [
      { id: 'e1', source: 'TOOL-PUNCH-01', target: 'PUNCH-MACHINE', label: '安装于' },
      { id: 'e2', source: 'LOT-PUNCH-02', target: 'PUNCH-MACHINE', label: '加工于' },
      { id: 'e3', source: 'LOT-PUNCH-02', target: 'QI-DIMENSION', label: '由...检验' },
      { id: 'e4', source: 'TOOL-PUNCH-01', target: 'MAINT-TOOL', label: '需要' },
      { id: 'e5', source: 'MAINT-TOOL', target: 'SP-NEW-TOOL', label: '被...替换' },
    ]
  },
  cost_accounting: {
    name: '批次生产成本核算 (LOT-W-002)',
    nodes: [
      { id: 'LOT-W-002', label: '卷绕批次-002 (产线:L-003)', type: 'Batch', x: 0, y: 0 },
      { id: 'MAT-FOIL', label: '铜箔/铝箔 (成本:¥5000, 供应商:诺德)', type: 'Material', x: -200, y: -100 },
      { id: 'WO-0322', label: 'WO-20260322 (人工成本:¥800)', type: 'WorkOrder', x: 200, y: -100 },
      { id: 'SO-202606', label: 'SO-202606 (客户:小鹏)', type: 'SalesOrder', x: 0, y: 150 },
      { id: 'TEL-ENERGY', label: '能耗数据 (电费:¥300)', type: 'Telemetry', x: -200, y: 150 },
      { id: 'QI-SCRAP', label: '废品记录 (损失:¥200)', type: 'QualityInspection', x: 200, y: 150 },
    ],
    edges: [
      { id: 'e1', source: 'LOT-W-002', target: 'MAT-FOIL', label: '消耗' },
      { id: 'e2', source: 'LOT-W-002', target: 'WO-0322', label: '属于' },
      { id: 'e3', source: 'WO-0322', target: 'SO-202606', label: '履行' },
      { id: 'e4', source: 'LOT-W-002', target: 'TEL-ENERGY', label: '消耗能源' },
      { id: 'e5', source: 'LOT-W-002', target: 'QI-SCRAP', label: '产生废料' },
    ]
  },
  safety_incident: {
    name: '安全生产事故排查 (INCIDENT-001)',
    nodes: [
      { id: 'INCIDENT-001', label: '电池热失控事故', type: 'EquipmentFailure', x: 0, y: 0 },
      { id: 'WS-TESTING', label: '测试车间', type: 'Workshop', x: -200, y: -100 },
      { id: 'TECH-ZHAO', label: '赵六 (测试员, 受伤)', type: 'Technician', x: 200, y: -100 },
      { id: 'TEST-CHAMBER', label: '防爆测试箱 (损坏)', type: 'Device', x: 0, y: 150 },
      { id: 'LOT-TEST-05', label: '测试批次-05 (起火源)', type: 'Batch', x: -200, y: 150 },
      { id: 'MAINT-REPAIR', label: '设备大修工单', type: 'MaintenanceOrder', x: 200, y: 150 },
    ],
    edges: [
      { id: 'e1', source: 'INCIDENT-001', target: 'WS-TESTING', label: '发生于' },
      { id: 'e2', source: 'INCIDENT-001', target: 'TECH-ZHAO', label: '由...报告' },
      { id: 'e3', source: 'INCIDENT-001', target: 'TEST-CHAMBER', label: '涉及' },
      { id: 'e4', source: 'LOT-TEST-05', target: 'TEST-CHAMBER', label: '测试于' },
      { id: 'e5', source: 'INCIDENT-001', target: 'MAINT-REPAIR', label: '触发' },
    ]
  }
};

const SCHEMA_NODES = [
  { id: 'Factory', label: '工厂', x: 50, y: 10, color: 'indigo', icon: 'Database' },
  { id: 'Workshop', label: '车间', x: 50, y: 25, color: 'indigo', icon: 'Layers' },
  { id: 'ProductionLine', label: '产线', x: 50, y: 40, color: 'indigo', icon: 'Activity' },
  { id: 'Device', label: '设备', x: 25, y: 55, color: 'blue', icon: 'Cpu' },
  { id: 'Telemetry', label: '遥测数据', x: 25, y: 75, color: 'amber', icon: 'Activity' },
  { id: 'Supplier', label: '供应商', x: 15, y: 25, color: 'rose', icon: 'Users' },
  { id: 'Material', label: '物料', x: 15, y: 40, color: 'rose', icon: 'Box' },
  { id: 'Customer', label: '客户', x: 85, y: 25, color: 'emerald', icon: 'Users' },
  { id: 'SalesOrder', label: '销售订单', x: 85, y: 40, color: 'emerald', icon: 'FileText' },
  { id: 'Product', label: '产品', x: 85, y: 55, color: 'purple', icon: 'Box' },
  { id: 'BOM', label: '物料清单', x: 85, y: 75, color: 'purple', icon: 'Layers' },
  { id: 'WorkOrder', label: '工单', x: 65, y: 55, color: 'emerald', icon: 'FileText' },
  { id: 'Batch', label: '批次', x: 45, y: 55, color: 'emerald', icon: 'Layers' },
  { id: 'QualityInspection', label: '质检记录', x: 45, y: 75, color: 'rose', icon: 'ShieldCheck' },
  { id: 'EquipmentFailure', label: '设备故障', x: 10, y: 55, color: 'red', icon: 'AlertTriangle' },
  { id: 'MaintenanceOrder', label: '维修工单', x: 10, y: 70, color: 'orange', icon: 'Wrench' },
  { id: 'SparePart', label: '备件', x: 10, y: 85, color: 'blue', icon: 'Box' },
  { id: 'Technician', label: '技术员', x: 25, y: 85, color: 'emerald', icon: 'Users' },
];

const SCHEMA_EDGES = [
  { source: 'Factory', target: 'Workshop', label: '包含' },
  { source: 'Workshop', target: 'ProductionLine', label: '包含' },
  { source: 'ProductionLine', target: 'Device', label: '包含' },
  { source: 'ProductionLine', target: 'WorkOrder', label: '执行' },
  { source: 'Device', target: 'Telemetry', label: '产生' },
  { source: 'Supplier', target: 'Material', label: '供应' },
  { source: 'Material', target: 'Batch', label: '被消耗于' },
  { source: 'Customer', target: 'SalesOrder', label: '下达' },
  { source: 'SalesOrder', target: 'WorkOrder', label: '履行于' },
  { source: 'SalesOrder', target: 'Product', label: '包含' },
  { source: 'WorkOrder', target: 'Batch', label: '产生' },
  { source: 'WorkOrder', target: 'Product', label: '生产' },
  { source: 'Batch', target: 'Device', label: '加工于' },
  { source: 'Batch', target: 'QualityInspection', label: '检验于' },
  { source: 'BOM', target: 'Product', label: '定义' },
  { source: 'Device', target: 'EquipmentFailure', label: '发生' },
  { source: 'EquipmentFailure', target: 'MaintenanceOrder', label: '触发' },
  { source: 'MaintenanceOrder', target: 'SparePart', label: '消耗' },
  { source: 'MaintenanceOrder', target: 'Technician', label: '分配给' },
];

const getIcon = (name: string) => {
  switch(name) {
    case 'Database': return <Database size={16} />;
    case 'Layers': return <Layers size={16} />;
    case 'Activity': return <Activity size={16} />;
    case 'Cpu': return <Cpu size={16} />;
    case 'Users': return <Users size={16} />;
    case 'Box': return <Box size={16} />;
    case 'FileText': return <FileText size={16} />;
    case 'ShieldCheck': return <ShieldCheck size={16} />;
    case 'AlertTriangle': return <AlertTriangle size={16} />;
    case 'Wrench': return <Wrench size={16} />;
    default: return <Box size={16} />;
  }
};

export default function OntologyModeling() {
  const [activeTab, setActiveTab] = useState<TabKey>('discovery');
  const [expandedSources, setExpandedSources] = useState<string[]>(['mes', 'plm', 'qms']);
  const [selectedTableId, setSelectedTableId] = useState('mes_production_line');
  const [selectedTemplate, setSelectedTemplate] = useState('tpl_line');
  const [selectedInstanceTarget, setSelectedInstanceTarget] = useState('failure_impact');

  // State for draggable instance nodes
  const [instanceNodes, setInstanceNodes] = useState(SCENARIOS_DATA['failure_impact'].nodes);
  const [dragState, setDragState] = useState<{ id: string, startX: number, startY: number, initialNodeX: number, initialNodeY: number } | null>(null);

  React.useEffect(() => {
    if (SCENARIOS_DATA[selectedInstanceTarget]) {
      setInstanceNodes(SCENARIOS_DATA[selectedInstanceTarget].nodes);
    }
  }, [selectedInstanceTarget]);

  const handleNodeMouseDown = (e: React.MouseEvent, id: string, initialNodeX: number, initialNodeY: number) => {
    e.preventDefault();
    setDragState({
      id,
      startX: e.clientX,
      startY: e.clientY,
      initialNodeX,
      initialNodeY
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragState) {
      const dx = e.clientX - dragState.startX;
      const dy = e.clientY - dragState.startY;
      setInstanceNodes(prev => prev.map(node => {
        if (node.id === dragState.id) {
          return {
            ...node,
            x: dragState.initialNodeX + dx,
            y: dragState.initialNodeY + dy
          };
        }
        return node;
      }));
    }
  };

  const handleMouseUp = () => {
    setDragState(null);
  };

  // --- Relations Tab State & Handlers ---
  const [relNodes, setRelNodes] = useState(SCHEMA_NODES);
  const [relEdges, setRelEdges] = useState(SCHEMA_EDGES.map((e, i) => ({ ...e, id: `rel-edge-${i}`, cardinality: '1:N' })));
  const [activeRelId, setActiveRelId] = useState<string | null>(null);
  const [isAddingRel, setIsAddingRel] = useState(false);
  const [relFormData, setRelFormData] = useState({ source: '', target: '', label: '', cardinality: '1:N' });
  const [relDragState, setRelDragState] = useState<{ id: string, startX: number, startY: number, initialNodeX: number, initialNodeY: number } | null>(null);
  const [graphName, setGraphName] = useState('默认生产制造本体');
  const [isEditingGraphName, setIsEditingGraphName] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [showNewGraphConfirm, setShowNewGraphConfirm] = useState(false);
  const [showAddNodeModal, setShowAddNodeModal] = useState(false);
  const [newNodeData, setNewNodeData] = useState({ id: '', label: '', type: 'Equipment' });

  const handleAddNode = () => {
    if (!newNodeData.id || !newNodeData.label) return;
    
    let color = 'indigo';
    if (['Material', 'Product', 'SparePart'].includes(newNodeData.type)) color = 'emerald';
    else if (['WorkOrder', 'SalesOrder', 'MaintenanceOrder', 'PurchaseOrder'].includes(newNodeData.type)) color = 'purple';
    else if (['QualityInspection', 'Telemetry', 'Incident'].includes(newNodeData.type)) color = 'rose';
    else if (['Process', 'Recipe'].includes(newNodeData.type)) color = 'amber';
    else if (['Worker', 'Supplier', 'Customer'].includes(newNodeData.type)) color = 'blue';
    else if (['Warehouse', 'Logistics'].includes(newNodeData.type)) color = 'gray';

    const newNode = {
      id: newNodeData.id,
      label: newNodeData.label,
      type: newNodeData.type,
      color,
      x: 50 + Math.random() * 10 - 5,
      y: 50 + Math.random() * 10 - 5
    };

    setRelNodes([...relNodes, newNode]);
    setShowAddNodeModal(false);
    setNewNodeData({ id: '', label: '', type: 'Equipment' });
  };

  const handleRelNodeMouseDown = (e: React.MouseEvent, id: string, initialNodeX: number, initialNodeY: number) => {
    e.preventDefault();
    setRelDragState({ id, startX: e.clientX, startY: e.clientY, initialNodeX, initialNodeY });
  };

  const handleRelMouseMove = (e: React.MouseEvent) => {
    if (relDragState) {
      const dx = (e.clientX - relDragState.startX) * 0.08; 
      const dy = (e.clientY - relDragState.startY) * 0.08;
      setRelNodes(prev => prev.map(node => {
        if (node.id === relDragState.id) {
          return { ...node, x: relDragState.initialNodeX + dx, y: relDragState.initialNodeY + dy };
        }
        return node;
      }));
    }
  };

  const handleRelMouseUp = () => setRelDragState(null);

  const handleSaveRel = () => {
    if (activeRelId) {
      setRelEdges(prev => prev.map(e => e.id === activeRelId ? { ...e, ...relFormData } : e));
    } else {
      setRelEdges(prev => [...prev, { ...relFormData, id: `rel-edge-${Date.now()}` }]);
    }
    setActiveRelId(null);
    setIsAddingRel(false);
  };

  const handleDeleteRel = (id: string) => {
    setRelEdges(prev => prev.filter(e => e.id !== id));
    if (activeRelId === id) setActiveRelId(null);
  };

  const openEditRel = (edge: any) => {
    setRelFormData(edge);
    setActiveRelId(edge.id);
    setIsAddingRel(false);
  };

  const openAddRel = () => {
    if (relNodes.length < 2) return;
    setRelFormData({ source: relNodes[0].id, target: relNodes[1].id, label: '关联', cardinality: '1:N' });
    setActiveRelId(null);
    setIsAddingRel(true);
  };
  // --------------------------------------

  const toggleSource = (sourceId: string) => {
    setExpandedSources(prev => 
      prev.includes(sourceId) ? prev.filter(id => id !== sourceId) : [...prev, sourceId]
    );
  };

  // Find the currently selected table data
  const currentTable = useMemo(() => {
    for (const source of DATA_SOURCES) {
      const table = source.tables.find(t => t.id === selectedTableId);
      if (table) return table;
    }
    return DATA_SOURCES[0].tables[0];
  }, [selectedTableId]);

  // Find the currently selected template data
  const currentTemplateData = useMemo(() => {
    return TEMPLATES.find(t => t.id === selectedTemplate) || TEMPLATES[0];
  }, [selectedTemplate]);

  const renderDiscoveryTab = () => (
    <div className="flex-1 flex overflow-hidden">
      {/* Left: Data Sources */}
      <div className="w-64 border-r border-gray-200 bg-white flex flex-col shrink-0">
        <div className="p-3 border-b border-gray-200 bg-gray-50/80">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-2">
            <Database size={14} /> 数据源接入
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {DATA_SOURCES.map((source) => {
            const SourceIcon = source.icon;
            return (
              <div key={source.id} className="mb-2">
                <button 
                  onClick={() => toggleSource(source.id)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded text-sm text-gray-700 font-medium transition-colors"
                >
                  {expandedSources.includes(source.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <SourceIcon size={14} className={source.color} />
                  <span className="truncate">{source.name}</span>
                </button>
                {expandedSources.includes(source.id) && (
                  <div className="ml-6 mt-1 space-y-1">
                    {source.tables.map(table => (
                      <button 
                        key={table.id}
                        onClick={() => setSelectedTableId(table.id)}
                        className={cn(
                          "w-full flex items-center justify-between px-2 py-1.5 rounded text-xs transition-all",
                          selectedTableId === table.id ? "bg-indigo-50 text-indigo-700 font-medium" : "text-gray-600 hover:bg-gray-50"
                        )}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Table2 size={12} className={selectedTableId === table.id ? "text-indigo-500" : "text-gray-400"} />
                          <span className="truncate">{table.name}</span>
                        </div>
                        <span className="text-[9px] text-gray-400 bg-white px-1 rounded border border-gray-100">{table.rows > 1000 ? (table.rows/1000).toFixed(1) + 'k' : table.rows}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Middle: Table Structure */}
      <div className="flex-1 border-r border-gray-200 bg-gray-50/30 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Table2 size={16} className="text-indigo-600" /> {currentTable.name}
            </h3>
            <p className="text-[10px] text-gray-500 mt-0.5">元数据采集完成，共 {currentTable.fields.length} 个字段</p>
          </div>
          <button className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 hover:bg-indigo-100 transition-colors border border-indigo-100">
            <Sparkles size={14} /> 重新识别
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[10px] uppercase tracking-wider text-gray-500">
                  <th className="p-3 font-medium">字段名</th>
                  <th className="p-3 font-medium">数据类型</th>
                  <th className="p-3 font-medium">业务含义</th>
                </tr>
              </thead>
              <tbody>
                {currentTable.fields.map((field, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 text-xs">
                    <td className="p-3 font-mono text-gray-800">{field.name}</td>
                    <td className="p-3 text-gray-500 font-mono text-[10px]">{field.type}</td>
                    <td className="p-3 text-gray-600">{field.comment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right: AI Recognition Result */}
      <div className="w-80 bg-white flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-200 bg-indigo-50/50">
          <h3 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
            <Wand2 size={16} className="text-indigo-600" /> AI 实体识别结果
          </h3>
        </div>
        <div className="p-5 space-y-6">
          <div className="text-center p-6 bg-gradient-to-b from-indigo-50 to-white border border-indigo-100 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Layers size={24} />
            </div>
            <div className="text-xs text-gray-500 mb-1">推断实体类型</div>
            <div className="text-lg font-bold text-indigo-900">{currentTable.recognizedAs}</div>
            <div className="mt-3 inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-[10px] font-medium border border-emerald-200">
              <CheckCircle2 size={12} /> 置信度 {currentTable.confidence}%
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">识别依据 (可解释性)</h4>
            <div className="space-y-2 text-xs">
              {currentTable.reasons.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-gray-50 p-2 rounded border border-gray-100">
                  <CheckCircle2 size={14} className="text-indigo-500 shrink-0 mt-0.5" />
                  <span className="text-gray-600">{reason}</span>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => setActiveTab('mapping')}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            去匹配模板 <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderMappingTab = () => (
    <div className="flex-1 flex overflow-hidden">
      {/* Left: Template Library */}
      <div className="w-64 border-r border-gray-200 bg-white flex flex-col shrink-0">
        <div className="p-3 border-b border-gray-200 bg-gray-50/80">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-2">
            <FileText size={14} /> 本体模板库
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {TEMPLATES.map(tpl => (
            <div 
              key={tpl.id}
              onClick={() => setSelectedTemplate(tpl.id)}
              className={cn(
                "p-3 rounded-lg border cursor-pointer transition-all",
                selectedTemplate === tpl.id ? "bg-indigo-50 border-indigo-300 shadow-sm" : "bg-white border-gray-200 hover:border-indigo-200"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <Layers size={14} className={selectedTemplate === tpl.id ? "text-indigo-600" : "text-gray-400"} />
                <h4 className="text-xs font-bold text-gray-800">{tpl.name}</h4>
              </div>
              <div className="text-[10px] text-gray-500 bg-gray-100 inline-block px-1.5 py-0.5 rounded">{tpl.category}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Middle: Recommended Template Structure */}
      <div className="flex-1 border-r border-gray-200 bg-gray-50/30 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Sparkles size={16} className="text-amber-500" /> AI 推荐模板结构
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-gray-900 rounded-xl p-4 shadow-sm">
            <pre className="text-xs font-mono text-emerald-400 whitespace-pre-wrap">
{currentTemplateData.structure}
            </pre>
          </div>
        </div>
      </div>

      {/* Right: Field Mapping */}
      <div className="w-96 bg-white flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Link2 size={16} className="text-indigo-600" /> 字段自动映射 (Auto Mapping)
          </h3>
          <button className="bg-indigo-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-indigo-700 transition-colors shadow-sm">
            一键映射
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {currentTemplateData.mappings.map((mapping, i) => (
            <div key={i} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="flex-1">
                <div className="text-[10px] text-gray-500 mb-1">数据源字段</div>
                <div className="text-xs font-mono font-medium text-gray-800 bg-white px-2 py-1 rounded border border-gray-200 inline-block">{mapping.source}</div>
              </div>
              <div className="px-3 flex flex-col items-center">
                {mapping.status === 'mapped' ? (
                  <ArrowRight size={16} className="text-emerald-500" />
                ) : (
                  <ArrowRight size={16} className="text-gray-300" />
                )}
                {mapping.auto && <span className="text-[8px] text-emerald-600 font-bold mt-1">AUTO</span>}
              </div>
              <div className="flex-1 text-right">
                <div className="text-[10px] text-gray-500 mb-1">本体属性</div>
                <div className={cn(
                  "text-xs font-mono font-medium px-2 py-1 rounded border inline-block",
                  mapping.status === 'mapped' ? "bg-indigo-50 text-indigo-700 border-indigo-200" : "bg-white text-gray-400 border-gray-200 border-dashed"
                )}>
                  {mapping.target}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button 
            onClick={() => setActiveTab('relations')}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            保存并定义关系 <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderRelationsTab = () => (
    <div className="flex-1 flex overflow-hidden">
      {/* Middle: Graph */}
      <div 
        className="flex-1 bg-[#f8f9fa] relative overflow-hidden flex flex-col border-r border-gray-200"
        onMouseMove={handleRelMouseMove}
        onMouseUp={handleRelMouseUp}
        onMouseLeave={handleRelMouseUp}
      >
        <div className="absolute top-4 left-4 z-10 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="flex items-center gap-2">
            {isEditingGraphName ? (
              <input
                autoFocus
                value={graphName}
                onChange={e => setGraphName(e.target.value)}
                onBlur={() => setIsEditingGraphName(false)}
                onKeyDown={e => e.key === 'Enter' && setIsEditingGraphName(false)}
                className="text-sm font-bold text-gray-800 border-b-2 border-indigo-500 focus:outline-none px-1 bg-transparent w-40"
              />
            ) : (
              <div
                className="text-sm font-bold text-gray-800 cursor-pointer hover:text-indigo-600 flex items-center gap-1 group"
                onClick={() => setIsEditingGraphName(true)}
              >
                {graphName} <Edit3 size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}
          </div>
          <div className="h-4 w-px bg-gray-300"></div>
          <div className="flex items-center gap-3 text-[10px] font-medium text-gray-500">
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> 制造资源</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> 生产执行</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-500"></div> 产品定义</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-500"></div> 供应链/质量</span>
          </div>
        </div>

        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <button
            onClick={() => setShowNewGraphConfirm(true)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-md transition-colors shadow-sm"
          >
            <Plus size={14} /> 新建图谱
          </button>
          <button 
            onClick={() => {
              setShowSaveToast(true);
              setTimeout(() => setShowSaveToast(false), 3000);
            }}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors shadow-sm"
          >
            <Save size={14} /> 保存图谱
          </button>
        </div>
        
        {/* Floating Toolbar */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 bg-white px-2 py-2 rounded-xl shadow-md border border-gray-200 flex items-center gap-2">
          <button 
            onClick={() => setShowAddNodeModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Plus size={16} className="text-indigo-600" /> 添加节点
          </button>
          <div className="w-px h-5 bg-gray-300"></div>
          <button 
            onClick={openAddRel}
            disabled={relNodes.length < 2}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${relNodes.length < 2 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <Link2 size={16} className={relNodes.length < 2 ? 'text-gray-400' : 'text-emerald-600'} /> 添加关系
          </button>
        </div>

        {/* Complex SVG Graph Representation */}
        <div className="flex-1 w-full h-full relative flex items-center justify-center overflow-auto min-h-[600px]">
          {relNodes.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-0">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Network size={40} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-700 mb-2">图谱为空</h3>
              <p className="text-sm text-gray-500 mb-6 max-w-md text-center">
                当前本体图谱没有任何节点和关系。请先添加实体节点，然后建立它们之间的关联关系。
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowAddNodeModal(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 flex items-center gap-2 font-medium"
                >
                  <Plus size={18} /> 添加节点
                </button>
              </div>
            </div>
          )}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 min-w-[800px] min-h-[600px]">
            <defs>
              <marker id="arrow-gray" markerWidth="8" markerHeight="6" refX="40" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#cbd5e1" />
              </marker>
              <marker id="arrow-indigo" markerWidth="8" markerHeight="6" refX="40" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#6366f1" />
              </marker>
            </defs>
            {relEdges.map((edge) => {
              const sourceNode = relNodes.find(n => n.id === edge.source);
              const targetNode = relNodes.find(n => n.id === edge.target);
              if (!sourceNode || !targetNode) return null;
              const isSelected = edge.id === activeRelId;
              return (
                <line 
                  key={edge.id}
                  x1={`${sourceNode.x}%`} y1={`${sourceNode.y}%`} 
                  x2={`${targetNode.x}%`} y2={`${targetNode.y}%`} 
                  stroke={isSelected ? "#6366f1" : "#cbd5e1"} 
                  strokeWidth={isSelected ? "2.5" : "1.5"} 
                  markerEnd={isSelected ? "url(#arrow-indigo)" : "url(#arrow-gray)"} 
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>

          {/* Edge Labels */}
          {relEdges.map((edge) => {
            const sourceNode = relNodes.find(n => n.id === edge.source);
            const targetNode = relNodes.find(n => n.id === edge.target);
            if (!sourceNode || !targetNode) return null;
            
            const midX = (sourceNode.x + targetNode.x) / 2;
            const midY = (sourceNode.y + targetNode.y) / 2;
            const isSelected = edge.id === activeRelId;
            
            return (
              <div 
                key={`label-${edge.id}`}
                onClick={() => openEditRel(edge)}
                className={cn(
                  "absolute px-2 py-1 backdrop-blur-sm text-[10px] font-mono rounded border cursor-pointer whitespace-nowrap z-10 shadow-sm transition-all hover:scale-110",
                  isSelected ? "bg-indigo-100 text-indigo-700 border-indigo-300 font-bold" : "bg-white/90 text-gray-500 border-gray-200"
                )}
                style={{ left: `${midX}%`, top: `${midY}%`, transform: 'translate(-50%, -50%)' }}
              >
                {edge.label}
              </div>
            );
          })}

          {/* Nodes */}
          {relNodes.map((node) => {
            const colorMap = {
              indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
              blue: 'bg-blue-50 border-blue-200 text-blue-700',
              amber: 'bg-amber-50 border-amber-200 text-amber-700',
              rose: 'bg-rose-50 border-rose-200 text-rose-700',
              emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
              purple: 'bg-purple-50 border-purple-200 text-purple-700',
            };
            const colorClass = colorMap[node.color as keyof typeof colorMap] || colorMap.indigo;
            const isDragging = relDragState?.id === node.id;
            
            return (
              <div 
                key={node.id}
                onMouseDown={(e) => handleRelNodeMouseDown(e, node.id, node.x, node.y)}
                className={cn(
                  "absolute -translate-x-1/2 -translate-y-1/2 border-2 p-2 rounded-xl shadow-sm flex flex-col items-center w-28 z-20 transition-shadow cursor-move select-none",
                  colorClass,
                  isDragging ? "ring-2 ring-indigo-400 shadow-lg scale-105" : "hover:shadow-md hover:border-indigo-300"
                )}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
              >
                <div className="mb-1 opacity-80 pointer-events-none">
                  {getIcon(node.icon)}
                </div>
                <span className="text-[10px] font-bold text-center leading-tight pointer-events-none">{node.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Relation Config */}
      <div className="w-80 bg-white flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Network size={16} className="text-indigo-600" /> 关系属性配置
            </h3>
            <p className="text-xs text-gray-500 mt-1">共定义 {relEdges.length} 组实体关系</p>
          </div>
          {!isAddingRel && !activeRelId && (
            <button 
              onClick={openAddRel}
              disabled={relNodes.length < 2}
              className={`p-1.5 rounded transition-colors ${relNodes.length < 2 ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
              title={relNodes.length < 2 ? "需至少两个节点才能新建关系" : "新建关系"}
            >
              <Plus size={16} />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50/50">
          {(isAddingRel || activeRelId) ? (
            <div className="p-4 space-y-4 bg-white border-b border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-xs font-bold text-gray-800">{isAddingRel ? '新建实体关系' : '编辑实体关系'}</h4>
                <button onClick={() => { setIsAddingRel(false); setActiveRelId(null); }} className="text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">源实体 (Source)</label>
                  <select 
                    value={relFormData.source} 
                    onChange={e => setRelFormData({...relFormData, source: e.target.value})}
                    className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {relNodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">目标实体 (Target)</label>
                  <select 
                    value={relFormData.target} 
                    onChange={e => setRelFormData({...relFormData, target: e.target.value})}
                    className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {relNodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">关系名称 (Label)</label>
                  <input 
                    type="text" 
                    list="relation-labels"
                    value={relFormData.label}
                    onChange={e => setRelFormData({...relFormData, label: e.target.value})}
                    placeholder="例如: 包含, 产生"
                    className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <datalist id="relation-labels">
                    <option value="包含" />
                    <option value="属于" />
                    <option value="产生" />
                    <option value="消耗" />
                    <option value="触发" />
                    <option value="分配给" />
                    <option value="需要" />
                    <option value="维护" />
                    <option value="加工于" />
                    <option value="由...检验" />
                    <option value="由...操作" />
                    <option value="由...供应" />
                    <option value="位于" />
                    <option value="监控" />
                    <option value="定义" />
                    <option value="生产" />
                    <option value="履行" />
                    <option value="由...下达" />
                    <option value="采购" />
                    <option value="由...追踪" />
                    <option value="执行于" />
                    <option value="补充" />
                    <option value="是...的实例" />
                    <option value="操作" />
                    <option value="持有" />
                    <option value="通过...运输" />
                    <option value="影响" />
                    <option value="升级" />
                    <option value="延迟" />
                    <option value="安装" />
                    <option value="使用" />
                    <option value="采购自" />
                    <option value="由...评估" />
                    <option value="交付给" />
                    <option value="发货自" />
                    <option value="离开自" />
                    <option value="控制环境" />
                    <option value="安装于" />
                    <option value="被...替换" />
                    <option value="消耗能源" />
                    <option value="产生废料" />
                    <option value="发生于" />
                    <option value="由...报告" />
                    <option value="涉及" />
                    <option value="测试于" />
                  </datalist>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">基数 (Cardinality)</label>
                  <select 
                    value={relFormData.cardinality} 
                    onChange={e => setRelFormData({...relFormData, cardinality: e.target.value})}
                    className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="1:1">1 : 1 (一对一)</option>
                    <option value="1:N">1 : N (一对多)</option>
                    <option value="N:M">N : M (多对多)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  onClick={handleSaveRel}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1"
                >
                  <Save size={14} /> 保存
                </button>
                {activeRelId && (
                  <button 
                    onClick={() => handleDeleteRel(activeRelId)}
                    className="px-3 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors"
                    title="删除关系"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {relEdges.map((edge) => {
                const sourceNode = relNodes.find(n => n.id === edge.source);
                const targetNode = relNodes.find(n => n.id === edge.target);
                return (
                  <div 
                    key={edge.id} 
                    onClick={() => openEditRel(edge)}
                    className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded border border-gray-200 group-hover:bg-indigo-50 group-hover:text-indigo-700 group-hover:border-indigo-200 transition-colors">{edge.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-indigo-600 font-medium">{edge.cardinality}</span>
                        <Edit3 size={12} className="text-gray-300 group-hover:text-indigo-500" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="text-gray-600 font-medium truncate max-w-[100px]">{sourceNode?.label || edge.source}</div>
                      <ArrowRight size={12} className="text-gray-400 mx-2 shrink-0" />
                      <div className="text-gray-600 font-medium truncate max-w-[100px]">{targetNode?.label || edge.target}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 bg-white">
          <button 
            onClick={() => setActiveTab('instances')}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            生成实例图谱 <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Modals and Toasts */}
      {showAddNodeModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-[400px] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Plus size={16} className="text-indigo-600" />
                添加实体节点
              </h3>
              <button onClick={() => setShowAddNodeModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">节点 ID (唯一标识)</label>
                <input 
                  type="text" 
                  value={newNodeData.id}
                  onChange={e => setNewNodeData({...newNodeData, id: e.target.value})}
                  placeholder="例如: EQUIP-001"
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">节点名称 (显示标签)</label>
                <input 
                  type="text" 
                  value={newNodeData.label}
                  onChange={e => setNewNodeData({...newNodeData, label: e.target.value})}
                  placeholder="例如: 1号涂布机"
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">实体类型 (Type)</label>
                <select 
                  value={newNodeData.type}
                  onChange={e => setNewNodeData({...newNodeData, type: e.target.value})}
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <optgroup label="制造资源">
                    <option value="Equipment">设备 (Equipment)</option>
                    <option value="ProductionLine">产线 (ProductionLine)</option>
                    <option value="Worker">人员 (Worker)</option>
                    <option value="Warehouse">仓库 (Warehouse)</option>
                  </optgroup>
                  <optgroup label="产品与物料">
                    <option value="Material">物料 (Material)</option>
                    <option value="Product">产品 (Product)</option>
                    <option value="SparePart">备件 (SparePart)</option>
                  </optgroup>
                  <optgroup label="生产执行">
                    <option value="WorkOrder">工单 (WorkOrder)</option>
                    <option value="Process">工序 (Process)</option>
                    <option value="Recipe">配方 (Recipe)</option>
                  </optgroup>
                  <optgroup label="质量与运维">
                    <option value="QualityInspection">质检 (QualityInspection)</option>
                    <option value="Telemetry">遥测/指标 (Telemetry)</option>
                    <option value="Incident">异常事件 (Incident)</option>
                    <option value="MaintenanceOrder">维保单 (MaintenanceOrder)</option>
                  </optgroup>
                  <optgroup label="供应链">
                    <option value="Supplier">供应商 (Supplier)</option>
                    <option value="Customer">客户 (Customer)</option>
                    <option value="SalesOrder">销售订单 (SalesOrder)</option>
                    <option value="PurchaseOrder">采购订单 (PurchaseOrder)</option>
                    <option value="Logistics">物流 (Logistics)</option>
                  </optgroup>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setShowAddNodeModal(false)}
                className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                取消
              </button>
              <button 
                onClick={handleAddNode}
                disabled={!newNodeData.id || !newNodeData.label}
                className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                添加节点
              </button>
            </div>
          </div>
        </div>
      )}

      {showNewGraphConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-[400px] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-500" />
                新建图谱确认
              </h3>
              <button onClick={() => setShowNewGraphConfirm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600">
                确定要新建图谱吗？当前未保存的节点和关系将被清空。
              </p>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setShowNewGraphConfirm(false)}
                className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                取消
              </button>
              <button 
                onClick={() => {
                  setRelNodes([]);
                  setRelEdges([]);
                  setGraphName('新建本体图谱');
                  setActiveRelId(null);
                  setIsAddingRel(false);
                  setShowNewGraphConfirm(false);
                }}
                className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
              >
                确定新建
              </button>
            </div>
          </div>
        </div>
      )}

      {showSaveToast && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 size={16} className="text-emerald-500" />
          <span className="text-sm font-medium">图谱 "{graphName}" 已保存！可在“实例绑定与生成”模块中使用。</span>
        </div>
      )}
    </div>
  );

  const renderInstancesTab = () => (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#f8f9fa]">
      <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Box size={16} className="text-indigo-600" /> 实例绑定与生成
          </h3>
          <div className="h-4 w-px bg-gray-300"></div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">选择目标实例:</span>
            <select 
              className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-indigo-500 bg-gray-50"
              value={selectedInstanceTarget}
              onChange={(e) => setSelectedInstanceTarget(e.target.value)}
            >
              {Object.entries(SCENARIOS_DATA).map(([key, data]) => (
                <option key={key} value={key}>{data.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded flex items-center gap-1">
            <CheckCircle2 size={12} /> 实例图谱已生成
          </span>
          <button className="bg-indigo-600 text-white px-4 py-1.5 rounded text-xs font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2">
            <Save size={14} /> 发布至知识库
          </button>
        </div>
      </div>

      <div 
        className="flex-1 relative overflow-hidden flex items-center justify-center bg-slate-50"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Instance Graph Visualization */}
        <div className="absolute top-1/2 left-1/2 w-0 h-0">
          <svg className="absolute overflow-visible pointer-events-none" style={{ top: 0, left: 0 }}>
            <defs>
              <marker id="arrow-inst" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#9ca3af" />
              </marker>
            </defs>
            {(SCENARIOS_DATA[selectedInstanceTarget]?.edges || []).map(edge => {
              const source = instanceNodes.find(n => n.id === edge.source);
              const target = instanceNodes.find(n => n.id === edge.target);
              if (!source || !target) return null;

              return (
                <g key={edge.id}>
                  <line 
                    x1={source.x} y1={source.y} 
                    x2={target.x} y2={target.y} 
                    stroke="#9ca3af" strokeWidth="2" markerEnd="url(#arrow-inst)" 
                  />
                  <text 
                    x={(source.x + target.x)/2} 
                    y={(source.y + target.y)/2 - 5} 
                    textAnchor="middle" fontSize="10" fill="#6b7280" fontWeight="medium"
                  >
                    {edge.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {instanceNodes.map(node => {
            return (
              <div 
                key={node.id}
                onMouseDown={(e) => handleNodeMouseDown(e, node.id, node.x, node.y)}
                className={cn(
                  "absolute transform -translate-x-1/2 -translate-y-1/2 bg-white border-2 p-3 rounded-xl shadow-sm flex flex-col items-center w-36 z-10 cursor-move select-none transition-shadow",
                  dragState?.id === node.id ? "border-indigo-400 shadow-md ring-2 ring-indigo-100" : "border-indigo-200 hover:border-indigo-300 hover:shadow-md"
                )}
                style={{ left: node.x, top: node.y }}
              >
                <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider pointer-events-none">{node.type}</div>
                <span className="text-sm font-bold text-indigo-900 pointer-events-none">{node.label}</span>
                <div className="text-[9px] font-mono text-gray-400 mt-1 pointer-events-none">{node.id}</div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Bottom Panel: Agent Linkage */}
      <div className="h-48 bg-white border-t border-gray-200 p-4 shrink-0 overflow-y-auto">
        <h4 className="text-xs font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Sparkles size={14} className="text-indigo-600" /> 联动价值 (Agent & MCP & Workflow)
        </h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-indigo-50/50 border border-indigo-100 p-3 rounded-lg">
            <div className="text-[10px] font-bold text-indigo-800 mb-1">全场景语义理解</div>
            <p className="text-[10px] text-gray-600">Agent 现在知道 "涂布机-01" 发生 "主轴卡死" 故障，触发了 "维修单"，并能顺藤摸瓜找到受影响的 "批次"、"工单" 乃至 "特斯拉订单"。</p>
          </div>
          <div className="bg-amber-50/50 border border-amber-100 p-3 rounded-lg">
            <div className="text-[10px] font-bold text-amber-800 mb-1">跨域影响评估 (Impact Analysis)</div>
            <p className="text-[10px] text-gray-600">当设备故障时，系统自动沿着图谱计算：维修需要消耗 "备件-涂布辊"，由 "张三" 负责，且会导致 "WO-20260318-01" 延期，直接影响 "特斯拉" 的交付。</p>
          </div>
          <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-lg">
            <div className="text-[10px] font-bold text-emerald-800 mb-1">Workflow 自动编排</div>
            <p className="text-[10px] text-gray-600">基于图谱，Agent 自动生成应对工作流：1. 锁定受影响的批次；2. 预警销售人员联系特斯拉；3. 自动向仓库发起备件领用申请。</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden font-sans">
      {/* Top Header */}
      <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 shrink-0 bg-gray-900 text-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Database size={18} />
          </div>
          <div>
            <h2 className="text-sm font-semibold">Ontology Builder</h2>
            <p className="text-[10px] text-gray-400 font-mono">本体建模与自动化生成引擎</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-700">
            数据层 → Ontology Builder → Agent / 推理层
          </span>
        </div>
      </div>

      {/* Main Content with Vertical Tabs */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation (Stepper) */}
        <div className="w-48 bg-gray-50 border-r border-gray-200 flex flex-col shrink-0 py-4 z-20">
          <div className="px-4 mb-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">构建流程</h3>
          </div>
          <nav className="flex-1 space-y-1 px-2">
            {[
              { id: 'discovery', label: '1. 数据接入与发现', icon: Search },
              { id: 'mapping', label: '2. 模板匹配与映射', icon: GitMerge },
              { id: 'relations', label: '3. 关系定义与图谱', icon: Network },
              { id: 'instances', label: '4. 实例绑定与生成', icon: Box },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabKey)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-all text-left",
                    isActive 
                      ? "bg-indigo-100 text-indigo-700 shadow-sm" 
                      : "text-gray-600 hover:bg-gray-200/50"
                  )}
                >
                  <Icon size={16} className={isActive ? "text-indigo-600" : "text-gray-400"} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeTab === 'discovery' && renderDiscoveryTab()}
          {activeTab === 'mapping' && renderMappingTab()}
          {activeTab === 'relations' && renderRelationsTab()}
          {activeTab === 'instances' && renderInstancesTab()}
        </div>
      </div>
    </div>
  );
}
