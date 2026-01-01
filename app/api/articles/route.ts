import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const feedType = searchParams.get('feed') || 'all';
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Handle different feed types with different queries
    if (feedType === 'bookmarked') {
      // Get bookmarked articles for this user
      if (!userId) {
        return NextResponse.json({ articles: [] });
      }

      const { data: bookmarks, error: bookmarksError } = await supabase
        .from('user_bookmarks')
        .select(`
          article_id,
          articles (
            *,
            author:authors(*)
          )
        `)
        .eq('user_cookie_id', userId)
        .order('bookmarked_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (bookmarksError) {
        console.error('Error fetching bookmarks:', bookmarksError);
        return NextResponse.json({ error: 'Failed to fetch bookmarks' }, { status: 500 });
      }

      const articles = bookmarks?.map((b: any) => b.articles).filter(Boolean) || [];
      return NextResponse.json({ articles });
    }

    if (feedType === 'followed') {
      // Get articles from followed authors
      if (!userId) {
        return NextResponse.json({ articles: [] });
      }

      // First get followed author IDs
      const { data: follows } = await supabase
        .from('user_follows')
        .select('author_id')
        .eq('user_cookie_id', userId);

      const authorIds = follows?.map((f: any) => f.author_id) || [];

      if (authorIds.length === 0) {
        return NextResponse.json({ articles: [] });
      }

      const { data: articles, error } = await supabase
        .from('articles')
        .select(`
          *,
          author:authors(*)
        `)
        .in('author_id', authorIds)
        .order('published_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching followed articles:', error);
        return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
      }

      return NextResponse.json({ articles: articles || [] });
    }

    if (feedType === 'personalized') {
      // Get personalized articles based on reading history
      if (!userId) {
        // If no user ID, just return all articles
        const { data: articles, error } = await supabase
          .from('articles')
          .select(`
            *,
            author:authors(*)
          `)
          .order('published_at', { ascending: false, nullsFirst: false })
          .range(offset, offset + limit - 1);

        return NextResponse.json({ articles: articles || [] });
      }

      // Get user's reading history to understand preferences
      const { data: reads } = await supabase
        .from('user_reads')
        .select('article_id')
        .eq('user_cookie_id', userId)
        .order('read_at', { ascending: false })
        .limit(20);

      const readArticleIds = reads?.map((r: any) => r.article_id) || [];

      // For now, show articles they haven't read yet, prioritizing same authors/sources
      let query = supabase
        .from('articles')
        .select(`
          *,
          author:authors(*)
        `)
        .order('published_at', { ascending: false, nullsFirst: false });

      // Exclude already read articles
      if (readArticleIds.length > 0) {
        query = query.not('id', 'in', `(${readArticleIds.join(',')})`);
      }

      const { data: articles, error } = await query.range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching personalized articles:', error);
        return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
      }

      return NextResponse.json({ articles: articles || [] });
    }

    // Default query for 'all' and 'trending'
    let query = supabase
      .from('articles')
      .select(`
        *,
        author:authors(*)
      `)
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply trending filter
    if (feedType === 'trending') {
      query = query.eq('is_trending', true);
    }

    const { data: articles, error } = await query;

    if (error) {
      console.error('Error fetching articles:', error);
      return NextResponse.json(
        { error: 'Failed to fetch articles' },
        { status: 500 }
      );
    }

    return NextResponse.json({ articles: articles || [] });
  } catch (error) {
    console.error('Error in articles API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      url,
      summary,
      author_name,
      source,
      published_at,
      reliability_score,
      bias_score,
      content_snippet,
      image_url,
      category,
    } = body;

    // Check if article already exists
    const { data: existing } = await supabase
      .from('articles')
      .select('id')
      .eq('url', url)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Article already exists', id: existing.id },
        { status: 409 }
      );
    }

    // Find or create author
    let authorId = null;
    if (author_name) {
      const normalized = author_name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const { data: author } = await supabase
        .from('authors')
        .select('id')
        .eq('normalized_name', normalized)
        .single();

      if (author) {
        authorId = author.id;
      } else {
        // Create new author
        const { data: newAuthor } = await supabase
          .from('authors')
          .insert({
            name: author_name,
            normalized_name: normalized,
          })
          .select('id')
          .single();

        if (newAuthor) {
          authorId = newAuthor.id;
        }
      }
    }

    // Insert article
    const { data: article, error } = await supabase
      .from('articles')
      .insert({
        title,
        url,
        summary,
        author_id: authorId,
        author_name,
        source,
        published_at: published_at || new Date().toISOString(),
        reliability_score,
        bias_score,
        content_snippet,
        image_url,
        category,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating article:', error);
      return NextResponse.json(
        { error: 'Failed to create article' },
        { status: 500 }
      );
    }

    return NextResponse.json({ article }, { status: 201 });
  } catch (error) {
    console.error('Error in articles POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
