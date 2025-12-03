const { pool } = require('../../config/database');

class Application {
  static async create(applicationData) {
    const { jobId, userId, status = 'pending' } = applicationData;
    
    // Check if user already applied
    const [existing] = await pool.query(
      'SELECT id FROM applications WHERE job_id = ? AND user_id = ?',
      [jobId, userId]
    );
    
    if (existing.length > 0) {
      throw new Error('User has already applied for this job');
    }

    const query = `
      INSERT INTO applications (job_id, user_id, status, created_at)
      VALUES (?, ?, ?, NOW())
    `;
    const [result] = await pool.query(query, [jobId, userId, status]);
    const [rows] = await pool.query('SELECT * FROM applications WHERE id = ?', [result.insertId]);
    return rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT a.*, 
        j.title as job_title,
        u.name as user_name,
        u.email as user_email
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN users u ON a.user_id = u.id
      WHERE a.id = ?
    `;
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }

  static async findByJob(jobId) {
    const query = `
      SELECT a.*, 
        u.name as user_name,
        u.email as user_email
      FROM applications a
      JOIN users u ON a.user_id = u.id
      WHERE a.job_id = ?
      ORDER BY a.created_at DESC
    `;
    const [rows] = await pool.query(query, [jobId]);
    return rows;
  }

  static async findByUser(userId) {
    const query = `
      SELECT a.*, 
        j.title as job_title,
        j.description as job_description,
        j.location as job_location,
        j.salary as job_salary
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.user_id = ?
      ORDER BY a.created_at DESC
    `;
    const [rows] = await pool.query(query, [userId]);
    return rows;
  }

  static async getStatsForHR(hrId) {
    const query = `
      SELECT COUNT(*) as total_applications
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE j.posted_by = ?
    `;
    const [rows] = await pool.query(query, [hrId]);
    return rows[0];
  }
}

module.exports = Application;
