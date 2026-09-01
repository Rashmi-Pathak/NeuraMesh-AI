const fs = require("fs");
let content = fs.readFileSync("src/components/dashboard/FeatureTabs.tsx", "utf8");

content = content.replace(/const handleDrop = \(e\) => \{/, 
`const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (e) => {
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
    }
  };

  const handleDrop = (e) => {`);

content = content.replace(/<Button className="bg-indigo-600 hover:bg-indigo-500"><Plus className="w-4 h-4 mr-2"\/> Add Source<\/Button>/, 
`<input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
          <Button onClick={() => fileInputRef.current?.click()} className="bg-indigo-600 hover:bg-indigo-500"><Plus className="w-4 h-4 mr-2"/> Add Source</Button>`);

content = content.replace(/<div \n\s*onDragOver/m, 
`<div 
            onClick={() => fileInputRef.current?.click()}
            onDragOver`);

fs.writeFileSync("src/components/dashboard/FeatureTabs.tsx", content);
