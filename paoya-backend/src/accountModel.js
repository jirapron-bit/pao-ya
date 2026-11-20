const { getPool } = require('./db');

const PUBLIC_COLUMNS =
  'id, username, email, first_name, last_name, age, chronic_disease, created_at, updated_at';

async function createAccount({ username, passwordHash, email, first_name, last_name, age, chronic_disease }) {
  const [result] = await getPool().execute(
    `INSERT INTO paoya_account
       (username, password_hash, email, first_name, last_name, age, chronic_disease)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [username, passwordHash, email, first_name, last_name, age, chronic_disease]
  );
  return findById(result.insertId);
}

async function findById(id) {
  const [rows] = await getPool().execute(
    `SELECT ${PUBLIC_COLUMNS} FROM paoya_account WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
}

async function findCredentialsByLogin(login) {
  const [rows] = await getPool().execute(
    'SELECT id, password_hash FROM paoya_account WHERE username = ? OR email = ? LIMIT 1',
    [login, login.toLowerCase()]
  );
  return rows[0] || null;
}

async function findPasswordHashById(id) {
  const [rows] = await getPool().execute('SELECT password_hash FROM paoya_account WHERE id = ?', [id]);
  return rows[0]?.password_hash || null;
}

const UPDATABLE_COLUMNS = new Set(['email', 'first_name', 'last_name', 'age', 'chronic_disease']);

async function updateProfile(id, changes) {
  const columns = Object.keys(changes).filter((column) => UPDATABLE_COLUMNS.has(column));
  if (columns.length > 0) {
    const assignments = columns.map((column) => `${column} = ?`).join(', ');
    await getPool().execute(`UPDATE paoya_account SET ${assignments} WHERE id = ?`, [
      ...columns.map((column) => changes[column]),
      id,
    ]);
  }
  return findById(id);
}

async function updatePasswordHash(id, passwordHash) {
  await getPool().execute('UPDATE paoya_account SET password_hash = ? WHERE id = ?', [passwordHash, id]);
}

async function deleteAccount(id) {
  const [result] = await getPool().execute('DELETE FROM paoya_account WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  createAccount,
  findById,
  findCredentialsByLogin,
  findPasswordHashById,
  updateProfile,
  updatePasswordHash,
  deleteAccount,
};
