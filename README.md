# 📋 Tasks Generator - AI-Powered Planning Tool

A modern web app that transforms feature ideas into actionable user stories, engineering tasks, and risk assessments using AI.

## ✨ Features

- **Smart Task Generation**: Fill a simple form → AI generates comprehensive user stories & engineering tasks
- **Fast & Cheap**: Uses Groq API (10x cheaper, 3x faster than OpenAI)
- **Interactive Editing**: Edit, reorder, and group tasks with an intuitive UI
- **Multiple Export Formats**: Download as Markdown or Text for easy sharing
- **Project Templates**: Pre-configured templates for Mobile Apps, Web Apps, Internal Tools, and APIs
- **Risk Identification**: AI identifies potential risks and suggests mitigation strategies
- **Recent Specs History**: View and manage your last 5 generated specs
- **Health Status Page**: Monitor backend, database, and LLM connection status
- **Modern & Responsive**: Beautiful Tailwind CSS design that works on mobile and desktop

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (for local development)
- Groq API key (free from https://console.groq.com/keys) OR OpenAI API key

### Installation & Running Locally

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tasks_generator_app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your Groq API key (recommended):
   ```
   GROQ_API_KEY=gsk_...your_groq_key...
   LLM_PROVIDER=groq
   GROQ_MODEL=llama-3.3-70b-versatile
   ```
   
   Or use OpenAI instead:
   ```
   OPENAI_API_KEY=sk_...your_openai_key...
   LLM_PROVIDER=openai
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to http://localhost:3000

### Production Deployment (Vercel)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com/new
   - Select "Next.js" and import your repository
   - Add environment variables:
     - `GROQ_API_KEY`: Your Groq API key (from https://console.groq.com/keys)
     - `LLM_PROVIDER`: Set to `groq`
   - Or use OpenAI:
     - `OPENAI_API_KEY`: Your OpenAI API key
     - `LLM_PROVIDER`: Set to `openai`
   - Click Deploy

3. **Access your app**
   Your app will be live at: `https://your-project.vercel.app`

## 📖 How to Use

### Creating a Spec

1. **Fill the form** with:
   - **Feature Goal**: What you want to build
   - **Target Users**: Who will use it
   - **Constraints**: Limitations, technical requirements, etc.
   - **Project Type** (optional): Mobile App, Web App, Internal Tool, or API

2. **Click "Generate Tasks & Stories"** and wait for AI to process

3. **AI generates**:
   - User stories (what users need)
   - Engineering tasks (technical implementation)
   - Risks & unknowns (potential issues)

### Editing & Exporting

- **Edit items**: Click "Edit" on any item to modify it
- **Reorder**: Use ↑ ↓ buttons to reorder items
- **Delete**: Click "Delete" to remove items
- **Filter by group**: Use the group dropdown to organize items
- **Export**: 
  - Copy to clipboard (Markdown)
  - Download as Markdown file
  - Download as Text file

### Viewing History

Recent specs appear on the right side. Click any to view, edit, or export it again.

## 🏗️ Project Structure

```
app/
├── api/
│   ├── generate-tasks/route.js    # Main task generation endpoint
│   └── status/route.js             # Health check endpoint
├── components/
│   ├── TaskGeneratorForm.js        # Input form component
│   ├── TasksDisplay.js             # Modal for viewing & editing tasks
│   └── RecentSpecs.js              # Recent specs list
├── lib/
│   └── storage.js                  # Local storage utilities
├── status/
│   └── page.js                     # Status/health page
├── page.js                          # Home page
└── layout.js                        # Root layout
```

## 📊 What's Included

✅ **Fully functional**: Generate, edit, export tasks
✅ **AI-powered**: Uses OpenAI GPT-3.5 for task generation
✅ **Modern UI**: Tailwind CSS, responsive design
✅ **No database needed**: localStorage for persistence
✅ **Easy deployment**: One-click Vercel deployment
✅ **Health monitoring**: Status page for API health

## ⚠️ What's Not Included (Future Features)

- Real-time collaboration
- User authentication & multi-user support
- Cloud database for specs persistence
- Mobile native apps
- Integration with project management tools (Jira, Linear, etc.)
- Advanced analytics & reporting
- Custom LLM model fine-tuning

## 🔧 Configuration

### Environment Variables

Create `.env.local` (not committed to git):

**Option 1: Groq (RECOMMENDED - free & fast)**
```
GROQ_API_KEY=gsk_...
LLM_PROVIDER=groq
GROQ_MODEL=llama-3.3-70b-versatile
```

**Option 2: OpenAI**
```
OPENAI_API_KEY=sk_...
LLM_PROVIDER=openai
OPENAI_MODEL=gpt-3.5-turbo
```

See `.env.example` for all available options.

**Why Groq?**
- Free API key at https://console.groq.com
- 10x cheaper than OpenAI ($0.27 vs $2.00 per 1M tokens)
- 3x faster (100+ tokens/sec)
- Great for high-volume applications

### Customizing the LLM Prompt

Edit the prompt in `app/api/generate-tasks/route.js` to customize:
- Number of user stories generated
- Task categories and groups
- Risk severity levels
- Template-specific jargon

## 📝 Common Issues

### "LLM API key not configured"
- For Groq: Get free key at https://console.groq.com/keys
- For OpenAI: Get key at https://platform.openai.com/api-keys
- Ensure you've set the correct environment variable in `.env.local`
- Restart the development server after adding the key
- Check that the key is valid

### "Failed to generate tasks"
- Check your API key is valid and has remaining credits
- For Groq: Verify the key starts with `gsk_`
- For OpenAI: Verify the key starts with `sk_`
- Check the browser console for error details
- Try using a different LLM provider

### Tasks don't save
- Browser localStorage might be full
- Try clearing browser cache
- Check browser's developer tools → Application → Local Storage

## 🔐 Security Notes

- **Never commit `.env.local`** - it's in `.gitignore`
- Always use `.env.example` as a template for required variables
- API keys in `.env.local` are server-side only (safe from exposure)
- No sensitive data is stored in localStorage
- Production deployments use Vercel's secure environment variable system

## 📚 Technology Stack

- **Framework**: Next.js 14+ (React)
- **Styling**: Tailwind CSS
- **Storage**: Browser localStorage
- **AI/LLM**: Groq API (Llama 3.3 70B) - Or OpenAI as fallback
- **Hosting**: Vercel
- **Language**: JavaScript (ES6+)

## 🎯 Performance

- **Page load**: < 2 seconds
- **Task generation**: 10-30 seconds (depends on OpenAI API)
- **Editing**: Instant (client-side only)
- **Export**: Instant (no server needed)

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile: iOS Safari, Chrome Android

## 🆘 Support & Feedback

For issues or feature requests, please:
1. Check existing issues in the GitHub repository
2. Create a new issue with clear description
3. Include browser and OS information

## 📄 License

MIT License - Feel free to use and modify

## 🙌 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and create a Pull Request

---

Made with ❤️ | Last Updated: February 2026
