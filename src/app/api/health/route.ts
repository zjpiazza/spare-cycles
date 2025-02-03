export async function GET(request: Request) {
    try {
        const response = await fetch(`${process.env.OPENAI_API_BASE_URL}/models`);
        const data = await response.json();
        
        if (!response.ok || !Array.isArray(data)) {
            throw new Error('Models service unavailable');
        }
        
        return new Response(JSON.stringify({ 
            message: 'Service is online',
            models: data 
        }), { 
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (err) {
        console.error('Health check failed:', err);
        return new Response(JSON.stringify({ 
            message: 'Service is offline',
            error: err instanceof Error ? err.message : 'Unknown error'
        }), { 
            status: 503,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}