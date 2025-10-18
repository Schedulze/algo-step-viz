import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { runTopologicalSort, TopologicalSortStep, GraphNode, GraphEdge } from "@/utils/algorithms/topologicalSort";

export const TopologicalSortVisualizer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState([50]);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<TopologicalSortStep[]>([]);

  const defaultNodes: GraphNode[] = [
    { id: 0, x: 100, y: 100, label: "A" },
    { id: 1, x: 300, y: 100, label: "B" },
    { id: 2, x: 500, y: 100, label: "C" },
    { id: 3, x: 200, y: 250, label: "D" },
    { id: 4, x: 400, y: 250, label: "E" },
  ];

  const defaultEdges: GraphEdge[] = [
    { from: 0, to: 1 },
    { from: 0, to: 3 },
    { from: 1, to: 2 },
    { from: 1, to: 4 },
    { from: 3, to: 4 },
  ];

  useEffect(() => {
    resetVisualization();
  }, []);

  const resetVisualization = () => {
    const topoSteps = runTopologicalSort(defaultNodes, defaultEdges);
    setSteps(topoSteps);
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
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--border))" />
            </marker>
          </defs>
          {defaultEdges.map((edge, idx) => {
            const fromNode = defaultNodes.find((n) => n.id === edge.from)!;
            const toNode = defaultNodes.find((n) => n.id === edge.to)!;
            const dx = toNode.x - fromNode.x;
            const dy = toNode.y - fromNode.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const unitX = dx / length;
            const unitY = dy / length;
            const endX = toNode.x - unitX * 30;
            const endY = toNode.y - unitY * 30;

            return (
              <line
                key={idx}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={endX}
                y2={endY}
                stroke="hsl(var(--border))"
                strokeWidth={2}
                markerEnd="url(#arrowhead)"
              />
            );
          })}
          {defaultNodes.map((node) => {
            const isVisited = currentState?.visited.has(node.id);
            const isCurrent = currentState?.currentNode === node.id;
            return (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={25}
                  fill={isCurrent ? "hsl(var(--primary))" : isVisited ? "hsl(var(--chart-2))" : "hsl(var(--background))"}
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  className="transition-all duration-300"
                />
                <text
                  x={node.x}
                  y={node.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-semibold"
                  fill={isCurrent || isVisited ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))"}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
        {currentState?.sorted.length > 0 && (
          <div className="mt-4 text-sm">
            <p className="font-semibold">Topological Order:</p>
            <p className="text-muted-foreground">
              {currentState.sorted.map((id) => defaultNodes.find((n) => n.id === id)?.label).join(" → ")}
            </p>
          </div>
        )}
      </Card>

      {currentState?.description && (
        <Card className="p-4 bg-primary/10 border-primary/20">
          <p className="text-sm">{currentState.description}</p>
        </Card>
      )}

      <Card className="p-4 bg-muted/30">
        <h4 className="font-semibold mb-2">Algorithm (Kahn's Algorithm):</h4>
        <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
          <li>Calculate in-degree (number of incoming edges) for each vertex</li>
          <li>Add all vertices with in-degree 0 to a queue</li>
          <li>While queue is not empty:</li>
          <li className="ml-6">Remove a vertex from queue and add to result</li>
          <li className="ml-6">For each neighbor, decrement its in-degree</li>
          <li className="ml-6">If neighbor's in-degree becomes 0, add it to queue</li>
          <li>Result contains vertices in topological order</li>
        </ol>
      </Card>
    </div>
  );
};
