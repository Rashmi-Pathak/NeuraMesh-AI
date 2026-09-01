import React from 'react';
import { Search, ThumbsUp, ThumbsDown, ShieldCheck, Scale, Cpu } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

export const LiveActivityFeed = ({ activities = [] }: { activities: any[] }) => {
  return (
    <div className="h-full flex flex-col pt-2">
      <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
        {activities.map((act, i) => {
          const IconComponent = (LucideIcons as any)[act.icon] || Search;
          return (
            <div key={i} className="flex items-start justify-between animate-fadeIn">
              <div className="flex gap-3">
                <div className="mt-0.5">
                  <IconComponent size={14} color={act.color} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{act.name}</p>
                  <p className="text-xs text-gray-500">{act.action}</p>
                </div>
              </div>
              <span className="text-[10px] text-gray-600">{act.time}</span>
            </div>
          );
        })}
        {activities.length === 0 && (
          <div className="text-gray-600 text-sm italic h-full flex items-center justify-center">Waiting for research to begin...</div>
        )}
      </div>
    </div>
  );
};

export const OverallProgress = ({ progress = 0, status = "Awaiting query..." }: { progress: number, status: string }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center pt-2 relative">
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* SVG Circle for progress */}
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="64" cy="64" r="56" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
          <circle 
            cx="64" 
            cy="64" 
            r="56" 
            stroke="url(#progress-gradient)" 
            strokeWidth="8" 
            fill="none" 
            strokeDasharray="351.8" 
            strokeDashoffset={351.8 - (351.8 * progress) / 100}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold text-white">{progress}%</span>
          <span className="text-[10px] text-gray-400 max-w-[80px] leading-tight mt-1 truncate">{status}</span>
        </div>
      </div>
    </div>
  );
};

export const AgentPerformance = ({ responses = [], isProcessing = false }: { responses: any[], isProcessing: boolean }) => {
  const getProgress = (agentName: string, phase: number) => {
    if (responses.find(r => r.agent === agentName)) return 100;
    if (!isProcessing) return 0;
    if (phase === 1) return Math.floor(Math.random() * 60) + 20;
    if (phase === 2 && responses.length >= 3) return Math.floor(Math.random() * 60) + 20;
    if (phase === 3 && responses.length >= 5) return Math.floor(Math.random() * 60) + 20;
    return 0;
  };

  const agents = [
    { icon: Search, color: '#22c55e', name: 'Research Agent', progress: getProgress('Research Agent', 1) },
    { icon: ThumbsUp, color: '#3b82f6', name: 'Pro Agent', progress: getProgress('Pro Advocate', 1) },
    { icon: ThumbsDown, color: '#ef4444', name: 'Con Agent', progress: getProgress('Con Advocate', 1) },
    { icon: ShieldCheck, color: '#eab308', name: 'Fact Checker', progress: getProgress('Fact Checker', 2) },
    { icon: Scale, color: '#4f46e5', name: 'Bias Checker', progress: getProgress('Bias Checker', 2) },
    { icon: Cpu, color: '#06b6d4', name: 'Synthesizer', progress: getProgress('Synthesizer', 3) },
  ];

  return (
    <div className="h-full flex flex-col pt-2 justify-between">
      {agents.map((agent, i) => (
        <div key={i} className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 w-32">
            <agent.icon size={12} color={agent.color} />
            <span className="text-gray-300">{agent.name}</span>
          </div>
          <div className="flex-1 mx-3 h-1.5 bg-white/5 rounded-full overflow-hidden">
             <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${agent.progress}%`, backgroundColor: agent.color }}></div>
          </div>
          <span className="text-gray-500 w-8 text-right">{agent.progress}%</span>
        </div>
      ))}
    </div>
  );
};

