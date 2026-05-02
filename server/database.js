import sqlite3 from 'sqlite3';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'data.db');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    password TEXT,
    displayName TEXT,
    role TEXT,
    coins INTEGER DEFAULT 0,
    demerits INTEGER DEFAULT 0,
    roomId TEXT,
    streak INTEGER DEFAULT 0,
    lastActive TEXT,
    totalEarned INTEGER DEFAULT 0,
    pin TEXT,
    pushSub TEXT,
    lastWheelSpin TEXT,
    createdAt TEXT
  )`);

  // Auto-migrate columns if they don't exist
  db.run(`ALTER TABLE users ADD COLUMN pin TEXT`, (err) => {});
  db.run(`ALTER TABLE users ADD COLUMN pushSub TEXT`, (err) => {});
  db.run(`ALTER TABLE users ADD COLUMN streak INTEGER DEFAULT 0`, (err) => {});
  db.run(`ALTER TABLE users ADD COLUMN lastActive TEXT`, (err) => {});
  db.run(`ALTER TABLE users ADD COLUMN totalEarned INTEGER DEFAULT 0`, (err) => {});
  db.run(`ALTER TABLE users ADD COLUMN lastWheelSpin TEXT`, (err) => {});

  db.run(`CREATE TABLE IF NOT EXISTS wheel_options (
    id TEXT PRIMARY KEY,
    roomId TEXT,
    label TEXT,
    effectType TEXT,
    effectValue INTEGER,
    createdAt TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS rooms (
    id TEXT PRIMARY KEY,
    name TEXT,
    inviteCode TEXT UNIQUE,
    domUserId TEXT,
    subUserId TEXT,
    createdAt TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS user_achievements (
    id TEXT PRIMARY KEY,
    userId TEXT,
    achievementId TEXT,
    unlockedAt TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    roomId TEXT,
    title TEXT,
    description TEXT,
    category TEXT,
    coinReward INTEGER,
    recurrence TEXT,
    deadline TEXT,
    requiresProof INTEGER,
    proofType TEXT,
    conditions TEXT,
    status TEXT,
    lastResetDate TEXT,
    timeLimit INTEGER,
    viewedAt TEXT,
    isIntense INTEGER DEFAULT 0,
    createdAt TEXT
  )`);
  db.run(`ALTER TABLE tasks ADD COLUMN timeLimit INTEGER`, (err) => {});
  db.run(`ALTER TABLE tasks ADD COLUMN viewedAt TEXT`, (err) => {});
  db.run(`ALTER TABLE tasks ADD COLUMN isIntense INTEGER DEFAULT 0`, (err) => {});

  db.run(`CREATE TABLE IF NOT EXISTS submissions (
    id TEXT PRIMARY KEY,
    taskId TEXT,
    userId TEXT,
    proofUrl TEXT,
    proofType TEXT,
    note TEXT,
    status TEXT,
    domComment TEXT,
    submittedAt TEXT,
    reviewedAt TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    userId TEXT,
    type TEXT,
    amount INTEGER,
    reason TEXT,
    createdAt TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS rules (
    id TEXT PRIMARY KEY,
    roomId TEXT,
    title TEXT,
    description TEXT,
    severity TEXT,
    demeritPenalty INTEGER,
    isActive INTEGER DEFAULT 1,
    createdAt TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS limits (
    id TEXT PRIMARY KEY,
    roomId TEXT,
    userId TEXT,
    title TEXT,
    description TEXT,
    status TEXT,
    category TEXT,
    createdAt TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS rewards (
    id TEXT PRIMARY KEY,
    roomId TEXT,
    title TEXT,
    description TEXT,
    cost INTEGER,
    type TEXT,
    emoji TEXT,
    rewardCategory TEXT DEFAULT 'premio',
    isAvailable INTEGER DEFAULT 1,
    createdAt TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS purchases (
    id TEXT PRIMARY KEY,
    rewardId TEXT,
    userId TEXT,
    rewardTitle TEXT,
    cost INTEGER,
    purchasedAt TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS demerits (
    id TEXT PRIMARY KEY,
    roomId TEXT,
    userId TEXT,
    ruleId TEXT,
    ruleName TEXT,
    reason TEXT,
    points INTEGER,
    punishment TEXT,
    issuedAt TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS journal (
    id TEXT PRIMARY KEY,
    roomId TEXT,
    userId TEXT,
    content TEXT,
    mood TEXT,
    prompt TEXT,
    audioUrl TEXT,
    isReadByDom INTEGER DEFAULT 0,
    createdAt TEXT
  )`);
  db.run(`ALTER TABLE journal ADD COLUMN audioUrl TEXT`, (err) => {});

  db.run(`CREATE TABLE IF NOT EXISTS journal_prompts (
    id TEXT PRIMARY KEY,
    roomId TEXT,
    text TEXT,
    isUsed INTEGER DEFAULT 0,
    createdAt TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS guide_messages (
    id TEXT PRIMARY KEY,
    roomId TEXT,
    userId TEXT,
    role TEXT,
    text TEXT,
    audioUrl TEXT,
    createdAt TEXT
  )`);
  db.run(`ALTER TABLE guide_messages ADD COLUMN audioUrl TEXT`, (err) => {});
});

export const dbRun = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

export const dbGet = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const dbAll = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export default db;
