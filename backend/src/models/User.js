const { pool } = require('../../config/database');

class User {
  static async create(userData) {
    const { name, email, password, role } = userData;
    const query = `
      INSERT INTO users (name, email, password, role, created_at)
      VALUES (?, ?, ?, ?, NOW())
    `;
    const [result] = await pool.query(query, [name, email, password, role]);
    return { id: result.insertId, name, email, role, created_at: new Date() };
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await pool.query(query, [email]);
    return rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, name, email, role, created_at FROM users WHERE id = ?';
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }

  static async findAll() {
    const query = 'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC';
    const [rows] = await pool.query(query);
    return rows;
  }
}

module.exports = User;
