import React from 'react';

export const KeyInsights = ({ recommendation }: { recommendation: any }) => {
  if (!recommendation) {
    return (
      <div className="h-full flex flex-col pt-2 w-full">
         <div className="flex-1 flex items-center justify-center mb-4 relative opacity-50">
            <div className="relative w-32 h-24">
               <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-[20px]"></div>
               <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Brain_icon.svg/512px-Brain_icon.svg.png" className="w-full h-full opacity-30 object-contain drop-shadow-[0_0_15px_#4f46e5] invert brightness-200" alt="Brain mapping" />
            </div>
         </div>
         <div className="text-gray-600 text-sm italic text-center">Awaiting final synthesis...</div>
      </div>
    );
  }

  // Simple parser to extract bullet points from the synthesizer's markdown response
  const responseText = recommendation.response || "";
  const bullets = responseText.split('\n').filter((l: string) => l.trim().startsWith('•') || l.trim().startsWith('-')).map((l: string) => l.replace(/^[•-]\s*/, '').replace(/\*\*/g, ''));

  return (
    <div className="h-full flex flex-col pt-2 w-full animate-fadeIn">
       <div className="flex-1 flex items-center justify-center mb-4 relative">
          <div className="relative w-32 h-24">
             <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-[20px]"></div>
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Brain_icon.svg/512px-Brain_icon.svg.png" className="w-full h-full opacity-30 object-contain drop-shadow-[0_0_15px_#4f46e5] invert brightness-200" alt="Brain mapping" />
             
             <div className="absolute top-[20%] left-[30%] w-1.5 h-1.5 bg-indigo-400 rounded-full shadow-[0_0_8px_#6366f1] animate-ping"></div>
             <div className="absolute top-[50%] left-[60%] w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_8px_#3b82f6] animate-pulse"></div>
             <div className="absolute top-[70%] left-[40%] w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_8px_#4f46e5] animate-ping" style={{ animationDelay: '0.5s' }}></div>
          </div>
       </div>

       <div className="space-y-3">
          {bullets.slice(0, 3).map((bullet: string, i: number) => (
            <div key={i} className="flex items-start gap-2 text-xs">
               <span className="w-4 h-4 rounded bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-[10px]">{i + 1}</span>
               <p className="text-gray-300">{bullet}</p>
            </div>
          ))}
       </div>
    </div>
  );
};

export const ResearchMetrics = ({ isProcessing, responseCount }: { isProcessing: boolean, responseCount: number }) => {
  const sourcesAnalyzed = isProcessing ? Math.floor(Math.random() * 50) + responseCount * 40 : (responseCount > 0 ? 247 : 0);
  const dataPoints = isProcessing ? Math.floor(Math.random() * 200) + responseCount * 300 : (responseCount > 0 ? 1847 : 0);
  const confidence = responseCount === 6 ? 94 : 0;
  const bias = responseCount >= 5 ? 12 : 0;

  return (
    <div className="grid grid-cols-2 gap-3 w-full">
       <div className="bg-[#11111a] border border-white/5 rounded-xl p-3 transition-all">
          <p className="text-[10px] text-gray-500 mb-1 flex justify-between">Sources <span className="text-green-400">{sourcesAnalyzed > 0 ? '+15%' : ''}</span></p>
          <p className="text-xl font-bold text-white mb-1">{sourcesAnalyzed}</p>
          <p className="text-[10px] text-gray-600">{sourcesAnalyzed > 0 ? <><span className="text-green-500">+23%</span> vs last</> : 'Awaiting...'}</p>
       </div>
       <div className="bg-[#11111a] border border-white/5 rounded-xl p-3 transition-all">
          <p className="text-[10px] text-gray-500 mb-1 flex justify-between">Data Points <span className="text-green-400">{dataPoints > 0 ? '+15%' : ''}</span></p>
          <p className="text-xl font-bold text-white mb-1">{dataPoints.toLocaleString()}</p>
          <p className="text-[10px] text-gray-600">{dataPoints > 0 ? <><span className="text-green-500">+75%</span> vs last</> : 'Awaiting...'}</p>
       </div>
       <div className="bg-[#11111a] border border-white/5 rounded-xl p-3 transition-all">
          <p className="text-[10px] text-gray-500 mb-1 flex justify-between">Confidence</p>
          <p className="text-xl font-bold text-white mb-1">{confidence}%</p>
          <p className="text-[10px] text-gray-600">{confidence > 0 ? <><span className="text-green-500">+8%</span> vs last</> : 'Calculating...'}</p>
       </div>
       <div className="bg-[#11111a] border border-white/5 rounded-xl p-3 transition-all">
          <p className="text-[10px] text-gray-500 mb-1 flex justify-between">Bias Score <span className="text-green-400">{bias > 0 ? '+5%' : ''}</span></p>
          <p className="text-xl font-bold text-white mb-1">{bias}%</p>
          <p className="text-[10px] text-gray-600">{bias > 0 ? <><span className="text-green-500">+5%</span> vs last</> : 'Calculating...'}</p>
       </div>
    </div>
  );
};

export const KnowledgeGraph = ({ isProcessing }: { isProcessing: boolean }) => {
  return (
    <div className="h-full flex flex-col pt-2 w-full relative">
       <p className="text-lg font-bold text-white mb-0">{isProcessing ? Math.floor(Math.random() * 200) + 40 : 247}</p>
       <p className="text-xs text-gray-500 mb-2">Connections Mapped</p>
       
       <div className="flex-1 relative w-full mt-2 overflow-hidden rounded-xl border border-white/5">
          {/* Simulated node graph using simple absolute positions for dots and lines */}
          <svg className="absolute inset-0 w-full h-full opacity-40">
             <line x1="10%" y1="20%" x2="40%" y2="50%" stroke="#6366f1" strokeWidth="1" className={isProcessing ? "animate-pulse" : ""} />
             <line x1="40%" y1="50%" x2="80%" y2="30%" stroke="#3b82f6" strokeWidth="1" className={isProcessing ? "animate-pulse" : ""} style={{ animationDelay: '0.2s' }} />
             <line x1="40%" y1="50%" x2="60%" y2="80%" stroke="#4f46e5" strokeWidth="1" className={isProcessing ? "animate-pulse" : ""} style={{ animationDelay: '0.4s' }} />
             <line x1="80%" y1="30%" x2="90%" y2="70%" stroke="#06b6d4" strokeWidth="1" className={isProcessing ? "animate-pulse" : ""} style={{ animationDelay: '0.6s' }} />
             <line x1="60%" y1="80%" x2="90%" y2="70%" stroke="#22c55e" strokeWidth="1" className={isProcessing ? "animate-pulse" : ""} style={{ animationDelay: '0.8s' }} />
             <line x1="20%" y1="80%" x2="40%" y2="50%" stroke="#eab308" strokeWidth="1" className={isProcessing ? "animate-pulse" : ""} style={{ animationDelay: '1s' }} />
             <line x1="10%" y1="20%" x2="20%" y2="80%" stroke="#ef4444" strokeWidth="1" className={isProcessing ? "animate-pulse" : ""} style={{ animationDelay: '1.2s' }} />
          </svg>
          
          <div className="absolute top-[20%] left-[10%] w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_5px_#6366f1]"></div>
          <div className="absolute top-[50%] left-[40%] w-2.5 h-2.5 rounded-full bg-blue-600 shadow-[0_0_8px_#4f46e5] animate-pulse"></div>
          <div className="absolute top-[30%] left-[80%] w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_5px_#3b82f6]"></div>
          <div className="absolute top-[80%] left-[60%] w-2 h-2 rounded-full bg-green-400 shadow-[0_0_5px_#22c55e]"></div>
          <div className="absolute top-[70%] left-[90%] w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_5px_#06b6d4]"></div>
          <div className="absolute top-[80%] left-[20%] w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_5px_#eab308]"></div>
       </div>
    </div>
  );
};

