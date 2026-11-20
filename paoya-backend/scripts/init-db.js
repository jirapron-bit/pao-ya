require('dotenv').config({ quiet: true });

const { initDatabase, closePool } = require('../src/db');

initDatabase()
  .then(() => console.log('Created/verified table paoya_account'))
  .catch((err) => {
    console.error('Database init failed:', err.message);
    process.exitCode = 1;
  })
  .finally(closePool);
