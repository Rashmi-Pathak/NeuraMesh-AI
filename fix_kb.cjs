
const fs = require("fs");
let content = fs.readFileSync("src/components/dashboard/FeatureTabs.tsx", "utf8");

const kbRegex = /export const KnowledgeBaseTab = \(\) => \([\s\S]*?\}\);\s*export const AgentStudioTab/m;

const newKB = `export const KnowledgeBaseTab = () => {
  const [files, setFiles] = useState([
    { id: 1, name: "Q3_Earnings_Report.pdf", type: "pdf", size: "2.4 MB", date: "Aug 20, 2026", status: "Indexed" },
    { id: 2, name: "Competitor_Analysis.docx", type: "doc", size: "1.1 MB", date: "Aug 22, 2026", status: "Indexed" },
    { id: 3, name: "Board_Meeting_Transcript.mp3", type: "audio", size: "14.5 MB", date: "Aug 23, 2026", status: "Processing..." },
  ]);
  const [search, setSearch] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const newFile = {
      id: Date.now(),
      name: "New_Document_Upload.pdf",
      type: "pdf",
      size: "3.2 MB",
      date: "Just now",
      status: "Processing..."
    };
    setFiles([newFile, ...files]);
  };

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex-1 flex flex-col z-10 max-w-6xl mx-auto w-full py-8 animate-fadeIn h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3"><BookOpen className="text-indigo-500" /> Knowledge Base</h2>
          <p className="text-gray-400 mt-2">Manage proprietary documents and data for Retrieval-Augmented Generation (RAG).</p>
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
          <Button className="bg-indigo-600 hover:bg-indigo-500"><Plus className="w-4 h-4 mr-2"/> Add Source</Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 h-[600px]">
        {/* Upload & Stats Sidebar */}
        <div className="col-span-1 space-y-6">
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={\`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer flex flex-col justify-center items-center h-48 \${isDragging ? "border-indigo-500 bg-indigo-500/10" : "border-white/10 bg-[#11111a] hover:border-indigo-500/50"}\`}
          >
            <Upload className={\`w-8 h-8 mb-3 \${isDragging ? "text-indigo-400 animate-bounce" : "text-gray-500"}\`} />
            <h3 className="text-sm font-medium text-white mb-1">Upload Data</h3>
            <p className="text-xs text-gray-500">Drop files here to index</p>
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
                  <span className="text-xs text-gray-500">Total Sources</span>
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
        <div className="col-span-3 bg-[#11111a] border border-white/5 rounded-2xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/5 bg-[#0a0a14] grid grid-cols-12 gap-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <div className="col-span-5">Document Name</div>
            <div className="col-span-2">Date Added</div>
            <div className="col-span-2">Size</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            {filteredFiles.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <FileText className="w-12 h-12 mb-4 opacity-20" />
                <p>No documents found.</p>
              </div>
            ) : (
              filteredFiles.map(file => (
                <div key={file.id} className="grid grid-cols-12 gap-4 items-center p-3 hover:bg-white/5 rounded-xl transition-colors group">
                  <div className="col-span-5 flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0 text-indigo-400">
                      {file.type === "audio" ? <Mic className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                    </div>
                    <span className="text-sm font-medium text-white truncate">{file.name}</span>
                  </div>
                  <div className="col-span-2 text-sm text-gray-400">{file.date}</div>
                  <div className="col-span-2 text-sm text-gray-500">{file.size}</div>
                  <div className="col-span-2">
                    <span className={\`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium \${file.status === "Indexed" ? "bg-green-500/10 text-green-400" : "bg-blue-500/10 text-blue-400 animate-pulse"}\`}>
                      {file.status === "Indexed" ? <div className="w-1.5 h-1.5 rounded-full bg-green-400" /> : <Loader2 className="w-3 h-3 animate-spin" />}
                      {file.status}
                    </span>
                  </div>
                  <div className="col-span-1 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setFiles(files.filter(f => f.id !== file.id))} className="text-gray-500 hover:text-red-400 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AgentStudioTab`;

content = content.replace(kbRegex, newKB);
fs.writeFileSync("src/components/dashboard/FeatureTabs.tsx", content);

