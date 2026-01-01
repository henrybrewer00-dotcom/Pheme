import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = 'https://jurmkjcoklubevhzlgda.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1cm1ramNva2x1YmV2aHpsZ2RhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzI2MDI5MCwiZXhwIjoyMDgyODM2MjkwfQ.BmHnZglOQsWxYnbKYDH_fZ1qOnSwFkovi7DS7r6YI8M';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeSchema() {
  console.log('🚀 Executing database schema...\n');

  try {
    // Read the SQL schema file
    const schemaPath = path.join(__dirname, '..', 'supabase-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    console.log('📋 SQL Schema loaded');
    console.log('📝 Executing schema (this may take a moment)...\n');

    // Execute the SQL using rpc
    const { data, error } = await supabase.rpc('exec_sql', { sql_string: schema });

    if (error) {
      console.error('❌ Error executing schema:', error.message);
      console.log('\n⚠️  Fallback: Manual setup required');
      console.log('   1. Go to https://jurmkjcoklubevhzlgda.supabase.co');
      console.log('   2. Navigate to SQL Editor');
      console.log('   3. Copy contents of supabase-schema.sql');
      console.log('   4. Paste and execute');
      console.log('   5. Then run: npm run seed\n');
      process.exit(1);
    }

    console.log('✅ Schema executed successfully!');
    console.log('\n🌱 Now run: npm run seed');
    console.log('   This will populate the database with sample articles\n');

  } catch (error) {
    console.error('❌ Execution failed:', error);
    console.log('\n📝 Manual setup required:');
    console.log('   1. Go to https://jurmkjcoklubevhzlgda.supabase.co');
    console.log('   2. SQL Editor → New Query');
    console.log('   3. Copy & paste supabase-schema.sql');
    console.log('   4. Run the query');
    console.log('   5. Then: npm run seed\n');
  }
}

executeSchema();
