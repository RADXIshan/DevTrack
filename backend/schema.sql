-- DevTracker Database Schema
-- 5 dedicated tables, one per tracking mode

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  bio TEXT,
  github_url VARCHAR(500),
  linkedin_url VARCHAR(500),
  twitter_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);

-- DSA: Coding problems and algorithmic challenges
CREATE TABLE IF NOT EXISTS dsa_entries (
  id UUID PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  difficulty VARCHAR(50) DEFAULT 'Easy',
  data_structure VARCHAR(255),
  algorithm VARCHAR(255),
  time_complexity VARCHAR(100),
  space_complexity VARCHAR(100),
  leetcode_url VARCHAR(500),
  approach_thought TEXT,
  completed_at TIMESTAMP DEFAULT NOW(),
  user_id UUID NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- DEV: Development projects (frontend, backend, fullstack)
CREATE TABLE IF NOT EXISTS dev_entries (
  id UUID PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  project_type VARCHAR(100) DEFAULT 'Fullstack',
  frontend_tech VARCHAR(500),
  backend_tech VARCHAR(500),
  database_tech VARCHAR(500),
  other_tech VARCHAR(500),
  github_url VARCHAR(500),
  live_url VARCHAR(500),
  description TEXT,
  completed_at TIMESTAMP DEFAULT NOW(),
  user_id UUID NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- AI/ML: Research, algorithms, libraries, papers
CREATE TABLE IF NOT EXISTS aiml_entries (
  id UUID PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  algorithm VARCHAR(255),
  library VARCHAR(255),
  paper_url VARCHAR(500),
  dataset VARCHAR(255),
  model_used VARCHAR(255),
  framework VARCHAR(255),
  key_findings TEXT,
  completed_at TIMESTAMP DEFAULT NOW(),
  user_id UUID NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Databases: SQL, NoSQL, NewSQL concepts and practice
CREATE TABLE IF NOT EXISTS db_entries (
  id UUID PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  db_type VARCHAR(100) DEFAULT 'SQL',
  db_technology VARCHAR(255),
  concepts_covered VARCHAR(500),
  use_case TEXT,
  notes TEXT,
  completed_at TIMESTAMP DEFAULT NOW(),
  user_id UUID NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- System Design: LLD, HLD, architecture patterns
CREATE TABLE IF NOT EXISTS systemdesign_entries (
  id UUID PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  design_type VARCHAR(100) DEFAULT 'HLD',
  components VARCHAR(1000),
  patterns VARCHAR(500),
  scalability_notes TEXT,
  resources_url VARCHAR(500),
  notes TEXT,
  completed_at TIMESTAMP DEFAULT NOW(),
  user_id UUID NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Predefined sheet progress (still used for DSA sheets)
CREATE TABLE IF NOT EXISTS predefined_sheet_progress (
  id UUID PRIMARY KEY,
  sheet_name VARCHAR(255) NOT NULL,
  problem_id VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'INCOMPLETE',
  user_id UUID NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, sheet_name, problem_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_dsa_entries_user_id ON dsa_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_dsa_entries_difficulty ON dsa_entries(difficulty);
CREATE INDEX IF NOT EXISTS idx_dev_entries_user_id ON dev_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_dev_entries_project_type ON dev_entries(project_type);
CREATE INDEX IF NOT EXISTS idx_aiml_entries_user_id ON aiml_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_aiml_entries_framework ON aiml_entries(framework);
CREATE INDEX IF NOT EXISTS idx_db_entries_user_id ON db_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_db_entries_db_type ON db_entries(db_type);
CREATE INDEX IF NOT EXISTS idx_systemdesign_entries_user_id ON systemdesign_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_systemdesign_entries_design_type ON systemdesign_entries(design_type);
CREATE INDEX IF NOT EXISTS idx_predefined_sheet_progress_user_id ON predefined_sheet_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_predefined_sheet_progress_sheet_name ON predefined_sheet_progress(sheet_name);
