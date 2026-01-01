import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const { data: authors, error } = await supabase
      .from('authors')
      .select('*')
      .order('followed_count', { ascending: false })
      .order('article_count', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching authors:', error);
      return NextResponse.json(
        { error: 'Failed to fetch authors' },
        { status: 500 }
      );
    }

    return NextResponse.json({ authors: authors || [] });
  } catch (error) {
    console.error('Error in authors API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
