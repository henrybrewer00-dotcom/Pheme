import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔗 Testing Supabase connection...\n');

  try {
    // Try to query articles table
    const { data, error } = await supabase
      .from('articles')
      .select('id')
      .limit(1);

    if (error) {
      if (error.message.includes('relation "articles" does not exist') ||
          error.message.includes('does not exist')) {
        console.log('⚠️  Tables not created yet');
        console.log('\n📋 Next step: Create database schema');
        console.log('   Copy supabase-schema.sql to Supabase SQL Editor\n');
        return false;
      } else {
        console.error('❌ Connection error:', error.message);
        return false;
      }
    }

    console.log('✅ Connection successful!');
    console.log('✅ Tables exist!');

    // Check if there's any data
    const { data: articles } = await supabase
      .from('articles')
      .select('count');

    console.log(`\n📊 Current data: ${articles ? articles.length : 0} articles`);

    if (!articles || articles.length === 0) {
      console.log('\n🌱 Ready to seed! Run: npm run seed\n');
    } else {
      console.log('\n✨ Database already populated!\n');
      console.log('🚀 Start the app: npm run dev\n');
    }

    return true;

  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

testConnection();
