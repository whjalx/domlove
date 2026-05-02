import express from 'express';
import cors from 'cors';
import { dbRun, dbGet, dbAll } from './database.js';
import crypto from 'crypto';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import multer from 'multer';
import { createServer } from 'http';
import { Server } from 'socket.io';
import webpush from 'web-push';
import Sentiment from 'sentiment';

const __dirname = dirname(fileURLToPath(import.meta.url));
const uploadsDir = join(__dirname, '..', 'uploads');
if (!existsSync(uploadsDir)) mkdirSync(uploadsDir, { recursive: true });

// Setup VAPID Keys
const vapidPath = join(__dirname, '.vapid.json');
let vapidKeys;
if (existsSync(vapidPath)) {
  vapidKeys = JSON.parse(readFileSync(vapidPath, 'utf-8'));
} else {
  vapidKeys = webpush.generateVAPIDKeys();
  writeFileSync(vapidPath, JSON.stringify(vapidKeys));
}
webpush.setVapidDetails('mailto:admin@domlover.local', vapidKeys.publicKey, vapidKeys.privateKey);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(null, crypto.randomUUID().slice(0, 12) + '.' + ext);
  }
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use('/uploads', express.static(uploadsDir));

const uid = () => crypto.randomUUID().slice(0, 8);
const now = () => new Date().toISOString();
const cdmxDate = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Mexico_City' });

// Sentiment Analysis setup
const sentimentAnalyzer = new Sentiment();
// Basic Spanish vocab mapping (sentiment defaults to EN, we add some ES words)
const esVocab = {
  'feliz': 3, 'bien': 2, 'excelente': 4, 'maravilloso': 4, 'amor': 3, 'gracias': 2,
  'triste': -3, 'mal': -2, 'horrible': -4, 'enojada': -3, 'dolor': -3, 'castigo': -1,
  'ansiosa': -2, 'miedo': -2, 'cansada': -1
};
sentimentAnalyzer.registerLanguage('es', { labels: esVocab });

// Achievement Definitions
const ACHIEVEMENTS = [
  { id: 'first_task', title: 'Primera Tarea', icon: '🌱' },
  { id: 'streak_7', title: 'Semana Perfecta', icon: '🔥' },
  { id: 'collector_100', title: 'Coleccionista', icon: '💰' },
  { id: 'devoted', title: 'Devota', icon: '💎' }
];

// Active Socket connections
const connectedUsers = new Map();

io.on('connection', (socket) => {
  socket.on('register', (userId) => {
    if (userId) connectedUsers.set(userId, socket.id);
  });
  socket.on('disconnect', () => {
    for (const [userId, sockId] of connectedUsers.entries()) {
      if (sockId === socket.id) connectedUsers.delete(userId);
    }
  });
});

async function sendPush(userId, payload) {
  try {
    const user = await dbGet('SELECT pushSub FROM users WHERE id = ?', [userId]);
    if (user && user.pushSub) {
      const sub = JSON.parse(user.pushSub);
      await webpush.sendNotification(sub, JSON.stringify(payload)).catch(e => {
        if (e.statusCode === 410) { // Unsubscribed
          dbRun('UPDATE users SET pushSub = NULL WHERE id = ?', [userId]);
        }
      });
    }
  } catch (err) {
    console.error('Push error:', err);
  }
}

async function checkAchievements(userId) {
  try {
    const user = await dbGet('SELECT * FROM users WHERE id = ?', [userId]);
    if (!user) return;
    const earned = await dbAll('SELECT achievementId FROM user_achievements WHERE userId = ?', [userId]);
    const earnedIds = new Set(earned.map(e => e.achievementId));

    const unlock = async (id) => {
      if (!earnedIds.has(id)) {
        await dbRun('INSERT INTO user_achievements (id, userId, achievementId, unlockedAt) VALUES (?,?,?,?)', [uid(), userId, id, now()]);
        const ach = ACHIEVEMENTS.find(a => a.id === id);
        if (ach) {
          sendPush(userId, { title: '¡Logro Desbloqueado!', body: `${ach.icon} ${ach.title}`, url: '#/achievements' });
        }
      }
    };

    // Checks
    if (user.totalEarned > 0) await unlock('first_task');
    if (user.streak >= 7) await unlock('streak_7');
    if (user.totalEarned >= 100) await unlock('collector_100');
    if (user.totalEarned >= 600) await unlock('devoted');

  } catch (err) { console.error(err); }
}

