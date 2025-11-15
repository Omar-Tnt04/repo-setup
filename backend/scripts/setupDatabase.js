const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
  let connection;

  try {
    console.log('🔧 Setting up database...\n');

    // Connect to MySQL (without specifying database)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD
    });

    console.log('✅ Connected to MySQL server');

    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'tunisian_freelancers';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`✅ Database '${dbName}' created/verified`);

    // Use the database
    await connection.query(`USE \`${dbName}\``);

    // Read schema.sql
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    let schemaSQL = await fs.readFile(schemaPath, 'utf8');
    
    console.log('\n📋 Creating tables...');
    
    // Extract only table creation statements (everything before stored procedures)
    const tablesSection = schemaSQL.split('-- ====================')[0];
    
    // Execute table creation statements
    const tableStatements = tablesSection
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 10 && !s.startsWith('--'));
    
    for (const stmt of tableStatements) {
      if (stmt.trim()) {
        try {
          await connection.query(stmt);
        } catch (err) {
          if (!err.message.includes('already exists') && 
              !err.message.includes('Can\'t DROP')) {
            console.error(`⚠️  Warning:`, err.message.split('\n')[0]);
          }
        }
      }
    }
    
    console.log('✅ Tables created successfully');
    console.log('\n📝 Note: Stored procedures skipped (use MySQL Workbench to create them if needed)');
    console.log('\n📝 To seed sample data, run: npm run db:seed');
    console.log('\n✅ Database setup complete!\n');

  } catch (error) {
    console.error('\n❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
