-- Agent Data OS - Core Database Schema
-- Design Principle: Object + Graph + Agent + Tool + Decision

-- ==========================================
-- 1. Object Layer (业务对象层)
-- ==========================================

CREATE TABLE object_entity (
    id VARCHAR(64) PRIMARY KEY,
    type VARCHAR(64) NOT NULL,
    name VARCHAR(128) NOT NULL,
    state VARCHAR(64),
    lifecycle_stage VARCHAR(64),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE object_attribute (
    id BIGSERIAL PRIMARY KEY,
    object_id VARCHAR(64) REFERENCES object_entity(id) ON DELETE CASCADE,
    attr_key VARCHAR(128) NOT NULL,
    attr_value TEXT,
    value_type VARCHAR(32),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE object_relation (
    id BIGSERIAL PRIMARY KEY,
    source_id VARCHAR(64) REFERENCES object_entity(id) ON DELETE CASCADE,
    target_id VARCHAR(64) REFERENCES object_entity(id) ON DELETE CASCADE,
    relation_type VARCHAR(64) NOT NULL,
    weight DECIMAL(5,2) DEFAULT 1.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 2. Semantic/Graph Layer (语义/图谱层)
-- ==========================================

CREATE TABLE ontology_class (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    description TEXT,
    parent_id VARCHAR(64) REFERENCES ontology_class(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ontology_property (
    id VARCHAR(64) PRIMARY KEY,
    class_id VARCHAR(64) REFERENCES ontology_class(id) ON DELETE CASCADE,
    name VARCHAR(128) NOT NULL,
    data_type VARCHAR(64) NOT NULL,
    is_required BOOLEAN DEFAULT false
);

CREATE TABLE knowledge_triple (
    id BIGSERIAL PRIMARY KEY,
    subject_id VARCHAR(64) NOT NULL,
    predicate VARCHAR(128) NOT NULL,
    object_id VARCHAR(64) NOT NULL,
    confidence DECIMAL(5,4) DEFAULT 1.0,
    source VARCHAR(128),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 3. Agent Layer (智能体层)
-- ==========================================

CREATE TABLE agent_profile (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    role VARCHAR(64) NOT NULL,
    system_prompt TEXT,
    model_config JSONB,
    status VARCHAR(32) DEFAULT 'idle',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE agent_memory (
    id BIGSERIAL PRIMARY KEY,
    agent_id VARCHAR(64) REFERENCES agent_profile(id) ON DELETE CASCADE,
    memory_type VARCHAR(32) NOT NULL, -- 'short_term', 'long_term'
    content TEXT NOT NULL,
    -- embedding VECTOR(1536), -- Uncomment if using pgvector
    importance DECIMAL(5,2) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE agent_task (
    id VARCHAR(64) PRIMARY KEY,
    agent_id VARCHAR(64) REFERENCES agent_profile(id),
    title VARCHAR(256) NOT NULL,
    description TEXT,
    status VARCHAR(32) DEFAULT 'pending',
    priority INT DEFAULT 0,
    result JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- ==========================================
-- 4. Tool/MCP Layer (工具/MCP层)
-- ==========================================

CREATE TABLE mcp_server (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    url VARCHAR(256) NOT NULL,
    status VARCHAR(32) DEFAULT 'disconnected',
    config JSONB,
    last_ping_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mcp_tool (
    id VARCHAR(64) PRIMARY KEY,
    server_id VARCHAR(64) REFERENCES mcp_server(id) ON DELETE CASCADE,
    name VARCHAR(128) NOT NULL,
    description TEXT,
    input_schema JSONB NOT NULL,
    output_schema JSONB,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE tool_execution_log (
    id BIGSERIAL PRIMARY KEY,
    tool_id VARCHAR(64) REFERENCES mcp_tool(id),
    agent_id VARCHAR(64) REFERENCES agent_profile(id),
    task_id VARCHAR(64) REFERENCES agent_task(id),
    input_data JSONB,
    output_data JSONB,
    execution_time_ms INT,
    status VARCHAR(32),
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 5. Decision & Simulation Layer (推演与仿真层)
-- ==========================================

CREATE TABLE decision_scenario (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    description TEXT,
    base_state JSONB,
    target_objectives JSONB,
    status VARCHAR(32) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE simulation_run (
    id VARCHAR(64) PRIMARY KEY,
    scenario_id VARCHAR(64) REFERENCES decision_scenario(id) ON DELETE CASCADE,
    parameters JSONB,
    status VARCHAR(32) DEFAULT 'running',
    progress INT DEFAULT 0,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE TABLE simulation_result (
    id BIGSERIAL PRIMARY KEY,
    run_id VARCHAR(64) REFERENCES simulation_run(id) ON DELETE CASCADE,
    metric_name VARCHAR(128) NOT NULL,
    baseline_value DECIMAL(15,4),
    simulated_value DECIMAL(15,4),
    variance DECIMAL(15,4),
    confidence DECIMAL(5,4)
);

CREATE TABLE decision_action (
    id VARCHAR(64) PRIMARY KEY,
    scenario_id VARCHAR(64) REFERENCES decision_scenario(id),
    run_id VARCHAR(64) REFERENCES simulation_run(id),
    action_type VARCHAR(64) NOT NULL,
    payload JSONB,
    estimated_impact JSONB,
    approval_status VARCHAR(32) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
