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
  static async updateById(id, attrs) {
    const todo = await Todo.getById(id);
    if(!todo) return null;
    const { description, complete } = { ...todo, ...attrs };
    const { rows } = await pool.query('UPDATE todos SET description=$2, complete=$3 WHERE id=$1 RETURNING *',
      [id, description, complete]
    );
    return new Todo(rows[0]);
  }

  //getting todo by its id, assigning description and complete to be the todos and attributes we want to use.
  //

  static async getById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM todos WHERE id = $1', [id]
    );
    if (!rows[0]) {
      return null;
    }
    return new Todo(rows[0]);
  }
};
