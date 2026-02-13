# Tasks Generator

A simple app that turns a feature idea into user stories, engineering tasks, and risks using AI.

## Features

- Generate user stories, engineering tasks, and risks
- Edit, reorder, delete, and add items
- Export as Markdown or Text
- Save last 5 specs in localStorage

## Quick Start (Local)

1. Install dependencies
   ```bash
   npm install
   ```

2. Add environment variables
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local`:
   ```
   GROQ_API_KEY=your_groq_key_here
   LLM_PROVIDER=groq
   GROQ_MODEL=llama-3.3-70b-versatile
   ```

3. Run the app
   ```bash
   npm run dev
   ```

4. Open
   http://localhost:3000

## Deploy to Vercel

1. Push to GitHub
2. Go to https://vercel.com/new and import the repo
3. Add environment variables
   - `GROQ_API_KEY`
   - `LLM_PROVIDER=groq`
   - `GROQ_MODEL=llama-3.3-70b-versatile`
4. Click Deploy

## How to Use

1. Fill **Feature Goal**, **Target Users**, **Constraints**, and optional **Project Type**
2. Click **Generate Tasks & Stories**
3. Edit items, add new items, or export

## Notes

- `.env.local` is not committed (kept local)
- Data is stored in browser localStorage
