// Deno edge function for multi-agent AI analysis

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AgentConfig {
  name: string;
  role: string;
  icon: string;
  model: string;
  color: string;
  systemPrompt: string;
}

const agents: AgentConfig[] = [
  {
    name: "Research Agent",
    role: "Data & Statistics Analyst",
    icon: "📊",
    model: "google/gemini-2.5-flash",
    color: "blue",
    systemPrompt: "You are analytical, data-driven, and objective. Focus ONLY on numbers, statistics, trends, and verifiable facts. No opinions. Provide your analysis in 3-4 concise sentences.",
  },
  {
    name: "Pro Advocate",
    role: "Opportunity Finder",
    icon: "💡",
    model: "google/gemini-2.5-flash",
    color: "green",
    systemPrompt: "You are optimistic and opportunity-focused. Build the STRONGEST case FOR this decision. Highlight benefits and positive outcomes. Provide your analysis in 3-4 concise sentences.",
  },
  {
    name: "Con Advocate",
    role: "Risk Assessor",
    icon: "😈",
    model: "google/gemini-2.5-flash",
    color: "red",
    systemPrompt: "You are cautious and risk-aware. Identify EVERY potential problem, downside, and risk. Be the voice of caution. Provide your analysis in 3-4 concise sentences.",
  },
  {
    name: "Bias Checker",
    role: "Critical Analyst",
    icon: "🎯",
    model: "google/gemini-2.5-pro",
    color: "yellow",
    systemPrompt: "You analyze OTHER agents' arguments. Identify logical fallacies, confirmation bias, overconfidence, and weak reasoning. Be specific about WHICH agent said WHAT. Provide your analysis in 3-4 concise sentences.",
  },
  {
    name: "Fact Checker",
    role: "Truth Verifier",
    icon: "✅",
    model: "google/gemini-2.5-pro",
    color: "purple",
    systemPrompt: "You verify claims from OTHER agents. Identify unverified statements, questionable claims, and potential misinformation. Be specific about WHICH claims need verification. Provide your analysis in 3-4 concise sentences.",
  },
  {
    name: "Synthesizer",
    role: "Strategic Advisor",
    icon: "🎓",
    model: "google/gemini-2.5-pro",
    color: "pink",
    systemPrompt: `Create a balanced recommendation using this EXACT format:

**Recommendation:** [clear decision]

**Key Reasoning:**
• [point 1]
• [point 2]
• [point 3]

**Action Steps:**
1. [step 1]
2. [step 2]
3. [step 3]

**Confidence Level:** [X/10] - [justification]

**Important Considerations:** [risks/caveats]`,
  },
];

async function callAI(agent: AgentConfig, query: string, context: string = ""): Promise<string> {
  const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
  if (!GEMINI_API_KEY) { throw new Error('GEMINI_API_KEY not configured'); }

  const messages = [
    { role: "system", content: agent.systemPrompt },
    { role: "user", content: context ? `Query: ${query}\n\nContext from other agents:\n${context}` : query }
  ];

  console.log(`${agent.name} calling AI with model: ${agent.model}`);

  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GEMINI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: agent.model,
      messages: messages,
      max_tokens: 600,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`${agent.name} AI error:`, error);
    throw new Error(`AI request failed: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();

    if (!query || typeof query !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processing query:', query);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const sendMessage = (data: any) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        };

        try {
          // Phase 1: Fast agents in parallel (Research, Pro, Con)
          sendMessage({ type: 'status', message: '🚀 Activating agent swarm...' });
          
          const phase1Agents = agents.slice(0, 3);
          const phase1Results = await Promise.all(
            phase1Agents.map(async (agent) => {
              sendMessage({ type: 'status', message: `${agent.icon} ${agent.name} analyzing...` });
              const response = await callAI(agent, query);
              const result = {
                agent: agent.name,
                role: agent.role,
                icon: agent.icon,
                response,
                color: agent.color,
                model: agent.model,
              };
              sendMessage({ type: 'agent_response', data: result });
              return result;
            })
          );

          // Small delay for visual effect
          await new Promise(resolve => setTimeout(resolve, 200));

          // Phase 2: Checker agents in parallel (Bias, Fact)
          sendMessage({ type: 'status', message: '🎯 Checking for biases and verifying facts...' });
          
          const phase1Context = phase1Results
            .map(r => `${r.agent}: ${r.response}`)
            .join('\n\n');

          const phase2Agents = agents.slice(3, 5);
          const phase2Results = await Promise.all(
            phase2Agents.map(async (agent) => {
              const response = await callAI(agent, query, phase1Context);
              const result = {
                agent: agent.name,
                role: agent.role,
                icon: agent.icon,
                response,
                color: agent.color,
                model: agent.model,
              };
              sendMessage({ type: 'agent_response', data: result });
              return result;
            })
          );

          await new Promise(resolve => setTimeout(resolve, 200));

          // Phase 3: Synthesizer
          sendMessage({ type: 'status', message: '🎓 Synthesizing final recommendation...' });
          
          const allContext = [...phase1Results, ...phase2Results]
            .map(r => `${r.agent}: ${r.response}`)
            .join('\n\n');

          const synthesizerAgent = agents[5];
          const finalResponse = await callAI(synthesizerAgent, query, allContext);
          
          sendMessage({
            type: 'final_response',
            data: {
              agent: synthesizerAgent.name,
              role: synthesizerAgent.role,
              icon: synthesizerAgent.icon,
              response: finalResponse,
              model: synthesizerAgent.model,
            },
          });

          sendMessage({ type: 'complete', message: '✅ Analysis complete!' });
          controller.close();

        } catch (error) {
          console.error('Error in analysis:', error);
          sendMessage({ 
            type: 'error', 
            message: error instanceof Error ? error.message : 'Analysis failed' 
          });
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

