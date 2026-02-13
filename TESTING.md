## ✅ Testing Checklist - Tasks Generator App

### 📦 Before Testing

```bash
# 1. Install dependencies
npm install

# 2. Get free API key
# Go to: https://console.groq.com/keys
# Copy your API key (starts with gsk_)

# 3. Create .env.local
cp .env.example .env.local

# 4. Add your Groq API key to .env.local
echo "GROQ_API_KEY=gsk_your_key_here" >> .env.local
echo "LLM_PROVIDER=groq" >> .env.local
```

### 🚀 Run the App

```bash
npm run dev
# Visit: http://localhost:3000
```

### 🧪 Test Cases

#### Test 1: Form Visibility ✅
**What to check:**
- [ ] Labels are large and bold (feature goal, users, constraints, project type)
- [ ] Input boxes are large with visible borders
- [ ] Each field has an emoji icon
- [ ] Project Type field shows 4 template options
- [ ] Sample data buttons appear below the form
- [ ] Font sizes are comfortable to read
- [ ] Submit button has gradient color and emoji

**Expected Result:**
- All text should be clearly readable
- Large fonts (not tiny)
- Emojis help identify each field

---

#### Test 2: Error Messages ✅
**What to check:**
- [ ] Leave all fields empty and click submit
- [ ] Error should appear with:
  - 🚨 Red background (bright red-600)
  - White bold text (large font)
  - Clear message: "Missing required fields..."

**Expected Result:**
```
🚨 Please enter a feature goal
```
(Red background, white text, large and bold)

---

#### Test 3: LLM Configuration Check
**What to check:**
- [ ] Visit: http://localhost:3000/status
- [ ] Check "LLM API" status

**Without .env.local:**
```
LLM API: ⚠️ Not Configured
Status: not_configured
Provider: groq
```

**With .env.local (correct key):**
```
LLM API: ✅ Connected
Status: healthy
Provider: groq
```

**With wrong/expired key:**
```
LLM API: ❌ Error
Status: error
Provider: groq
```

---

#### Test 4: Form Submission - No API Key
**What to check:**
- [ ] Fill form with test data:
  - Goal: "Add dark mode theme"
  - Users: "Desktop users who prefer dark"
  - Constraints: "2 week deadline"
