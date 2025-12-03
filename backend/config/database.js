const mysql = require('mysql2/promise');
require('dotenv').config();

// Parse MySQL connection URL if provided
function parseConnectionConfig() {
  // If MYSQL_URL is provided, parse it
  const mysqlUrl = process.env.MYSQL_URL || process.env.DATABASE_URL;
  
  if (mysqlUrl && mysqlUrl.startsWith('mysql://')) {
    try {
      const url = new URL(mysqlUrl);
      return {
        host: url.hostname,
        port: parseInt(url.port) || 3306,
        user: url.username,
        password: url.password,
        database: url.pathname.replace('/', '')
      };
    } catch (error) {
      console.error('⚠️  Error parsing MySQL URL:', error.message);
    }
  }
  
  // Check if DB_HOST contains a full URL (common mistake)
  if (process.env.DB_HOST && process.env.DB_HOST.startsWith('mysql://')) {
    try {
      const url = new URL(process.env.DB_HOST);
      return {
        host: url.hostname,
        port: parseInt(url.port) || 3306,
        user: url.username || process.env.DB_USER || 'root',
        password: url.password || process.env.DB_PASSWORD || '',
        database: url.pathname.replace('/', '') || process.env.DB_NAME || 'railway'
      };
    } catch (error) {
      console.error('⚠️  Error parsing DB_HOST URL:', error.message);
    }
  }
  
  // Use individual environment variables
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'railway'
  };
}

const dbConfig = parseConnectionConfig();

// Create MySQL connection pool
const pool = mysql.createPool({
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully!');
    console.log(`   Host: ${dbConfig.host}`);
    console.log(`   Port: ${dbConfig.port}`);
    console.log(`   Database: ${dbConfig.database}`);
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed!');
    console.error(`   Error: ${error.message}`);
    console.error(`   Attempting to connect to: ${dbConfig.host}:${dbConfig.port}`);
    console.error(`   Database: ${dbConfig.database}`);
    
    // Check if user put full URL in DB_HOST
    if (process.env.DB_HOST && process.env.DB_HOST.startsWith('mysql://')) {
      console.error('\n⚠️  Full MySQL URL detected in DB_HOST!');
      console.error('   You have two options:');
      console.error('   Option 1: Use MYSQL_URL variable (recommended)');
      console.error('     MYSQL_URL=mysql://user:pass@host:port/database');
      console.error('   Option 2: Split into separate variables:');
      console.error('     DB_HOST=hostname (without mysql://)');
      console.error('     DB_PORT=port');
      console.error('     DB_USER=username');
      console.error('     DB_PASSWORD=password');
      console.error('     DB_NAME=database\n');
    }
    // Railway-specific help
    else if (process.env.DB_HOST && process.env.DB_HOST.includes('railway.internal')) {
      console.error('\n⚠️  Railway Internal Hostname Detected!');
      console.error('   "mysql.railway.internal" only works when deployed on Railway.');
      console.error('   For local development, you need the PUBLIC connection details:');
      console.error('   1. Go to Railway dashboard → Your MySQL service');
      console.error('   2. Click "Connect" or "Variables" tab');
      console.error('   3. Look for PUBLIC connection details (not internal)');
      console.error('   4. The host should look like: containers-us-west-xxx.railway.app');
      console.error('   5. Update your .env file with the public hostname\n');
    } else {
      console.error('\n💡 To fix this:');
      console.error('   1. Make sure MySQL is running');
      console.error('   2. Check your .env file has correct credentials');
      console.error('   3. Ensure the database exists');
      console.error('   4. Check Railway documentation for connection help\n');
    }
    return false;
  }
}

module.exports = { pool, testConnection };
