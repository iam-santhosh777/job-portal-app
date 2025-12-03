/**
 * Database Initialization Script
 * Run this once to create all tables in Railway MySQL
 * 
 * Usage: node scripts/init-database.js
 */

const { pool } = require('../config/database');

async function initializeDatabase() {
  let connection;
  
  try {
    connection = await pool.getConnection();
    console.log('✅ Connected to database');

    // Check if users table exists and has the correct structure
    const [tables] = await connection.query(
      "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'users'"
    );
    
    if (tables[0].count > 0) {
      // Table exists, check if it has password and role columns
      const [columns] = await connection.query(
        `SELECT COLUMN_NAME FROM information_schema.COLUMNS 
         WHERE TABLE_SCHEMA = DATABASE() 
         AND TABLE_NAME = 'users' 
         AND COLUMN_NAME IN ('password', 'role')`
      );
      
      const hasPassword = columns.some(col => col.COLUMN_NAME === 'password');
      const hasRole = columns.some(col => col.COLUMN_NAME === 'role');
      
      if (!hasPassword || !hasRole) {
        // Old table structure, need to migrate
        console.log('⚠️  Old users table detected. Migrating to new structure...');
        
        // Drop tables in correct order (drop dependent tables first)
        // Resumes depends on jobs and users
        // Applications depends on jobs and users
        // Jobs depends on users
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');
        await connection.query('DROP TABLE IF EXISTS resumes');
        await connection.query('DROP TABLE IF EXISTS applications');
        await connection.query('DROP TABLE IF EXISTS jobs');
        await connection.query('DROP TABLE IF EXISTS users');
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('✅ Old tables dropped');
      }
    }

    // Create users table with correct structure
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(10) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CHECK (role IN ('HR', 'USER'))
      )
    `;

    await connection.query(createUsersTable);
    console.log('✅ Users table created successfully!');

    // Create jobs table
    const createJobsTable = `
      CREATE TABLE IF NOT EXISTS jobs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        salary VARCHAR(50),
        location VARCHAR(100),
        expiry_status VARCHAR(10) DEFAULT 'active',
        posted_by INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE CASCADE,
        CHECK (expiry_status IN ('active', 'expired'))
      )
    `;

    await connection.query(createJobsTable);
    console.log('✅ Jobs table created successfully!');

    // Create applications table
    const createApplicationsTable = `
      CREATE TABLE IF NOT EXISTS applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        job_id INT NOT NULL,
        user_id INT NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_application (job_id, user_id),
        CHECK (status IN ('pending', 'accepted', 'rejected'))
      )
    `;

    await connection.query(createApplicationsTable);
    console.log('✅ Applications table created successfully!');

    // Create resumes table
    const createResumesTable = `
      CREATE TABLE IF NOT EXISTS resumes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        job_id INT,
        hr_id INT NOT NULL,
        filename VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        status VARCHAR(20) DEFAULT 'uploaded',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL,
        FOREIGN KEY (hr_id) REFERENCES users(id) ON DELETE CASCADE,
        CHECK (status IN ('uploaded', 'failed'))
      )
    `;

    await connection.query(createResumesTable);
    console.log('✅ Resumes table created successfully!');

    // Create indexes for better performance
    // MySQL doesn't support IF NOT EXISTS for indexes, so we use try-catch
    const createIndex = async (name, table, column) => {
      try {
        await connection.query(`CREATE INDEX ${name} ON ${table}(${column})`);
      } catch (error) {
        // Index already exists or other error - ignore
        if (!error.message.includes('Duplicate key name')) {
          console.log(`⚠️  Warning creating index ${name}: ${error.message}`);
        }
      }
    };

    await createIndex('idx_jobs_posted_by', 'jobs', 'posted_by');
    await createIndex('idx_jobs_expiry_status', 'jobs', 'expiry_status');
    await createIndex('idx_applications_job_id', 'applications', 'job_id');
    await createIndex('idx_applications_user_id', 'applications', 'user_id');
    await createIndex('idx_resumes_hr_id', 'resumes', 'hr_id');
    console.log('✅ Indexes created successfully!');

    // Create sample HR user (password: password123)
    const bcrypt = require('bcryptjs');
    const hrPassword = await bcrypt.hash('password123', 10);
    const userPassword = await bcrypt.hash('password123', 10);

    // Insert or update HR user
    await connection.query(`
      INSERT INTO users (name, email, password, role)
      VALUES (?, ?, ?, 'HR')
      ON DUPLICATE KEY UPDATE 
        name = VALUES(name),
        password = VALUES(password),
        role = VALUES(role)
    `, ['HR Manager', 'hr@example.com', hrPassword]);

    // Insert or update USER
    await connection.query(`
      INSERT INTO users (name, email, password, role)
      VALUES (?, ?, ?, 'USER')
      ON DUPLICATE KEY UPDATE 
        name = VALUES(name),
        password = VALUES(password),
        role = VALUES(role)
    `, ['Test User', 'user@example.com', userPassword]);

    console.log('✅ Sample users created (if not exists)');
    console.log('   HR: hr@example.com / password123');
    console.log('   USER: user@example.com / password123');
    console.log('\n⚠️  Note: Please change these passwords in production!');

    console.log('\n✅ Database initialization completed successfully!');
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    if (connection) {
      connection.release();
    }
    await pool.end();
  }
}

// Run initialization
initializeDatabase();
