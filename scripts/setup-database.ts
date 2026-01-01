import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  console.log('🚀 Setting up Pheme database...\n');

  try {
    // Read the SQL schema file
    const schemaPath = path.join(__dirname, '..', 'supabase-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    console.log('📋 SQL Schema loaded from supabase-schema.sql');
    console.log('\n⚠️  IMPORTANT: Please run the schema manually in Supabase SQL Editor');
    console.log('   1. Go to your Supabase dashboard');
    console.log('   2. Navigate to SQL Editor');
    console.log('   3. Copy the contents of supabase-schema.sql');
    console.log('   4. Paste and execute in SQL Editor');
    console.log('   5. Then run: npm run seed\n');

    // Test connection
    console.log('🔗 Testing database connection...');
    const { data, error } = await supabase.from('articles').select('count');

    if (error) {
      if (error.message.includes('relation "articles" does not exist')) {
        console.log('⚠️  Tables not created yet. Please run the SQL schema first.');
        console.log('   Copy supabase-schema.sql to Supabase SQL Editor and execute it.\n');
      } else {
        console.error('❌ Database error:', error.message);
      }
      return;
    }

    console.log('✅ Database connection successful!');
    console.log('   Tables are ready. Run: npm run seed\n');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
