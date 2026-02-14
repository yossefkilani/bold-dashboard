import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

let db: any = null;

export async function openDB() {
  if (db) return db;

  db = await open({
    filename: path.join(process.cwd(), "dev.db")
    driver: sqlite3.Database
  });

  // إنشاء الجداول داخل الدالة فقط
  await db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT,
      email TEXT,
      phone TEXT,
      business_sector TEXT,
      project_name TEXT,
      project_description TEXT,

      start_date TEXT,
      total_price REAL DEFAULT 0,
      paid_amount REAL DEFAULT 0,

      project_references TEXT,
      status TEXT DEFAULT 'new',
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS project_phases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      duration_days INTEGER NOT NULL,
      position INTEGER NOT NULL,
      created_at TEXT,

      FOREIGN KEY(project_id) REFERENCES projects(id)
    );

    CREATE TABLE IF NOT EXISTS project_payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      amount REAL NOT NULL,
      payment_date TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at TEXT,

      FOREIGN KEY(project_id) REFERENCES projects(id)
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT,
      message TEXT,
      project_id INTEGER,
      is_read INTEGER DEFAULT 0,
      created_at TEXT
    );
    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT,
      email TEXT,
      phone TEXT,
      business_sector TEXT,
      project_name TEXT,
      form_data TEXT,
      status TEXT,
      created_at TEXT
    );
    CREATE TABLE IF NOT EXISTS site_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hero_slider TEXT,
      hero_cta_title TEXT,
      hero_cta_link TEXT,
      contact_email TEXT
    );
    CREATE TABLE IF NOT EXISTS cases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_name TEXT,
      project_title TEXT,
      description TEXT,
      industry TEXT,
      cover_thumb TEXT,
      hero_image TEXT,
      work_images TEXT,
      created_at TEXT
    );

    `);

  return db;
}