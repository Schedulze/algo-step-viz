import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { runEditDistance, EditDistanceStep } from "@/utils/algorithms/editDistance";

export const EditDistanceVisualizer = () => {
  const [word1, setWord1] = useState("HORSE");
  const [word2, setWord2] = useState("ROS");
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState([50]);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<EditDistanceStep[]>([]);

  useEffect(() => {
    resetVisualization();
  }, [word1, word2]);

  const resetVisualization = () => {
    if (word1 && word2) {
      const edSteps = runEditDistance(word1, word2);
      setSteps(edSteps);
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
      <Card className="p-4 bg-muted/50">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">From:</label>
            <Input
              value={word1}
              onChange={(e) => setWord1(e.target.value.toUpperCase())}
              className="w-32"
              maxLength={10}
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">To:</label>
            <Input
              value={word2}
              onChange={(e) => setWord2(e.target.value.toUpperCase())}
              className="w-32"
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
        <h3 className="text-lg font-semibold mb-4">Edit Distance DP Table</h3>
        <div className="overflow-x-auto">
          <table className="border-collapse">
            <thead>
              <tr>
                <th className="border border-border p-3 bg-muted"></th>
                <th className="border border-border p-3 bg-muted"></th>
                {word2.split("").map((char, i) => (
                  <th key={i} className="border border-border p-3 bg-muted font-mono">
                    {char}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentState?.dp.map((row, i) => (
                <tr key={i}>
                  <td className="border border-border p-3 bg-muted font-mono">
                    {i === 0 ? "" : word1[i - 1]}
                  </td>
                  {row.map((cell, j) => {
                    const isCurrent = currentState.currentRow === i && currentState.currentCol === j;
                    return (
                      <td
                        key={j}
                        className={`border border-border p-3 text-center transition-all duration-500 ${
                          isCurrent ? "bg-primary/30 scale-110 font-bold" : "bg-background"
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
          {currentState.operations && (
            <div className="mt-2">
              <p className="text-sm font-semibold">Operations:</p>
              <ol className="text-xs list-decimal list-inside text-muted-foreground mt-1">
                {currentState.operations.map((op, idx) => (
                  <li key={idx}>{op}</li>
                ))}
              </ol>
            </div>
          )}
        </Card>
      )}

      <Card className="p-4 bg-muted/30">
        <h4 className="font-semibold mb-2">Algorithm:</h4>
        <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
          <li>Create DP table where dp[i][j] = edit distance between word1[0..i] and word2[0..j]</li>
          <li>Base cases: dp[i][0] = i (delete all), dp[0][j] = j (insert all)</li>
          <li>For each cell (i, j):</li>
          <li className="ml-6">If word1[i-1] == word2[j-1]: dp[i][j] = dp[i-1][j-1]</li>
          <li className="ml-6">Else: dp[i][j] = 1 + min(insert, delete, replace)</li>
          <li className="ml-12">Insert: dp[i][j-1]</li>
          <li className="ml-12">Delete: dp[i-1][j]</li>
          <li className="ml-12">Replace: dp[i-1][j-1]</li>
          <li>Result: dp[m][n] gives minimum operations</li>
        </ol>
      </Card>
    </div>
  );
};
