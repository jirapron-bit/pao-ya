const jwt = require('jsonwebtoken');

const TOKEN_TTL = process.env.JWT_EXPIRES_IN || '7d';

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return secret;
}

function signToken(accountId) {
  return jwt.sign({}, getSecret(), { subject: String(accountId), expiresIn: TOKEN_TTL });
}

function requireAuth(req, res, next) {
  const header = req.get('authorization') || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบ' });
  }
  try {
    const payload = jwt.verify(token, getSecret());
    req.accountId = Number(payload.sub);
    return next();
  } catch {
    return res.status(401).json({ error: 'โทเค็นไม่ถูกต้องหรือหมดอายุ' });
  }
}

module.exports = { signToken, requireAuth };
