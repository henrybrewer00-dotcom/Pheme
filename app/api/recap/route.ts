import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function GET(request: NextRequest) {
  try {
    // Get articles from the last 24 hours
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const { data: articles, error } = await supabase
      .from('articles')
      .select(`
        *,
        author:authors(*)
      `)
      .gte('created_at', yesterday.toISOString())
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching articles:', error);
      return NextResponse.json(
        { error: 'Failed to fetch articles' },
        { status: 500 }
      );
    }

    if (!articles || articles.length === 0) {
      return NextResponse.json({
        recap: 'No articles found from the last 24 hours.',
        articleCount: 0,
        categories: [],
      });
    }

    // Group articles by category
    const categoryCounts: Record<string, number> = {};
    articles.forEach((article) => {
      const category = article.category || 'Uncategorized';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    // Prepare article summaries for AI
    const articleSummaries = articles.map((article, index) =>
      `${index + 1}. [${article.category || 'General'}] ${article.title}\n   ${article.content_snippet || 'No description available.'}\n   Source: ${article.source}`
    ).join('\n\n');

    // Generate AI summary
    const prompt = `You are an unbiased news analyst. Here are the top news stories from the last 24 hours across various categories including politics, technology, science, health, environment, and more.

Please create a concise, engaging daily news recap that:
1. Summarizes the key themes and developments
2. Highlights the most significant stories
3. Remains completely neutral and unbiased
4. Groups similar stories together
5. Is informative yet brief (about 300-400 words)
6. Includes a mix of all important categories

Articles:
${articleSummaries}

Write the recap in a friendly, conversational tone as if you're giving someone a quick update on what happened yesterday. Start with "Here's what happened in the last 24 hours:" and organize by themes or categories.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const recap = message.content[0].type === 'text' ? message.content[0].text : '';

    return NextResponse.json({
      recap,
      articleCount: articles.length,
      categories: Object.entries(categoryCounts).map(([name, count]) => ({
        name,
        count,
      })),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error generating recap:', error);
    return NextResponse.json(
      { error: 'Failed to generate recap' },
      { status: 500 }
    );
  }
}
