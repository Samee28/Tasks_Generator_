# Testing

## Quick Setup

```bash
npm install
cp .env.example .env.local
```

Edit `.env.local`:
```
GROQ_API_KEY=your_groq_key_here
LLM_PROVIDER=groq
GROQ_MODEL=llama-3.3-70b-versatile
```

Run:
```bash
npm run dev
```

## Checklist

- Home page loads and form is visible
- Sample buttons load form data
- Submitting with empty fields shows error
- Submitting with valid data returns tasks
- Edit mode text is clear and readable
- Add Story / Add Task works
- Export buttons download files
- Status page loads at `/status`
