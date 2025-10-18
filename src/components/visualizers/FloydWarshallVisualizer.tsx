import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { runFloydWarshall, FloydWarshallStep, WeightedGraphNode, WeightedGraphEdge } from "@/utils/algorithms/floydWarshall";

export const FloydWarshallVisualizer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState([50]);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<FloydWarshallStep[]>([]);

  const defaultNodes: WeightedGraphNode[] = [
    { id: 0, x: 100, y: 100, label: "0" },
    { id: 1, x: 300, y: 100, label: "1" },
    { id: 2, x: 500, y: 100, label: "2" },
    { id: 3, x: 300, y: 250, label: "3" },
  ];

  const defaultEdges: WeightedGraphEdge[] = [
    { from: 0, to: 1, weight: 3 },
    { from: 1, to: 2, weight: 1 },
    { from: 0, to: 3, weight: 5 },
    { from: 3, to: 2, weight: 2 },
    { from: 1, to: 3, weight: 4 },
  ];

  useEffect(() => {
    resetVisualization();
  }, []);

  const resetVisualization = () => {
    const fwSteps = runFloydWarshall(defaultNodes, defaultEdges);
    setSteps(fwSteps);
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
  const INF = 9999;

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
        <h3 className="text-lg font-semibold mb-4">Distance Matrix</h3>
        <div className="overflow-x-auto">
          <table className="border-collapse">
            <thead>
              <tr>
                <th className="border border-border p-3 bg-muted"></th>
                {defaultNodes.map((node) => (
                  <th key={node.id} className="border border-border p-3 bg-muted font-mono">
                    {node.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentState?.distances.map((row, i) => (
                <tr key={i}>
                  <td className="border border-border p-3 bg-muted font-mono">{i}</td>
                  {row.map((cell, j) => {
                    const isCurrent = currentState.i === i && currentState.j === j;
                    const isIntermediate = currentState.k === i || currentState.k === j;
                    return (
                      <td
                        key={j}
                        className={`border border-border p-3 text-center transition-all duration-500 ${
                          isCurrent
                            ? "bg-primary/30 scale-110 font-bold"
                            : isIntermediate
                            ? "bg-chart-2/20"
                            : "bg-background"
                        }`}
                      >
                        {cell === INF ? "∞" : cell}
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
          <li>Initialize distance matrix with edge weights (∞ for no edge)</li>
          <li>Set distance from each vertex to itself as 0</li>
          <li>For each intermediate vertex k:</li>
          <li className="ml-6">For each source vertex i:</li>
          <li className="ml-12">For each destination vertex j:</li>
          <li className="ml-16">If dist[i][k] + dist[k][j] &lt; dist[i][j]:</li>
          <li className="ml-20">Update dist[i][j] = dist[i][k] + dist[k][j]</li>
          <li>Result: shortest paths between all pairs</li>
        </ol>
      </Card>
    </div>
  );
};
