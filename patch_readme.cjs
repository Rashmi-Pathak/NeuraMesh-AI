const fs = require("fs");
let content = fs.readFileSync("README.md", "utf8");

const navSection = `
## 🗺️ Platform Navigation

NeuraMesh AI Research Studio is divided into distinct hubs, each designed to optimize your workflow:

- **🏠 Dashboard**: The main control center. Enter your research queries, watch the AI swarm work in real-time, and engage in continuous follow-up conversations.
- **🔍 Research Hub**: A dedicated deep-dive area for exploring complex topics and reviewing comprehensive, multi-perspective findings.
- **🌐 Agent Network**: Visualize the underlying AI architecture. See exactly which specialized agents are active and understand their distinct roles.
- **📚 Knowledge Base**: The home for your proprietary data. Upload \`.txt\` and \`.csv\` files to securely extract text and chat directly with your own documents via the embedded Document Q&A chatbot.
- **🕒 History**: Your automated research log. Every search and conversation is saved here so you never lose track of a brilliant insight.
- **⭐ Favorites**: A personal bookmarking system for your most critical research outputs, allowing for instant retrieval.
`;

content = content.replace(/## 🤖 The 6 AI Agents/, navSection + "\n## 🤖 The 6 AI Agents");

fs.writeFileSync("README.md", content);
