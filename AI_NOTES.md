# AI Notes

## What AI Is Used For

- Generates user stories, engineering tasks, and risks
- Response is expected in JSON

## Provider

- **Groq** (default)
- Model: `llama-3.3-70b-versatile`

## Local Setup

Create `.env.local`:
```
GROQ_API_KEY=your_groq_key_here
LLM_PROVIDER=groq
GROQ_MODEL=llama-3.3-70b-versatile
```

## If You Switch Provider

Update `.env.local` with the other provider keys and set `LLM_PROVIDER` accordingly.
