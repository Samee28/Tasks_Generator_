import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { goal, users, constraints, template } = await request.json();

    if (!goal || !users || !constraints) {
      return NextResponse.json(
        { error: 'Missing required fields: goal, users, constraints' },
        { status: 400 }
      );
    }

    const provider = process.env.LLM_PROVIDER || 'groq';
    const apiKey = provider === 'groq' ? process.env.GROQ_API_KEY : process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: `LLM API key not configured. Set ${provider === 'groq' ? 'GROQ_API_KEY' : 'OPENAI_API_KEY'} in .env.local` },
        { status: 500 }
      );
    }

    const prompt = `You are a product management and engineering expert. Generate a comprehensive list of user stories and engineering tasks for the following feature:

Goal: ${goal}
Target Users: ${users}
Constraints: ${constraints}
${template ? `Project Type: ${template}` : ''}

Generate the response in the following JSON format:
{
  "userStories": [
    {
      "id": "US-001",
      "title": "User story title",
      "description": "As a [type of user], I want [what], so that [benefit]",
      "priority": "high|medium|low",
      "group": "group_name"
    }
  ],
  "engineeringTasks": [
    {
      "id": "TASK-001",
      "title": "Technical task title",
      "description": "What needs to be implemented",
      "priority": "high|medium|low",
      "group": "group_name",
      "estimatedHours": 4,
      "dependencies": ["TASK-XXX"]
    }
  ],
  "risks": [
    {
      "id": "R-001",
      "title": "Potential risk",
      "description": "Description of the risk",
      "severity": "high|medium|low",
      "mitigation": "How to mitigate this risk"
    }
  ]
}

Ensure the response is valid JSON and includes 5-10 user stories and 8-15 engineering tasks organized into logical groups.`;

    let endpoint, model;
    if (provider === 'groq') {
      endpoint = 'https://api.groq.com/openai/v1/chat/completions';
      model = process.env.GROQ_MODEL || 'mixtral-8x7b-32768';
    } else {
      endpoint = 'https://api.openai.com/v1/chat/completions';
      model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI that generates product requirements and engineering tasks in valid JSON format. Always respond with valid JSON only, no additional text.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error(`${provider.toUpperCase()} API error:`, error);
      return NextResponse.json(
        { error: 'Failed to generate tasks from LLM' },
        { status: response.status }
      );
    }

    const data = await response.json();
    let content = data.choices[0].message.content;

    // Strip markdown code blocks if present
    if (content.includes('```')) {
      content = content.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    }

    // Parse the JSON response
    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse LLM response:', content);
      return NextResponse.json(
        { error: 'Invalid response format from LLM' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: parsedContent,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Task generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
