import { useState } from 'react';
import { Activity, Terminal, BrainCircuit, Clock, Database, CheckCircle2, AlertCircle, Loader2, Cpu } from 'lucide-react';
import { cn } from '../lib/utils';

const activeTasks = [
  { id: 'TASK-8902', name: 'EQ-001 温度异常诊断与处理', agent: 'Planner-01', status: 'running', progress: 65, startTime: '10:23:45' },
  { id: 'TASK-8901', name: '周度 OEE 报表生成', agent: 'Analyst-02', status: 'completed', progress: 100, startTime: '09:00:00' },
  { id: 'TASK-8903', name: '物料短缺风险评估', agent: 'Critic-01', status: 'running', progress: 40, startTime: '11:20:00' },
  { id: 'TASK-8904', name: '产线-A 激光传感器校准', agent: 'Operator-03', status: 'running', progress: 30, startTime: '11:10:00' },
  { id: 'TASK-8905', name: '电池包-Y 质量抽检分析', agent: 'Analyst-01', status: 'completed', progress: 100, startTime: '08:30:00' },
  { id: 'TASK-8906', name: '涂布机-A 涂布厚度异常预警', agent: 'Monitor-02', status: 'running', progress: 80, startTime: '10:45:00' },
  { id: 'TASK-8907', name: '自动排产计划优化', agent: 'Planner-02', status: 'running', progress: 20, startTime: '11:30:00' },
  { id: 'TASK-8908', name: '仓储 AGV 路径冲突解决', agent: 'Coordinator-01', status: 'completed', progress: 100, startTime: '09:15:00' },
  { id: 'TASK-8909', name: '客户订单交期预测', agent: 'Analyst-03', status: 'running', progress: 45, startTime: '10:50:00' },
  { id: 'TASK-8910', name: '能源消耗异常波动排查', agent: 'Monitor-01', status: 'running', progress: 10, startTime: '11:45:00' },
];

