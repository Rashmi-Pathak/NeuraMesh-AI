import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, recommendation } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating follow-up questions for query:", query.slice(0, 50));

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a research assistant that generates insightful follow-up questions. Based on the user's original question and the analysis provided, suggest exactly 3 follow-up questions that would help them explore the topic more deeply. Each question should be specific, actionable, and directly related to the analysis. Return ONLY a JSON array of 3 question strings, no other text.`
          },
          {
            role: "user",
            content: `Original Question: ${query}\n\nAnalysis Summary: ${recommendation.slice(0, 1000)}\n\nGenerate 3 follow-up questions as a JSON array.`
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    console.log("AI Response:", content);

    // Parse the JSON array from the response
    let followUps: string[];
    try {
      // Try to extract JSON array from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        followUps = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: split by newlines and clean up
        followUps = content
          .split('\n')
          .filter((line: string) => line.trim().length > 10)
          .slice(0, 3)
          .map((line: string) => line.replace(/^[\d\.\-\*]+\s*/, '').trim());
      }
    } catch (parseError) {
      console.error("Failed to parse follow-ups:", parseError);
      followUps = [
        "What are the main risks I should consider?",
        "What timeline would be realistic for this decision?",
        "What resources or skills do I need to succeed?"
      ];
    }

    // Ensure we have exactly 3 questions
    followUps = followUps.slice(0, 3);
    while (followUps.length < 3) {
      followUps.push("What else should I consider before making this decision?");
    }

    return new Response(JSON.stringify({ followUps }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error generating follow-ups:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        followUps: [
          "What are the potential risks involved?",
          "What timeline should I consider?",
          "What resources do I need to get started?"
        ]
      }),
      {
        status: 200, // Return 200 with fallback questions
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
