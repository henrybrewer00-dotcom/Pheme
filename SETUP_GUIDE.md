# Pheme Setup Guide

Complete step-by-step guide to get your AI-powered news aggregator running.

## Quick Start (5 minutes)

### 1. Set Up Supabase Database

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click "New Project"
3. Fill in project details:
   - **Name**: Pheme (or your choice)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to you
4. Wait for project to be created (~2 minutes)

5. **Create Database Tables**:
   - Go to SQL Editor (left sidebar)
   - Click "New Query"
   - Copy entire contents of `supabase-schema.sql`
   - Paste into SQL editor
   - Click "Run" (bottom right)
   - You should see "Success. No rows returned"

6. **Get API Credentials**:
   - Go to Project Settings (gear icon in sidebar)
   - Click "API" in left menu
   - Copy these two values:
     - **Project URL** (looks like: https://xxxxx.supabase.co)
     - **anon public** key (long string starting with "eyJ...")

### 2. Get Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Go to API Keys section
4. Click "Create Key"
5. Give it a name (e.g., "Pheme App")
6. Copy the API key (starts with "sk-ant-...")
7. **Note**: Free tier includes $5 credits - enough for ~5000 summaries

### 3. Configure Environment Variables

1. Open `.env.local` in your code editor
2. Replace the placeholder values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci... (your actual key)
ANTHROPIC_API_KEY=sk-ant-... (your actual key)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Install and Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit http://localhost:3000 - you should see the app!

### 5. Add Sample Articles

The app needs articles to display. Use this curl command to add a test article:

```bash
curl -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Welcome to Pheme - Your AI News Aggregator",
    "url": "https://github.com/yourusername/pheme",
    "author_name": "Pheme Team",
    "source": "Pheme",
    "content_snippet": "Pheme is an AI-powered news aggregation platform that brings you personalized news feeds, smart summaries, and intelligent content discovery.",
    "published_at": "2024-01-01T12:00:00Z"
  }'
```

Add a few more articles to test the features. Change the title, URL, author, etc.

## Generate AI Summaries

After adding articles, generate AI summaries:

```bash
# Get the article ID from the response above, then:
curl -X POST http://localhost:3000/api/summaries \
  -H "Content-Type: application/json" \
  -d '{
    "articleId": "YOUR_ARTICLE_ID",
    "title": "Article Title",
    "content": "Full article content here...",
    "source": "Source Name"
  }'
```

## Deploy to Vercel

### Option 1: Vercel Dashboard (Easiest)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ANTHROPIC_API_KEY`
   - `NEXT_PUBLIC_APP_URL` (set to your Vercel URL)
6. Click "Deploy"

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add ANTHROPIC_API_KEY
vercel env add NEXT_PUBLIC_APP_URL

# Redeploy with environment variables
vercel --prod
```

## Integrating Real News Sources

For production, you'll want to fetch real news. Here are recommended APIs:

### NewsAPI.org

1. Sign up at [newsapi.org](https://newsapi.org)
2. Get free API key (100 requests/day)
3. Create `scripts/fetch-newsapi.ts`:

```typescript
const response = await fetch(
  `https://newsapi.org/v2/top-headlines?country=us&apiKey=${NEWSAPI_KEY}`
);
const data = await response.json();

for (const article of data.articles) {
  await fetch('http://localhost:3000/api/articles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: article.title,
      url: article.url,
      author_name: article.author,
      source: article.source.name,
      content_snippet: article.description,
      published_at: article.publishedAt,
      image_url: article.urlToImage,
    }),
  });
}
```

### RSS Feeds

Many news sites offer RSS feeds. Use a library like `rss-parser`:

```bash
npm install rss-parser
```

```typescript
import Parser from 'rss-parser';

const parser = new Parser();
const feed = await parser.parseURL('https://news.ycombinator.com/rss');

for (const item of feed.items) {
  // Insert into database via API
}
```

## Testing Features

1. **Bookmarks**: Click bookmark icon on any article
2. **Following**: Visit an author page and click "Follow"
3. **Search**: Use search bar in header
4. **Dark Mode**: Click moon/sun icon in header
5. **Personalization**: Read several articles, then visit "For You" page
6. **Notifications**: Follow an author, add their new article, check notifications

## Troubleshooting

### "No articles found"
- Add articles using the curl command above
- Check Supabase database has articles: SQL Editor → `SELECT * FROM articles;`

### "Failed to fetch articles"
- Verify Supabase URL and key in `.env.local`
- Check Supabase project is active
- Look for errors in browser console (F12)

### AI Summaries not working
- Verify Anthropic API key is correct
- Check you have credits remaining
- Look at server logs for API errors

### Dark mode not persisting
- Check browser allows localStorage
- Clear browser cache and try again

### Build errors
```bash
# Clear cache and rebuild
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

## Database Maintenance

### View all articles
```sql
SELECT id, title, author_name, source, created_at 
FROM articles 
ORDER BY created_at DESC 
LIMIT 10;
```

### Clear all data (start fresh)
```sql
TRUNCATE articles, authors, user_reads, user_follows, 
         user_bookmarks, notifications CASCADE;
```

### Check user activity
```sql
SELECT user_cookie_id, COUNT(*) as reads 
FROM user_reads 
GROUP BY user_cookie_id;
```

## Performance Tips

1. **Enable caching**: AI summaries are cached automatically
2. **Limit API calls**: Generate summaries in batches
3. **Use indexes**: Already configured in schema
4. **Paginate results**: Articles load 50 at a time
5. **Lazy load images**: Use Next.js Image component

## Security Checklist

- [ ] Environment variables in `.env.local` (never commit to git)
- [ ] Supabase RLS policies enabled (optional for production)
- [ ] CORS configured for production domain
- [ ] API rate limiting (add in production)
- [ ] Anthropic API key protected (server-side only)

## Next Steps

1. Set up automated news fetching (cron job)
2. Add user authentication (NextAuth.js)
3. Implement email notifications
4. Add analytics (Vercel Analytics)
5. Create admin dashboard
6. Add more AI features (topic extraction, sentiment analysis)

## Support

- Check [README.md](README.md) for detailed documentation
- Review [supabase-schema.sql](supabase-schema.sql) for database structure
- Inspect API routes in `app/api/` for backend logic

---

**You're all set!** Your AI-powered news aggregator is ready to use.
