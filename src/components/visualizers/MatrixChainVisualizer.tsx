import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { runMatrixChain, MatrixChainStep } from "@/utils/algorithms/matrixChain";

export const MatrixChainVisualizer = () => {
  const [dimensions] = useState([10, 20, 30, 40, 30]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState([50]);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<MatrixChainStep[]>([]);

  useEffect(() => {
    resetVisualization();
  }, [dimensions]);

  const resetVisualization = () => {
    const mcSteps = runMatrixChain(dimensions);
    setSteps(mcSteps);
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
        <h3 className="text-lg font-semibold mb-4">Cost Matrix (DP Table)</h3>
        <div className="overflow-x-auto">
          <table className="border-collapse">
            <thead>
              <tr>
                <th className="border border-border p-3 bg-muted"></th>
                {currentState?.dp[0]?.map((_, j) => (
                  <th key={j} className="border border-border p-3 bg-muted font-mono">
                    {j}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentState?.dp.map((row, i) => (
                <tr key={i}>
                  <td className="border border-border p-3 bg-muted font-mono">{i}</td>
                  {row.map((cell, j) => {
                    const isCurrent = currentState.currentI === i && currentState.currentJ === j;
                    return (
                      <td
                        key={j}
                        className={`border border-border p-3 text-center transition-all duration-500 ${
                          isCurrent ? "bg-primary/30 scale-110 font-bold" : "bg-background"
                        }`}
                      >
                        {cell === 0 ? "-" : cell === Infinity ? "∞" : cell}
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
        </Card>
      )}

      <Card className="p-4 bg-muted/30">
        <h4 className="font-semibold mb-2">Algorithm:</h4>
        <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
          <li>Given matrices A1, A2, ..., An with dimensions p0×p1, p1×p2, ..., pn-1×pn</li>
          <li>Create DP table where dp[i][j] = minimum cost to multiply Ai...Aj</li>
          <li>Base case: dp[i][i] = 0 (single matrix, no multiplication)</li>
          <li>For each chain length L from 2 to n:</li>
          <li className="ml-6">For each starting position i:</li>
          <li className="ml-12">Try all split points k between i and j</li>
          <li className="ml-12">Cost = dp[i][k] + dp[k+1][j] + pi×pk+1×pj+1</li>
          <li className="ml-12">Choose k that minimizes cost</li>
          <li>Result: dp[0][n-1] gives minimum operations</li>
        </ol>
      </Card>
    </div>
  );
};
