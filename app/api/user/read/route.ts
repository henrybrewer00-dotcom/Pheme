import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { articleId, userId, readDuration } = body;

    if (!articleId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if read already exists
    const { data: existing } = await supabase
      .from('user_reads')
      .select('id')
      .eq('article_id', articleId)
      .eq('user_cookie_id', userId)
      .single();

    if (existing) {
      // Update read duration if provided
      if (readDuration !== undefined) {
        const { error } = await supabase
          .from('user_reads')
          .update({ read_duration: readDuration })
          .eq('id', existing.id);

        if (error) {
          console.error('Error updating read:', error);
        }
      }

      return NextResponse.json({ read: existing });
    }

    // Create new read record
    const { data: read, error } = await supabase
      .from('user_reads')
      .insert({
        article_id: articleId,
        user_cookie_id: userId,
        read_duration: readDuration || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating read record:', error);
      return NextResponse.json(
        { error: 'Failed to record read' },
        { status: 500 }
      );
    }

    return NextResponse.json({ read }, { status: 201 });
  } catch (error) {
    console.error('Error in read API:', error);
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

    const { data: reads, error } = await supabase
      .from('user_reads')
      .select(`
        *,
        article:articles(*)
      `)
      .eq('user_cookie_id', userId)
      .order('read_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching reads:', error);
      return NextResponse.json(
        { error: 'Failed to fetch reading history' },
        { status: 500 }
      );
    }

    return NextResponse.json({ reads: reads || [] });
  } catch (error) {
    console.error('Error in read GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
