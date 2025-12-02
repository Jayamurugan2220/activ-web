import express from 'express';
import cors from 'cors';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';

const app = express();
app.use(cors());
app.use(express.json());

const adapter = new JSONFile('db.json');
// lowdb v6's Low constructor requires default data to be passed
// as the second argument — supply an initial shape so the app
// doesn't crash on startup when db.json is missing or empty.
const db = new Low(adapter, { users: [] });

async function initDb() {
  await db.read();
  // If db.data is undefined (no db.json yet), initialize it and write once.
  // Avoid writing unconditionally because nodemon is watching db.json —
  // unconditional writes on every start cause nodemon to restart repeatedly.
  if (!db.data) {
    db.data = { users: [] };
    await db.write();
  }
}

initDb();

app.get('/', (req, res) => res.json({ ok: true, message: 'ACTIV backend running' }));

app.post('/api/register', async (req, res) => {
  const { memberId, password, email, firstName } = req.body;
  if (!memberId || !password) return res.status(400).json({ error: 'memberId and password required' });

  await db.read();
  const exists = db.data.users.find(u => u.memberId === memberId || (email && u.email === email));
  if (exists) return res.status(409).json({ error: 'Member exists' });

  const hashed = await bcrypt.hash(password, 10);
  const user = { id: nanoid(), memberId, password: hashed, email, firstName, createdAt: new Date().toISOString() };
  db.data.users.push(user);
  await db.write();

  // return safe user info
  const { password: _p, ...safe } = user;
  res.json({ ok: true, user: safe });
});

app.post('/api/login', async (req, res) => {
  const { identifier, password } = req.body; // identifier can be email or memberId
  if (!identifier || !password) return res.status(400).json({ error: 'identifier and password required' });

  await db.read();
  const user = db.data.users.find(u => u.memberId === identifier || u.email === identifier);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const { password: _p, ...safe } = user;
  res.json({ ok: true, user: safe });
});

app.listen(4000, () => console.log('ACTIV backend listening on http://localhost:4000'));
