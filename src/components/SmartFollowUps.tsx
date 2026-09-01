import { useState, useEffect } from "react";
import { Sparkles, Loader2, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SmartFollowUpsProps {
  query: string;
  recommendation: string;
  onSelectFollowUp: (question: string) => void;
}

export const SmartFollowUps = ({ query, recommendation, onSelectFollowUp }: SmartFollowUpsProps) => {
  const [followUps, setFollowUps] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const generateFollowUps = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await supabase.functions.invoke('generate-followups', {
          body: { query, recommendation },
        });

        if (response.error) {
          throw new Error(response.error.message);
        }

        if (response.data?.followUps) {
          setFollowUps(response.data.followUps);
        }
      } catch (err) {
        console.error("Failed to generate follow-ups:", err);
        setError("Could not generate follow-up questions");
        // Fallback follow-ups
        setFollowUps([
          `What are the risks involved in ${query.slice(0, 50)}...?`,
          "What timeline should I consider for this decision?",
          "What resources do I need to get started?",
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    if (query && recommendation) {
      generateFollowUps();
    }
  }, [query, recommendation]);

  if (isLoading) {
    return (
      <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 animate-fadeIn">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          <h3 className="font-semibold text-foreground">Generating Smart Follow-ups...</h3>
        </div>
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 animate-fadeIn">
      <div className="flex items-center gap-3 mb-4">
        <MessageCircle className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Continue Your Research</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Based on your analysis, consider exploring:
      </p>

      <div className="grid gap-3">
        {followUps.map((question, idx) => (
          <button
            key={idx}
            onClick={() => onSelectFollowUp(question)}
            className="group relative text-left p-4 rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.02]"
          >
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 border border-primary/30 group-hover:border-primary/60 rounded-lg transition-colors" />
            
            {/* Content */}
            <div className="relative flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="text-sm text-foreground group-hover:text-primary transition-colors">
                {question}
              </p>
            </div>
            
            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
        ))}
      </div>

      {error && (
        <p className="text-xs text-muted-foreground mt-3 text-center">
          {error}
        </p>
      )}
    </div>
  );
};