const taskReasoningSteps: Record<string, any[]> = {
  'TASK-8902': [
    { id: 1, type: 'context', content: '获取 EQ-001 过去 24 小时温度时序数据...', status: 'done', time: '10:23:46' },
    { id: 2, type: 'tool', content: '调用工具: get_sensor_data(id="EQ-001", metrics=["temp", "vibration"])', status: 'done', time: '10:23:48' },
    { id: 3, type: 'reasoning', content: '分析数据：发现 10:15 开始温度梯度异常升高，斜率 > 2.5°C/min。同时伴随轻微高频振动。', status: 'done', time: '10:23:55' },
    { id: 4, type: 'context', content: '检索知识库：寻找"温度急升+高频振动"的历史案例...', status: 'done', time: '10:23:56' },
    { id: 5, type: 'reasoning', content: '匹配到案例 CASE-2023-112：冷却液循环泵轴承磨损初期症状。置信度 85%。', status: 'done', time: '10:24:02' },
    { id: 6, type: 'tool', content: '调用工具: check_maintenance_record(id="EQ-001", component="cooling_pump")', status: 'running', time: '10:24:05' },
  ],
  'TASK-8901': [
    { id: 1, type: 'context', content: '提取本周所有产线的 OEE 原始数据...', status: 'done', time: '09:00:05' },
    { id: 2, type: 'tool', content: '调用工具: query_database(query="SELECT * FROM oee_logs WHERE date >= DATE_SUB(NOW(), INTERVAL 7 DAY)")', status: 'done', time: '09:00:10' },
    { id: 3, type: 'reasoning', content: '计算可用性、性能和质量指数。发现产线-B 的可用性下降了 4%。', status: 'done', time: '09:00:25' },
    { id: 4, type: 'tool', content: '调用工具: generate_report(data=oee_data, format="pdf")', status: 'done', time: '09:00:40' },
    { id: 5, type: 'reasoning', content: '报表生成完毕，准备发送给生产主管。', status: 'done', time: '09:00:45' },
  ],
  'TASK-8903': [
    { id: 1, type: 'context', content: '接收到最新的 ERP 物料库存快照，发现负极材料库存低于安全阈值...', status: 'done', time: '11:20:05' },
    { id: 2, type: 'tool', content: '调用工具: analyze_inventory_impact(material="anode", current_stock=5000)', status: 'done', time: '11:20:15' },
    { id: 3, type: 'reasoning', content: '评估影响：当前库存仅能维持 2 天生产，预计影响 3 个进行中的工单。', status: 'done', time: '11:20:30' },
    { id: 4, type: 'tool', content: '调用工具: query_supplier_lead_time(material="anode")', status: 'running', time: '11:20:45' },
  ],
  'TASK-8904': [
    { id: 1, type: 'context', content: '接收到产线-A 激光传感器精度下降的警报...', status: 'done', time: '11:10:00' },
    { id: 2, type: 'tool', content: '调用工具: initiate_calibration_sequence(sensor_id="LASER-A-01")', status: 'done', time: '11:10:05' },
    { id: 3, type: 'reasoning', content: '校准序列已启动，正在等待传感器返回基准测试数据。', status: 'done', time: '11:10:15' },
    { id: 4, type: 'tool', content: '调用工具: read_calibration_results(sensor_id="LASER-A-01")', status: 'running', time: '11:10:30' },
  ],
  'TASK-8905': [
    { id: 1, type: 'context', content: '获取批次 BAT-Y-20260317 的抽检图像数据...', status: 'done', time: '08:30:00' },
    { id: 2, type: 'tool', content: '调用工具: run_cv_model(model="defect_detection_v2", images=batch_images)', status: 'done', time: '08:30:15' },
    { id: 3, type: 'reasoning', content: '视觉模型分析完成：未发现明显划痕或极耳折叠缺陷。良率 100%。', status: 'done', time: '08:30:45' },
    { id: 4, type: 'tool', content: '调用工具: update_quality_record(batch_id="BAT-Y-20260317", status="PASS")', status: 'done', time: '08:30:50' },
  ],
  'TASK-8906': [
    { id: 1, type: 'context', content: '实时监控涂布机-A 的面密度传感器数据流...', status: 'done', time: '10:45:00' },
    { id: 2, type: 'reasoning', content: '检测到连续 3 个采样点厚度超过上限阈值 (152μm)。', status: 'done', time: '10:45:12' },
    { id: 3, type: 'tool', content: '调用工具: adjust_coating_gap(machine_id="COATER-A", delta=-2)', status: 'running', time: '10:45:15' },
  ],
  'TASK-8907': [
    { id: 1, type: 'context', content: '触发排产计算：接收到新的插单请求及设备状态更新...', status: 'done', time: '11:30:05' },
    { id: 2, type: 'tool', content: '调用工具: run_aps_solver(constraints=["delivery_date", "machine_availability"])', status: 'running', time: '11:30:15' },
  ],
  'TASK-8908': [
    { id: 1, type: 'context', content: '检测到 AGV-05 和 AGV-12 在通道 C 发生路径冲突预警...', status: 'done', time: '09:15:00' },
    { id: 2, type: 'reasoning', content: '分析优先级：AGV-05 载有急需物料，优先级较高。', status: 'done', time: '09:15:02' },
    { id: 3, type: 'tool', content: '调用工具: send_agv_command(agv_id="AGV-12", action="wait", location="NODE-C-1")', status: 'done', time: '09:15:05' },
    { id: 4, type: 'reasoning', content: 'AGV-12 已避让，AGV-05 顺利通过。恢复 AGV-12 路径。', status: 'done', time: '09:15:20' },
  ],
  'TASK-8909': [
    { id: 1, type: 'context', content: '收到新订单 ORD-2026-992，请求交期评估...', status: 'done', time: '10:50:00' },
    { id: 2, type: 'tool', content: '调用工具: check_inventory_and_capacity(product_id="PROD-102", quantity=5000)', status: 'done', time: '10:50:05' },
    { id: 3, type: 'reasoning', content: '当前库存 1000，需生产 4000。产线-A 产能饱和，产线-B 预计明天有空档。', status: 'done', time: '10:50:15' },
    { id: 4, type: 'tool', content: '调用工具: simulate_production_schedule(order_id="ORD-2026-992")', status: 'running', time: '10:50:20' },
  ],
  'TASK-8910': [
    { id: 1, type: 'context', content: '车间总能耗超过基线 15%，触发异常排查...', status: 'done', time: '11:45:05' },
    { id: 2, type: 'tool', content: '调用工具: fetch_energy_consumption_breakdown(facility="workshop_1")', status: 'running', time: '11:45:15' },
  ]
};

