import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const feedType = searchParams.get('feed') || 'all';
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('articles')
      .select(`
        *,
        author:authors(*)
      `)
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters based on feed type
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
