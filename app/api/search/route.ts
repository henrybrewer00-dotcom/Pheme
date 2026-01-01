import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'articles'; // articles, authors, all

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: 'Search query must be at least 2 characters' },
        { status: 400 }
      );
    }

    const searchTerm = `%${query.trim()}%`;
    const results: any = {};

    // Search articles
    if (type === 'articles' || type === 'all') {
      const { data: articles, error: articlesError } = await supabase
        .from('articles')
        .select(`
          *,
          author:authors(*)
        `)
        .or(`title.ilike.${searchTerm},content_snippet.ilike.${searchTerm},source.ilike.${searchTerm}`)
        .order('published_at', { ascending: false, nullsFirst: false })
        .limit(50);

      if (!articlesError) {
        results.articles = articles || [];
      }
    }

    // Search authors
    if (type === 'authors' || type === 'all') {
      const { data: authors, error: authorsError } = await supabase
        .from('authors')
        .select('*')
        .or(`name.ilike.${searchTerm},bio.ilike.${searchTerm}`)
        .order('followed_count', { ascending: false })
        .limit(20);

      if (!authorsError) {
        results.authors = authors || [];
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error in search API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
