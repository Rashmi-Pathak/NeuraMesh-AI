interface AgentCardProps {
  agent: string;
  role: string;
  icon: string;
  response: string;
  color: string;
  delay: number;
  model?: string;
}

const colorClasses = {
  blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30",
  green: "from-green-500/20 to-green-600/20 border-green-500/30",
  red: "from-red-500/20 to-red-600/20 border-red-500/30",
  yellow: "from-yellow-500/20 to-yellow-600/20 border-yellow-500/30",
  purple: "from-purple-500/20 to-purple-600/20 border-purple-500/30",
  pink: "from-pink-500/20 to-pink-600/20 border-pink-500/30",
};

export const AgentCard = ({ agent, role, icon, response, color, delay, model }: AgentCardProps) => {
  const gradientClass = colorClasses[color as keyof typeof colorClasses] || colorClasses.purple;

  return (
    <div
      className="bg-card border border-border rounded-xl p-6 hover:scale-105 transition-transform duration-300 animate-fadeIn"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-start gap-4 mb-4">
        <div
          className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center text-2xl flex-shrink-0`}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-foreground truncate">{agent}</h3>
          <p className="text-xs text-muted-foreground">{role}</p>
          {model && (
            <p className="text-xs text-primary/70 mt-1">
              {model.includes('pro') ? '🧠 Gemini Pro' : '⚡ Gemini Flash'}
            </p>
          )}
        </div>
      </div>
      <p className="text-sm text-foreground/90 leading-relaxed">{response}</p>
    </div>
  );
};
