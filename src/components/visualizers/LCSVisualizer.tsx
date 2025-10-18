import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { runLCS, LCSStep } from "@/utils/algorithms/lcs";

export const LCSVisualizer = () => {
  const [text1, setText1] = useState("ABCDGH");
  const [text2, setText2] = useState("AEDFHR");
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState([50]);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<LCSStep[]>([]);

  useEffect(() => {
    resetVisualization();
  }, [text1, text2]);

  const resetVisualization = () => {
    if (text1 && text2) {
      const lcsSteps = runLCS(text1, text2);
      setSteps(lcsSteps);
      setCurrentStep(0);
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 1000 - speed[0] * 9);
      return () => clearTimeout(timer);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, steps.length, speed]);

  const currentState = steps[currentStep];

  return (
    <div className="space-y-6">
      <Card className="p-3 sm:p-4 bg-muted/50">
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">Text 1:</label>
            <Input
              value={text1}
              onChange={(e) => setText1(e.target.value.toUpperCase())}
              className="w-28 sm:w-32"
              maxLength={10}
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">Text 2:</label>
            <Input
              value={text2}
              onChange={(e) => setText2(e.target.value.toUpperCase())}
              className="w-28 sm:w-32"
              maxLength={10}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={currentStep >= steps.length - 1}
              size="sm"
              variant={isPlaying ? "secondary" : "default"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button onClick={resetVisualization} size="sm" variant="outline">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 min-w-[150px] max-w-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-muted-foreground">Speed:</span>
              <Slider value={speed} onValueChange={setSpeed} max={100} min={10} step={10} className="flex-1" />
            </div>
          </div>

          <div className="text-xs sm:text-sm text-muted-foreground">
            Step: {currentStep + 1} / {steps.length}
          </div>
        </div>
      </Card>

      <Card className="p-3 sm:p-6 bg-card/50">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">LCS DP Table</h3>
        <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
          <table className="min-w-full border-collapse text-xs sm:text-sm">
            <thead>
              <tr>
                <th className="border border-border p-1.5 sm:p-3 bg-muted sticky left-0 z-10"></th>
                <th className="border border-border p-1.5 sm:p-3 bg-muted"></th>
                {text2.split("").map((char, i) => (
                  <th key={i} className="border border-border p-1.5 sm:p-3 bg-muted font-mono min-w-[32px] sm:min-w-[48px]">
                    {char}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentState?.dp.map((row, i) => (
                <tr key={i}>
                  <td className="border border-border p-1.5 sm:p-3 bg-muted font-mono sticky left-0 z-10">
                    {i === 0 ? "" : text1[i - 1]}
                  </td>
                  {row.map((cell, j) => {
                    const isCurrent = currentState.currentRow === i && currentState.currentCol === j;
                    return (
                      <td
                        key={j}
                        className={`border border-border p-1.5 sm:p-3 text-center transition-all duration-500 min-w-[32px] sm:min-w-[48px] ${
                          isCurrent ? "bg-current/30 scale-110 font-bold" : "bg-background"
                        }`}
                      >
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {currentState?.description && (
        <Card className="p-4 bg-primary/10 border-primary/20">
          <p className="text-sm">{currentState.description}</p>
          {currentState.lcs && (
            <p className="text-sm font-semibold mt-2">
              LCS so far: <span className="font-mono text-primary">{currentState.lcs}</span>
            </p>
          )}
        </Card>
      )}
    </div>
  );
};
