import { CheckCircle, Zap, Brain, Clock } from "lucide-react";

interface FinalRecommendationProps {
  recommendation: string;
  processingTime: string | null;
  agentCount: number;
}

export const FinalRecommendation = ({
  recommendation,
  processingTime,
  agentCount,
}: FinalRecommendationProps) => {
  return (
    <div className="max-w-4xl mx-auto mb-12 animate-slideUp">
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/30 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <CheckCircle className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-bold gradient-text">Final Recommendation</h2>
        </div>

        <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 mb-6">
          <div className="prose prose-invert max-w-none">
            {recommendation.split("\n").map((line, idx) => {
              if (line.startsWith("**")) {
                const content = line.replace(/\*\*/g, "");
                if (content.includes(":")) {
                  const [heading, ...rest] = content.split(":");
                  return (
                    <p key={idx} className="mb-3">
                      <strong className="text-primary">{heading}:</strong>
                      {rest.join(":")}
                    </p>
                  );
                }
                return (
                  <p key={idx} className="font-bold text-primary mb-2">
                    {content}
                  </p>
                );
              }
              if (line.match(/^\d+\./)) {
                return (
                  <p key={idx} className="ml-4 mb-2 text-foreground/90">
                    {line}
                  </p>
                );
              }
              if (line.startsWith("•")) {
                return (
                  <p key={idx} className="ml-4 mb-2 text-foreground/90">
                    {line}
                  </p>
                );
              }
              return line.trim() ? (
                <p key={idx} className="mb-3 text-foreground/90">
                  {line}
                </p>
              ) : null;
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border/50">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>Powered by Gemini AI</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-400" />
              <span>Multi-Agent Analysis</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {processingTime && (
              <div className="flex items-center gap-2 text-primary">
                <Clock className="w-4 h-4" />
                <span className="font-semibold">{processingTime}s</span>
              </div>
            )}
            <div className="px-3 py-1 bg-primary/20 text-primary rounded-full font-semibold">
              {agentCount} Agents
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
