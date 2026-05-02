// ══════════════════════════════════════════
// MIGRATION SCRIPT — v2 → v3
// Run: node server/migrate_v3.js
// ══════════════════════════════════════════
import sqlite3Pkg from 'sqlite3';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, copyFileSync } from 'fs';

const sqlite3 = sqlite3Pkg;
const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'data.db');
const backupPath = join(__dirname, `data.db.bak_v3_${Date.now()}`);

if (!existsSync(dbPath)) {
  console.log('No database found. Nothing to migrate.');
  process.exit(0);
}

// 1. Backup
copyFileSync(dbPath, backupPath);
console.log('✅ Backup created:', backupPath);

const db = new sqlite3.Database(dbPath);
const run = (q) => new Promise((res, rej) => db.run(q, (err) => err ? rej(err) : res()));

async function migrate() {
  try {
    // 2. Add new columns to users
    await run(`ALTER TABLE users ADD COLUMN streak INTEGER DEFAULT 0`).catch(() => console.log('  ℹ users.streak column already exists'));
    await run(`ALTER TABLE users ADD COLUMN lastActive TEXT`).catch(() => console.log('  ℹ users.lastActive column already exists'));
    await run(`ALTER TABLE users ADD COLUMN totalEarned INTEGER DEFAULT 0`).catch(() => console.log('  ℹ users.totalEarned column already exists'));
    await run(`ALTER TABLE users ADD COLUMN pin TEXT`).catch(() => console.log('  ℹ users.pin column already exists'));
    await run(`ALTER TABLE users ADD COLUMN pushSub TEXT`).catch(() => console.log('  ℹ users.pushSub column already exists'));

    // 3. Create user_achievements table
    await run(`CREATE TABLE IF NOT EXISTS user_achievements (
      id TEXT PRIMARY KEY,
      userId TEXT,
      achievementId TEXT,
      unlockedAt TEXT
    )`);

    // 4. Update totalEarned for existing users based on transactions
    await run(`
      UPDATE users 
      SET totalEarned = (
        SELECT COALESCE(SUM(amount), 0) 
        FROM transactions 
        WHERE transactions.userId = users.id AND type = 'earned'
      )
    `);

    console.log('✅ Migration to v3 complete!');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  } finally {
    db.close();
  }
}

migrate();
