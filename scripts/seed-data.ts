import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Sample data
const sampleArticles = [
  {
    title: 'AI Breakthrough: New Model Achieves Human-Level Reasoning',
    url: 'https://example.com/ai-breakthrough-2024',
    author_name: 'Dr. Sarah Chen',
    source: 'Tech Daily',
    content_snippet: 'Researchers at leading AI labs announced a major breakthrough today, unveiling a new model that demonstrates unprecedented reasoning capabilities. The model can solve complex problems, engage in nuanced discussions, and even explain its thought process.',
    published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    reliability_score: 8.5,
    bias_score: 'Center',
    category: 'Technology',
    is_trending: true,
  },
  {
    title: 'Global Climate Summit Reaches Historic Agreement',
    url: 'https://example.com/climate-summit-agreement',
    author_name: 'Michael Rodriguez',
    source: 'World News Network',
    content_snippet: 'World leaders have reached a landmark agreement at the Global Climate Summit, committing to unprecedented emissions reductions and renewable energy investments. The accord includes binding targets for 2030 and 2040.',
    published_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    reliability_score: 9.0,
    bias_score: 'Center',
    category: 'Environment',
    is_trending: true,
  },
  {
    title: 'Scientists Discover Potential Cure for Common Cold',
    url: 'https://example.com/cold-cure-discovery',
    author_name: 'Dr. Emily Watson',
    source: 'Medical Journal Today',
    content_snippet: 'After decades of research, scientists have identified a promising compound that could finally provide a cure for the common cold. Clinical trials show a 95% success rate in eliminating symptoms within 24 hours.',
    published_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    reliability_score: 8.8,
    bias_score: 'Center',
    category: 'Health',
    is_trending: false,
  },
  {
    title: 'SpaceX Announces Plans for Mars Colony by 2030',
    url: 'https://example.com/spacex-mars-colony',
    author_name: 'James Martinez',
    source: 'Space Exploration News',
    content_snippet: 'Elon Musk revealed detailed plans for establishing the first human colony on Mars within the next six years. The ambitious project includes multiple cargo missions starting in 2026, followed by crewed missions.',
    published_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    reliability_score: 7.2,
    bias_score: 'Center',
    category: 'Space',
    is_trending: true,
  },
  {
    title: 'New Study Links Mediterranean Diet to Longer Lifespan',
    url: 'https://example.com/mediterranean-diet-study',
    author_name: 'Dr. Lisa Anderson',
    source: 'Health Science Review',
    content_snippet: 'A comprehensive 20-year study tracking 100,000 participants found that adherence to a Mediterranean diet increased life expectancy by an average of 4.5 years. The diet rich in olive oil, fish, and vegetables showed remarkable health benefits.',
    published_at: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    reliability_score: 8.9,
    bias_score: 'Center',
    category: 'Health',
    is_trending: false,
  },
  {
    title: 'Tech Giants Announce Joint Venture for Quantum Computing',
    url: 'https://example.com/quantum-computing-venture',
    author_name: 'Dr. Sarah Chen',
    source: 'Tech Daily',
    content_snippet: 'Major technology companies including Google, IBM, and Microsoft have formed an unprecedented alliance to accelerate quantum computing development. The partnership aims to create commercially viable quantum computers within three years.',
    published_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    reliability_score: 8.7,
    bias_score: 'Center',
    category: 'Technology',
    is_trending: false,
  },
  {
    title: 'Renewable Energy Surpasses Fossil Fuels in Global Production',
    url: 'https://example.com/renewable-energy-milestone',
    author_name: 'Michael Rodriguez',
    source: 'World News Network',
    content_snippet: 'For the first time in history, renewable energy sources have produced more electricity globally than fossil fuels. Solar and wind power led the charge, with a 40% increase in capacity over the past year.',
    published_at: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
    reliability_score: 9.1,
    bias_score: 'Center',
    category: 'Environment',
    is_trending: false,
  },
  {
    title: 'FDA Approves First Gene Therapy for Alzheimers Disease',
    url: 'https://example.com/alzheimers-gene-therapy',
    author_name: 'Dr. Emily Watson',
    source: 'Medical Journal Today',
    content_snippet: 'The FDA has approved a groundbreaking gene therapy that shows promise in slowing or even reversing Alzheimers disease progression. Early trials demonstrated significant cognitive improvements in 70% of patients.',
    published_at: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    reliability_score: 9.0,
    bias_score: 'Center',
    category: 'Health',
    is_trending: false,
  },
  {
    title: 'Self-Driving Cars Achieve 99.9% Safety Record',
    url: 'https://example.com/self-driving-safety-record',
    author_name: 'Alexandra Kim',
    source: 'Auto Tech Review',
    content_snippet: 'Autonomous vehicles have reached a major safety milestone, completing 10 million miles with only 12 minor incidents. The technology is now statistically safer than human drivers in most conditions.',
    published_at: new Date(Date.now() - 42 * 60 * 60 * 1000).toISOString(),
    reliability_score: 8.3,
    bias_score: 'Center',
    category: 'Technology',
    is_trending: false,
  },
  {
    title: 'Ocean Cleanup Initiative Removes 500,000 Tons of Plastic',
    url: 'https://example.com/ocean-cleanup-success',
    author_name: 'David Thompson',
    source: 'Environmental Today',
    content_snippet: 'The Ocean Cleanup Project has successfully removed over 500,000 tons of plastic waste from the Great Pacific Garbage Patch. New advanced filtering systems are processing waste at triple the original rate.',
    published_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    reliability_score: 8.6,
    bias_score: 'Center',
    category: 'Environment',
    is_trending: false,
  },
  {
    title: 'Breakthrough in Fusion Energy: Sustained Reaction Achieved',
    url: 'https://example.com/fusion-energy-breakthrough',
    author_name: 'Dr. Robert Chang',
    source: 'Science Daily',
    content_snippet: 'Scientists at the National Ignition Facility have achieved a sustained fusion reaction lasting over 10 minutes, marking a critical step toward unlimited clean energy. The breakthrough solves several decades-old engineering challenges.',
    published_at: new Date(Date.now() - 54 * 60 * 60 * 1000).toISOString(),
    reliability_score: 9.2,
    bias_score: 'Center',
    category: 'Science',
    is_trending: true,
  },
  {
    title: 'New Brain-Computer Interface Helps Paralyzed Patients Walk',
    url: 'https://example.com/brain-computer-interface-walking',
    author_name: 'Dr. Sarah Chen',
    source: 'Tech Daily',
    content_snippet: 'A revolutionary brain-computer interface has enabled paralyzed patients to walk again through thought-controlled exoskeletons. The technology reads neural signals with unprecedented accuracy.',
    published_at: new Date(Date.now() - 60 * 60 * 60 * 1000).toISOString(),
    reliability_score: 8.8,
    bias_score: 'Center',
    category: 'Technology',
    is_trending: false,
  },
  {
    title: 'Global Education Initiative Reaches 100 Million Children',
    url: 'https://example.com/education-initiative-milestone',
    author_name: 'Maria Santos',
    source: 'Education World',
    content_snippet: 'UNESCOs digital education program has successfully provided free online learning to 100 million underprivileged children worldwide. The initiative uses AI-powered personalized learning platforms.',
    published_at: new Date(Date.now() - 66 * 60 * 60 * 1000).toISOString(),
    reliability_score: 8.7,
    bias_score: 'Center',
    category: 'Education',
    is_trending: false,
  },
  {
    title: 'Vertical Farms Revolution: Cities Achieve Food Independence',
    url: 'https://example.com/vertical-farms-revolution',
    author_name: 'James Martinez',
    source: 'Space Exploration News',
    content_snippet: 'Major cities are achieving food independence through massive vertical farming installations. These high-tech farms use 95% less water and produce 400 times more food per acre than traditional farming.',
    published_at: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    reliability_score: 8.4,
    bias_score: 'Center',
    category: 'Agriculture',
    is_trending: false,
  },
  {
    title: 'Archaeologists Discover Lost City in Amazon Rainforest',
    url: 'https://example.com/lost-city-amazon',
    author_name: 'Dr. Carlos Rivera',
    source: 'Archaeology Magazine',
    content_snippet: 'Using LiDAR technology, archaeologists have uncovered a massive pre-Columbian city in the Amazon, home to an estimated 500,000 people at its peak. The discovery rewrites our understanding of ancient civilizations.',
    published_at: new Date(Date.now() - 78 * 60 * 60 * 1000).toISOString(),
    reliability_score: 8.9,
    bias_score: 'Center',
    category: 'Archaeology',
    is_trending: true,
  },
];

