import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCAL_DB_PATH = path.join(__dirname, 'agripilot_store.json');

const { Pool } = pg;
let pool = null;
let usePostgres = false;

// Initialize Persistent Local Storage structure if not exists
const initialStore = {
  users: [],
  fields: [],
  advisories: [],
  messages: [],
  ai_analyses: [],
  insights: []
};

function readLocalStore() {
  try {
    if (!fs.existsSync(LOCAL_DB_PATH)) {
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(initialStore, null, 2), 'utf-8');
      return { ...initialStore };
    }
    const data = fs.readFileSync(LOCAL_DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading local db store, resetting to initial state:', err.message);
    return { ...initialStore };
  }
}

function writeLocalStore(data) {
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to local db store:', err.message);
  }
}

// PostgreSQL schema initialization
const PG_SCHEMA = `
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    farm_name VARCHAR(255) NOT NULL,
    farming_sector VARCHAR(100) DEFAULT 'Horticulture',
    farming_approach VARCHAR(100) DEFAULT 'Integrated Pest Management (IPM)',
    primary_goal VARCHAR(100) DEFAULT 'Maximize Yield & Reduce Disease',
    risk_alert_threshold VARCHAR(50) DEFAULT 'Medium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    crop_type VARCHAR(100) NOT NULL,
    acreage NUMERIC(10, 2) NOT NULL DEFAULT 1.0,
    soil_type VARCHAR(100) NOT NULL DEFAULT 'Loamy',
    status VARCHAR(50) NOT NULL DEFAULT 'Healthy',
    risk_level VARCHAR(50) NOT NULL DEFAULT 'Low',
    location VARCHAR(255) DEFAULT 'Field Block Main',
    health_score NUMERIC(5, 2) DEFAULT 85.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS advisories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    field_id UUID REFERENCES fields(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    advisory_id UUID NOT NULL REFERENCES advisories(id) ON DELETE CASCADE,
    sender_type VARCHAR(50) NOT NULL CHECK (sender_type IN ('farmer', 'agent', 'ai')),
    content TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    advisory_id UUID NOT NULL REFERENCES advisories(id) ON DELETE CASCADE,
    message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
    category VARCHAR(100) NOT NULL,
    diagnosis VARCHAR(255) NOT NULL,
    confidence_score NUMERIC(5, 2) NOT NULL DEFAULT 0.85,
    severity VARCHAR(50) NOT NULL,
    priority VARCHAR(50) NOT NULL,
    risk_level VARCHAR(50) NOT NULL,
    summary TEXT NOT NULL,
    organic_remedy TEXT NOT NULL,
    chemical_remedy TEXT NOT NULL,
    recommended_action TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    insight_type VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL DEFAULT 'Medium',
    recommended_action TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`;

export async function initDb() {
  if (config.databaseUrl) {
    try {
      pool = new Pool({
        connectionString: config.databaseUrl,
        connectionTimeoutMillis: 4000,
        ssl: config.databaseUrl.includes('supabase') || config.isProduction
          ? { rejectUnauthorized: false }
          : false,
      });
      await pool.query('SELECT NOW()');
      console.log('Connected to Supabase PostgreSQL database successfully.');
      await pool.query(PG_SCHEMA);
      console.log('PostgreSQL schema verified and ready.');
      usePostgres = true;
      return;
    } catch (err) {
      console.warn('PostgreSQL connection notice (' + err.message + '). Active resilient local store ready.');
      usePostgres = false;
    }
  } else {
    console.log('No DATABASE_URL configured. Initializing resilient local store.');
  }

  // Verify local store file
  readLocalStore();
  console.log('AgriPilot Local Persistent Storage initialized at:', LOCAL_DB_PATH);
}

