const pool = require('../utils/pool');

module.exports = class Todo {
  id;
  user_id;
  description;
  complete;

  constructor(row) {
    this.id = row.id;
    this.user_id = row.user_id;
    this.description = row.description;
    this.complete = row.complete;
  }

  static async insert({ user_id, description }) {
    const { rows } = await pool.query('INSERT INTO todos (user_id, description) VALUES ($1,$2) RETURNING *', [user_id, description]);
    return new Todo(rows[0]);

  }

  static async getAll(user_id) {
    const { rows } = await pool.query('SELECT * FROM todos WHERE user_id=$1 ORDER BY created_at DESC', [user_id]);
  
    return rows.map((todo) => new Todo(todo));
  }
};
