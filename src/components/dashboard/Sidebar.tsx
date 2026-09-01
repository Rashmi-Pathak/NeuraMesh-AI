import React, { useState } from 'react';
import { Home, Search, Network, BookOpen, Clock, Star, Brain, User, MoreHorizontal, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Sidebar = ({ onNewResearch, user, onLogout }: { onNewResearch?: () => void, user?: any, onLogout?: () => void }) => {
  const [showLogout, setShowLogout] = useState(false);

  return (
    <aside className="w-64 bg-[#0a0a14] border-r border-white/5 h-screen flex flex-col px-4 py-6 flex-shrink-0 relative">
      <div className="flex items-center gap-3 mb-8 px-2">
        <Brain className="w-8 h-8 text-blue-500 animate-pulse" />
        <div>
          <h1 className="font-bold text-lg text-white tracking-wider">NEURAMESH</h1>
          <p className="text-xs text-gray-400">AI Research Studio</p>
        </div>
      </div>

      <Button onClick={onNewResearch} className="w-full bg-blue-600/10 text-blue-500 hover:bg-blue-600/20 border border-blue-500/30 mb-8 rounded-xl justify-start px-4 py-6 shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all">
        <span className="mr-2 text-xl">+</span> New Research
      </Button>

      <nav className="flex-1 space-y-2">
        {[
          { icon: <Home size={18} />, label: 'Dashboard' },
          { icon: <Search size={18} />, label: 'Research Hub' },
          { icon: <Network size={18} />, label: 'Agent Network' },
          { icon: <BookOpen size={18} />, label: 'Knowledge Base' },
          { icon: <Clock size={18} />, label: 'History' },
          { icon: <Star size={18} />, label: 'Favorites' },
        ].map((item, i) => (
          <button
            key={i}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-gray-400 hover:text-white hover:bg-white/5"
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto relative">
        {showLogout && user && (
          <div className="absolute bottom-full left-0 w-full mb-2 bg-[#11111a] border border-white/10 rounded-xl p-2 shadow-2xl z-50">
            <button 
              onClick={() => { setShowLogout(false); onLogout?.(); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={16} />
              <span className="text-sm font-medium">Log Out</span>
            </button>
          </div>
        )}
        
        {user ? (
          <div 
            onClick={() => setShowLogout(!showLogout)}
            className="flex items-center justify-between px-3 py-3 cursor-pointer hover:bg-white/5 border border-transparent hover:border-white/5 rounded-xl transition-all bg-[#0a0a14]"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                <span className="text-white font-bold text-sm">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-medium text-white truncate">{user.email?.split('@')[0]}</h4>
                <p className="text-xs text-blue-400">Researcher</p>
              </div>
            </div>
            <MoreHorizontal size={18} className="text-gray-500 flex-shrink-0" />
          </div>
        ) : (
          <div className="px-3 py-3 rounded-xl bg-white/5 border border-white/10 text-center">
            <p className="text-xs text-gray-400">Not logged in</p>
          </div>
        )}
      </div>
    </aside>
  );
};
