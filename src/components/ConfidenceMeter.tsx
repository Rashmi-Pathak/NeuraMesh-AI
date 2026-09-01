import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ConfidenceMeterProps {
  recommendation: string;
}

export const ConfidenceMeter = ({ recommendation }: ConfidenceMeterProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  // Extract confidence score from recommendation (format: X/10)
  const extractConfidence = (text: string): number => {
    const match = text.match(/(\d+(?:\.\d+)?)\s*\/\s*10/);
    if (match) {
      return Math.min(10, Math.max(0, parseFloat(match[1])));
    }
    return 7; // Default if not found
  };

  const score = extractConfidence(recommendation);
  const percentage = (score / 10) * 100;

  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0;
      const increment = score / 30;
      const interval = setInterval(() => {
        current += increment;
        if (current >= score) {
          setAnimatedScore(score);
          clearInterval(interval);
        } else {
          setAnimatedScore(current);
        }
      }, 20);
      return () => clearInterval(interval);
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);

  const getColor = () => {
    if (score >= 7) return { bg: "bg-green-500", text: "text-green-400", glow: "shadow-green-500/30" };
    if (score >= 5) return { bg: "bg-yellow-500", text: "text-yellow-400", glow: "shadow-yellow-500/30" };
    return { bg: "bg-red-500", text: "text-red-400", glow: "shadow-red-500/30" };
  };

  const getQualityText = () => {
    if (score >= 8) return "High Confidence";
    if (score >= 7) return "Strong Confidence";
    if (score >= 5) return "Moderate Confidence";
    if (score >= 3) return "Low Confidence";
    return "Very Low Confidence";
  };

  const getIcon = () => {
    if (score >= 7) return <TrendingUp className="w-5 h-5" />;
    if (score >= 5) return <Minus className="w-5 h-5" />;
    return <TrendingDown className="w-5 h-5" />;
  };

  const colors = getColor();

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 mb-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Confidence Score</h3>
        <div className={`flex items-center gap-2 ${colors.text}`}>
          {getIcon()}
          <span className="font-bold">{getQualityText()}</span>
        </div>
      </div>
      
      <div className="relative h-4 bg-muted rounded-full overflow-hidden mb-3">
        <div
          className={`absolute inset-y-0 left-0 ${colors.bg} transition-all duration-1000 ease-out rounded-full shadow-lg ${colors.glow}`}
          style={{ width: `${(animatedScore / 10) * 100}%` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Recommendation Quality</span>
        <span className={`font-bold text-lg ${colors.text}`}>
          {animatedScore.toFixed(1)}/10 ({Math.round((animatedScore / 10) * 100)}%)
        </span>
      </div>
    </div>
  );
};
