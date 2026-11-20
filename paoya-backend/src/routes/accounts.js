const express = require('express');
const bcrypt = require('bcrypt');
const Account = require('../accountModel');
const { signToken, requireAuth } = require('../auth');
const { validateRegistration, validateProfileUpdate, validatePassword } = require('../validation');

const SALT_ROUNDS = 12;
const router = express.Router();

function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}

function duplicateFieldError(err) {
  if (err.code !== 'ER_DUP_ENTRY') return null;
  if (err.message.includes('username')) return { username: 'ชื่อผู้ใช้นี้ถูกใช้แล้ว' };
  if (err.message.includes('email')) return { email: 'อีเมลนี้ถูกใช้แล้ว' };
  return { _: 'ข้อมูลซ้ำกับบัญชีที่มีอยู่แล้ว' };
}

router.post('/auth/register', async (req, res) => {
  const { data, errors } = validateRegistration(req.body);
  if (hasErrors(errors)) return res.status(400).json({ error: 'ข้อมูลไม่ถูกต้อง', fields: errors });

  try {
    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
    const account = await Account.createAccount({ ...data, passwordHash });
    return res.status(201).json({ token: signToken(account.id), account });
  } catch (err) {
    const fields = duplicateFieldError(err);
    if (fields) return res.status(409).json({ error: 'ข้อมูลซ้ำ', fields });
    throw err;
  }
});

router.post('/auth/login', async (req, res) => {
  const login = typeof req.body?.login === 'string' ? req.body.login.trim() : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (!login || !password) {
    return res.status(400).json({ error: 'กรุณากรอกอีเมลหรือชื่อผู้ใช้ และรหัสผ่าน' });
  }

  const credentials = await Account.findCredentialsByLogin(login);
  const valid = credentials && (await bcrypt.compare(password, credentials.password_hash));
  if (!valid) return res.status(401).json({ error: 'ชื่อผู้ใช้/อีเมล หรือรหัสผ่านไม่ถูกต้อง' });

  const account = await Account.findById(credentials.id);
  return res.json({ token: signToken(account.id), account });
});

router.get('/accounts/me', requireAuth, async (req, res) => {
  const account = await Account.findById(req.accountId);
  if (!account) return res.status(404).json({ error: 'ไม่พบบัญชี' });
  return res.json({ account });
});

router.put('/accounts/me', requireAuth, async (req, res) => {
  const { data, errors } = validateProfileUpdate(req.body);
  if (hasErrors(errors)) return res.status(400).json({ error: 'ข้อมูลไม่ถูกต้อง', fields: errors });

  try {
    const account = await Account.updateProfile(req.accountId, data);
    if (!account) return res.status(404).json({ error: 'ไม่พบบัญชี' });
    return res.json({ account });
  } catch (err) {
    const fields = duplicateFieldError(err);
    if (fields) return res.status(409).json({ error: 'ข้อมูลซ้ำ', fields });
    throw err;
  }
});

router.put('/accounts/me/password', requireAuth, async (req, res) => {
  const currentPassword = req.body?.current_password;
  const newPassword = req.body?.new_password;
  const passwordError = validatePassword(newPassword);
  if (typeof currentPassword !== 'string' || passwordError) {
    return res.status(400).json({
      error: 'ข้อมูลไม่ถูกต้อง',
      fields: { ...(passwordError && { new_password: passwordError }) },
    });
  }

  const hash = await Account.findPasswordHashById(req.accountId);
  if (!hash) return res.status(404).json({ error: 'ไม่พบบัญชี' });
  if (!(await bcrypt.compare(currentPassword, hash))) {
    return res.status(401).json({ error: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' });
  }

  await Account.updatePasswordHash(req.accountId, await bcrypt.hash(newPassword, SALT_ROUNDS));
  return res.json({ message: 'เปลี่ยนรหัสผ่านเรียบร้อยแล้ว' });
});

router.delete('/accounts/me', requireAuth, async (req, res) => {
  const deleted = await Account.deleteAccount(req.accountId);
  if (!deleted) return res.status(404).json({ error: 'ไม่พบบัญชี' });
  return res.status(204).end();
});

module.exports = router;
