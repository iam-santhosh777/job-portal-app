const { pool } = require('../../config/database');

class Resume {
  static async create(resumeData) {
    const { jobId, hrId, filename, filePath, status = 'uploaded' } = resumeData;
    const query = `
      INSERT INTO resumes (job_id, hr_id, filename, file_path, status, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;
    const [result] = await pool.query(query, [jobId, hrId, filename, filePath, status]);
    const [rows] = await pool.query('SELECT * FROM resumes WHERE id = ?', [result.insertId]);
    return rows[0];
  }

  static async createMultiple(resumesData) {
    // Insert resumes one by one to get individual IDs
    const insertedResumes = [];
    for (const resumeData of resumesData) {
      const resume = await this.create(resumeData);
      insertedResumes.push(resume);
    }
    return insertedResumes;
  }

  static async findById(id) {
    const query = 'SELECT * FROM resumes WHERE id = ?';
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }

  static async findByHR(hrId) {
    const query = `
      SELECT r.*, j.title as job_title
      FROM resumes r
      LEFT JOIN jobs j ON r.job_id = j.id
      WHERE r.hr_id = ?
      ORDER BY r.created_at DESC
    `;
    const [rows] = await pool.query(query, [hrId]);
    return rows;
  }

  static async getStatsForHR(hrId) {
    const query = `
      SELECT 
        COUNT(*) as total_resumes,
        SUM(CASE WHEN status = 'uploaded' THEN 1 ELSE 0 END) as uploaded_count,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_count
      FROM resumes
      WHERE hr_id = ?
    `;
    const [rows] = await pool.query(query, [hrId]);
    return rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM resumes WHERE id = ?';
    await pool.query(query, [id]);
    return true;
  }

  static async deleteByHR(hrId, resumeId) {
    // Delete only if HR owns the resume
    const query = 'DELETE FROM resumes WHERE id = ? AND hr_id = ?';
    const [result] = await pool.query(query, [resumeId, hrId]);
    return result.affectedRows > 0;
  }
}

module.exports = Resume;
