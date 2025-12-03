const { pool } = require('../../config/database');

class Job {
  static async create(jobData) {
    const { title, description, salary, location, postedBy } = jobData;
    const query = `
      INSERT INTO jobs (title, description, salary, location, expiry_status, posted_by, created_at)
      VALUES (?, ?, ?, ?, 'active', ?, NOW())
    `;
    const [result] = await pool.query(query, [title, description, salary, location, postedBy]);
    const [rows] = await pool.query('SELECT * FROM jobs WHERE id = ?', [result.insertId]);
    return rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM jobs WHERE id = ?';
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }

  static async findActive(userId = null) {
    let query = `
      SELECT j.*, u.name as posted_by_name
      FROM jobs j
      LEFT JOIN users u ON j.posted_by = u.id
      WHERE j.expiry_status = 'active'
    `;
    
    const params = [];
    
    // If userId is provided, check if user has applied
    if (userId) {
      query = `
        SELECT j.*, 
          u.name as posted_by_name,
          CASE WHEN a.id IS NOT NULL THEN 1 ELSE 0 END as has_applied,
          a.status as application_status
        FROM jobs j
        LEFT JOIN users u ON j.posted_by = u.id
        LEFT JOIN applications a ON j.id = a.job_id AND a.user_id = ?
        WHERE j.expiry_status = 'active'
      `;
      params.push(userId);
    }
    
    query += ' ORDER BY j.created_at DESC';
    
    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async findAll(userId = null) {
    let query = `
      SELECT j.*, u.name as posted_by_name
      FROM jobs j
      LEFT JOIN users u ON j.posted_by = u.id
    `;
    
    const params = [];
    
    // If userId is provided, check if user has applied
    if (userId) {
      query = `
        SELECT j.*, 
          u.name as posted_by_name,
          CASE WHEN a.id IS NOT NULL THEN 1 ELSE 0 END as has_applied,
          a.status as application_status
        FROM jobs j
        LEFT JOIN users u ON j.posted_by = u.id
        LEFT JOIN applications a ON j.id = a.job_id AND a.user_id = ?
      `;
      params.push(userId);
    }
    
    query += ' ORDER BY j.expiry_status ASC, j.created_at DESC';
    
    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async findByHR(hrId) {
    const query = `
      SELECT j.*, 
        (SELECT COUNT(*) FROM applications WHERE job_id = j.id) as application_count
      FROM jobs j
      WHERE j.posted_by = ?
      ORDER BY j.created_at DESC
    `;
    const [rows] = await pool.query(query, [hrId]);
    return rows;
  }

  static async updateExpiryStatus(id, status) {
    const query = `
      UPDATE jobs 
      SET expiry_status = ? 
      WHERE id = ?
    `;
    await pool.query(query, [status, id]);
    const [rows] = await pool.query('SELECT * FROM jobs WHERE id = ?', [id]);
    return rows[0];
  }

  static async getStats(hrId) {
    const query = `
      SELECT 
        COUNT(*) as total_jobs,
        SUM(CASE WHEN expiry_status = 'active' THEN 1 ELSE 0 END) as total_active,
        SUM(CASE WHEN expiry_status = 'expired' THEN 1 ELSE 0 END) as total_expired
      FROM jobs
      WHERE posted_by = ?
    `;
    const [rows] = await pool.query(query, [hrId]);
    return rows[0];
  }
}

module.exports = Job;
