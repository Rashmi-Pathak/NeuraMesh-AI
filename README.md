# NeuraMesh AI Research Studio

![NeuraMesh AI](https://img.shields.io/badge/AI-Powered-purple) ![Groq](https://img.shields.io/badge/Groq-API-orange) ![React](https://img.shields.io/badge/React-18-blue) ![Status](https://img.shields.io/badge/Status-Production-green)

**NeuraMesh AI Research Studio** is an advanced, multi-agent research platform designed to help you analyze complex topics, brainstorm ideas, and interact with your proprietary documents. It utilizes a swarm of specialized AI agents working in parallel to provide balanced, deeply analyzed, and actionable insights.

---

## 🌟 Key Features

- **🚀 Ultra-Fast Agent Swarm**: Powered by the Groq API (`groq/compound-mini`), 6 specialized AI agents analyze your queries simultaneously for lightning-fast results.
- **📚 Knowledge Base & Document Chat**: Upload `.txt` and `.csv` files natively in your browser. Chat directly with your data using the dedicated Document Q&A interface.
- **🧠 Conversational Memory**: The platform remembers your chat history, allowing for fluid, continuous, and natural follow-up conversations.
- **🎯 Dynamic Follow-Ups**: The AI automatically generates highly relevant follow-up questions to help you dive deeper into the topic.
- **✨ Strict Bullet-Point Formatting**: Enjoy clean, highly scannable, and structured insights—no massive walls of text or complex tables.
- **🎨 Modern Dark UI**: A beautiful, distraction-free interface built with Tailwind CSS, featuring subtle animations and a sleek layout.

---


## 🗺️ Platform Navigation

NeuraMesh AI Research Studio is divided into distinct hubs, each designed to optimize your workflow:

- **🏠 Dashboard**: The main control center. Enter your research queries, watch the AI swarm work in real-time, and engage in continuous follow-up conversations.
- **🔍 Research Hub**: A dedicated deep-dive area for exploring complex topics and reviewing comprehensive, multi-perspective findings.
- **🌐 Agent Network**: Visualize the underlying AI architecture. See exactly which specialized agents are active and understand their distinct roles.
- **📚 Knowledge Base**: The home for your proprietary data. Upload `.txt` and `.csv` files to securely extract text and chat directly with your own documents via the embedded Document Q&A chatbot.
- **🕒 History**: Your automated research log. Every search and conversation is saved here so you never lose track of a brilliant insight.
- **⭐ Favorites**: A personal bookmarking system for your most critical research outputs, allowing for instant retrieval.

## 🤖 The 6 AI Agents

Each agent has a distinct personality and purpose to ensure a holistic analysis:

### Phase 1: Initial Analysis (Parallel)
1. **📊 Research Agent**
   - Role: Data & Statistics Analyst
   - Focus: Objective facts, trends, and statistics.

2. **💡 Pro Advocate**
   - Role: Opportunity Finder
   - Focus: Benefits, opportunities, and positive outcomes.

3. **😈 Con Advocate**
   - Role: Risk Assessor
   - Focus: Risks, downsides, and potential problems.

### Phase 2: Quality Assurance (Parallel)
4. **🎯 Bias Checker**
   - Role: Critical Analyst
   - Focus: Identifies logical fallacies and cognitive biases in the arguments.

5. **✅ Fact Checker**
   - Role: Truth Verifier
   - Focus: Verifies claims and flags potential misinformation.

### Phase 3: Synthesis
6. **🎓 Synthesizer**
   - Role: Strategic Advisor
   - Focus: Creates the final balanced recommendation and overview, perfectly formatted in clear bullet points.

---

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Shadcn UI
- **AI Backend**: Groq API
- **Models**: `groq/compound-mini` for ultra-fast, multi-agent parallel processing
- **Local Parsing**: Native browser `FileReader` API for instant `.txt` and `.csv` text extraction

---

## 💻 Architecture & Flow

```text
User Query
    ↓
Phase 1: Research, Pro, Con → PARALLEL (Groq API)
    ↓
Phase 2: Bias, Fact Checker → PARALLEL (Groq API)
    ↓
Phase 3: Synthesizer → Final Recommendation
    ↓
Dynamic Contextual Follow-up Generation
    ↓
Seamless UI Display
```

---

## 🛠️ Local Development

### Prerequisites
- Node.js 18+
- npm or yarn
- A valid Groq API Key

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/Rashmi-Pathak/NeuraMesh-AI.git
cd NeuraMesh-AI
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Environment Variables**
Create a `.env` file in the root directory and add your Groq API key:
```env
VITE_GROQ_API_KEY=your_groq_api_key_here
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:8080` to start researching!

---

## 💡 Why NeuraMesh AI?

Traditional decision-making and single-prompt AI chats often suffer from confirmation bias and a lack of diverse perspectives. 

**NeuraMesh AI solves this** by forcing the consideration of both pro and con arguments simultaneously, verifying factual claims with dedicated agents, and allowing you to contextualize everything against your own proprietary documents in the Knowledge Base.

---

## 📝 License

MIT License - feel free to use this for your own projects!
