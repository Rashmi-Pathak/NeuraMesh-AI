const fs = require("fs");
let content = fs.readFileSync("src/components/dashboard/FeatureTabs.tsx", "utf8");

const kbRegex = /export const KnowledgeBaseTab = \(\) => \{[\s\S]*?\}\);\s*};/m;

const newKB = `export const KnowledgeBaseTab = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [chatMessages, setChatMessages] = useState<{sender: 'user' | 'ai', text: string}[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleFileSelect = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newFile = {
        id: Date.now(),
        name: file.name,
        type: file.name.endsWith('.mp3') ? 'audio' : 'pdf',
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        date: 'Just now',
        status: 'Processing...'
      };
      setFiles([newFile, ...files]);
      setTimeout(() => {
         setFiles(prev => prev.map(f => f.id === newFile.id ? { ...f, status: 'Indexed' } : f));
      }, 2000);
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
        type: file.name.endsWith('.mp3') ? 'audio' : 'pdf',
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        date: 'Just now',
        status: 'Processing...'
      };
      setFiles([newFile, ...files]);
      setTimeout(() => {
         setFiles(prev => prev.map(f => f.id === newFile.id ? { ...f, status: 'Indexed' } : f));
      }, 2000);
    }
  };

  const handleDocChat = async () => {
    if (!chatInput.trim() || files.length === 0) return;
    const msg = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: msg }]);
    setChatInput("");
    setIsTyping(true);
    
    try {
      const fileContext = files.map(f => f.name).join(", ");
      const agent = { 
         name: "DocBot", 
         role: "Reader", 
         icon: "Book", 
         color: "#8b5cf6", 
         model: "groq/compound-mini", 
         systemPrompt: \`You are answering questions based on the following indexed documents: \${fileContext}. Provide clean, bullet-point answers.\`
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
            className={\`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col justify-center items-center h-40 \${isDragging ? "border-indigo-500 bg-indigo-500/10" : "border-white/10 bg-[#11111a] hover:border-indigo-500/50"}\`}
          >
            <Upload className={\`w-8 h-8 mb-3 \${isDragging ? "text-indigo-400 animate-bounce" : "text-gray-500"}\`} />
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
                    <span className={\`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-medium \${file.status === "Indexed" ? "bg-green-500/10 text-green-400" : "bg-blue-500/10 text-blue-400 animate-pulse"}\`}>
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
          <div className="p-4 border-b border-white/5 bg-[#0a0a14] flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
               <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Document Q&A</h3>
              <p className="text-xs text-gray-500">Ask questions about your data</p>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {chatMessages.length === 0 && (
              <div className="text-center text-gray-500 mt-20 text-sm">
                Upload a document first, then ask questions about it here!
              </div>
            )}
            {chatMessages.map((msg, i) => (
              <div key={i} className={\`flex \${msg.sender === "user" ? "justify-end" : "justify-start"}\`}>
                <div className={\`max-w-[85%] p-3 rounded-2xl text-sm \${msg.sender === "user" ? "bg-indigo-600 text-white rounded-tr-none" : "bg-[#1a1a24] border border-white/10 text-gray-200 rounded-tl-none"}\`}>
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
};`;

content = content.replace(kbRegex, newKB);
fs.writeFileSync("src/components/dashboard/FeatureTabs.tsx", content);
