# Pheme - AI-Powered News Aggregator

A production-ready, AI-powered news aggregation web application built with Next.js, Supabase, and Claude AI. Pheme provides personalized news feeds, AI-generated summaries, author tracking, and intelligent content discovery.

## Features

### Core Features
- **News Aggregation**: Aggregate articles from multiple sources with metadata tracking
- **AI Summaries**: Generate concise 2-3 sentence summaries using Claude AI
- **Personalized Feeds**: AI-powered personalization based on reading history
- **Author Tracking**: Follow your favorite authors and get notified of new articles
- **Smart Search**: Search across articles and authors with real-time results
- **Bookmarks**: Save articles with custom tags and notes
- **Dark Mode**: Full dark mode support with smooth transitions

### Advanced Features
- **Reliability Scoring**: AI-based source reliability rating (1-10 scale)
- **Bias Detection**: Automatic political bias analysis (Left/Center/Right)
- **Trending Detection**: Identify and highlight trending stories
- **Related Articles**: Cluster articles covering the same story
- **Reading History**: Track reading patterns for personalization
- **Notifications**: Get notified when followed authors publish new content
- **Cookie-based Identity**: No login required - uses secure cookie tracking
- **Responsive Design**: Mobile-first design that works on all devices

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (serverless)
- **Database**: Supabase (PostgreSQL)
- **AI**: Anthropic Claude API
- **Deployment**: Vercel
- **State Management**: React Hooks + localStorage
- **Styling**: Tailwind CSS with dark mode support

## Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)
- Anthropic API key (for AI summaries)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Copy the contents of `supabase-schema.sql` and execute it
4. This will create all necessary tables, indexes, and triggers
5. Get your project URL and anon key from Settings > API

### 3. Configure Environment Variables

Update `.env.local` with your credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Anthropic API Configuration
ANTHROPIC_API_KEY=your-anthropic-api-key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

### 5. Populate with News Articles

Use the API endpoint to add articles:

```bash
curl -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Example Article Title",
    "url": "https://example.com/article",
    "author_name": "John Doe",
    "source": "Example News",
    "content_snippet": "This is the article content...",
    "published_at": "2024-01-01T12:00:00Z"
  }'
```

## Deployment to Vercel

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Add environment variables
4. Deploy

## Project Structure

```
Pheme/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   └── */              # Pages
├── components/          # React components
├── lib/                # Utilities and clients
├── supabase-schema.sql # Database schema
└── .env.local          # Environment variables
```

## License

MIT
