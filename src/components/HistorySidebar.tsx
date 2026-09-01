import { useState, useEffect } from "react";
import { History, ChevronLeft, ChevronRight, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface HistoryItem {
  id: string;
  query: string;
  timestamp: number;
  agentResponses: any[];
  finalRecommendation: string;
  processingTime: string | null;
}

interface HistorySidebarProps {
  onLoadHistory: (item: HistoryItem) => void;
  currentQuery: string;
  currentResponses: any[];
  currentRecommendation: string;
  currentProcessingTime: string | null;
  isProcessing: boolean;
}

const STORAGE_KEY = "NeuraMesh-history";

export const HistorySidebar = ({
  onLoadHistory,
  currentQuery,
  currentResponses,
  currentRecommendation,
  currentProcessingTime,
  isProcessing,
}: HistorySidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history:", e);
      }
    }
  }, []);

  // Save current analysis to history when complete
  useEffect(() => {
    if (currentRecommendation && currentQuery && !isProcessing) {
      const existingIndex = history.findIndex(h => h.query === currentQuery);
      if (existingIndex === -1) {
        const newItem: HistoryItem = {
          id: Date.now().toString(),
          query: currentQuery,
          timestamp: Date.now(),
          agentResponses: currentResponses,
          finalRecommendation: currentRecommendation,
          processingTime: currentProcessingTime,
        };
        const updated = [newItem, ...history].slice(0, 10);
        setHistory(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
    }
  }, [currentRecommendation, isProcessing]);

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const formatTimestamp = (ts: number) => {
    const date = new Date(ts);
    const now = new Date();
    const diff = now.getTime() - ts;
    
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-50 bg-card border border-border border-l-0 rounded-r-lg p-2 hover:bg-muted transition-colors"
      >
        {isOpen ? (
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        ) : (
          <div className="flex items-center gap-1">
            <History className="w-5 h-5 text-primary" />
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-card border-r border-border z-40 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: "300px" }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-foreground">History</h2>
              </div>
              {history.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearHistory}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* History List */}
          <ScrollArea className="flex-1">
            <div className="p-2">
              {history.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No analyses yet</p>
                  <p className="text-xs mt-1">Your past queries will appear here</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onLoadHistory(item)}
                      className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors border border-transparent hover:border-primary/30"
                    >
                      <p className="text-sm text-foreground line-clamp-2 mb-2">
                        {item.query}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimestamp(item.timestamp)}</span>
                        {item.processingTime && (
                          <span className="text-primary">• {item.processingTime}s</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-3 border-t border-border text-center text-xs text-muted-foreground">
            Showing last {history.length} of 10 analyses
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
