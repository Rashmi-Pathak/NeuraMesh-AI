const fs = require("fs");
let content = fs.readFileSync("src/components/dashboard/FeatureTabs.tsx", "utf8");

// 1. Add extraction logic to handleFileSelect
content = content.replace(/const handleFileSelect = \(e: any\) => \{[\s\S]*?if \(e\.target\.files/m, 
`const handleFileSelect = (e: any) => {
    if (e.target.files`);

content = content.replace(/const newFile = \{[\s\S]*?status: 'Processing\.\.\.'\s*\};[\s\S]*?setFiles\(\[newFile, \.\.\.files\]\);[\s\S]*?setTimeout\(\(\) => \{[\s\S]*?status: 'Indexed' \} : f\)\);\s*\}, 2000\);/m, 
`const newFile = {
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
      }`);

// 2. Add extraction logic to handleDrop (doing same replacement)
content = content.replace(/const newFile = \{[\s\S]*?status: 'Processing\.\.\.'\s*\};[\s\S]*?setFiles\(\[newFile, \.\.\.files\]\);[\s\S]*?setTimeout\(\(\) => \{[\s\S]*?status: 'Indexed' \} : f\)\);\s*\}, 2000\);/m, 
`const newFile = {
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
      }`);


// 3. Update handleDocChat context to use f.content
content = content.replace(/const fileContext = targetFile \? targetFile\.name : files\.map\(f => f\.name\)\.join\(", "\);/, 
`const fileContext = targetFile ? 
         \`Document: \${targetFile.name}\\nContent: \${targetFile.content || 'No content parsed'}\` : 
         files.map(f => \`Document: \${f.name}\\nContent: \${f.content || 'No content parsed'}\`).join("\\n\\n---\\n\\n");`);

fs.writeFileSync("src/components/dashboard/FeatureTabs.tsx", content);
