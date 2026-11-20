const express = require('express');
const cors = require('cors');
const accountRoutes = require('./routes/accounts');

function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use((req, res, next) => {
    res.set({
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    });
    next();
  });

  const allowedOrigins = process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim());
  app.use(cors(allowedOrigins ? { origin: allowedOrigins } : undefined));
  app.use(express.json({ limit: '100kb' }));

  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
  app.use('/api', accountRoutes);

  app.use((req, res) => res.status(404).json({ error: 'ไม่พบ endpoint นี้' }));

  app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'รูปแบบ JSON ไม่ถูกต้อง' });
    }
    console.error(err);
    return res.status(500).json({ error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' });
  });

  return app;
}

module.exports = { createApp };
