import Anthropic from '@anthropic-ai/sdk';

const apiKey = process.env.ANTHROPIC_API_KEY;

if (!apiKey) {
  throw new Error('Missing ANTHROPIC_API_KEY environment variable');
}

export const anthropic = new Anthropic({
  apiKey,
});

export async function generateSummary(
  title: string,
  content: string
): Promise<string> {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: `Generate a concise 2-3 sentence summary of this news article. Focus on the key facts and main points.

Title: ${title}

Content: ${content}

Provide only the summary, no preamble or additional commentary.`,
        },
      ],
    });

    const textContent = response.content.find((block) => block.type === 'text');
    if (textContent && textContent.type === 'text') {
      return textContent.text;
    }

    return 'Summary not available';
  } catch (error) {
    console.error('Error generating summary:', error);
    return 'Summary generation failed';
  }
}

export async function analyzeBias(
  title: string,
  content: string,
  source: string
): Promise<string> {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 50,
      messages: [
        {
          role: 'user',
          content: `Analyze the political bias of this article and respond with ONLY one word: "Left", "Center-Left", "Center", "Center-Right", or "Right".

Title: ${title}
Source: ${source}
Content snippet: ${content.substring(0, 500)}

Respond with only the bias classification, nothing else.`,
        },
      ],
    });

    const textContent = response.content.find((block) => block.type === 'text');
    if (textContent && textContent.type === 'text') {
      const bias = textContent.text.trim();
      if (['Left', 'Center-Left', 'Center', 'Center-Right', 'Right'].includes(bias)) {
        return bias;
      }
    }

    return 'Unknown';
  } catch (error) {
    console.error('Error analyzing bias:', error);
    return 'Unknown';
  }
}

export async function scoreReliability(source: string): Promise<number> {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 20,
      messages: [
        {
          role: 'user',
          content: `Rate the reliability of this news source on a scale of 1-10, where 10 is most reliable. Consider factors like fact-checking, editorial standards, and journalistic integrity.

Source: ${source}

Respond with ONLY a number between 1 and 10, nothing else.`,
        },
      ],
    });

    const textContent = response.content.find((block) => block.type === 'text');
    if (textContent && textContent.type === 'text') {
      const score = parseFloat(textContent.text.trim());
      if (!isNaN(score) && score >= 1 && score <= 10) {
        return Math.round(score * 10) / 10; // Round to 1 decimal
      }
    }

    return 5.0; // Default neutral score
  } catch (error) {
    console.error('Error scoring reliability:', error);
    return 5.0;
  }
}

export async function extractTopics(
  title: string,
  content: string
): Promise<string[]> {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: `Extract 3-5 main topics/tags from this article. Return them as a comma-separated list.

Title: ${title}
Content: ${content.substring(0, 500)}

Respond with only the topics separated by commas, nothing else.`,
        },
      ],
    });

    const textContent = response.content.find((block) => block.type === 'text');
    if (textContent && textContent.type === 'text') {
      return textContent.text
        .split(',')
        .map((topic) => topic.trim())
        .filter((topic) => topic.length > 0);
    }

    return [];
  } catch (error) {
    console.error('Error extracting topics:', error);
    return [];
  }
}

export async function analyzePersonalization(
  readArticles: Array<{ title: string; content: string }>,
  targetArticle: { title: string; content: string }
): Promise<number> {
  try {
    if (readArticles.length === 0) {
      return 0.5; // Neutral score if no history
    }

    const recentArticles = readArticles.slice(-10); // Use last 10 articles
    const articleSummaries = recentArticles
      .map((a) => `- ${a.title}`)
      .join('\n');

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 20,
      messages: [
        {
          role: 'user',
          content: `Based on a user's reading history, rate how relevant this new article would be to them on a scale of 0-1, where 1 is highly relevant.

Reading History:
${articleSummaries}

New Article: ${targetArticle.title}

Respond with ONLY a decimal number between 0 and 1, nothing else.`,
        },
      ],
    });

    const textContent = response.content.find((block) => block.type === 'text');
    if (textContent && textContent.type === 'text') {
      const score = parseFloat(textContent.text.trim());
      if (!isNaN(score) && score >= 0 && score <= 1) {
        return score;
      }
    }

    return 0.5;
  } catch (error) {
    console.error('Error analyzing personalization:', error);
    return 0.5;
  }
}
