import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import {
  generateSummary,
  analyzeBias,
  scoreReliability,
} from '@/lib/anthropic/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { articleId, title, content, source } = body;

    if (!articleId || !title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate summary, bias, and reliability score in parallel
    const [summary, bias, reliability] = await Promise.all([
      generateSummary(title, content),
      analyzeBias(title, content, source || ''),
      scoreReliability(source || ''),
    ]);

    // Update article with generated data
    const { data: article, error } = await supabase
      .from('articles')
      .update({
        summary,
        bias_score: bias,
        reliability_score: reliability,
      })
      .eq('id', articleId)
      .select()
      .single();

    if (error) {
      console.error('Error updating article:', error);
      return NextResponse.json(
        { error: 'Failed to update article' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      summary,
      bias,
      reliability,
      article,
    });
  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
