import { Client } from 'pg';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  try {
    await client.connect();
    console.log('🔄 Running database migrations...');

    // Drop old problem_entries table if exists (to migrate from old schema)
    await client.query('DROP TABLE IF EXISTS problem_entries CASCADE;');
    console.log('🗑️  Dropped old problem_entries table');

    // Run new schema
    const schemaPath = join(__dirname, 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');
    await client.query(schema);

    console.log('✅ Database migrations completed successfully!');
    console.log('📊 Tables created: users, dsa_entries, dev_entries, aiml_entries, db_entries, systemdesign_entries, predefined_sheet_progress');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

migrate()
  .then(() => {
    console.log('🎉 Migration complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration error:', error);
    process.exit(1);
  });