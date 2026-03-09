-- Database schema for the application
-- Run this SQL to create the necessary tables

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

CREATE TABLE IF NOT EXISTS problem_entries (
  id UUID PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  leetcode_url VARCHAR(500),
  difficulty VARCHAR(50),
  data_structure VARCHAR(255),
  algorithm VARCHAR(255),
  pattern VARCHAR(255),
  approach_thought TEXT,
  mode VARCHAR(50) DEFAULT 'DSA',
  github_url VARCHAR(500),
  live_url VARCHAR(500),
  tech_stack VARCHAR(255),
  paper_url VARCHAR(500),
  model_used VARCHAR(255),
  framework VARCHAR(255),
  completed_at TIMESTAMP DEFAULT NOW(),
  user_id UUID NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS predefined_sheet_progress (
  id UUID PRIMARY KEY,
  sheet_name VARCHAR(255) NOT NULL,
  problem_id VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'INCOMPLETE',
  user_id UUID NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, sheet_name, problem_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_problem_entries_user_id ON problem_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_problem_entries_mode ON problem_entries(mode);
CREATE INDEX IF NOT EXISTS idx_predefined_sheet_progress_user_id ON predefined_sheet_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_predefined_sheet_progress_sheet_name ON predefined_sheet_progress(sheet_name);
