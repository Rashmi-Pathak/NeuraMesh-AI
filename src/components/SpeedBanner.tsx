import { useEffect, useState } from "react";
import { Zap, Clock, TrendingUp } from "lucide-react";

interface SpeedBannerProps {
  processingTime: string;
  agentCount: number;
}

export const SpeedBanner = ({ processingTime, agentCount }: SpeedBannerProps) => {
  const [animatedParallel, setAnimatedParallel] = useState(0);
  const [animatedSequential, setAnimatedSequential] = useState(0);
  const [animatedSpeedup, setAnimatedSpeedup] = useState(0);

  const parallelTime = parseFloat(processingTime);
  const sequentialTime = parallelTime * agentCount; // Simulated sequential time
  const speedup = sequentialTime / parallelTime;

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const stepDuration = duration / steps;

    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic

      setAnimatedParallel(parallelTime * eased);
      setAnimatedSequential(sequentialTime * eased);
      setAnimatedSpeedup(speedup * eased);

      if (step >= steps) {
        clearInterval(interval);
        setAnimatedParallel(parallelTime);
        setAnimatedSequential(sequentialTime);
        setAnimatedSpeedup(speedup);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [parallelTime, sequentialTime, speedup]);

  return (
    <div className="max-w-4xl mx-auto mb-8 animate-slideUp">
      <div className="bg-gradient-to-r from-primary/20 via-card to-secondary/20 border border-primary/30 rounded-2xl p-6 shadow-lg overflow-hidden relative">
        {/* Background animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 animate-pulse" />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground">Parallel Processing Power</h3>
              <p className="text-sm text-muted-foreground">Multi-agent execution complete</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Parallel Time */}
            <div className="bg-card/60 backdrop-blur-sm rounded-xl p-4 border border-green-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-green-400" />
                <span className="text-sm text-muted-foreground">Parallel</span>
              </div>
              <div className="text-3xl font-bold text-green-400">
                {animatedParallel.toFixed(1)}s
              </div>
              <div className="text-xs text-green-400/70 mt-1">All agents at once</div>
            </div>

            {/* Sequential Time */}
            <div className="bg-card/60 backdrop-blur-sm rounded-xl p-4 border border-red-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-red-400" />
                <span className="text-sm text-muted-foreground">Sequential</span>
              </div>
              <div className="text-3xl font-bold text-red-400">
                {animatedSequential.toFixed(1)}s
              </div>
              <div className="text-xs text-red-400/70 mt-1">One by one (estimated)</div>
            </div>

            {/* Speedup */}
            <div className="bg-card/60 backdrop-blur-sm rounded-xl p-4 border border-primary/30">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Speedup</span>
              </div>
              <div className="text-3xl font-bold gradient-text">
                {animatedSpeedup.toFixed(1)}x
              </div>
              <div className="text-xs text-primary/70 mt-1">Faster with parallel</div>
            </div>
          </div>

          {/* Animated bar comparison */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-20">Parallel</span>
              <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-1000"
                  style={{ width: `${(parallelTime / sequentialTime) * 100}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-green-400 w-12">{parallelTime}s</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-20">Sequential</span>
              <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full transition-all duration-1000"
                  style={{ width: '100%' }}
                />
              </div>
              <span className="text-xs font-semibold text-red-400 w-12">{sequentialTime.toFixed(1)}s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
