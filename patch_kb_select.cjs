const fs = require("fs");
let content = fs.readFileSync("src/components/dashboard/FeatureTabs.tsx", "utf8");

// 1. Add selectedFileId state
content = content.replace(/const \[isTyping, setIsTyping\] = useState\(false\);/, 
`const [isTyping, setIsTyping] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<number | 'all'>('all');`);

// 2. Update handleDocChat context logic
content = content.replace(/const fileContext = files\.map\(f => f\.name\)\.join\(", "\);/, 
`const targetFile = selectedFileId === 'all' ? null : files.find(f => f.id === selectedFileId);
      const fileContext = targetFile ? targetFile.name : files.map(f => f.name).join(", ");`);

// 3. Update the chat header to include the dropdown
content = content.replace(/<div className="p-4 border-b border-white\/5 bg-\[#0a0a14\] flex items-center gap-3">[\s\S]*?<p className="text-xs text-gray-500">Ask questions about your data<\/p>\s*<\/div>\s*<\/div>/,
`<div className="p-4 border-b border-white/5 bg-[#0a0a14] flex items-center justify-between">
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
          </div>`);

fs.writeFileSync("src/components/dashboard/FeatureTabs.tsx", content);
