import { NextResponse } from 'next/server';
import { getOpenAIClient } from '@/lib/openai';


export async function POST(request: Request) {
  try {
    const openai = getOpenAIClient();
    const body = await request.json();
    const { messages, model } = body;
    
    const completion = await openai.chat.completions.create({
      messages,
      model: model,
    });

    return NextResponse.json(completion.choices[0].message);
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(

      { error: 'There was an error processing your request' },
      { status: 500 }
    );
  }
} 