const methods = {
  // Push & VAPID
  async getVapidPublicKey() {
    return vapidKeys.publicKey;
  },
  async savePushSubscription(userId, subscription) {
    await dbRun('UPDATE users SET pushSub = ? WHERE id = ?', [JSON.stringify(subscription), userId]);
    return true;
  },

  // Auth & Security
  async verifyPin(userId, pin) {
    const user = await dbGet('SELECT pin FROM users WHERE id = ?', [userId]);
    if (!user) return false;
    if (!user.pin) return true; // No pin set = allowed
    return user.pin === pin;
  },
  async setPin(userId, pin) {
    await dbRun('UPDATE users SET pin = ? WHERE id = ?', [pin, userId]);
    return true;
  },
  async changePassword(userId, oldPassword, newPassword) {
    const user = await dbGet('SELECT * FROM users WHERE id = ?', [userId]);
    if (!user || user.password !== oldPassword) throw new Error('Contraseña actual incorrecta');
    await dbRun('UPDATE users SET password = ? WHERE id = ?', [newPassword, userId]);
    return true;
  },

  async register(email, password, displayName, role) {
    const existing = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    if (existing) throw new Error('Email ya registrado');
    const user = { id: uid(), email, password, displayName, role, coins: 0, demerits: 0, roomId: null, createdAt: now() };
    await dbRun('INSERT INTO users (id, email, password, displayName, role, coins, demerits, roomId, createdAt) VALUES (?,?,?,?,?,?,?,?,?)', 
      [user.id, user.email, user.password, user.displayName, user.role, user.coins, user.demerits, user.roomId, user.createdAt]);
    return user;
  },
  async login(email, password) {
    const user = await dbGet('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
    if (!user) throw new Error('Credenciales incorrectas');
    return user;
  },
  async getCurrentUser(id) {
    if (!id) return null;
    return await dbGet('SELECT * FROM users WHERE id = ?', [id]);
  },
  async updateUser(userId, updates) {
    const keys = Object.keys(updates);
    if (keys.length === 0) return await dbGet('SELECT * FROM users WHERE id = ?', [userId]);
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => updates[k]);
    await dbRun(`UPDATE users SET ${setClause} WHERE id = ?`, [...values, userId]);
    return await dbGet('SELECT * FROM users WHERE id = ?', [userId]);
  },
  async getPartner(roomId, myId) {
    if (!roomId) return null;
    return await dbGet('SELECT * FROM users WHERE roomId = ? AND id != ?', [roomId, myId]) || null;
  },

  // Rooms
  async createRoom(domUserId, name) {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const room = { id: uid(), name, inviteCode: code, domUserId, subUserId: null, createdAt: now() };
    await dbRun('INSERT INTO rooms (id, name, inviteCode, domUserId, subUserId, createdAt) VALUES (?,?,?,?,?,?)',
      [room.id, room.name, room.inviteCode, room.domUserId, room.subUserId, room.createdAt]);
    await dbRun('UPDATE users SET roomId = ? WHERE id = ?', [room.id, domUserId]);
    return room;
  },
  async joinRoom(subUserId, code) {
    const room = await dbGet('SELECT * FROM rooms WHERE inviteCode = ?', [code]);
    if (!room) throw new Error('Código inválido');
    if (room.subUserId) throw new Error('La sala ya tiene una Sumisa');
    await dbRun('UPDATE rooms SET subUserId = ? WHERE id = ?', [subUserId, room.id]);
    await dbRun('UPDATE users SET roomId = ? WHERE id = ?', [room.id, subUserId]);
    return await dbGet('SELECT * FROM rooms WHERE id = ?', [room.id]);
  },
  async getCurrentRoom(roomId) {
    if (!roomId) return null;
    return await dbGet('SELECT * FROM rooms WHERE id = ?', [roomId]);
  },

  // Tasks
  async createTask(data) {
    const task = { id: uid(), ...data, status: 'active', lastResetDate: cdmxDate(), createdAt: now() };
    await dbRun('INSERT INTO tasks (id, roomId, title, description, category, coinReward, recurrence, deadline, requiresProof, proofType, conditions, status, lastResetDate, timeLimit, isIntense, createdAt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [task.id, task.roomId, task.title, task.description, task.category, task.coinReward, task.recurrence, task.deadline, task.requiresProof ? 1 : 0, task.proofType, task.conditions, task.status, task.lastResetDate, task.timeLimit || null, task.isIntense ? 1 : 0, task.createdAt]);
    task.requiresProof = !!task.requiresProof;
    
    // Notify sub
    const room = await dbGet('SELECT * FROM rooms WHERE id = ?', [task.roomId]);
    if (room && room.subUserId) {
      sendPush(room.subUserId, { title: 'Nueva Tarea Asignada', body: task.title, url: '#/tasks' });
    }
    
    return task;
  },
  async updateTask(taskId, updates) {
    const keys = Object.keys(updates);
    if (keys.length === 0) return;
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => {
      if (typeof updates[k] === 'boolean') return updates[k] ? 1 : 0;
      return updates[k];
    });
    await dbRun(`UPDATE tasks SET ${setClause} WHERE id = ?`, [...values, taskId]);
    return await dbGet('SELECT * FROM tasks WHERE id = ?', [taskId]);
  },
  async deleteTask(taskId) {
    await dbRun('DELETE FROM tasks WHERE id = ?', [taskId]);
  },
  async getTasks(roomId, filters = {}) {
    const today = cdmxDate();
    const getMonday = (d) => {
      const date = new Date(d);
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1);
      return new Date(date.setDate(diff)).toISOString().slice(0, 10);
    };
    const currentMonday = getMonday(today);

    const dailyTasks = await dbAll(
      "SELECT * FROM tasks WHERE roomId = ? AND recurrence = 'daily' AND status = 'completed' AND (lastResetDate IS NULL OR lastResetDate < ?)",
      [roomId, today]
    );
    const weeklyTasks = await dbAll(
      "SELECT * FROM tasks WHERE roomId = ? AND recurrence = 'weekly' AND status = 'completed' AND (lastResetDate IS NULL OR lastResetDate < ?)",
      [roomId, currentMonday]
    );
    
    for (const t of [...dailyTasks, ...weeklyTasks]) {
      await dbRun("UPDATE tasks SET status = 'active', lastResetDate = ?, viewedAt = NULL WHERE id = ?", [t.recurrence === 'weekly' ? currentMonday : today, t.id]);
    }

    // Auto-fail timed tasks
    const activeTasks = await dbAll("SELECT * FROM tasks WHERE roomId = ? AND status = 'active' AND timeLimit IS NOT NULL AND viewedAt IS NOT NULL", [roomId]);
    for (const t of activeTasks) {
      const viewedDate = new Date(t.viewedAt);
      const limitMs = t.timeLimit * 60000;
      if (Date.now() - viewedDate.getTime() > limitMs) {
        await dbRun("UPDATE tasks SET status = 'failed' WHERE id = ?", [t.id]);
        
        // Find subUserId to assign demerit
        const room = await dbGet('SELECT subUserId FROM rooms WHERE id = ?', [t.roomId]);
        if (room && room.subUserId) {
           const demerit = { id: uid(), roomId: t.roomId, userId: room.subUserId, ruleId: 'system', ruleName: 'Tiempo Expirado', reason: 'La tarea relámpago expiró: ' + t.title, points: 5, punishment: null, issuedAt: now() };
           await dbRun('INSERT INTO demerits (id, roomId, userId, ruleId, ruleName, reason, points, punishment, issuedAt) VALUES (?,?,?,?,?,?,?,?,?)', 
             [demerit.id, demerit.roomId, demerit.userId, demerit.ruleId, demerit.ruleName, demerit.reason, demerit.points, demerit.punishment, demerit.issuedAt]);
           await dbRun('UPDATE users SET demerits = demerits + ? WHERE id = ?', [demerit.points, demerit.userId]);
           sendPush(demerit.userId, { title: '⏳ Tiempo Expirado', body: `Fallaste la tarea: ${t.title} (+5 deméritos)`, url: '#/demerits' });
        }
      }
    }

    let query = 'SELECT * FROM tasks WHERE roomId = ?';
    const params = [roomId];
    if (filters.status) { query += ' AND status = ?'; params.push(filters.status); }
    if (filters.category) { query += ' AND category = ?'; params.push(filters.category); }
    query += ' ORDER BY createdAt DESC';
    const tasks = await dbAll(query, params);
    return tasks.map(t => ({...t, requiresProof: !!t.requiresProof}));
  },

  // Submissions
  async submitTask(taskId, proofData) {
    const sub = { id: uid(), taskId, ...proofData, status: 'pending', submittedAt: now(), reviewedAt: null, domComment: null };
    await dbRun('INSERT INTO submissions (id, taskId, userId, proofUrl, proofType, note, status, domComment, submittedAt, reviewedAt) VALUES (?,?,?,?,?,?,?,?,?,?)',
      [sub.id, sub.taskId, sub.userId, sub.proofUrl, sub.proofType, sub.note, sub.status, sub.domComment, sub.submittedAt, sub.reviewedAt]);
    
    const task = await dbGet('SELECT * FROM tasks WHERE id = ?', [taskId]);
    const room = await dbGet('SELECT * FROM rooms WHERE id = ?', [task.roomId]);
    if (room && room.domUserId) {
      sendPush(room.domUserId, { title: 'Prueba Enviada', body: `Tarea: ${task.title}`, url: '#/tasks/review' });
    }
    
    return sub;
  },
  async reviewSubmission(subId, approved, comment = '') {
    const sub = await dbGet('SELECT * FROM submissions WHERE id = ?', [subId]);
    if (!sub) return;
    if (sub.status !== 'pending') return sub;
    
    sub.status = approved ? 'approved' : 'rejected';
    sub.domComment = comment;
    sub.reviewedAt = now();
    await dbRun('UPDATE submissions SET status = ?, domComment = ?, reviewedAt = ? WHERE id = ?', [sub.status, sub.domComment, sub.reviewedAt, subId]);

    const task = await dbGet('SELECT * FROM tasks WHERE id = ?', [sub.taskId]);

    if (approved && task) {
      // Award coins
      await this.addCoins(sub.userId, task.coinReward, `Tarea: ${task.title}`);
      
      // Update Task status
      if (task.recurrence === 'once') {
        await this.updateTask(task.id, { status: 'completed' });
      } else if (task.recurrence === 'daily') {
        await this.updateTask(task.id, { status: 'completed', lastResetDate: cdmxDate() });
      } else if (task.recurrence === 'weekly') {
        const getMonday = (d) => {
          const date = new Date(d);
          const day = date.getDay();
          const diff = date.getDate() - day + (day === 0 ? -6 : 1);
          return new Date(date.setDate(diff)).toISOString().slice(0, 10);
        };
        await this.updateTask(task.id, { status: 'completed', lastResetDate: getMonday(cdmxDate()) });
      }

      // Check aftercare
      if (task.isIntense) {
        const sockId = connectedUsers.get(sub.userId);
        if (sockId) {
          io.to(sockId).emit('aftercare_trigger', { taskId: task.id, title: task.title });
        }
      }

      // Update Streaks
      const user = await dbGet('SELECT * FROM users WHERE id = ?', [sub.userId]);
      const today = cdmxDate();
      if (user.lastActive !== today) {
        // Calculate days diff
        let newStreak = 1;
        if (user.lastActive) {
          const lastDate = new Date(user.lastActive);
          const currDate = new Date(today);
          const diffDays = Math.floor((currDate - lastDate) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) newStreak = (user.streak || 0) + 1;
        }
        await dbRun('UPDATE users SET streak = ?, lastActive = ? WHERE id = ?', [newStreak, today, sub.userId]);
      }
      
      await checkAchievements(sub.userId);
    }
    
    sendPush(sub.userId, { 
      title: approved ? 'Tarea Aprobada ✅' : 'Tarea Rechazada ❌', 
      body: `Tarea: ${task ? task.title : 'Desconocida'}`,
      url: '#/tasks'
    });

    return sub;
  },
  async getSubmissions(roomId, status = null) {
    let query = `SELECT s.* FROM submissions s JOIN tasks t ON s.taskId = t.id WHERE t.roomId = ?`;
    const params = [roomId];
    if (status) { query += ' AND s.status = ?'; params.push(status); }
    query += ' ORDER BY s.submittedAt DESC';
    return await dbAll(query, params);
  },
  async getSubmissionsForTask(taskId) {
    return await dbAll('SELECT * FROM submissions WHERE taskId = ?', [taskId]);
  },

  // Coins & Stats
  async addCoins(userId, amount, reason) {
    await dbRun('UPDATE users SET coins = coins + ?, totalEarned = totalEarned + ? WHERE id = ?', [amount, amount, userId]);
    const txn = { id: uid(), userId, type: 'earned', amount, reason, createdAt: now() };
    await dbRun('INSERT INTO transactions (id, userId, type, amount, reason, createdAt) VALUES (?,?,?,?,?,?)',
      [txn.id, txn.userId, txn.type, txn.amount, txn.reason, txn.createdAt]);
  },
  async spendCoins(userId, amount, reason) {
    const user = await dbGet('SELECT coins FROM users WHERE id = ?', [userId]);
    if (!user || user.coins < amount) throw new Error('Monedas insuficientes');
    await dbRun('UPDATE users SET coins = coins - ? WHERE id = ?', [amount, userId]);
    const txn = { id: uid(), userId, type: 'spent', amount, reason, createdAt: now() };
    await dbRun('INSERT INTO transactions (id, userId, type, amount, reason, createdAt) VALUES (?,?,?,?,?,?)',
      [txn.id, txn.userId, txn.type, txn.amount, txn.reason, txn.createdAt]);
  },
  async getTransactions(userId) {
    return await dbAll('SELECT * FROM transactions WHERE userId = ? ORDER BY createdAt DESC', [userId]);
  },
  async getAchievements(userId) {
    const earned = await dbAll('SELECT * FROM user_achievements WHERE userId = ?', [userId]);
    return ACHIEVEMENTS.map(ach => {
      const e = earned.find(x => x.achievementId === ach.id);
      return { ...ach, unlocked: !!e, unlockedAt: e ? e.unlockedAt : null };
    });
  },
  async toggleAchievement(userId, achievementId, forceStatus) {
    if (forceStatus) {
      await dbRun('INSERT OR IGNORE INTO user_achievements (userId, achievementId, unlockedAt) VALUES (?,?,?)', [userId, achievementId, now()]);
    } else {
      await dbRun('DELETE FROM user_achievements WHERE userId = ? AND achievementId = ?', [userId, achievementId]);
    }
  },
  async getWeeklyReport(roomId, subUserId) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const dateLimit = sevenDaysAgo.toISOString();

    const txns = await dbAll('SELECT * FROM transactions WHERE userId = ? AND createdAt >= ?', [subUserId, dateLimit]);
    let earned = 0;
    let spent = 0;
    txns.forEach(t => { if (t.type === 'earned') earned += t.amount; else spent += t.amount; });

    const demerits = await dbAll('SELECT * FROM demerits WHERE userId = ? AND issuedAt >= ?', [subUserId, dateLimit]);
    const totalDemerits = demerits.reduce((acc, d) => acc + d.points, 0);

    const subs = await dbAll('SELECT * FROM submissions WHERE userId = ? AND status = "approved" AND reviewedAt >= ?', [subUserId, dateLimit]);
    
    return { earned, spent, demerits: totalDemerits, tasksCompleted: subs.length };
  },

  // Rules
  async createRule(data) {
    const rule = { id: uid(), ...data, isActive: 1, createdAt: now() };
    await dbRun('INSERT INTO rules (id, roomId, title, description, severity, demeritPenalty, isActive, createdAt) VALUES (?,?,?,?,?,?,?,?)',
      [rule.id, rule.roomId, rule.title, rule.description, rule.severity, rule.demeritPenalty, rule.isActive, rule.createdAt]);
    rule.isActive = true;
    return rule;
  },
  async updateRule(ruleId, updates) {
    const keys = Object.keys(updates);
    if (keys.length === 0) return;
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => updates[k] === true ? 1 : updates[k] === false ? 0 : updates[k]);
    await dbRun(`UPDATE rules SET ${setClause} WHERE id = ?`, [...values, ruleId]);
  },
  async deleteRule(ruleId) {
    await dbRun('DELETE FROM rules WHERE id = ?', [ruleId]);
  },
  async getRules(roomId) {
    const rules = await dbAll('SELECT * FROM rules WHERE roomId = ?', [roomId]);
    return rules.map(r => ({...r, isActive: !!r.isActive}));
  },

  // Limits
  async createLimit(data) {
    const limit = { id: uid(), ...data, createdAt: now() };
    await dbRun('INSERT INTO limits (id, roomId, userId, title, description, status, category, createdAt) VALUES (?,?,?,?,?,?,?,?)',
      [limit.id, limit.roomId, limit.userId, limit.title, limit.description, limit.status, limit.category, limit.createdAt]);
    return limit;
  },
  async updateLimit(limitId, updates) {
    const keys = Object.keys(updates);
    if (keys.length === 0) return;
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => updates[k]);
    await dbRun(`UPDATE limits SET ${setClause} WHERE id = ?`, [...values, limitId]);
  },
  async deleteLimit(limitId) {
    await dbRun('DELETE FROM limits WHERE id = ?', [limitId]);
  },
  async getLimits(roomId) {
    return await dbAll('SELECT * FROM limits WHERE roomId = ?', [roomId]);
  },

  // Rewards
  async createReward(data) {
    const reward = { id: uid(), ...data, isAvailable: 1, createdAt: now() };
    await dbRun('INSERT INTO rewards (id, roomId, title, description, cost, type, emoji, rewardCategory, isAvailable, createdAt) VALUES (?,?,?,?,?,?,?,?,?,?)',
      [reward.id, reward.roomId, reward.title, reward.description, reward.cost, reward.type, reward.emoji, reward.rewardCategory || 'premio', reward.isAvailable, reward.createdAt]);
    reward.isAvailable = true;
    return reward;
  },
  async updateReward(rewardId, updates) {
    const keys = Object.keys(updates);
    if (keys.length === 0) return;
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => updates[k] === true ? 1 : updates[k] === false ? 0 : updates[k]);
    await dbRun(`UPDATE rewards SET ${setClause} WHERE id = ?`, [...values, rewardId]);
  },
  async deleteReward(rewardId) {
    await dbRun('DELETE FROM rewards WHERE id = ?', [rewardId]);
  },
  async getRewards(roomId) {
    const rewards = await dbAll('SELECT * FROM rewards WHERE roomId = ? AND isAvailable = 1', [roomId]);
    return rewards.map(r => ({...r, isAvailable: !!r.isAvailable}));
  },
  async purchaseReward(rewardId, userId) {
    const reward = await dbGet('SELECT * FROM rewards WHERE id = ?', [rewardId]);
    if (!reward) throw new Error('Recompensa no encontrada');
    await this.spendCoins(userId, reward.cost, `Compra: ${reward.title}`);
    const purchase = { id: uid(), rewardId, userId, rewardTitle: reward.title, cost: reward.cost, purchasedAt: now() };
    await dbRun('INSERT INTO purchases (id, rewardId, userId, rewardTitle, cost, purchasedAt) VALUES (?,?,?,?,?,?)',
      [purchase.id, purchase.rewardId, purchase.userId, purchase.rewardTitle, purchase.cost, purchase.purchasedAt]);
    
    // Notify DOM
    const room = await dbGet('SELECT * FROM rooms WHERE id = ?', [reward.roomId]);
    if (room && room.domUserId) {
      sendPush(room.domUserId, { title: 'Recompensa Comprada', body: `${reward.title} por ${reward.cost}🪙`, url: '#/shop' });
    }

    return reward;
  },
  async getPurchases(userId) {
    return await dbAll('SELECT * FROM purchases WHERE userId = ? ORDER BY purchasedAt DESC', [userId]);
  },
  async deletePurchase(purchaseId) {
    await dbRun('DELETE FROM purchases WHERE id = ?', [purchaseId]);
  },

  // Demerits
  async addDemerit(data) {
    const demerit = { id: uid(), ...data, issuedAt: now() };
    await dbRun('INSERT INTO demerits (id, roomId, userId, ruleId, ruleName, reason, points, punishment, issuedAt) VALUES (?,?,?,?,?,?,?,?,?)',
      [demerit.id, demerit.roomId, demerit.userId, demerit.ruleId, demerit.ruleName, demerit.reason, demerit.points, demerit.punishment, demerit.issuedAt]);
    if (data.userId) {
      await dbRun('UPDATE users SET demerits = demerits + ? WHERE id = ?', [data.points || 1, data.userId]);
      sendPush(data.userId, { title: '⚠️ Nuevo Demérito', body: `Motivo: ${demerit.reason}`, url: '#/demerits' });
    }
    return demerit;
  },
  async getDemerits(roomId) {
    return await dbAll('SELECT * FROM demerits WHERE roomId = ? ORDER BY issuedAt DESC', [roomId]);
  },

  // Journal
  async createJournalEntry(data) {
    // Basic offline sentiment analysis
    const result = sentimentAnalyzer.analyze(data.content, { language: 'es' });
    let mood = 'neutral';
    if (result.score > 2) mood = 'positive';
    else if (result.score < -2) mood = 'negative';

    const entry = { id: uid(), ...data, mood, isReadByDom: 0, createdAt: now() };
    await dbRun('INSERT INTO journal (id, roomId, userId, content, mood, prompt, audioUrl, isReadByDom, createdAt) VALUES (?,?,?,?,?,?,?,?,?)',
      [entry.id, entry.roomId, entry.userId, entry.content, entry.mood, entry.prompt, entry.audioUrl || null, entry.isReadByDom, entry.createdAt]);
    entry.isReadByDom = false;
    return entry;
  },
  async updateJournalEntry(entryId, updates) {
    const keys = Object.keys(updates);
    if (keys.length === 0) return;
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => updates[k] === true ? 1 : updates[k] === false ? 0 : updates[k]);
    await dbRun(`UPDATE journal SET ${setClause} WHERE id = ?`, [...values, entryId]);
  },
  async getJournalEntries(roomId) {
    const entries = await dbAll('SELECT * FROM journal WHERE roomId = ? ORDER BY createdAt DESC', [roomId]);
    return entries.map(e => ({...e, isReadByDom: !!e.isReadByDom}));
  },

  // Journal Prompts
  async createJournalPrompt(data) {
    const prompt = { id: uid(), ...data, isUsed: 0, createdAt: now() };
    await dbRun('INSERT INTO journal_prompts (id, roomId, text, isUsed, createdAt) VALUES (?,?,?,?,?)',
      [prompt.id, prompt.roomId, prompt.text, prompt.isUsed, prompt.createdAt]);
    prompt.isUsed = false;
    return prompt;
  },
  async getJournalPrompts(roomId) {
    const prompts = await dbAll('SELECT * FROM journal_prompts WHERE roomId = ? ORDER BY createdAt DESC', [roomId]);
    return prompts.map(p => ({...p, isUsed: !!p.isUsed}));
  },

  // Guide Messages (Chat Priv)
  async addGuideMessage(data) {
    const msg = { id: uid(), ...data, createdAt: now() };
    await dbRun('INSERT INTO guide_messages (id, roomId, userId, role, text, audioUrl, createdAt) VALUES (?,?,?,?,?,?,?)',
      [msg.id, msg.roomId, msg.userId, msg.role, msg.text, msg.audioUrl || null, msg.createdAt]);
    
    // Broadcast via Socket.io to users in this room
    io.emit(`chat_message_${msg.roomId}`, msg);

    // Push notify partner
    const room = await dbGet('SELECT * FROM rooms WHERE id = ?', [msg.roomId]);
    if (room) {
      const partnerId = msg.userId === room.domUserId ? room.subUserId : room.domUserId;
      if (partnerId) {
        sendPush(partnerId, { title: 'Nuevo mensaje', body: msg.text, url: '#/guide' });
      }
    }

    return msg;
  },
  async getGuideMessages(roomId) {
    return await dbAll('SELECT * FROM guide_messages WHERE roomId = ? ORDER BY createdAt ASC', [roomId]);
  },

  // Calendar Stats
  async getCalendarData(roomId, year, month) {
    const tasks = await this.getTasks(roomId);
    const subs = await this.getSubmissions(roomId, 'approved');
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const data = {};
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayTasks = tasks.filter(t => {
        if (t.recurrence === 'daily') return true;
        if (t.recurrence === 'weekly') { const created = new Date(t.createdAt); return created.getDay() === new Date(dateStr).getDay(); }
        return t.createdAt.startsWith(dateStr);
      });
      const dayCompleted = subs.filter(s => s.submittedAt.startsWith(dateStr));
      const total = dayTasks.length;
      const completed = dayCompleted.length;
      data[d] = total === 0 ? 'none' : completed >= total ? 'completed' : completed > 0 ? 'partial' : 'missed';
    }
    return data;
  },

  // ── DomLover v4 Additions ──
  async markTaskViewed(taskId) {
    const task = await dbGet('SELECT viewedAt FROM tasks WHERE id = ?', [taskId]);
    if (task && !task.viewedAt) {
      const vAt = now();
      await dbRun('UPDATE tasks SET viewedAt = ? WHERE id = ?', [vAt, taskId]);
      return vAt;
    }
    return task?.viewedAt;
  },

  async getTaskHistory(subUserId) {
    return await dbAll(`
      SELECT s.*, t.title, t.coinReward, t.recurrence 
      FROM submissions s
      LEFT JOIN tasks t ON s.taskId = t.id
      WHERE s.userId = ? AND s.status = 'approved'
      ORDER BY s.reviewedAt DESC
    `, [subUserId]);
  },

  // Wheel of Fortune
  async getWheelOptions(roomId) {
    return await dbAll('SELECT * FROM wheel_options WHERE roomId = ? ORDER BY createdAt ASC', [roomId]);
  },
  async saveWheelOptions(roomId, options) {
    await dbRun('DELETE FROM wheel_options WHERE roomId = ?', [roomId]);
    for (const opt of options) {
      await dbRun('INSERT INTO wheel_options (id, roomId, label, effectType, effectValue, createdAt) VALUES (?,?,?,?,?,?)',
        [uid(), roomId, opt.label, opt.effectType, opt.effectValue || 0, now()]);
    }
    return true;
  },
  async spinWheel(roomId, userId) {
    const user = await dbGet('SELECT * FROM users WHERE id = ?', [userId]);
    const today = cdmxDate();
    if (user.lastWheelSpin && user.lastWheelSpin.startsWith(today)) {
      throw new Error('Ya has girado la ruleta hoy.');
    }

    const options = await dbAll('SELECT * FROM wheel_options WHERE roomId = ?', [roomId]);
    if (!options || options.length === 0) {
      throw new Error('El Amo aún no ha configurado la ruleta.');
    }

    const winner = options[Math.floor(Math.random() * options.length)];

    if (winner.effectType === 'coins') {
      await dbRun('UPDATE users SET coins = coins + ? WHERE id = ?', [winner.effectValue, userId]);
    } else if (winner.effectType === 'demerit') {
      const demerit = { id: uid(), roomId, userId, ruleId: 'wheel', ruleName: 'Ruleta', reason: 'Caíste en la casilla de demérito', points: winner.effectValue, punishment: null, issuedAt: now() };
      await dbRun('INSERT INTO demerits (id, roomId, userId, ruleId, ruleName, reason, points, punishment, issuedAt) VALUES (?,?,?,?,?,?,?,?,?)', 
        [demerit.id, demerit.roomId, demerit.userId, demerit.ruleId, demerit.ruleName, demerit.reason, demerit.points, demerit.punishment, demerit.issuedAt]);
      await dbRun('UPDATE users SET demerits = demerits + ? WHERE id = ?', [winner.effectValue, userId]);
    }
    
    await dbRun('UPDATE users SET lastWheelSpin = ? WHERE id = ?', [now(), userId]);

    return winner;
  }
};

// ── RPC endpoint ──
app.post('/api/rpc', async (req, res) => {
  try {
    const { method, args } = req.body;
    if (!methods[method]) {
      return res.status(404).json({ error: 'Method not found' });
    }
    const result = await methods[method].apply(methods, args);
    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ── File upload endpoint ──
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const url = '/uploads/' + req.file.filename;
  res.json({ url, filename: req.file.filename, size: req.file.size });
});

// ── Production: Serve built frontend ──
const distPath = join(__dirname, '..', 'dist');

if (existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads') || req.path.startsWith('/socket.io')) return next();
    res.sendFile(join(distPath, 'index.html'));
  });
  console.log('Serving production build from dist/');
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log('DomLover server running on port ' + PORT);
});
