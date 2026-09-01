const fs = require("fs");
let content = fs.readFileSync("src/pages/Index.tsx", "utf8");

// 1. Add state for dynamicSuggestions and isSuggestionsLoading
content = content.replace(/const \[followUpMessages, setFollowUpMessages\] = useState[^\n]+;/, 
`const [followUpMessages, setFollowUpMessages] = useState<{sender: "user" | "ai", text: string}[]>([]);
  const [dynamicSuggestions, setDynamicSuggestions] = useState<string[]>([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  
  const generateSuggestions = async (contextQuery: string, answer: string) => {
    setIsSuggestionsLoading(true);
    try {
      const p = \`Based on this topic: "\${contextQuery}" and this answer: "\${answer}", generate exactly 3 short, relevant follow-up questions. Return ONLY the 3 questions separated by newlines, no bullet points, no numbering.\`;
      const sAgent = { ...agents[5], systemPrompt: "You are a helpful assistant. Output exactly 3 questions separated by newlines only." };
      const res = await callAI(sAgent, p);
      const suggestions = res.split("\\n").map(s => s.replace(/^[-*0-9.)\\s]+/, "").trim()).filter(s => s.length > 5).slice(0, 3);
      if (suggestions.length >= 2) setDynamicSuggestions(suggestions);
      else setDynamicSuggestions(["What are the next steps?", "Can you elaborate?", "Are there any risks?"]);
    } catch (e) {
      setDynamicSuggestions(["What are the next steps?", "Can you elaborate?", "Are there any risks?"]);
    }
    setIsSuggestionsLoading(false);
  };
`);

// 2. Call generateSuggestions at the end of handleAnalyze
content = content.replace(/saveToDb\(searchQuery, finalResult\);\s*setIsProcessing\(false\);/, 
`saveToDb(searchQuery, finalResult);
        setIsProcessing(false);
        generateSuggestions(searchQuery, finalResponse);`);

// 3. Call generateSuggestions at the end of handleFollowUp
content = content.replace(/setFollowUpMessages\(prev => \[\.\.\.prev, \{ sender: .ai., text: response \}\]\);\s*if \(activeChatId && user\) \{/, 
`setFollowUpMessages(prev => [...prev, { sender: 'ai', text: response }]);
        generateSuggestions(followUpQuery, response);
        
        if (activeChatId && user) {`);

// 4. Remove the old static suggestionChips array
content = content.replace(/const suggestionChips = \[\s*"[^"]+",\s*"[^"]+",\s*"[^"]+",\s*"[^"]+"\s*\];/, "");

// 5. Update the UI to use dynamicSuggestions
content = content.replace(/\{suggestionChips\.map\(\(chip, i\)/g, `{dynamicSuggestions.map((chip, i)`);

// 6. Fix the condition to show suggestions even if followUpMessages.length > 0
content = content.replace(/&& followUpMessages\.length === 0 && \(/, `&& (`);

// 7. Add loading skeleton for suggestions
content = content.replace(/<div className="flex flex-wrap gap-2 mb-2">/, 
`<div className="flex flex-wrap gap-2 mb-2">
                     {isSuggestionsLoading && <div className="text-xs text-gray-500 animate-pulse flex items-center h-7">Generating suggestions...</div>}`);

fs.writeFileSync("src/pages/Index.tsx", content);
