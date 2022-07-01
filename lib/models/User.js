const pool = require('../utils/pool');

class User {
  id;
  email;
  #passwordHash;

  constructor(row) {
    this.id = row.id;
    this.email = row.email;
    this.#passwordHash = row.passwordHash;
  }
  static async insert({ email, passwordHash }) {
    const { rows } = await pool.query(
      'INSERT INTO usersSL (email, passwordHash) VALUES ($1,$2) RETURNING *',
      [email, passwordHash]
    );
    return new User(rows[0]);
  }
  get passwordHash() {
    return this.#passwordHash;
  }
}
module.exports = { User };
