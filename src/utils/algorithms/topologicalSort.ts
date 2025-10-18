export interface GraphNode {
  id: number;
  x: number;
  y: number;
  label: string;
}

export interface GraphEdge {
  from: number;
  to: number;
}

export interface TopologicalSortStep {
  currentNode: number | null;
  visited: Set<number>;
  stack: number[];
  inDegree: Map<number, number>;
  description: string;
  sorted: number[];
}

export const runTopologicalSort = (nodes: GraphNode[], edges: GraphEdge[]): TopologicalSortStep[] => {
  const steps: TopologicalSortStep[] = [];
  const inDegree = new Map<number, number>();
  const adjacencyList = new Map<number, number[]>();
  const visited = new Set<number>();
  const sorted: number[] = [];

  // Initialize
  nodes.forEach((node) => {
    inDegree.set(node.id, 0);
    adjacencyList.set(node.id, []);
  });

  edges.forEach((edge) => {
    adjacencyList.get(edge.from)?.push(edge.to);
    inDegree.set(edge.to, (inDegree.get(edge.to) || 0) + 1);
  });

  steps.push({
    currentNode: null,
    visited: new Set(visited),
    stack: [],
    inDegree: new Map(inDegree),
    description: "Calculate in-degree for all nodes",
    sorted: [],
  });

  // Find all nodes with in-degree 0
  const queue: number[] = [];
  nodes.forEach((node) => {
    if (inDegree.get(node.id) === 0) {
      queue.push(node.id);
    }
  });

  steps.push({
    currentNode: null,
    visited: new Set(visited),
    stack: [...queue],
    inDegree: new Map(inDegree),
    description: `Nodes with in-degree 0: [${queue.join(", ")}]`,
    sorted: [],
  });

  while (queue.length > 0) {
    const current = queue.shift()!;
    visited.add(current);
    sorted.push(current);

    steps.push({
      currentNode: current,
      visited: new Set(visited),
      stack: [...queue],
      inDegree: new Map(inDegree),
      description: `Processing node ${current}`,
      sorted: [...sorted],
    });

    const neighbors = adjacencyList.get(current) || [];
    for (const neighbor of neighbors) {
      const newInDegree = inDegree.get(neighbor)! - 1;
      inDegree.set(neighbor, newInDegree);

      if (newInDegree === 0) {
        queue.push(neighbor);
      }
    }

    steps.push({
      currentNode: current,
      visited: new Set(visited),
      stack: [...queue],
      inDegree: new Map(inDegree),
      description: `Node ${current} processed. Updated in-degrees.`,
      sorted: [...sorted],
    });
  }

  steps.push({
    currentNode: null,
    visited: new Set(visited),
    stack: [],
    inDegree: new Map(inDegree),
    description: `Topological Sort Complete! Order: [${sorted.join(" → ")}]`,
    sorted: [...sorted],
  });

  return steps;
};
