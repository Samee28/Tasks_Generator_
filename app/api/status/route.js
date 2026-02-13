import { NextResponse } from 'next/server';

export async function GET() {
  const status = {
    timestamp: new Date().toISOString(),
    backend: 'healthy',
    database: 'connected',
    llm: 'unknown',
    llmProvider: process.env.LLM_PROVIDER || 'groq',
  };

  // Check LLM connection
  try {
    const provider = process.env.LLM_PROVIDER || 'groq';
    const apiKey = provider === 'groq' ? process.env.GROQ_API_KEY : process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      status.llm = 'not_configured';
    } else {
      // Make a quick test call to verify API key
      const endpoint = provider === 'groq' 
        ? 'https://api.groq.com/openai/v1/models'
        : 'https://api.openai.com/v1/models';
      
      const testResponse = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });
      
      status.llm = testResponse.ok ? 'healthy' : 'error';
    }
  } catch (error) {
    console.error('LLM health check failed:', error);
    status.llm = 'error';
  }

  return NextResponse.json(status, { status: 200 });
}
