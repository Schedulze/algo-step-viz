export interface WeightedGraphNode {
  id: number;
  x: number;
  y: number;
  label: string;
}

export interface WeightedGraphEdge {
  from: number;
  to: number;
  weight: number;
}

export interface PrimStep {
  currentNode: number | null;
  mstNodes: Set<number>;
  mstEdges: WeightedGraphEdge[];
  distances: Map<number, number>;
  description: string;
  totalCost: number;
}

export const runPrim = (
  nodes: WeightedGraphNode[],
  edges: WeightedGraphEdge[],
  startNode: number
): PrimStep[] => {
  const steps: PrimStep[] = [];
  const mstNodes = new Set<number>();
  const mstEdges: WeightedGraphEdge[] = [];
  const distances = new Map<number, number>();
  let totalCost = 0;

  // Build adjacency list for undirected graph
  const adjacencyList = new Map<number, Array<{ node: number; weight: number }>>();
  nodes.forEach((node) => adjacencyList.set(node.id, []));
  edges.forEach((edge) => {
    adjacencyList.get(edge.from)?.push({ node: edge.to, weight: edge.weight });
    adjacencyList.get(edge.to)?.push({ node: edge.from, weight: edge.weight });
  });

  nodes.forEach((node) => distances.set(node.id, node.id === startNode ? 0 : Infinity));

  steps.push({
    currentNode: null,
    mstNodes: new Set(mstNodes),
    mstEdges: [],
    distances: new Map(distances),
    description: `Starting from node ${startNode}`,
    totalCost: 0,
  });

  mstNodes.add(startNode);

  steps.push({
    currentNode: startNode,
    mstNodes: new Set(mstNodes),
    mstEdges: [],
    distances: new Map(distances),
    description: `Node ${startNode} added to MST`,
    totalCost: 0,
  });

  while (mstNodes.size < nodes.length) {
    let minEdge: WeightedGraphEdge | null = null;
    let minWeight = Infinity;

    for (const nodeId of mstNodes) {
      const neighbors = adjacencyList.get(nodeId) || [];
      for (const { node: neighbor, weight } of neighbors) {
        if (!mstNodes.has(neighbor) && weight < minWeight) {
          minWeight = weight;
          minEdge = { from: nodeId, to: neighbor, weight };
        }
      }
    }

    if (!minEdge) break;

    steps.push({
      currentNode: minEdge.to,
      mstNodes: new Set(mstNodes),
      mstEdges: [...mstEdges],
      distances: new Map(distances),
      description: `Found minimum edge (${minEdge.from}, ${minEdge.to}) with weight ${minEdge.weight}`,
      totalCost,
    });

    mstNodes.add(minEdge.to);
    mstEdges.push(minEdge);
    totalCost += minEdge.weight;

    steps.push({
      currentNode: minEdge.to,
      mstNodes: new Set(mstNodes),
      mstEdges: [...mstEdges],
      distances: new Map(distances),
      description: `Node ${minEdge.to} added to MST. Total cost: ${totalCost}`,
      totalCost,
    });
  }

  steps.push({
    currentNode: null,
    mstNodes: new Set(mstNodes),
    mstEdges: [...mstEdges],
    distances: new Map(distances),
    description: `MST Complete! Total cost: ${totalCost}`,
    totalCost,
  });

  return steps;
};
