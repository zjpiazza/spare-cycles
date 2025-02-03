import { NextResponse } from 'next/server';
import { getOpenAIClient } from '@/lib/openai';

export const dynamic = 'force-dynamic';  // Prevent static optimization
export const runtime = 'edge';  // Optional: Use edge runtime

export async function GET() {
  try {
    const openai = getOpenAIClient();
    const models = await openai.models.list();
    return NextResponse.json(models.data);
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'There was an error fetching models' },
      { status: 500 }
    );
  }
}