// Database Operations Layer (Unified Interface)
export const db = {
  isPostgres() {
    return usePostgres;
  },

  async query(text, params = []) {
    if (usePostgres && pool) {
      return pool.query(text, params);
    }
    throw new Error('Raw query not supported in local fallback mode. Use repository methods.');
  },

  // USERS
  async findUserByEmail(email) {
    if (usePostgres) {
      const res = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
      return res.rows[0] || null;
    }
    const store = readLocalStore();
    return store.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
  },

  async findUserById(id) {
    if (usePostgres) {
      const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
      return res.rows[0] || null;
    }
    const store = readLocalStore();
    return store.users.find(u => u.id === id) || null;
  },

  async createUser(userData) {
    const id = uuidv4();
    const now = new Date().toISOString();
    const user = {
      id,
      name: userData.name,
      email: userData.email.toLowerCase().trim(),
      password_hash: userData.password_hash,
      farm_name: userData.farm_name,
      farming_sector: userData.farming_sector || 'Horticulture',
      farming_approach: userData.farming_approach || 'Integrated Pest Management (IPM)',
      primary_goal: userData.primary_goal || 'Maximize Yield & Reduce Disease',
      risk_alert_threshold: userData.risk_alert_threshold || 'Medium',
      created_at: now,
      updated_at: now
    };

    if (usePostgres) {
      const res = await pool.query(
        `INSERT INTO users (id, name, email, password_hash, farm_name, farming_sector, farming_approach, primary_goal, risk_alert_threshold, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
        [user.id, user.name, user.email, user.password_hash, user.farm_name, user.farming_sector, user.farming_approach, user.primary_goal, user.risk_alert_threshold, user.created_at, user.updated_at]
      );
      return res.rows[0];
    }

    const store = readLocalStore();
    store.users.push(user);
    writeLocalStore(store);
    return user;
  },

  async updateUser(id, updates) {
    const now = new Date().toISOString();
    if (usePostgres) {
      const fields = [];
      const values = [];
      let idx = 1;

      for (const [key, val] of Object.entries(updates)) {
        if (key !== 'id' && key !== 'created_at') {
          fields.push(`${key} = $${idx}`);
          values.push(val);
          idx++;
        }
      }
      fields.push(`updated_at = $${idx}`);
      values.push(now);
      idx++;
      values.push(id);

      const res = await pool.query(
        `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx - 1} RETURNING *`,
        values
      );
      return res.rows[0] || null;
    }

    const store = readLocalStore();
    const userIdx = store.users.findIndex(u => u.id === id);
    if (userIdx === -1) return null;
    store.users[userIdx] = {
      ...store.users[userIdx],
      ...updates,
      updated_at: now
    };
    writeLocalStore(store);
    return store.users[userIdx];
  },

  // FIELDS
  async getFieldsByUserId(userId) {
    if (usePostgres) {
      const res = await pool.query('SELECT * FROM fields WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
      return res.rows;
    }
    const store = readLocalStore();
    return store.fields.filter(f => f.user_id === userId).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async getFieldById(id, userId) {
    if (usePostgres) {
      const res = await pool.query('SELECT * FROM fields WHERE id = $1 AND user_id = $2', [id, userId]);
      return res.rows[0] || null;
    }
    const store = readLocalStore();
    return store.fields.find(f => f.id === id && f.user_id === userId) || null;
  },

  async createField(data) {
    const id = uuidv4();
    const now = new Date().toISOString();
    const field = {
      id,
      user_id: data.user_id,
      name: data.name,
      crop_type: data.crop_type,
      acreage: Number(data.acreage) || 1.0,
      soil_type: data.soil_type || 'Loamy',
      status: data.status || 'Healthy',
      risk_level: data.risk_level || 'Low',
      location: data.location || 'Plot A-1',
      health_score: Number(data.health_score) || 85.0,
      created_at: now,
      updated_at: now
    };

    if (usePostgres) {
      const res = await pool.query(
        `INSERT INTO fields (id, user_id, name, crop_type, acreage, soil_type, status, risk_level, location, health_score, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
        [field.id, field.user_id, field.name, field.crop_type, field.acreage, field.soil_type, field.status, field.risk_level, field.location, field.health_score, field.created_at, field.updated_at]
      );
      return res.rows[0];
    }

    const store = readLocalStore();
    store.fields.push(field);
    writeLocalStore(store);
    return field;
  },

  async updateField(id, userId, updates) {
    const now = new Date().toISOString();
    if (usePostgres) {
      const fields = [];
      const values = [];
      let idx = 1;

      for (const [key, val] of Object.entries(updates)) {
        if (key !== 'id' && key !== 'user_id' && key !== 'created_at') {
          fields.push(`${key} = $${idx}`);
          values.push(val);
          idx++;
        }
      }
      fields.push(`updated_at = $${idx}`);
      values.push(now);
      idx++;
      values.push(id);
      values.push(userId);

      const res = await pool.query(
        `UPDATE fields SET ${fields.join(', ')} WHERE id = $${idx - 2} AND user_id = $${idx - 1} RETURNING *`,
        values
      );
      return res.rows[0] || null;
    }

    const store = readLocalStore();
    const idx = store.fields.findIndex(f => f.id === id && f.user_id === userId);
    if (idx === -1) return null;
    store.fields[idx] = {
      ...store.fields[idx],
      ...updates,
      updated_at: now
    };
    writeLocalStore(store);
    return store.fields[idx];
  },

  async deleteField(id, userId) {
    if (usePostgres) {
      const res = await pool.query('DELETE FROM fields WHERE id = $1 AND user_id = $2 RETURNING id', [id, userId]);
      return res.rowCount > 0;
    }
    const store = readLocalStore();
    const initialLen = store.fields.length;
    store.fields = store.fields.filter(f => !(f.id === id && f.user_id === userId));
    writeLocalStore(store);
    return store.fields.length < initialLen;
  },

  // ADVISORIES
  async getAdvisoriesByUserId(userId) {
    if (usePostgres) {
      const query = `
        SELECT a.*, f.name as field_name, f.crop_type,
               ai.diagnosis, ai.category, ai.severity, ai.priority, ai.risk_level, ai.confidence_score
        FROM advisories a
        LEFT JOIN fields f ON a.field_id = f.id
        LEFT JOIN LATERAL (
          SELECT * FROM ai_analyses
          WHERE advisory_id = a.id
          ORDER BY created_at DESC
          LIMIT 1
        ) ai ON true
        WHERE a.user_id = $1
        ORDER BY a.created_at DESC
      `;
      const res = await pool.query(query, [userId]);
      return res.rows;
    }
    const store = readLocalStore();
    const userAdvisories = store.advisories.filter(a => a.user_id === userId);
    return userAdvisories.map(a => {
      const field = store.fields.find(f => f.id === a.field_id) || {};
      const analyses = store.ai_analyses
        .filter(ai => ai.advisory_id === a.id)
        .sort((x, y) => new Date(y.created_at) - new Date(x.created_at));
      const latestAi = analyses[0] || {};
      return {
        ...a,
        field_name: field.name || 'Unassigned Field',
        crop_type: field.crop_type || 'General Crop',
        diagnosis: latestAi.diagnosis || null,
        category: latestAi.category || null,
        severity: latestAi.severity || null,
        priority: latestAi.priority || null,
        risk_level: latestAi.risk_level || null,
        confidence_score: latestAi.confidence_score || null
      };
    }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async getAdvisoryById(id, userId) {
    if (usePostgres) {
      const query = `
        SELECT a.*, f.name as field_name, f.crop_type, f.soil_type, f.acreage, f.location
        FROM advisories a
        LEFT JOIN fields f ON a.field_id = f.id
        WHERE a.id = $1 AND a.user_id = $2
      `;
      const res = await pool.query(query, [id, userId]);
      return res.rows[0] || null;
    }
    const store = readLocalStore();
    const advisory = store.advisories.find(a => a.id === id && a.user_id === userId);
    if (!advisory) return null;
    const field = store.fields.find(f => f.id === advisory.field_id) || {};
    return {
      ...advisory,
      field_name: field.name || 'Unassigned Field',
      crop_type: field.crop_type || 'General Crop',
      soil_type: field.soil_type || 'Unknown',
      acreage: field.acreage || 1.0,
      location: field.location || 'Block Main'
    };
  },

  async createAdvisory(data) {
    const id = uuidv4();
    const now = new Date().toISOString();
    const advisory = {
      id,
      field_id: data.field_id || null,
      user_id: data.user_id,
      title: data.title || 'Field Diagnostic Inquiry',
      status: data.status || 'Open',
      created_at: now,
      updated_at: now
    };

    if (usePostgres) {
      const res = await pool.query(
        `INSERT INTO advisories (id, field_id, user_id, title, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [advisory.id, advisory.field_id, advisory.user_id, advisory.title, advisory.status, advisory.created_at, advisory.updated_at]
      );
      return res.rows[0];
    }

    const store = readLocalStore();
    store.advisories.push(advisory);
    writeLocalStore(store);
    return advisory;
  },

  async updateAdvisory(id, updates) {
    const now = new Date().toISOString();
    if (usePostgres) {
      const fields = [];
      const values = [];
      let idx = 1;
      for (const [key, val] of Object.entries(updates)) {
        if (key !== 'id' && key !== 'user_id' && key !== 'created_at') {
          fields.push(`${key} = $${idx}`);
          values.push(val);
          idx++;
        }
      }
      fields.push(`updated_at = $${idx}`);
      values.push(now);
      idx++;
      values.push(id);
      const res = await pool.query(
        `UPDATE advisories SET ${fields.join(', ')} WHERE id = $${idx - 1} RETURNING *`,
        values
      );
      return res.rows[0] || null;
    }

    const store = readLocalStore();
    const idx = store.advisories.findIndex(a => a.id === id);
    if (idx === -1) return null;
    store.advisories[idx] = {
      ...store.advisories[idx],
      ...updates,
      updated_at: now
    };
    writeLocalStore(store);
    return store.advisories[idx];
  },

  // MESSAGES
  async getMessagesByAdvisoryId(advisoryId) {
    if (usePostgres) {
      const res = await pool.query(
        'SELECT * FROM messages WHERE advisory_id = $1 ORDER BY created_at ASC',
        [advisoryId]
      );
      return res.rows;
    }
    const store = readLocalStore();
    return store.messages
      .filter(m => m.advisory_id === advisoryId)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  },

  async createMessage(data) {
    const id = uuidv4();
    const now = new Date().toISOString();
    const msg = {
      id,
      advisory_id: data.advisory_id,
      sender_type: data.sender_type,
      content: data.content,
      image_url: data.image_url || null,
      created_at: now
    };

    if (usePostgres) {
      const res = await pool.query(
        `INSERT INTO messages (id, advisory_id, sender_type, content, image_url, created_at)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [msg.id, msg.advisory_id, msg.sender_type, msg.content, msg.image_url, msg.created_at]
      );
      return res.rows[0];
    }

    const store = readLocalStore();
    store.messages.push(msg);
    writeLocalStore(store);
    return msg;
  },

  // AI ANALYSES
  async getAiAnalysesByAdvisoryId(advisoryId) {
    if (usePostgres) {
      const res = await pool.query(
        'SELECT * FROM ai_analyses WHERE advisory_id = $1 ORDER BY created_at ASC',
        [advisoryId]
      );
      return res.rows;
    }
    const store = readLocalStore();
    return store.ai_analyses
      .filter(a => a.advisory_id === advisoryId)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  },

  async createAiAnalysis(data) {
    const id = uuidv4();
    const now = new Date().toISOString();
    const analysis = {
      id,
      advisory_id: data.advisory_id,
      message_id: data.message_id || null,
      category: data.category,
      diagnosis: data.diagnosis,
      confidence_score: Number(data.confidence_score) || 0.9,
      severity: data.severity,
      priority: data.priority,
      risk_level: data.risk_level,
      summary: data.summary,
      organic_remedy: data.organic_remedy,
      chemical_remedy: data.chemical_remedy,
      recommended_action: data.recommended_action,
      created_at: now
    };

    if (usePostgres) {
      const res = await pool.query(
        `INSERT INTO ai_analyses (id, advisory_id, message_id, category, diagnosis, confidence_score, severity, priority, risk_level, summary, organic_remedy, chemical_remedy, recommended_action, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
        [analysis.id, analysis.advisory_id, analysis.message_id, analysis.category, analysis.diagnosis, analysis.confidence_score, analysis.severity, analysis.priority, analysis.risk_level, analysis.summary, analysis.organic_remedy, analysis.chemical_remedy, analysis.recommended_action, analysis.created_at]
      );
      return res.rows[0];
    }

    const store = readLocalStore();
    store.ai_analyses.push(analysis);
    writeLocalStore(store);
    return analysis;
  },

  // INSIGHTS
  async getInsightsByUserId(userId) {
    if (usePostgres) {
      const res = await pool.query(
        'SELECT * FROM insights WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      return res.rows;
    }
    const store = readLocalStore();
    return store.insights
      .filter(i => i.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async createInsight(data) {
    const id = uuidv4();
    const now = new Date().toISOString();
    const insight = {
      id,
      user_id: data.user_id,
      title: data.title,
      description: data.description,
      insight_type: data.insight_type || 'Agronomic',
      severity: data.severity || 'Medium',
      recommended_action: data.recommended_action || '',
      created_at: now
    };

    if (usePostgres) {
      const res = await pool.query(
        `INSERT INTO insights (id, user_id, title, description, insight_type, severity, recommended_action, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [insight.id, insight.user_id, insight.title, insight.description, insight.insight_type, insight.severity, insight.recommended_action, insight.created_at]
      );
      return res.rows[0];
    }

    const store = readLocalStore();
    store.insights.push(insight);
    writeLocalStore(store);
    return insight;
  },

  // DASHBOARD STATS
  async getDashboardAnalytics(userId) {
    const fields = await this.getFieldsByUserId(userId);
    const advisories = await this.getAdvisoriesByUserId(userId);
    const insights = await this.getInsightsByUserId(userId);

    const totalFields = fields.length;
    const activeDiagnostics = advisories.length;
    
    // Healthy crop percentage
    const healthyFields = fields.filter(f => (f.status || '').toLowerCase() === 'healthy' || (f.health_score || 0) >= 80);
    const healthyCropsPct = totalFields > 0 ? Math.round((healthyFields.length / totalFields) * 100) : 85;

    // High priority threats
    const highThreats = advisories.filter(a => 
      (a.priority || '').toLowerCase() === 'high' || 
      (a.priority || '').toLowerCase() === 'critical' ||
      (a.severity || '').toLowerCase() === 'high' ||
      (a.severity || '').toLowerCase() === 'critical'
    ).length;

    // Average soil health index
    const avgHealthScore = totalFields > 0 
      ? Math.round(fields.reduce((acc, f) => acc + (Number(f.health_score) || 80), 0) / totalFields)
      : 84;

    // Disease distribution
    const diseaseMap = {};
    advisories.forEach(a => {
      const diag = a.diagnosis || 'Healthy / Monitoring';
      diseaseMap[diag] = (diseaseMap[diag] || 0) + 1;
    });
    const diseaseDistribution = Object.entries(diseaseMap).map(([name, count]) => ({ name, count }));

    // Category breakdown
    const categoryMap = {};
    advisories.forEach(a => {
      const cat = a.category || 'General';
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });
    const categoryDistribution = Object.entries(categoryMap).map(([name, count]) => ({ name, count }));

    // Priority breakdown
    const priorityMap = { 'Low': 0, 'Medium': 0, 'High': 0, 'Critical': 0 };
    advisories.forEach(a => {
      const p = a.priority || 'Medium';
      if (priorityMap[p] !== undefined) priorityMap[p]++;
      else priorityMap['Medium']++;
    });
    const priorityDistribution = Object.entries(priorityMap).map(([name, count]) => ({ name, count }));

    // Risk level breakdown
    const riskMap = { 'Low': 0, 'Medium': 0, 'High': 0 };
    fields.forEach(f => {
      const r = f.risk_level || 'Low';
      if (riskMap[r] !== undefined) riskMap[r]++;
      else riskMap['Low']++;
    });
    const riskDistribution = Object.entries(riskMap).map(([name, count]) => ({ name, count }));

    // Soil NPK distribution (estimated based on fields soil type and status)
    const npkDistribution = [
      { name: 'Optimal NPK', count: Math.max(1, fields.filter(f => f.status === 'Healthy').length) },
      { name: 'Low Nitrogen (N)', count: Math.max(1, fields.filter(f => f.status === 'Warning' || f.name.includes('Tomato')).length) },
      { name: 'Low Phosphorus (P)', count: Math.max(1, fields.filter(f => f.name.includes('Corn')).length) },
      { name: 'Potassium (K) Deficit', count: Math.max(0, fields.filter(f => f.name.includes('Wheat')).length) }
    ];

    return {
      kpi: {
        totalFields,
        activeDiagnostics,
        healthyCropsPct,
        highPriorityThreats: highThreats,
        soilHealthIndex: avgHealthScore,
        pendingActions: Math.max(1, advisories.filter(a => a.status === 'Open').length)
      },
      diseaseDistribution: diseaseDistribution.length > 0 ? diseaseDistribution : [
        { name: 'Early Blight', count: 3 },
        { name: 'Powdery Mildew', count: 2 },
        { name: 'Corn Aphids', count: 1 },
        { name: 'Nitrogen Stress', count: 2 },
        { name: 'Healthy', count: 4 }
      ],
      categoryDistribution: categoryDistribution.length > 0 ? categoryDistribution : [
        { name: 'Pathology', count: 4 },
        { name: 'Nutrient Deficiency', count: 2 },
        { name: 'Pest Infestation', count: 2 },
        { name: 'Water Stress', count: 1 }
      ],
      priorityDistribution,
      riskDistribution,
      npkDistribution,
      recentAdvisories: advisories.slice(0, 5),
      insights: insights.slice(0, 4)
    };
  }
};
