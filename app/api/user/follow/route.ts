import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { authorId, userId } = body;

    if (!authorId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if already following
    const { data: existing } = await supabase
      .from('user_follows')
      .select('id')
      .eq('author_id', authorId)
      .eq('user_cookie_id', userId)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Already following this author', follow: existing },
        { status: 409 }
      );
    }

    // Create follow record
    const { data: follow, error } = await supabase
      .from('user_follows')
      .insert({
        author_id: authorId,
        user_cookie_id: userId,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating follow:', error);
      return NextResponse.json(
        { error: 'Failed to follow author' },
        { status: 500 }
      );
    }

    return NextResponse.json({ follow }, { status: 201 });
  } catch (error) {
    console.error('Error in follow API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const authorId = searchParams.get('authorId');
    const userId = searchParams.get('userId');

    if (!authorId || !userId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('user_follows')
      .delete()
      .eq('author_id', authorId)
      .eq('user_cookie_id', userId);

    if (error) {
      console.error('Error deleting follow:', error);
      return NextResponse.json(
        { error: 'Failed to unfollow author' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in follow DELETE:', error);
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

    const { data: follows, error } = await supabase
      .from('user_follows')
      .select(`
        *,
        author:authors(*)
      `)
      .eq('user_cookie_id', userId)
      .order('followed_at', { ascending: false });

    if (error) {
      console.error('Error fetching follows:', error);
      return NextResponse.json(
        { error: 'Failed to fetch followed authors' },
        { status: 500 }
      );
    }

    return NextResponse.json({ follows: follows || [] });
  } catch (error) {
    console.error('Error in follow GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
