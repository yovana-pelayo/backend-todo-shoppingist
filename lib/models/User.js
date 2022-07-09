const pool = require('../utils/pool');

module.exports = class User {
  id;
  username;
  email; 
  #passwordHash;

  constructor(row) { 
    this.id = row.id;
    this.username = row.username;
    this.email = row.email;
    this.#passwordHash = row.passwordHash;
  }
  static async insert({ username, email, passwordHash }) {
    const { rows } = await pool.query(
      'INSERT INTO userSL (username,email, passwordHash) VALUES ($1,$2,$3) RETURNING *',
      [username, email, passwordHash]
    );
    return new User(rows[0]);
  }

 
  static async getByEmail(email) {
    const { rows } = await pool.query('SELECT * FROM userSL WHERE email=$1', [email]
    );

    if (!rows[0]) return null;

    return new User(rows[0]);
  }

 

  get passwordHash() {
    return this.#passwordHash;
  }
};

