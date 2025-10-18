import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { runSubsetSum, SubsetSumStep } from "@/utils/algorithms/subsetSum";

export const SubsetSumVisualizer = () => {
  const [numbers] = useState([3, 34, 4, 12, 5, 2]);
  const [target] = useState(9);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState([50]);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<SubsetSumStep[]>([]);

  useEffect(() => {
    resetVisualization();
  }, [numbers, target]);

  const resetVisualization = () => {
    const ssSteps = runSubsetSum(numbers, target);
    setSteps(ssSteps);
    setCurrentStep(0);
    setIsPlaying(false);
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
      <Card className="p-4 bg-muted/50">
        <div className="flex flex-wrap items-center gap-4">
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

          <div className="flex-1 min-w-[200px] max-w-xs">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Speed:</span>
              <Slider value={speed} onValueChange={setSpeed} max={100} min={10} step={10} className="flex-1" />
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Step: {currentStep + 1} / {steps.length}
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-card/50">
        <h3 className="text-lg font-semibold mb-4">DP Table</h3>
        <div className="overflow-x-auto">
          <table className="border-collapse text-xs">
            <thead>
              <tr>
                <th className="border border-border p-2 bg-muted">Num/Sum</th>
                {Array.from({ length: target + 1 }, (_, i) => (
                  <th key={i} className="border border-border p-2 bg-muted font-mono">
                    {i}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentState?.dp.map((row, i) => (
                <tr key={i}>
                  <td className="border border-border p-2 bg-muted font-semibold">
                    {i === 0 ? "0" : numbers[i - 1]}
                  </td>
                  {row.map((cell, j) => {
                    const isCurrent = currentState.currentRow === i && currentState.currentCol === j;
                    return (
                      <td
                        key={j}
                        className={`border border-border p-2 text-center transition-all duration-500 ${
                          isCurrent
                            ? "bg-primary/30 scale-110 font-bold"
                            : cell
                            ? "bg-chart-2/30"
                            : "bg-background"
                        }`}
                      >
                        {cell ? "✓" : "✗"}
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
          {currentState.subset && (
            <p className="text-sm font-semibold mt-2">
              Subset found: <span className="font-mono text-primary">[{currentState.subset.join(", ")}]</span>
            </p>
          )}
        </Card>
      )}

      <Card className="p-4 bg-muted/30">
        <h4 className="font-semibold mb-2">Algorithm:</h4>
        <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
          <li>Create DP table where dp[i][j] = can we make sum j using first i numbers</li>
          <li>Base case: dp[i][0] = true (sum 0 always possible with empty set)</li>
          <li>For each number nums[i] and sum j:</li>
          <li className="ml-6">If nums[i] &gt; j: exclude nums[i], dp[i][j] = dp[i-1][j]</li>
          <li className="ml-6">Else: include or exclude, dp[i][j] = dp[i-1][j] OR dp[i-1][j-nums[i]]</li>
          <li>Result: dp[n][target] tells if subset exists</li>
          <li>Backtrack to find actual subset</li>
        </ol>
      </Card>
    </div>
  );
};
