import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { runKruskal, KruskalStep, WeightedGraphNode, WeightedGraphEdge } from "@/utils/algorithms/kruskal";

export const KruskalVisualizer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState([50]);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<KruskalStep[]>([]);

  const defaultNodes: WeightedGraphNode[] = [
    { id: 0, x: 100, y: 100, label: "A" },
    { id: 1, x: 300, y: 100, label: "B" },
    { id: 2, x: 500, y: 100, label: "C" },
    { id: 3, x: 200, y: 250, label: "D" },
    { id: 4, x: 400, y: 250, label: "E" },
  ];

  const defaultEdges: WeightedGraphEdge[] = [
    { from: 0, to: 1, weight: 4 },
    { from: 0, to: 3, weight: 2 },
    { from: 1, to: 2, weight: 3 },
    { from: 1, to: 4, weight: 5 },
    { from: 2, to: 4, weight: 1 },
    { from: 3, to: 4, weight: 7 },
    { from: 3, to: 1, weight: 8 },
  ];

  useEffect(() => {
    resetVisualization();
  }, []);

  const resetVisualization = () => {
    const kruskalSteps = runKruskal(defaultNodes, defaultEdges);
    setSteps(kruskalSteps);
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
        <h3 className="text-lg font-semibold mb-4">Graph Visualization</h3>
        <svg width="600" height="350" className="border border-border rounded-lg bg-background">
          {defaultEdges.map((edge, idx) => {
            const fromNode = defaultNodes.find((n) => n.id === edge.from)!;
            const toNode = defaultNodes.find((n) => n.id === edge.to)!;
            const isInMST = currentState?.mstEdges.some(
              (e) =>
                (e.from === edge.from && e.to === edge.to) || (e.from === edge.to && e.to === edge.from)
            );
            const isCurrent =
              currentState?.currentEdge?.from === edge.from && currentState?.currentEdge?.to === edge.to;

            return (
              <g key={idx}>
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={isCurrent ? "hsl(var(--primary))" : isInMST ? "hsl(var(--chart-2))" : "hsl(var(--border))"}
                  strokeWidth={isCurrent ? 4 : isInMST ? 3 : 2}
                  className="transition-all duration-300"
                />
                <text
                  x={(fromNode.x + toNode.x) / 2}
                  y={(fromNode.y + toNode.y) / 2 - 10}
                  fill="hsl(var(--foreground))"
                  className="text-xs font-semibold"
                  textAnchor="middle"
                >
                  {edge.weight}
                </text>
              </g>
            );
          })}
          {defaultNodes.map((node) => (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r={25}
                fill="hsl(var(--background))"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
              />
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-semibold"
                fill="hsl(var(--foreground))"
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>
        <div className="mt-4 text-sm text-muted-foreground">
          <p>Total MST Cost: {currentState?.totalCost || 0}</p>
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
          <li>Sort all edges by weight in ascending order</li>
          <li>Initialize each vertex as its own component (Union-Find)</li>
          <li>For each edge (u,v) in sorted order:</li>
          <li className="ml-6">If u and v are in different components, add edge to MST</li>
          <li className="ml-6">Union the components of u and v</li>
          <li>Repeat until MST has n-1 edges</li>
        </ol>
      </Card>
    </div>
  );
};
