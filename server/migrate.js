// ══════════════════════════════════════════
// MIGRATION SCRIPT — v1 → v2
// Run: node server/migrate.js
// ══════════════════════════════════════════
import sqlite3Pkg from 'sqlite3';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, copyFileSync } from 'fs';

const sqlite3 = sqlite3Pkg;
const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'data.db');
const backupPath = join(__dirname, `data.db.bak_${Date.now()}`);

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
    // 2. Add rewardCategory column to rewards table (premio | mejora)
    await run(`ALTER TABLE rewards ADD COLUMN rewardCategory TEXT DEFAULT 'premio'`).catch(() => {
      console.log('  ℹ rewards.rewardCategory column already exists');
    });

    // 3. Add lastResetDate column to tasks table (for daily reset tracking)
    await run(`ALTER TABLE tasks ADD COLUMN lastResetDate TEXT`).catch(() => {
      console.log('  ℹ tasks.lastResetDate column already exists');
    });

    // 4. Set default rewardCategory for existing rewards
    await run(`UPDATE rewards SET rewardCategory = 'premio' WHERE rewardCategory IS NULL`);

    console.log('✅ Migration complete!');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  } finally {
    db.close();
  }
}

migrate();
