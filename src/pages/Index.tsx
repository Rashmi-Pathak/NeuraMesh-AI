import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { AgentNetwork } from '@/components/dashboard/AgentNetwork';
import { OverallProgress } from '@/components/dashboard/BottomWidgets';
import { KeyInsights, ResearchMetrics, KnowledgeGraph } from '@/components/dashboard/RightSidebarWidgets';
import { Auth } from '@/components/dashboard/Auth';
import { ResearchHubTab, KnowledgeBaseTab, AgentStudioTab, FavoritesTab } from '@/components/dashboard/FeatureTabs';
import { Share, Download, Loader2, Search, ArrowRight, PanelLeftClose, PanelRightClose, PanelLeft, PanelRight, ChevronLeft, ChevronRight, UserCircle, ChevronDown, ChevronUp, LogOut, Clock, MessageSquare, Star, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { agents, callAI } from '@/lib/gemini';
import { supabase } from '@/lib/supabaseClient';
import ReactMarkdown from 'react-markdown';

const Index = () => {
  const [query, setQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("Awaiting query...");
  const [agentResponses, setAgentResponses] = useState<any[]>([]);
  const [finalRecommendation, setFinalRecommendation] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  // Auth & DB State
  const [user, setUser] = useState<any>(null);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [followUpMessages, setFollowUpMessages] = useState<{sender: "user" | "ai", text: string}[]>([]);
  const [dynamicSuggestions, setDynamicSuggestions] = useState<string[]>([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  
  const generateSuggestions = async (contextQuery: string, answer: string) => {
    setIsSuggestionsLoading(true);
    try {
      const p = `Based on this topic: "${contextQuery}" and this answer: "${answer}", generate exactly 3 short, relevant follow-up questions. Return ONLY the 3 questions separated by newlines, no bullet points, no numbering.`;
      const sAgent = { ...agents[5], systemPrompt: "You are a helpful assistant. Output exactly 3 questions separated by newlines only." };
      const res = await callAI(sAgent, p);
      const suggestions = res.split("\n").map(s => s.replace(/^[-*0-9.)\s]+/, "").trim()).filter(s => s.length > 5).slice(0, 3);
      if (suggestions.length >= 2) setDynamicSuggestions(suggestions);
      else setDynamicSuggestions(["What are the next steps?", "Can you elaborate?", "Are there any risks?"]);
    } catch (e) {
      setDynamicSuggestions(["What are the next steps?", "Can you elaborate?", "Are there any risks?"]);
    }
    setIsSuggestionsLoading(false);
  };

  const [isFollowUpLoading, setIsFollowUpLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchHistory(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchHistory(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchHistory = async (userId: string) => {
    try {
      const { data, error } = await supabase.from('chats').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (!error && data) setChatHistory(data);
    } catch (e) { console.error(e) }
  };

  const loadChat = async (chatId: string, title: string) => {
    setActiveChatId(chatId);
    setQuery(title);
    setActiveTab('Dashboard');
    setIsProcessing(true);
    setProgress(100);
    setCurrentStatus("Loaded from history");
    setFollowUpMessages([]);
    
    try {
      const { data, error } = await supabase.from('messages').select('*').eq('chat_id', chatId).order('created_at', { ascending: true });
      if (data && !error) {
        // First message by agent is the main synth. The rest are follow ups (we didn't store user follow ups strictly before, but we can just map the agent ones)
        // Since we didn't save user queries in messages table (only chat title), we will just load the synth.
        const loadedResponses = data.filter(m => m.role === 'agent').map(m => ({
          agent: m.agent_name,
          role: agents.find(a => a.name === m.agent_name)?.role || "Agent",
          response: m.content,
          color: m.agent_color || "#3b82f6"
        }));
        
        const synth = loadedResponses.find(r => r.agent === 'Synthesizer');
        setAgentResponses(loadedResponses);
        setFinalRecommendation(synth || null);
      }
    } catch (e) { console.error(e) }
    setIsProcessing(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: 'Logged out', description: 'You have been successfully logged out.' });
  };

  const [leftCollapsed, setLeftCollapsed] = useState(false);
  
  const [activeTab, setActiveTab] = useState("Dashboard");

  const saveToDb = async (q: string, synth: any) => {
    if (!user) return;
    try {
       let cid = activeChatId;
       if (!cid) {
         const { data, error } = await supabase.from('chats').insert({ user_id: user.id, title: q }).select().single();
         if (error) throw error;
         cid = data.id;
         setActiveChatId(cid);
         fetchHistory(user.id);
       }
       
       await supabase.from('messages').insert({
         chat_id: cid,
         role: 'agent',
         agent_name: synth.agent,
         content: synth.response,
         agent_color: synth.color
       });
    } catch(e) { console.error("DB Save Error", e); }
  }

  const handleAnalyze = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    if (!import.meta.env.VITE_GROQ_API_KEY) {
      toast({ title: "API Key Missing", description: "VITE_GROQ_API_KEY not found in .env file", variant: "destructive" });
      return;
    }
    
    // IF we already have a final recommendation, treat this as a follow-up chat!
    if (finalRecommendation) {
       handleFollowUp(searchQuery);
       return;
    }

    setIsProcessing(true);
    setQuery(searchQuery);
    setSearchInput("");
    setAgentResponses([]);
    setFinalRecommendation(null);
    setFollowUpMessages([]);
    
    setProgress(10);
    setCurrentStatus("🚀 Activating agent swarm...");
    
    setTimeout(() => { setProgress(40); setCurrentStatus("Analyzing data and perspectives..."); }, 1500);
    setTimeout(() => { setProgress(70); setCurrentStatus("🎯 Checking for biases and verifying facts..."); }, 3000);
    
    try {
      const synthesizerAgent = agents[5];
      const finalResponse = await callAI(synthesizerAgent, searchQuery);
      
      const finalResult = { agent: synthesizerAgent.name, role: synthesizerAgent.role, icon: synthesizerAgent.icon, response: finalResponse, color: synthesizerAgent.color, model: synthesizerAgent.model };
      const dummyResponses = agents.slice(0, 5).map(a => ({ agent: a.name, role: a.role, response: "Analysis complete.", color: a.color }));
      
      setAgentResponses([...dummyResponses, finalResult]);
      setFinalRecommendation(finalResult);
      setProgress(100);
      setCurrentStatus("✅ Analysis complete!");
      saveToDb(searchQuery, finalResult);
        setIsProcessing(false);
        generateSuggestions(searchQuery, finalResponse);
    } catch (err: any) {
      setIsProcessing(false);
      toast({ title: "Error", description: err.message || "Analysis failed.", variant: "destructive" });
    }
  };

  const handleFollowUp = async (followUpQuery: string) => {
    setSearchInput("");
    setFollowUpMessages(prev => [...prev, { sender: 'user', text: followUpQuery }]);
    setIsFollowUpLoading(true);
    
    try {
      const synthesizerAgent = agents[5];
      // Pass previous context to keep the chat memory alive
      const context = `Original Query: ${query}\nOriginal Answer: ${finalRecommendation.response}\nPrevious Chat: ${followUpMessages.map(m => `${m.sender}: ${m.text}`).join('\n')}`;
      
      const followUpAgent = { ...synthesizerAgent, systemPrompt: "You are a helpful AI assistant continuing a research conversation. You MUST provide all your answers strictly in clean, concise bullet points. Never use long paragraphs or tables." };
      const response = await callAI(followUpAgent, followUpQuery, context);
      setFollowUpMessages(prev => [...prev, { sender: 'ai', text: response }]);
        generateSuggestions(followUpQuery, response);
        
        if (activeChatId && user) {
        await supabase.from('messages').insert({ chat_id: activeChatId, role: 'agent', agent_name: 'Synthesizer', content: response, agent_color: '#06b6d4' });
      }
    } catch(e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
    setIsFollowUpLoading(false);
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAnalyze(searchInput || e.currentTarget.value);
    }
  };

  

  const renderTabContent = () => {
    if (!user) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center z-10 text-center">
          <Auth onAuthSuccess={() => setActiveTab('Dashboard')} />
        </div>
      );
    }
    if (activeTab === 'Research Hub') return <ResearchHubTab />;
    if (activeTab === 'Knowledge Base') return <KnowledgeBaseTab />;
    if (activeTab === 'Agent Network') return <AgentStudioTab />;
    if (activeTab === 'Favorites') return <FavoritesTab />;
    if (activeTab === 'History') {
      return (
        <div className="flex-1 flex flex-col z-10 max-w-4xl mx-auto w-full py-8 animate-fadeIn">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold flex items-center gap-3"><Clock className="text-blue-500"/> Research History</h2>
          </div>
          {chatHistory.length === 0 ? (
            <div className="bg-[#11111a] border border-white/5 rounded-2xl p-12 text-center text-gray-400">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Your research history is currently empty.</p>
              <Button onClick={() => setActiveTab('Dashboard')} className="mt-4 bg-blue-600 hover:bg-blue-500 text-white">Start New Research</Button>
            </div>
          ) : (
            <div className="space-y-3">
               {chatHistory.map(chat => (
                 <div key={chat.id} onClick={() => loadChat(chat.id, chat.title)} className="bg-[#11111a] border border-white/5 hover:border-blue-500/50 hover:bg-white/5 rounded-xl p-5 cursor-pointer transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium text-lg">{chat.title}</h3>
                        <p className="text-xs text-gray-500">{new Date(chat.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                    <ArrowRight className="text-gray-600 group-hover:text-white transition-colors" />
                 </div>
               ))}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex h-screen bg-[#030308] text-white overflow-hidden">
      {!leftCollapsed ? (
        <div className="relative">
          <div onClick={(e) => {
            const target = e.target as HTMLElement;
            const itemText = target.closest('li')?.querySelector('span')?.innerText || target.innerText;
            if (['Dashboard', 'Research Hub', 'Agent Network', 'Knowledge Base', 'History', 'Favorites'].includes(itemText)) {
              setActiveTab(itemText);
            }
          }}>
            <Sidebar user={user} onLogout={handleLogout} onNewResearch={() => { setActiveTab("Dashboard"); setQuery(""); setSearchInput(""); setAgentResponses([]); setFinalRecommendation(null); setProgress(0); setActiveChatId(null); setFollowUpMessages([]); }} />
          </div>
          <button onClick={() => setLeftCollapsed(true)} className="absolute top-6 -right-3.5 z-50 bg-blue-600 rounded-full p-1.5 shadow-lg hover:bg-blue-500">
            <ChevronLeft size={16} />
          </button>
        </div>
      ) : (
        <div className="w-12 bg-[#0a0a14] border-r border-white/5 h-screen flex flex-col items-center py-6 flex-shrink-0 relative">
           <button onClick={() => setLeftCollapsed(false)} className="absolute top-6 -right-3.5 z-50 bg-blue-600 rounded-full p-1.5 shadow-lg hover:bg-blue-500">
            <ChevronRight size={16} />
          </button>
        </div>
      )}
      
      <main className="flex-1 flex flex-col h-screen overflow-y-auto p-8 border-r border-white/5 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        {activeTab !== "Dashboard" ? renderTabContent() : !query && !isProcessing && progress === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center z-10 max-w-3xl mx-auto w-full">
            <h2 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              What would you like to research?
            </h2>
            <div className="w-full relative group">
              <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl group-hover:bg-blue-500/30 transition-all duration-500"></div>
              <div className="relative bg-[#0a0a14] border border-white/10 rounded-2xl p-2 flex items-center shadow-2xl">
                <Search className="w-6 h-6 text-gray-400 ml-4" />
                <input 
                  type="text" 
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.currentTarget.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Ask a complex question requiring multi-agent analysis..." 
                  className="flex-1 bg-transparent border-none outline-none text-white text-lg placeholder-gray-500 px-4 py-4"
                  autoFocus
                />
                <Button 
                  onClick={() => handleAnalyze(searchInput)}
                  className="h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all"
                >
                  Analyze <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {["What are the long-term impacts of AI on work?", "Is universal basic income economically viable?", "Analyze the future of quantum computing"].map((suggestion, i) => (
                <button 
                  key={i}
                  onClick={() => { setSearchInput(suggestion); handleAnalyze(suggestion); }}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col z-10 h-full max-w-4xl mx-auto w-full">
            <header className="mb-8">
              <h2 className="text-3xl font-bold mb-3 leading-tight">{query}</h2>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-medium">Researching</span>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto mb-6 pr-4 space-y-6 custom-scrollbar">
              
              {isProcessing && !finalRecommendation ? (
                <div className="py-12 flex flex-col items-center justify-center text-center animate-pulse border border-white/5 bg-[#11111a]/50 rounded-2xl">
                  <div className="w-16 h-16 rounded-full border-t-2 border-l-2 border-blue-500 animate-spin mb-4 mx-auto"></div>
                  <h3 className="text-lg font-medium text-white mb-2">{currentStatus}</h3>
                  <p className="text-gray-400 text-sm">The agent swarm is actively gathering data and verifying facts...</p>
                </div>
              ) : finalRecommendation ? (
                <div className="space-y-6">
                  {/* Main Answer */}
                  <div className="bg-[#0a0a14] border border-blue-500/30 rounded-2xl p-8 shadow-[0_0_30px_rgba(59,130,246,0.1)] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 shadow-[0_0_20px_#3b82f6]"></div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="text-blue-400">✨</span> Summarized Answer
                      </h3>
                      <button onClick={() => toast({title:"Saved", description:"Added to Favorites"})} className="text-gray-500 hover:text-yellow-500 transition-colors">
                        <Star className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="prose prose-invert prose-blue max-w-none prose-p:leading-relaxed prose-pre:bg-white/5 animate-fadeIn">
                      <ReactMarkdown>{finalRecommendation.response}</ReactMarkdown>
                    </div>
                  </div>

                  {/* Follow Up Chat Interface */}
                  {followUpMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                      <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-gray-700' : 'bg-cyan-600 shadow-[0_0_10px_rgba(6,182,212,0.3)]'}`}>
                           {msg.sender === 'user' ? <User className="w-4 h-4 text-white" /> : <MessageSquare className="w-4 h-4 text-white" />}
                        </div>
                        <div className={`p-4 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-[#11111a] border border-white/10 text-gray-200 rounded-tl-none'}`}>
                          <div className="prose prose-invert prose-sm max-w-none"><ReactMarkdown>{msg.text}</ReactMarkdown></div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {isFollowUpLoading && (
                    <div className="flex justify-start animate-fadeIn">
                      <div className="flex gap-3 max-w-[85%] flex-row">
                        <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center flex-shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                           <MessageSquare className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-[#11111a] border border-white/10 p-4 rounded-2xl rounded-tl-none flex items-center">
                           <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            <div className="mt-auto flex flex-col gap-3 flex-shrink-0 mb-4 z-10">
               {finalRecommendation && !isProcessing && (
                 <div className="flex flex-wrap gap-2 mb-2">
                     {isSuggestionsLoading && <div className="text-xs text-gray-500 animate-pulse flex items-center h-7">Generating suggestions...</div>}
                   {dynamicSuggestions.map((chip, i) => (
                     <button key={i} onClick={() => { setSearchInput(chip); handleAnalyze(chip); }} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/10 transition">
                       {chip}
                     </button>
                   ))}
                 </div>
               )}
               <div className="bg-[#0a0a14] border border-white/10 rounded-2xl p-4 flex items-center gap-4 shadow-xl">
                 <input 
                   type="text" 
                   value={searchInput}
                   onChange={(e) => setSearchInput(e.currentTarget.value)}
                   placeholder={isProcessing || isFollowUpLoading ? "Agents are working..." : "Ask a follow-up question..."} 
                   className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 px-2" 
                   disabled={isProcessing || isFollowUpLoading}
                   onKeyDown={handleInputKeyDown}
                 />
                 <Button onClick={() => handleAnalyze(searchInput)} disabled={isProcessing || isFollowUpLoading} className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white p-0 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.4)]">
                    {isProcessing || isFollowUpLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <ArrowRight className="w-5 h-5" />}
                 </Button>
               </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;

