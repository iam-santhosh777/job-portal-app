-- Job Portal Database Schema
-- This file contains the complete database schema for the HRMS + Job Portal application
-- 
-- Usage:
--   1. Create database: CREATE DATABASE IF NOT EXISTS testdb;
--   2. Use database: USE testdb;
--   3. Run this script: source database/schema.sql;
-- 
-- Or use the initialization script: node scripts/init-database.js

-- Create users table (with authentication and role-based access)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CHECK (role IN ('HR', 'USER'))
);

-- Create jobs table (HR posts job listings)
CREATE TABLE IF NOT EXISTS jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  salary VARCHAR(50),
  location VARCHAR(100),
  expiry_status VARCHAR(10) DEFAULT 'active',
  posted_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE CASCADE,
  CHECK (expiry_status IN ('active', 'expired'))
);

-- Create applications table (users apply for jobs)
CREATE TABLE IF NOT EXISTS applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id INT NOT NULL,
  user_id INT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_application (job_id, user_id),
  CHECK (status IN ('pending', 'accepted', 'rejected'))
);

-- Create resumes table (HR uploads resumes)
CREATE TABLE IF NOT EXISTS resumes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id INT,
  hr_id INT NOT NULL,
  filename VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  status VARCHAR(20) DEFAULT 'uploaded',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL,
  FOREIGN KEY (hr_id) REFERENCES users(id) ON DELETE CASCADE,
  CHECK (status IN ('uploaded', 'failed'))
);

-- Create collections table (HR creates job collections for organization)
CREATE TABLE IF NOT EXISTS collections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255) NOT NULL,
  user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_jobs_posted_by ON jobs(posted_by);
CREATE INDEX IF NOT EXISTS idx_jobs_expiry_status ON jobs(expiry_status);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_hr_id ON resumes(hr_id);
