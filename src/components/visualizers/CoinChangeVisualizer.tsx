import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { runCoinChange, CoinChangeStep } from "@/utils/algorithms/coinChange";

export const CoinChangeVisualizer = () => {
  const [coins] = useState([1, 2, 5]);
  const [amount] = useState(11);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState([50]);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<CoinChangeStep[]>([]);

  useEffect(() => {
    resetVisualization();
  }, [coins, amount]);

  const resetVisualization = () => {
    const ccSteps = runCoinChange(coins, amount);
    setSteps(ccSteps);
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
        <h3 className="text-lg font-semibold mb-4">DP Array</h3>
        <div className="overflow-x-auto">
          <table className="border-collapse">
            <thead>
              <tr>
                {currentState?.dp.map((_, i) => (
                  <th key={i} className="border border-border p-3 bg-muted font-mono text-xs">
                    {i}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {currentState?.dp.map((cell, i) => {
                  const isCurrent = currentState.currentIndex === i;
                  return (
                    <td
                      key={i}
                      className={`border border-border p-3 text-center transition-all duration-500 ${
                        isCurrent ? "bg-primary/30 scale-110 font-bold" : "bg-background"
                      }`}
                    >
                      {cell === Infinity ? "∞" : cell}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex gap-2">
          {coins.map((coin, idx) => (
            <div
              key={idx}
              className={`p-2 rounded border ${
                currentState?.currentCoin === coin ? "border-primary bg-primary/20" : "border-border"
              }`}
            >
              <span className="font-semibold">Coin: {coin}</span>
            </div>
          ))}
        </div>
      </Card>

      {currentState?.description && (
        <Card className="p-4 bg-primary/10 border-primary/20">
          <p className="text-sm">{currentState.description}</p>
          {currentState.coins && (
            <p className="text-sm font-semibold mt-2">
              Coins used: <span className="font-mono text-primary">[{currentState.coins.join(", ")}]</span>
            </p>
          )}
        </Card>
      )}

      <Card className="p-4 bg-muted/30">
        <h4 className="font-semibold mb-2">Algorithm:</h4>
        <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
          <li>Create DP array where dp[i] = minimum coins needed for amount i</li>
          <li>Base case: dp[0] = 0 (0 coins for amount 0)</li>
          <li>Initialize all other values to ∞</li>
          <li>For each amount from 1 to target:</li>
          <li className="ml-6">For each coin denomination:</li>
          <li className="ml-12">If coin ≤ amount and dp[amount - coin] is valid:</li>
          <li className="ml-16">dp[amount] = min(dp[amount], dp[amount - coin] + 1)</li>
          <li>Result: dp[target] gives minimum coins needed</li>
        </ol>
      </Card>
    </div>
  );
};
