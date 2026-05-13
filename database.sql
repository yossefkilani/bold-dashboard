-- Bold Dashboard — MySQL Schema
-- Run this once on your Hostinger database

CREATE TABLE IF NOT EXISTS submissions (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  full_name    VARCHAR(255),
  email        VARCHAR(255),
  phone        VARCHAR(100),
  business_sector VARCHAR(255),
  project_name VARCHAR(255),
  form_data    LONGTEXT,
  status       VARCHAR(50) DEFAULT 'new',
  created_at   DATETIME DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  full_name        VARCHAR(255),
  email            VARCHAR(255),
  phone            VARCHAR(100),
  business_sector  VARCHAR(255),
  project_name     VARCHAR(255),
  total_price      DECIMAL(12,3),
  paid_amount      DECIMAL(12,3) DEFAULT 0,
  status           VARCHAR(50)  DEFAULT 'active',
  start_date       DATE,
  project_references LONGTEXT,
  notes            TEXT,
  created_at       DATETIME DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_phases (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  project_id   INT NOT NULL,
  title        VARCHAR(255),
  duration_days INT DEFAULT 1,
  position     INT DEFAULT 1,
  start_date   DATE,
  created_at   DATETIME DEFAULT NOW(),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS project_payments (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  project_id   INT NOT NULL,
  title        VARCHAR(255),
  amount       DECIMAL(12,3),
  payment_date DATE,
  created_at   DATETIME DEFAULT NOW(),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quotations (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  client     VARCHAR(255),
  project    VARCHAR(255),
  date       DATE,
  total      VARCHAR(100),
  currency   VARCHAR(10) DEFAULT 'KWD',
  terms      TEXT,
  bank       TINYINT(1)  DEFAULT 0,
  phases     LONGTEXT,
  status     VARCHAR(50) DEFAULT 'new',
  created_at DATETIME DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  type       VARCHAR(100),
  message    TEXT,
  project_id INT,
  is_read    TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_settings (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  key_name   VARCHAR(255) UNIQUE,
  value      LONGTEXT,
  updated_at DATETIME DEFAULT NOW() ON UPDATE NOW()
);

CREATE TABLE IF NOT EXISTS cases (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  title             VARCHAR(255),
  slug              VARCHAR(255),
  industry          VARCHAR(100),
  short_description TEXT,
  full_description  TEXT,
  cover_image       VARCHAR(500),
  hero_image        VARCHAR(500),
  gallery           LONGTEXT,
  position          INT DEFAULT 0,
  created_at        DATETIME DEFAULT NOW()
);