async function seedDatabase() {
  console.log('🌱 Seeding database with sample articles...\n');

  try {
    // Check if tables exist
    const { data: testData, error: testError } = await supabase
      .from('articles')
      .select('id')
      .limit(1);

    if (testError) {
      console.error('❌ Database tables not found. Please run the SQL schema first.');
      console.error('   Go to Supabase SQL Editor and execute supabase-schema.sql\n');
      process.exit(1);
    }

    // Check if data already exists
    const { data: existingArticles } = await supabase
      .from('articles')
      .select('id');

    if (existingArticles && existingArticles.length > 0) {
      console.log('⚠️  Database already contains articles.');
      console.log(`   Found ${existingArticles.length} existing articles.`);
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      const answer = await new Promise<string>((resolve) => {
        rl.question('   Add more sample articles anyway? (y/n): ', resolve);
      });
      rl.close();

      if (answer.toLowerCase() !== 'y') {
        console.log('   Skipping seed. Database unchanged.\n');
        return;
      }
    }

    // Step 1: Create authors first
    console.log('👤 Creating authors...\n');
    const uniqueAuthors = Array.from(
      new Set(sampleArticles.map((a) => a.author_name))
    );

    const authorMap = new Map<string, string>(); // author_name -> author_id

    for (const authorName of uniqueAuthors) {
      if (!authorName) continue;

      const normalized = authorName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // Check if author exists
      const { data: existingAuthor } = await supabase
        .from('authors')
        .select('id')
        .eq('normalized_name', normalized)
        .single();

      if (existingAuthor) {
        authorMap.set(authorName, existingAuthor.id);
        console.log(`   ♻️  Author exists: ${authorName}`);
      } else {
        const { data: newAuthor, error } = await supabase
          .from('authors')
          .insert({
            name: authorName,
            normalized_name: normalized,
          })
          .select('id')
          .single();

        if (newAuthor) {
          authorMap.set(authorName, newAuthor.id);
          console.log(`   ✅ Created author: ${authorName}`);
        } else {
          console.error(`   ❌ Failed to create author: ${authorName}`);
        }
      }
    }

    // Step 2: Insert articles with author_id
    console.log('\n📰 Adding articles...\n');
    let successCount = 0;
    let errorCount = 0;

    for (const article of sampleArticles) {
      console.log(`📝 Adding: ${article.title.substring(0, 50)}...`);

      const authorId = authorMap.get(article.author_name);

      // Insert article with author_id
      const { data, error } = await supabase
        .from('articles')
        .insert({
          ...article,
          author_id: authorId || null,
        })
        .select();

      if (error) {
        console.error(`   ❌ Error: ${error.message}`);
        errorCount++;
      } else {
        console.log(`   ✅ Added successfully`);
        successCount++;
      }

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Step 3: Create sample user follows to test notifications
    console.log('\n👥 Setting up test user follows...\n');
    const testUserId = 'demo-user-123'; // Sample user ID

    // Follow Dr. Sarah Chen (has multiple articles)
    const sarahChenId = authorMap.get('Dr. Sarah Chen');
    if (sarahChenId) {
      const { error } = await supabase
        .from('user_follows')
        .insert({
          user_cookie_id: testUserId,
          author_id: sarahChenId,
        });

      if (!error) {
        console.log('   ✅ Test user now follows Dr. Sarah Chen');
        console.log('   💡 When she publishes new articles, notifications will be created!');
      }
    }

    console.log(`\n✨ Seed complete!`);
    console.log(`   ✅ ${successCount} articles added`);
    console.log(`   ✅ ${authorMap.size} authors created/verified`);
    if (errorCount > 0) {
      console.log(`   ❌ ${errorCount} errors`);
    }
    console.log('\n🔔 Notifications system is ready!');
    console.log('   📌 Test user ID: demo-user-123');
    console.log('   📌 Open your browser console and run:');
    console.log('      localStorage.setItem("pheme_user_id", "demo-user-123")');
    console.log('   📌 Then refresh to see notifications from followed authors\n');
    console.log('\n🚀 Your app is ready! Run: npm run dev\n');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seedDatabase();
