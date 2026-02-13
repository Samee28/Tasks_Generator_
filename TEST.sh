#!/bin/bash

# 🧪 TESTING GUIDE - Tasks Generator LLM Integration

echo "======================================"
echo "📋 Tasks Generator - LLM Testing"
echo "======================================"
echo ""

# Step 1: Check if server is running
echo "🔍 Checking if dev server is running on port 3000..."
curl -s http://localhost:3000/api/status > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Server is running!"
else
    echo "❌ Server is NOT running. Start it with: npm run dev"
    exit 1
fi

echo ""
echo "📊 Current System Status:"
curl -s http://localhost:3000/api/status | jq '.'

echo ""
echo "======================================"
echo "🧪 Testing Task Generation API"
echo "======================================"
echo ""

# Test 1: Empty fields (should fail)
echo "Test 1: Empty fields (should show validation error)"
echo "---"
curl -s -X POST http://localhost:3000/api/generate-tasks \
  -H "Content-Type: application/json" \
  -d '{"goal":"","users":"","constraints":""}' | jq '.error'
echo ""

# Test 2: Valid input but no API key
echo "Test 2: Valid input without API key (expected error)"
echo "---"
curl -s -X POST http://localhost:3000/api/generate-tasks \
  -H "Content-Type: application/json" \
  -d '{
    "goal": "Add dark mode to the app",
    "users": "Users who prefer dark themes",
    "constraints": "Must work on all browsers"
  }' | jq '.error'
echo ""

echo "======================================"
echo "🎯 How to Test with Real LLM:"
echo "======================================"
echo ""
echo "1. Get a FREE Groq API key:"
echo "   🔗 https://console.groq.com/keys"
echo ""
echo "2. Create .env.local file:"
echo "   $ cp .env.example .env.local"
echo ""
echo "3. Add your Groq API key:"
echo "   GROQ_API_KEY=gsk_your_key_here"
echo "   LLM_PROVIDER=groq"
echo ""
echo "4. Restart dev server:"
echo "   $ npm run dev"
echo ""
echo "5. Test with curl:"
echo "   curl -X POST http://localhost:3000/api/generate-tasks \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"goal\":\"Add notifications\",\"users\":\"Mobile users\",\"constraints\":\"2 weeks\"}'"
echo ""
echo "6. Or open the web UI:"
echo "   🌐 http://localhost:3000"
echo "   Fill the form and click 'Generate Tasks & Stories'"
echo ""

echo "======================================"
echo "✨ Form Features:"
echo "======================================"
echo "Required Fields:"
echo "  • 🎯 Feature Goal"
echo "  • 👥 Target Users"
echo "  • ⚡ Constraints"
echo ""
echo "Optional Fields (helps AI generate better tasks):"
echo "  • 📱 Project Type (Mobile/Web/Internal)"
echo "  • ⏰ Timeline"
echo "  • 💰 Budget"
echo "  • 👨‍💼 Team Size"
echo ""

echo "======================================"
echo "🚀 Once LLM is configured:"
echo "======================================"
echo "You'll get:"
echo "  ✅ 5-10 User Stories"
echo "  ✅ 8-15 Engineering Tasks"
echo "  ✅ 2-5 Risk Assessments"
echo "  ✅ Organized by groups"
echo "  ✅ Editable & exportable"
echo ""
