// Using Groq instead of Gemini due to rate limits
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export interface AgentConfig {
  name: string;
  role: string;
  icon: string;
  model: string;
  color: string;
  systemPrompt: string;
}

export const agents: AgentConfig[] = [
  {
    name: "Research Agent",
    role: "Data & Statistics Analyst",
    icon: "Search",
    model: "groq/compound-mini",
    color: "#22c55e",
    systemPrompt: "You are analytical, data-driven, and objective. Focus ONLY on numbers, statistics, trends, and verifiable facts. No opinions. Provide your analysis in clean, concise bullet points.",
  },
  {
    name: "Pro Advocate",
    role: "Opportunity Finder",
    icon: "ThumbsUp",
    model: "groq/compound-mini",
    color: "#3b82f6",
    systemPrompt: "You are optimistic and opportunity-focused. Build the STRONGEST case FOR this decision. Highlight benefits and positive outcomes. Provide your analysis in clean, concise bullet points.",
  },
  {
    name: "Con Advocate",
    role: "Risk Assessor",
    icon: "ThumbsDown",
    model: "groq/compound-mini",
    color: "#ef4444",
    systemPrompt: "You are cautious and risk-aware. Identify EVERY potential problem, downside, and risk. Be the voice of caution. Provide your analysis in clean, concise bullet points.",
  },
  {
    name: "Fact Checker",
    role: "Truth Verifier",
    icon: "ShieldCheck",
    model: "groq/compound-mini",
    color: "#eab308",
    systemPrompt: "You verify claims from OTHER agents. Identify unverified statements, questionable claims, and potential misinformation. Be specific about WHICH claims need verification. Provide your analysis in clean, concise bullet points.",
  },
  {
    name: "Bias Checker",
    role: "Critical Analyst",
    icon: "Scale",
    model: "groq/compound-mini",
    color: "#6366f1",
    systemPrompt: "You analyze OTHER agents' arguments. Identify logical fallacies, confirmation bias, overconfidence, and weak reasoning. Be specific about WHICH agent said WHAT. Provide your analysis in clean, concise bullet points.",
  },
  {
    name: "Synthesizer",
    role: "Strategic Advisor",
    icon: "Cpu",
    model: "groq/compound-mini",
    color: "#06b6d4",
    systemPrompt: "You are the Chief Analyst. Your job is to provide highly structured, comprehensive answers. You MUST format all of your answers as clean, concise bullet points. Do not use tables, long paragraphs, or overly complex formatting. Just clear, organized bullet points.",
  },
];

export async function callAI(agent: AgentConfig, query: string, context: string = ""): Promise<string> {
  if (!GROQ_API_KEY) {
    throw new Error('VITE_GROQ_API_KEY not configured in .env');
  }

  const userPrompt = context ? `Query: ${query}\n\nConversation History/Context:\n${context}` : query;

  const response = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: agent.model,
      messages: [
        { role: "system", content: agent.systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    let errorMsg = response.statusText;
    try {
      const errorData = await response.json();
      errorMsg = errorData.error?.message || errorMsg;
    } catch (e) {}
    console.error(`${agent.name} AI error:`, errorMsg);
    throw new Error(`API Error: ${errorMsg}`);
  }

  const data = await response.json();
  if (!data.choices || data.choices.length === 0) {
    return "No response generated.";
  }
  let content = data.choices[0].message.content;
  content = content.split('</think>').pop().trim();
  return content;
}

















