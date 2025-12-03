/**
 * Migration Script: Add User-Collection Relationship
 * This script adds user_id foreign key to collections table
 * Collections are for HR organization - users apply to jobs directly
 * 
 * Usage: node scripts/migrate-add-user-relationship.js
 */

const { pool } = require('../config/database');

async function migrateDatabase() {
  let connection;
  
  try {
    connection = await pool.getConnection();
    console.log('✅ Connected to database');

    // Check if user_id column already exists
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'collections' 
      AND COLUMN_NAME = 'user_id'
    `);

    if (columns.length === 0) {
      // Add user_id foreign key to collections table
      console.log('📝 Adding user_id column to collections table...');
      await connection.execute(`
        ALTER TABLE collections 
        ADD COLUMN user_id INT,
        ADD CONSTRAINT fk_collection_user 
        FOREIGN KEY (user_id) REFERENCES users(id) 
        ON DELETE SET NULL
      `);
      console.log('✅ user_id column added to collections table!');
    } else {
      console.log('ℹ️  user_id column already exists in collections table');
    }


    console.log('\n🎉 Migration complete!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error during migration:', error.message);
    console.error('\n💡 If you see errors:');
    console.error('   1. Make sure users and collections tables exist');
    console.error('   2. Check your database connection');
    process.exit(1);
  } finally {
    if (connection) {
      connection.release();
    }
    await pool.end();
  }
}

// Run migration
migrateDatabase();