export default function AgentMonitor() {
  const [selectedTask, setSelectedTask] = useState('TASK-8902');
  
  const currentTask = activeTasks.find(t => t.id === selectedTask);
  const reasoningSteps = taskReasoningSteps[selectedTask] || [];
  const activeTaskCount = activeTasks.filter(t => t.status === 'running').length;

  return (
    <div className="h-full flex flex-col gap-6">
      <header>
        <h2 className="text-xl font-bold text-gray-900">智能体控制台</h2>
        <p className="text-sm text-gray-500 mt-1">多智能体协同执行与推理链监控</p>
      </header>

      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        {/* Left Pane: Task List */}
        <div className="col-span-4 flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">当前任务队列</h3>
            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[10px] font-medium">{activeTaskCount} 运行中</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {activeTasks.map((task) => (
              <button
                key={task.id}
                onClick={() => setSelectedTask(task.id)}
                className={cn(
                  "w-full text-left p-4 rounded-lg border transition-all duration-200",
                  selectedTask === task.id
                    ? "bg-gray-50 border-gray-300 ring-1 ring-gray-200 shadow-sm"
                    : "bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50/50"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-xs font-medium text-gray-900">{task.id}</span>
                  <span className={cn(
                    "flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded",
                    task.status === 'running' ? "text-blue-700 bg-blue-50" :
                    task.status === 'completed' ? "text-emerald-700 bg-emerald-50" :
                    "text-gray-600 bg-gray-100"
                  )}>
                    {task.status === 'running' && <Loader2 size={10} className="animate-spin" />}
                    {task.status === 'completed' && <CheckCircle2 size={10} />}
                    {task.status === 'pending' && <Clock size={10} />}
                    {task.status === 'running' ? '运行中' : task.status === 'completed' ? '已完成' : '等待中'}
                  </span>
                </div>
                <div className="font-medium text-gray-900 text-sm mb-1 truncate">{task.name}</div>
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <Cpu size={12} />
                  <span className="font-mono">{task.agent}</span>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                    <span>进度</span>
                    <span>{task.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        task.status === 'completed' ? "bg-emerald-500" : "bg-blue-500"
                      )}
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Pane: Reasoning Chain & Tools */}
        <div className="col-span-8 flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <BrainCircuit className="text-indigo-600" size={18} />
              <h3 className="text-sm font-semibold text-gray-900">Token 级推理链</h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
              <Clock size={14} />
              开始时间: {currentTask?.startTime || '-'}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-[#f8f9fa]">
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              {reasoningSteps.map((step, index) => (
                <div key={step.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  {/* Timeline dot */}
                  <div className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#f8f9fa] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10",
                    step.type === 'tool' ? "bg-amber-100 text-amber-600" :
                    step.type === 'reasoning' ? "bg-indigo-100 text-indigo-600" :
                    "bg-blue-100 text-blue-600"
                  )}>
                    {step.type === 'tool' ? <Terminal size={16} /> :
                     step.type === 'reasoning' ? <BrainCircuit size={16} /> :
                     <Database size={16} />}
                  </div>
                  
                  {/* Content Card */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded",
                        step.type === 'tool' ? "bg-amber-50 text-amber-700" :
                        step.type === 'reasoning' ? "bg-indigo-50 text-indigo-700" :
                        "bg-blue-50 text-blue-700"
                      )}>
                        {step.type}
                      </span>
                      <span className="text-xs font-mono text-gray-400">{step.time}</span>
                    </div>
                    
                    {step.type === 'tool' ? (
                      <div className="bg-gray-900 rounded-lg p-3 mt-2">
                        <code className="text-xs font-mono text-green-400 break-all">
                          {step.content}
                        </code>
                        {step.status === 'running' && (
                          <div className="flex items-center gap-2 mt-2 text-gray-400 text-xs font-mono">
                            <Loader2 size={12} className="animate-spin" />
                            等待工具响应...
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {step.content}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
