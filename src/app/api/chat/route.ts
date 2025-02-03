import { getOpenAIClient } from '@/lib/openai';

// Enable edge runtime
export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const openai = getOpenAIClient();
    const body = await request.json();
    const { messages, model } = body;
    
    const stream = await openai.chat.completions.create({
      messages,
      model: model,
      stream: true,
    });

    // Create a ReadableStream from the OpenAI stream
    const textStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || '';
          if (text) {
            controller.enqueue(new TextEncoder().encode(text));
          }
        }
        controller.close();
      },
    });

    // Return the stream with the appropriate headers
    return new Response(textStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
    
  } catch (error) {
    console.error('OpenAI API error:', error);
    return new Response(
      JSON.stringify({ error: 'There was an error processing your request' }), 
      { status: 500 }
    );
  }
} 