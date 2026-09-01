import React, { useState, useEffect } from 'react';
import { Search, Upload, FileText, Mic, Play, Plus, Save, Star, Download, Users, GitFork, ArrowRight, BookOpen, Trash2, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';
import { callAI, AgentConfig } from '@/lib/gemini';
import ReactMarkdown from 'react-markdown';

export const ResearchHubTab = () => {
  const [publicChats, setPublicChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicResearch = async () => {
      // Fetching all recent chats to act as "Public Research"
      const { data, error } = await supabase.from('chats').select('*').order('created_at', { ascending: false }).limit(10);
      if (data) setPublicChats(data);
      setLoading(false);
    };
    fetchPublicResearch();
  }, []);

  return (
    <div className="flex-1 flex flex-col z-10 max-w-5xl mx-auto w-full py-8 animate-fadeIn">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3"><Users className="text-blue-500" /> Research Hub</h2>
          <p className="text-gray-400 mt-2">Discover trending multi-agent deep dives from the community.</p>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
      ) : publicChats.length === 0 ? (
        <div className="bg-[#11111a] border border-white/5 rounded-2xl p-12 text-center text-gray-400">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No research has been posted yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {publicChats.map((item, i) => (
            <div key={i} className="bg-[#11111a] border border-white/5 rounded-2xl p-6 hover:border-blue-500/30 transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{item.title}</h3>
                <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-full">Community</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  {new Date(item.created_at).toLocaleDateString()}
                </div>
                <Button variant="outline" className="border-white/10 hover:bg-blue-600 hover:border-blue-600 h-8 text-xs">
                  <GitFork className="w-3 h-3 mr-2" /> View
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const KnowledgeBaseTab = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [chatMessages, setChatMessages] = useState<{sender: 'user' | 'ai', text: string}[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<number | 'all'>('all');

  const handleFileSelect = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newFile = {
        id: Date.now(),
        name: file.name,
        type: file.name.endsWith('.mp3') ? 'audio' : 'document',
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        date: 'Just now',
        status: 'Processing...',
        content: ''
      };
      
      setFiles([newFile, ...files]);
      
      if (file.name.endsWith('.txt') || file.name.endsWith('.csv')) {
         const reader = new FileReader();
         reader.onload = (ev) => {
            const text = ev.target?.result as string;
            setFiles(prev => prev.map(f => f.id === newFile.id ? { ...f, status: 'Indexed', content: text } : f));
         };
         reader.readAsText(file);
      } else {
         setTimeout(() => {
            setFiles(prev => prev.map(f => f.id === newFile.id ? { ...f, status: 'Indexed', content: "File content extraction is not fully supported for this format without a backend server." } : f));
         }, 1000);
      }
    }
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const newFile = {
        id: Date.now(),
        name: file.name,
        type: file.name.endsWith('.mp3') ? 'audio' : 'document',
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        date: 'Just now',
        status: 'Processing...',
        content: ''
      };
      
      setFiles([newFile, ...files]);
      
      if (file.name.endsWith('.txt') || file.name.endsWith('.csv')) {
         const reader = new FileReader();
         reader.onload = (ev) => {
            const text = ev.target?.result as string;
            setFiles(prev => prev.map(f => f.id === newFile.id ? { ...f, status: 'Indexed', content: text } : f));
         };
         reader.readAsText(file);
      } else {
         setTimeout(() => {
            setFiles(prev => prev.map(f => f.id === newFile.id ? { ...f, status: 'Indexed', content: "File content extraction is not fully supported for this format without a backend server." } : f));
         }, 1000);
      }
    }
  };

  const handleDocChat = async () => {
    if (!chatInput.trim() || files.length === 0) return;
    const msg = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: msg }]);
    setChatInput("");
    setIsTyping(true);
    
    try {
      const targetFile = selectedFileId === 'all' ? null : files.find(f => f.id === selectedFileId);
      const fileContext = targetFile ? 
         `Document: ${targetFile.name}\nContent: ${targetFile.content || 'No content parsed'}` : 
         files.map(f => `Document: ${f.name}\nContent: ${f.content || 'No content parsed'}`).join("\n\n---\n\n");
      const agent = { 
         name: "DocBot", 
         role: "Reader", 
         icon: "Book", 
         color: "#8b5cf6", 
         model: "groq/compound-mini", 
         systemPrompt: `You are answering questions based on the following indexed documents: ${fileContext}. Provide clean, bullet-point answers.`
      };
      const response = await callAI(agent, msg);
      setChatMessages(prev => [...prev, { sender: 'ai', text: response }]);
    } catch(e) {
      setChatMessages(prev => [...prev, { sender: 'ai', text: "Error reading documents." }]);
    }
    setIsTyping(false);
  };

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex-1 flex flex-col z-10 max-w-7xl mx-auto w-full py-8 animate-fadeIn h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3"><BookOpen className="text-indigo-500" /> Knowledge Base</h2>
          <p className="text-gray-400 mt-2">Manage proprietary documents and chat directly with your data.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search knowledge..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#11111a] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 w-64"
            />
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
          <Button onClick={() => fileInputRef.current?.click()} className="bg-indigo-600 hover:bg-indigo-500"><Plus className="w-4 h-4 mr-2"/> Add Source</Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 h-[600px]">
        {/* Upload & Stats Sidebar */}
        <div className="col-span-3 space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col justify-center items-center h-40 ${isDragging ? "border-indigo-500 bg-indigo-500/10" : "border-white/10 bg-[#11111a] hover:border-indigo-500/50"}`}
          >
            <Upload className={`w-8 h-8 mb-3 ${isDragging ? "text-indigo-400 animate-bounce" : "text-gray-500"}`} />
            <h3 className="text-sm font-medium text-white mb-1">Upload Data</h3>
            <p className="text-xs text-gray-500">Click or Drop files here</p>
          </div>

          <div className="bg-[#11111a] border border-white/5 rounded-2xl p-6">
            <h3 className="text-xs font-bold text-gray-400 mb-4 tracking-wider">DATABASE STATS</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Vector Storage</span>
                  <span className="text-white font-medium">45%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-[45%]"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="bg-[#0a0a14] p-3 rounded-lg border border-white/5">
                  <span className="block text-xl font-bold text-white">{files.length}</span>
                  <span className="text-xs text-gray-500">Sources</span>
                </div>
                <div className="bg-[#0a0a14] p-3 rounded-lg border border-white/5">
                  <span className="block text-xl font-bold text-white">12.4M</span>
                  <span className="text-xs text-gray-500">Tokens</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Files List */}
        <div className="col-span-5 bg-[#11111a] border border-white/5 rounded-2xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/5 bg-[#0a0a14] grid grid-cols-12 gap-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <div className="col-span-6">Document Name</div>
            <div className="col-span-3">Status</div>
            <div className="col-span-3 text-right">Actions</div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            {filteredFiles.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <FileText className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm">No documents found.</p>
                <p className="text-xs mt-1">Upload a file to start chatting.</p>
              </div>
            ) : (
              filteredFiles.map(file => (
                <div key={file.id} className="grid grid-cols-12 gap-4 items-center p-3 hover:bg-white/5 rounded-xl transition-colors group">
                  <div className="col-span-6 flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0 text-indigo-400">
                      {file.type === "audio" ? <Mic className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                    </div>
                    <span className="text-sm font-medium text-white truncate">{file.name}</span>
                  </div>
                  <div className="col-span-3">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-medium ${file.status === "Indexed" ? "bg-green-500/10 text-green-400" : "bg-blue-500/10 text-blue-400 animate-pulse"}`}>
                      {file.status === "Indexed" ? <div className="w-1.5 h-1.5 rounded-full bg-green-400" /> : <Loader2 className="w-3 h-3 animate-spin" />}
                      {file.status}
                    </span>
                  </div>
                  <div className="col-span-3 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setFiles(files.filter(f => f.id !== file.id))} className="text-gray-500 hover:text-red-400 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Document Chat */}
        <div className="col-span-4 bg-[#11111a] border border-white/5 rounded-2xl flex flex-col relative overflow-hidden">
          <div className="p-4 border-b border-white/5 bg-[#0a0a14] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                 <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Document Q&A</h3>
                <p className="text-[10px] text-gray-500">Select context & chat</p>
              </div>
            </div>
            
            {files.length > 0 && (
              <select 
                value={selectedFileId} 
                onChange={(e) => setSelectedFileId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="bg-[#11111a] border border-white/10 text-xs text-white rounded-lg px-2 py-1 outline-none w-32 truncate"
              >
                <option value="all">All Documents</option>
                {files.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {chatMessages.length === 0 && (
              <div className="text-center text-gray-500 mt-20 text-sm">
                Upload a document first, then ask questions about it here!
              </div>
            )}
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.sender === "user" ? "bg-indigo-600 text-white rounded-tr-none" : "bg-[#1a1a24] border border-white/10 text-gray-200 rounded-tl-none"}`}>
                  <div className="prose prose-invert prose-sm"><ReactMarkdown>{msg.text}</ReactMarkdown></div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#1a1a24] border border-white/10 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                   <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                </div>
              </div>
            )}
          </div>
          
          <div className="p-3 border-t border-white/5 bg-[#0a0a14]">
            <div className="flex items-center gap-2 bg-[#11111a] rounded-xl p-1.5 border border-white/10">
              <input 
                type="text" 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)} 
                onKeyDown={(e) => { if(e.key === 'Enter') handleDocChat(); }}
                disabled={files.length === 0}
                placeholder={files.length === 0 ? "Upload a file first..." : "Ask about your files..."} 
                className="flex-1 bg-transparent border-none outline-none px-3 text-white text-sm disabled:opacity-50" 
              />
              <Button onClick={handleDocChat} disabled={files.length === 0} className="w-8 h-8 p-0 rounded-lg bg-indigo-600 hover:bg-indigo-500"><ArrowRight className="w-3 h-3" /></Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export const AgentStudioTab = () => {
  const [allAgents, setAllAgents] = useState<AgentConfig[]>([
    { name: "Legal Expert", role: "Contract Analyst", color: "#8b5cf6", icon: "Scale", model: "groq/compound-mini", systemPrompt: "You are a legal expert. Provide concise legal analysis strictly in clean bullet points." },
    { name: "Code Reviewer", role: "Security Auditor", color: "#f97316", icon: "Code", model: "groq/compound-mini", systemPrompt: "You are a senior developer. Review code for bugs and security, answering strictly in clean bullet points." },
    { name: "Market Analyst", role: "Trend Forecaster", color: "#14b8a6", icon: "TrendingUp", model: "groq/compound-mini", systemPrompt: "You analyze market trends and provide economic forecasts strictly in clean bullet points." },
  ]);

  const [selectedAgent, setSelectedAgent] = useState<AgentConfig | null>(null);
  const [messages, setMessages] = useState<{sender: string, text: string}[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleCreateAgent = () => {
    const name = prompt("Enter new agent name (e.g. Psychologist):");
    if (!name) return;
    const role = prompt("Enter agent role (e.g. Behavioral Analyst):") || "Specialist";
    const newAgent: AgentConfig = {
      name,
      role,
      color: "#" + Math.floor(Math.random()*16777215).toString(16),
      icon: "User",
      model: "groq/compound-mini",
      systemPrompt: `You are an expert ${name} acting as a ${role}. Provide your answers strictly in clean, concise bullet points.`
    };
    setAllAgents([...allAgents, newAgent]);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !selectedAgent) return;
    const userMsg = input;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput("");
    setIsTyping(true);
    
    try {
      const context = messages.map(m => `${m.sender}: ${m.text}`).join("\n");
      const response = await callAI(selectedAgent, userMsg, context);
      setMessages(prev => [...prev, { sender: 'ai', text: response }]);
    } catch (e: any) {
      setMessages(prev => [...prev, { sender: 'ai', text: "Error: " + e.message }]);
    }
    setIsTyping(false);
  };

  return (
    <div className="flex-1 flex flex-col z-10 max-w-5xl mx-auto w-full py-8 animate-fadeIn">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3"><Play className="text-green-500" /> Agent Studio Chat</h2>
          <p className="text-gray-400 mt-2">Chat directly with specialized AI agents.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-[#11111a] border border-white/5 rounded-2xl flex flex-col h-[600px] relative overflow-hidden">
          {selectedAgent ? (
            <>
              <div className="p-4 border-b border-white/5 bg-[#0a0a14] flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedAgent.color }}></div>
                <h3 className="font-bold text-white">{selectedAgent.name}</h3>
                <span className="text-xs text-gray-500">{selectedAgent.role}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {messages.length === 0 && (
                  <div className="text-center text-gray-500 mt-20">Send a message to start chatting with {selectedAgent.name}.</div>
                )}
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-[#1a1a24] border border-white/10 text-gray-200 rounded-tl-none'}`}>
                      <div className="prose prose-invert prose-sm"><ReactMarkdown>{msg.text}</ReactMarkdown></div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-[#1a1a24] border border-white/10 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                       <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-white/5 bg-[#0a0a14]">
                <div className="flex items-center gap-3 bg-[#11111a] rounded-xl p-2 border border-white/10">
                  <input 
                    type="text" 
                    value={input} 
                    onChange={(e)=>setInput(e.target.value)} 
                    onKeyDown={(e)=>{if(e.key==='Enter') handleSendMessage()}}
                    placeholder={`Message ${selectedAgent.name}...`} 
                    className="flex-1 bg-transparent border-none outline-none px-3 text-white" 
                  />
                  <Button onClick={handleSendMessage} className="w-10 h-10 p-0 rounded-lg bg-green-600 hover:bg-green-500"><ArrowRight className="w-4 h-4" /></Button>
                </div>
              </div>
            </>
          ) : (
             <div className="flex-1 flex items-center justify-center text-gray-500">
                <p>Select an agent from the right to start chatting.</p>
             </div>
          )}
        </div>
        
        <div className="space-y-4 bg-[#11111a] border border-white/5 rounded-2xl p-6 h-[600px] overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider">AVAILABLE AGENTS</h3>
            <Button onClick={handleCreateAgent} variant="outline" size="sm" className="h-7 text-xs border-white/10 hover:bg-white/5"><Plus className="w-3 h-3 mr-1"/> Create</Button>
          </div>
          
          {allAgents.map((agent, i) => (
            <div 
              key={i} 
              onClick={() => { setSelectedAgent(agent); setMessages([]); setInput(""); }}
              className={`bg-[#0a0a14] border rounded-xl p-4 cursor-pointer transition-colors flex items-center gap-3 ${selectedAgent?.name === agent.name ? 'border-green-500/50' : 'border-white/10 hover:border-white/30'}`}
            >
              <div className="w-3 h-3 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" style={{ backgroundColor: agent.color, boxShadow: `0 0 10px ${agent.color}` }}></div>
              <div>
                <p className="text-sm font-medium text-white">{agent.name}</p>
                <p className="text-xs text-gray-500">{agent.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const FavoritesTab = () => (
  <div className="flex-1 flex flex-col z-10 max-w-4xl mx-auto w-full py-8 animate-fadeIn">
    <div className="flex justify-between items-center mb-8">
      <div>
        <h2 className="text-3xl font-bold flex items-center gap-3"><Star className="text-yellow-500" /> Starred Insights</h2>
        <p className="text-gray-400 mt-2">Compile your favorite agent findings into massive PDF reports.</p>
      </div>
      <Button className="bg-white text-black hover:bg-gray-200"><Download className="w-4 h-4 mr-2"/> Export All to PDF</Button>
    </div>
    
    <div className="space-y-4">
      {[
        { agent: "Fact Checker", text: "The assertion regarding 2024 inflation rates directly aligns with IMF projections, confirming the macroeconomic baseline.", date: "Aug 23, 2026" },
        { agent: "Pro Advocate", text: "Automating routine labor frees workers to focus on creative, strategic endeavors, acting as a massive economic force multiplier.", date: "Aug 22, 2026" }
      ].map((item, i) => (
        <div key={i} className="bg-[#11111a] border border-yellow-500/20 rounded-xl p-6 relative">
          <Star className="absolute top-6 right-6 text-yellow-500 fill-yellow-500 w-5 h-5" />
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-md">{item.agent}</span>
            <span className="text-xs text-gray-500">{item.date}</span>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed pr-8">{item.text}</p>
        </div>
      ))}
    </div>
  </div>
);





