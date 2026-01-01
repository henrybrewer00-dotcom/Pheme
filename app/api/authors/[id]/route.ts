import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch author
    const { data: author, error: authorError } = await supabase
      .from('authors')
      .select('*')
      .eq('id', id)
      .single();

    if (authorError || !author) {
      return NextResponse.json(
        { error: 'Author not found' },
        { status: 404 }
      );
    }

    // Fetch author's articles
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('*')
      .eq('author_id', id)
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .limit(50);

    if (articlesError) {
      console.error('Error fetching author articles:', articlesError);
    }

    return NextResponse.json({
      author,
      articles: articles || [],
    });
  } catch (error) {
    console.error('Error fetching author:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
