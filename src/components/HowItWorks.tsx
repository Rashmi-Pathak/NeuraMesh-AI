import { Zap, Users, Target, Brain, Sparkles, Code } from "lucide-react";

export const HowItWorks = () => {
  return (
    <div className="max-w-5xl mx-auto mt-16 animate-fadeIn">
      <h2 className="text-3xl font-bold text-center mb-8 gradient-text">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-yellow-400" />
          </div>
          <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Parallel processing enables all agents to analyze simultaneously, delivering
            comprehensive results in 3-5 seconds using Google Gemini AI.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold mb-3">Multiple Perspectives</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Six specialized agents analyze your question from different angles: research, pros,
            cons, biases, facts, and synthesis.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500/20 to-pink-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-pink-400" />
          </div>
          <h3 className="text-xl font-bold mb-3">Bias Detection</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Dedicated agents identify logical fallacies, verify facts, and check for cognitive
            biases to ensure balanced recommendations.
          </p>
        </div>
      </div>

      <div className="mt-12 bg-card border border-border rounded-xl p-8">
        <h3 className="text-2xl font-bold text-center mb-6 gradient-text">Tech Stack</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              AI Models
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">⚡</span>
                <span><strong>Gemini 2.5 Flash:</strong> Fast agents (Research, Pro, Con)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">🧠</span>
                <span><strong>Gemini 2.5 Pro:</strong> Deep reasoning (Bias, Fact, Synthesizer)</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Code className="w-5 h-5 text-secondary" />
              Architecture
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-secondary">→</span>
                <span><strong>Frontend:</strong> React 18, TypeScript, Tailwind CSS</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-secondary">→</span>
                <span><strong>Backend:</strong> Lovable Cloud Edge Functions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-secondary">→</span>
                <span><strong>Streaming:</strong> Server-Sent Events (SSE)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