- [ ] Leave optional fields empty (they're optional!)
- [ ] Click "Generate Tasks & Stories"

**Expected Result:**
```
🚨 LLM API key not configured. Set GROQ_API_KEY in .env.local
```
(Large red error message)

---

#### Test 5: Form Submission - With API Key ✅
**Prerequisites:**
- [ ] Groq API key is set in .env.local
- [ ] Restarted dev server (`npm run dev`)

**What to check:**
- [ ] Fill form again:
  ```
  Goal: "Add push notifications to our app"
  Users: "Mobile and web users"
  Constraints: "Must be simple, 1 week deadline"
  Timeline: "1 week"
  Budget: "$2000"
  Team Size: "2 developers"
  Project Type: "Mobile App"
  ```
- [ ] Click "Generate Tasks & Stories"
- [ ] Wait 30-45 seconds (UI shows: ⏳ Generating...)

**Expected Result:**
- Modal opens with generated tasks
- Shows:
  - ✅ User Stories (5-10 items)
  - ✅ Engineering Tasks (8-15 items)
  - ✅ Risks & Unknowns (2-5 items)
  - Each with priority, timelines, descriptions

---

#### Test 6: Task Editing Features
**What to check:**
- [ ] Click "Edit" on any user story
- [ ] Modify the description
- [ ] Click "Done" to save
- [ ] Use ↑ ↓ buttons to reorder tasks
- [ ] Click group dropdown to filter by group
- [ ] Click "Delete" to remove a task

**Expected Result:**
- All editing features work smoothly
- Changes are instant (client-side)
- No API calls needed for editing

---

#### Test 7: Export Functions
**What to check:**
- [ ] Click "Copy Markdown" button
- [ ] Paste in text editor to verify format
- [ ] Click "Download Markdown" button
- [ ] Check downloaded file: `task-spec-[timestamp].md`
- [ ] Click "Download Text" button
- [ ] Check downloaded file: `task-spec-[timestamp].txt`

**Expected Result:**
- Markdown format: Proper headings, formatting
- Text format: Clean, readable plain text
- Both include all tasks, risks, metadata

---

#### Test 8: Recent Specs History
**What to check:**
- [ ] Generate first spec successfully
- [ ] Right sidebar shows "Last 5 Generated Specs"
- [ ] Generate second spec
- [ ] Both are listed in history
- [ ] Click on old spec to view it again
- [ ] Click ✕ to delete from history

**Expected Result:**
- All generated specs appear in history
- Max 5 specs stored
- Clicking selects and displays the spec
- Deleting removes from history

---

#### Test 9: Status Page
**What to check:**
- [ ] Visit: http://localhost:3000/status
- [ ] Page shows:
  - Backend: ✅ Healthy
  - Database: ✅ Connected
  - LLM API: Status depends on config
- [ ] Page auto-refreshes every 30 seconds
- [ ] All colors are visible (green ✅, red ❌, yellow ⚠️)

**Expected Result:**
- Status page loads instantly
- All indicators update after 30 seconds
- Clear color coding

---

#### Test 10: Mobile Responsiveness
**What to check:**
- [ ] Open http://localhost:3000 on mobile
- [ ] Form fields should stack vertically
- [ ] Buttons should be large (easy to tap)
- [ ] Modal window should fit screen
- [ ] No horizontal scroll needed

**Expected Result:**
- All features work on mobile
- Text remains readable
- No overflow or layout issues

---

### 🐛 Troubleshooting

**"LLM API key not configured" error?**
1. Copy `.env.example` to `.env.local`
2. Get key from: https://console.groq.com/keys
3. Add to `.env.local`: `GROQ_API_KEY=gsk_...`
4. Restart dev server: `npm run dev`

**"Failed to generate tasks" error?**
1. Check API key is valid and not expired
2. Check you have one request remaining
3. Try status page: http://localhost:3000/status
4. Check browser console for error details

**Fonts too small?**
1. This should be fixed - fonts are now `text-base` and `font-bold`
2. If still small, try refreshing the page
3. Clear browser cache if needed

**Form not working?**
1. Check dev server is running: http://localhost:3000
2. Open browser console (F12) for error messages
3. Restart dev server

---

### 📊 Expected LLM Output Example

```json
{
  "userStories": [
    {
      "id": "US-001",
      "title": "User receives push notification",
      "description": "As a mobile user, I want to receive push notifications about new messages, so that I stay informed",
      "priority": "high",
      "group": "Notifications"
    }
  ],
  "engineeringTasks": [
    {
      "id": "TASK-001",
      "title": "Set up Firebase Cloud Messaging",
      "description": "Configure Firebase Cloud Messaging for iOS and Android",
      "priority": "high",
      "group": "Backend",
      "estimatedHours": 4,
      "dependencies": []
    }
  ],
  "risks": [
    {
      "id": "R-001",
      "title": "Push notification delays",
      "description": "Network latency could cause notifications to be delayed",
      "severity": "medium",
      "mitigation": "Implement retry logic with exponential backoff"
    }
  ]
}
```

---

### ✅ Final Verification

Mark as complete when:
- [ ] Form has large, bold, visible fonts
- [ ] Optional fields (timeline, budget, team size) are present
- [ ] Error messages are bright red with white text
- [ ] Status page shows LLM provider
- [ ] All editing features (reorder, delete, filter) work
- [ ] Export produces valid markdown and text files
- [ ] Recent specs history persists across page reloads
- [ ] Mobile responsiveness is good
- [ ] LLM generates tasks when API key is configured

---

**Last Updated:** February 13, 2026
