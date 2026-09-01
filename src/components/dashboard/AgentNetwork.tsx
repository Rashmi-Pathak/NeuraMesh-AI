import React from 'react';
import { ShieldCheck, ThumbsUp, ThumbsDown, Search, Scale, Cpu, Loader2 } from 'lucide-react';

const AgentNode = ({ title, subtitle, status, progress, color, icon: Icon, align = 'left', responseText = '', stacked = false }: any) => {
  return (
    <div className={`relative flex items-center gap-4 ${align === 'right' && !stacked ? 'flex-row-reverse' : ''} ${stacked ? 'w-full' : ''}`}>
      <div className={`${stacked ? 'w-full' : 'w-[240px]'} bg-[#11111a] border border-white/10 rounded-xl p-3 relative overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)]`}>
        <div className={`absolute top-0 ${align === 'left' || stacked ? 'left-0' : 'right-0'} w-1 h-full`} style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}></div>
        
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center border border-white/10 flex-shrink-0" style={{ backgroundColor: `${color}20`, color: color }}>
            {status === 'In Progress' ? <Loader2 size={20} className="animate-spin" /> : <Icon size={20} />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h4 className="text-sm font-semibold text-white truncate">{title}</h4>
            </div>
            <p className="text-xs text-gray-400 mb-2 truncate">{subtitle}</p>
            
            <div className="flex justify-between items-center text-[10px]">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: status === 'Completed' ? '#22c55e' : (status === 'In Progress' ? color : '#6b7280') }}></span>
                <span className={status === 'Completed' ? 'text-green-400' : 'text-gray-400'}>{status}</span>
              </div>
              <span className="text-gray-300 font-medium">{progress}%</span>
            </div>
            <div className="w-full h-1 bg-gray-800 rounded-full mt-1.5 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%`, backgroundColor: color }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AgentNetwork = ({ responses = [], isProcessing = false, stacked = false }: { responses: any[], isProcessing: boolean, stacked?: boolean }) => {
  const getAgentData = (name: string, defaultIcon: any, defaultColor: string, defaultSubtitle: string, phase: number) => {
    const response = responses.find(r => r.agent === name);
    
    let status = 'Pending';
    let progress = 0;
    
    if (response) {
      status = 'Completed';
      progress = 100;
    } else if (isProcessing) {
      if (phase === 1) {
        status = 'In Progress';
        progress = Math.floor(Math.random() * 40) + 30;
      } else if (phase === 2 && responses.length >= 3) {
        status = 'In Progress';
        progress = Math.floor(Math.random() * 40) + 30;
      } else if (phase === 3 && responses.length >= 5) {
        status = 'In Progress';
        progress = Math.floor(Math.random() * 40) + 30;
      }
    }

    return {
      title: name,
      subtitle: defaultSubtitle,
      status,
      progress,
      color: defaultColor,
      icon: defaultIcon,
      responseText: response?.response || '',
      stacked
    };
  };

  const research = getAgentData("Research Agent", Search, "#22c55e", "Data Collection", 1);
  const pro = getAgentData("Pro Advocate", ThumbsUp, "#3b82f6", "For Perspective", 1);
  const con = getAgentData("Con Advocate", ThumbsDown, "#ef4444", "Against Perspective", 1);
  const fact = getAgentData("Fact Checker", ShieldCheck, "#eab308", "Verification", 2);
  const bias = getAgentData("Bias Checker", Scale, "#6366f1", "Bias Analysis", 2);
  const synth = getAgentData("Synthesizer", Cpu, "#06b6d4", "Insight Generation", 3);

  if (stacked) {
    return (
      <div className="flex flex-col gap-3 w-full animate-fadeIn">
        <AgentNode {...research} />
        <AgentNode {...pro} />
        <AgentNode {...con} />
        <AgentNode {...fact} />
        <AgentNode {...bias} />
        <AgentNode {...synth} />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-between px-4 mt-8">
      {/* Central Glowing Node */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="relative flex items-center justify-center">
          <div className={`w-32 h-32 rounded-full border border-blue-500/20 absolute ${isProcessing ? 'animate-[spin_2s_linear_infinite]' : ''}`}></div>
          <div className={`w-24 h-24 rounded-full border border-indigo-500/30 absolute ${isProcessing ? 'animate-[spin_1.5s_linear_infinite_reverse]' : ''}`}></div>
          <div className="w-16 h-16 rounded-full bg-blue-900/40 border border-blue-500/50 absolute blur-[2px]"></div>
          <div className={`w-8 h-8 rounded-full bg-blue-400 shadow-[0_0_30px_10px_rgba(59,130,246,0.6)] z-10 ${isProcessing ? 'animate-ping' : ''}`}></div>
          <div className="w-4 h-4 rounded-full bg-white z-20 absolute shadow-[0_0_15px_#fff]"></div>
        </div>
      </div>

      {/* SVG Connecting Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.2))' }}>
        <defs>
          <linearGradient id="grad-research" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#22c55e" stopOpacity={research.progress > 0 ? "0.8" : "0.2"} /><stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" /></linearGradient>
          <linearGradient id="grad-pro" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#3b82f6" stopOpacity={pro.progress > 0 ? "0.8" : "0.2"} /><stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" /></linearGradient>
          <linearGradient id="grad-con" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#ef4444" stopOpacity={con.progress > 0 ? "0.8" : "0.2"} /><stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" /></linearGradient>
          <linearGradient id="grad-fact" x1="100%" y1="0%" x2="0%" y2="0%"><stop offset="0%" stopColor="#eab308" stopOpacity={fact.progress > 0 ? "0.8" : "0.2"} /><stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" /></linearGradient>
          <linearGradient id="grad-bias" x1="100%" y1="0%" x2="0%" y2="0%"><stop offset="0%" stopColor="#6366f1" stopOpacity={bias.progress > 0 ? "0.8" : "0.2"} /><stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" /></linearGradient>
          <linearGradient id="grad-synth" x1="100%" y1="0%" x2="0%" y2="0%"><stop offset="0%" stopColor="#06b6d4" stopOpacity={synth.progress > 0 ? "0.8" : "0.2"} /><stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" /></linearGradient>
        </defs>
        
        {/* Left lines */}
        <path d="M 260 50 C 400 50, 400 150, 500 150" fill="none" stroke="url(#grad-research)" strokeWidth="2" className={research.progress > 0 && isProcessing ? "animate-[pulse_1s_ease-in-out_infinite]" : ""} />
        <path d="M 260 150 C 400 150, 400 150, 500 150" fill="none" stroke="url(#grad-pro)" strokeWidth="2" className={pro.progress > 0 && isProcessing ? "animate-[pulse_1.2s_ease-in-out_infinite_0.5s]" : ""} />
        <path d="M 260 250 C 400 250, 400 150, 500 150" fill="none" stroke="url(#grad-con)" strokeWidth="2" className={con.progress > 0 && isProcessing ? "animate-[pulse_1.5s_ease-in-out_infinite_1s]" : ""} />
        
        {/* Right lines */}
        <path d="M 740 50 C 600 50, 600 150, 500 150" fill="none" stroke="url(#grad-fact)" strokeWidth="2" className={fact.progress > 0 && isProcessing ? "animate-[pulse_1s_ease-in-out_infinite]" : ""} />
        <path d="M 740 150 C 600 150, 600 150, 500 150" fill="none" stroke="url(#grad-bias)" strokeWidth="2" className={bias.progress > 0 && isProcessing ? "animate-[pulse_1.2s_ease-in-out_infinite_0.5s]" : ""} />
        <path d="M 740 250 C 600 250, 600 150, 500 150" fill="none" stroke="url(#grad-synth)" strokeWidth="2" className={synth.progress > 0 && isProcessing ? "animate-[pulse_1.5s_ease-in-out_infinite_1s]" : ""} />
      </svg>

      <div className="flex flex-col gap-6 z-10">
        <AgentNode {...research} align="left" />
        <AgentNode {...pro} align="left" />
        <AgentNode {...con} align="left" />
      </div>

      <div className="flex flex-col gap-6 z-10">
        <AgentNode {...fact} align="right" />
        <AgentNode {...bias} align="right" />
        <AgentNode {...synth} align="right" />
      </div>
    </div>
  );
};
