/**
 * Migration Script: Add status field to services table
 * Run this script to apply the migration to your Supabase database
 *
 * Usage: npx tsx scripts/apply-migration.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  console.log('🔄 Starting migration: Add status field to services...\n');

  try {
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, '..', 'prisma', 'migrations', '20260627000000_add_status_to_services', 'migration.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 Migration SQL:');
    console.log(migrationSQL);
    console.log('\n');

    // Note: Supabase client doesn't support raw SQL queries with the anon key
    // You need to either:
    // 1. Run this SQL directly in the Supabase SQL Editor (Dashboard -> SQL Editor)
    // 2. Use the service role key (not recommended for client-side code)

    console.log('⚠️  IMPORTANT: Please apply this migration manually:');
    console.log('1. Go to your Supabase Dashboard (https://app.supabase.com)');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the SQL above');
    console.log('4. Click "Run" to execute the migration\n');

    console.log('Alternatively, you can run the migration using Prisma:');
    console.log('   npx prisma migrate deploy\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

applyMigration();
