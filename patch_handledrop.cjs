const fs = require("fs");
let content = fs.readFileSync("src/components/dashboard/FeatureTabs.tsx", "utf8");

content = content.replace(/  const handleDocChat = async \(\) => \{/, 
`  const handleDrop = (e: any) => {
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

  const handleDocChat = async () => {`);

fs.writeFileSync("src/components/dashboard/FeatureTabs.tsx", content);
