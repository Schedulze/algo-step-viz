import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";
import { runDijkstra, WeightedGraphNode, WeightedGraphEdge, DijkstraStep } from "@/utils/algorithms/dijkstra";

export const DijkstraVisualizer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState([50]);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<DijkstraStep[]>([]);
  const [nodes] = useState<WeightedGraphNode[]>([
    { id: 0, x: 150, y: 200, label: "A" },
    { id: 1, x: 300, y: 100, label: "B" },
    { id: 2, x: 450, y: 200, label: "C" },
    { id: 3, x: 300, y: 300, label: "D" },
  ]);
  const [edges] = useState<WeightedGraphEdge[]>([
    { from: 0, to: 1, weight: 4 },
    { from: 0, to: 3, weight: 2 },
    { from: 1, to: 2, weight: 3 },
    { from: 3, to: 1, weight: 1 },
    { from: 3, to: 2, weight: 5 },
  ]);

  useEffect(() => {
    resetVisualization();
  }, []);

  const resetVisualization = () => {
    const dijkstraSteps = runDijkstra(nodes, edges, 0);
    setSteps(dijkstraSteps);
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

  const currentState = steps[currentStep] || { current: null, distances: new Map(), visited: new Set() };

  const getNodeColor = (nodeId: number) => {
    if (currentState.current === nodeId) return "hsl(var(--current))";
    if (currentState.visited.has(nodeId)) return "hsl(var(--visited))";
    return "hsl(var(--unvisited))";
  };

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
              <Settings className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Speed:</span>
              <Slider value={speed} onValueChange={setSpeed} max={100} min={10} step={10} className="flex-1" />
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Step: {currentStep + 1} / {steps.length}
          </div>
        </div>
      </Card>

      <Card className="p-3 sm:p-6 bg-card/50">
        <div className="relative w-full h-[250px] sm:h-[400px] bg-background/50 rounded-lg border border-border overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet">
            {edges.map((edge, idx) => {
              const fromNode = nodes.find((n) => n.id === edge.from);
              const toNode = nodes.find((n) => n.id === edge.to);
              if (!fromNode || !toNode) return null;

              const midX = (fromNode.x + toNode.x) / 2;
              const midY = (fromNode.y + toNode.y) / 2;

              return (
                <g key={idx}>
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke="hsl(var(--border))"
                    strokeWidth="2"
                    className="transition-all duration-300"
                  />
                  <circle cx={midX} cy={midY} r="15" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
                  <text
                    x={midX}
                    y={midY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-foreground text-xs font-semibold select-none"
                  >
                    {edge.weight}
                  </text>
                </g>
              );
            })}

            {nodes.map((node) => {
              const distance = currentState.distances.get(node.id);
              return (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="30"
                    fill={getNodeColor(node.id)}
                    stroke="hsl(var(--foreground))"
                    strokeWidth="2"
                    className="transition-all duration-500"
                  />
                  <text
                    x={node.x}
                    y={node.y - 5}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-foreground font-semibold text-lg select-none"
                  >
                    {node.label}
                  </text>
                  <text
                    x={node.x}
                    y={node.y + 12}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-foreground text-xs select-none"
                  >
                    {distance === Infinity ? "∞" : distance}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </Card>

      <Card className="p-3 sm:p-4 bg-primary/10 border-primary/20">
        <h3 className="font-semibold mb-2 text-sm sm:text-base">Shortest Distances from A:</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {nodes.map((node) => {
            const dist = currentState.distances.get(node.id);
            return (
              <div key={node.id} className="text-xs sm:text-sm">
                <span className="text-muted-foreground">{node.label}:</span>{" "}
                <span className="font-mono">{dist === Infinity ? "∞" : dist}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
