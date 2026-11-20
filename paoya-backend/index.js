require('dotenv').config({ quiet: true });

const { createApp } = require('./src/app');
const { initDatabase } = require('./src/db');

const PORT = Number(process.env.PORT) || 3000;

async function main() {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not set in .env');
  }

  await initDatabase();
  console.log(`Database ready: table paoya_account in ${process.env.DB_NAME || 'paoya_db'}`);

  createApp().listen(PORT, () => {
    console.log(`PaoYa backend listening on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
