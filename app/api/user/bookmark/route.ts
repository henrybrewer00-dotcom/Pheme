import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { articleId, userId, tags, notes } = body;

    if (!articleId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if already bookmarked
    const { data: existing } = await supabase
      .from('user_bookmarks')
      .select('id')
      .eq('article_id', articleId)
      .eq('user_cookie_id', userId)
      .single();

    if (existing) {
      // Update existing bookmark
      const { data: bookmark, error } = await supabase
        .from('user_bookmarks')
        .update({
          tags: tags || null,
          notes: notes || null,
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating bookmark:', error);
        return NextResponse.json(
          { error: 'Failed to update bookmark' },
          { status: 500 }
        );
      }

      return NextResponse.json({ bookmark });
    }

    // Create new bookmark
    const { data: bookmark, error } = await supabase
      .from('user_bookmarks')
      .insert({
        article_id: articleId,
        user_cookie_id: userId,
        tags: tags || null,
        notes: notes || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating bookmark:', error);
      return NextResponse.json(
        { error: 'Failed to create bookmark' },
        { status: 500 }
      );
    }

    return NextResponse.json({ bookmark }, { status: 201 });
  } catch (error) {
    console.error('Error in bookmark API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const articleId = searchParams.get('articleId');
    const userId = searchParams.get('userId');

    if (!articleId || !userId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('user_bookmarks')
      .delete()
      .eq('article_id', articleId)
      .eq('user_cookie_id', userId);

    if (error) {
      console.error('Error deleting bookmark:', error);
      return NextResponse.json(
        { error: 'Failed to remove bookmark' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in bookmark DELETE:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    const { data: bookmarks, error } = await supabase
      .from('user_bookmarks')
      .select(`
        *,
        article:articles(
          *,
          author:authors(*)
        )
      `)
      .eq('user_cookie_id', userId)
      .order('bookmarked_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookmarks:', error);
      return NextResponse.json(
        { error: 'Failed to fetch bookmarks' },
        { status: 500 }
      );
    }

    return NextResponse.json({ bookmarks: bookmarks || [] });
  } catch (error) {
    console.error('Error in bookmark GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
