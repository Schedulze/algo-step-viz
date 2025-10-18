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

export interface KruskalStep {
  currentEdge: WeightedGraphEdge | null;
  mstEdges: WeightedGraphEdge[];
  parent: Map<number, number>;
  rank: Map<number, number>;
  description: string;
  totalCost: number;
}

class UnionFind {
  parent: Map<number, number>;
  rank: Map<number, number>;

  constructor(nodes: number[]) {
    this.parent = new Map();
    this.rank = new Map();
    nodes.forEach((node) => {
      this.parent.set(node, node);
      this.rank.set(node, 0);
    });
  }

  find(x: number): number {
    if (this.parent.get(x) !== x) {
      this.parent.set(x, this.find(this.parent.get(x)!));
    }
    return this.parent.get(x)!;
  }

  union(x: number, y: number): boolean {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) return false;

    const rankX = this.rank.get(rootX)!;
    const rankY = this.rank.get(rootY)!;

    if (rankX < rankY) {
      this.parent.set(rootX, rootY);
    } else if (rankX > rankY) {
      this.parent.set(rootY, rootX);
    } else {
      this.parent.set(rootY, rootX);
      this.rank.set(rootX, rankX + 1);
    }
    return true;
  }
}

export const runKruskal = (nodes: WeightedGraphNode[], edges: WeightedGraphEdge[]): KruskalStep[] => {
  const steps: KruskalStep[] = [];
  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
  const mstEdges: WeightedGraphEdge[] = [];
  const nodeIds = nodes.map((n) => n.id);
  const uf = new UnionFind(nodeIds);
  let totalCost = 0;

  steps.push({
    currentEdge: null,
    mstEdges: [],
    parent: new Map(uf.parent),
    rank: new Map(uf.rank),
    description: `Sort edges by weight. Processing ${sortedEdges.length} edges.`,
    totalCost: 0,
  });

  for (const edge of sortedEdges) {
    steps.push({
      currentEdge: edge,
      mstEdges: [...mstEdges],
      parent: new Map(uf.parent),
      rank: new Map(uf.rank),
      description: `Checking edge (${edge.from}, ${edge.to}) with weight ${edge.weight}`,
      totalCost,
    });

    if (uf.union(edge.from, edge.to)) {
      mstEdges.push(edge);
      totalCost += edge.weight;
      steps.push({
        currentEdge: edge,
        mstEdges: [...mstEdges],
        parent: new Map(uf.parent),
        rank: new Map(uf.rank),
        description: `Edge (${edge.from}, ${edge.to}) added to MST. Total cost: ${totalCost}`,
        totalCost,
      });
    } else {
      steps.push({
        currentEdge: edge,
        mstEdges: [...mstEdges],
        parent: new Map(uf.parent),
        rank: new Map(uf.rank),
        description: `Edge (${edge.from}, ${edge.to}) creates a cycle. Skipped.`,
        totalCost,
      });
    }
  }

  steps.push({
    currentEdge: null,
    mstEdges: [...mstEdges],
    parent: new Map(uf.parent),
    rank: new Map(uf.rank),
    description: `MST Complete! Total cost: ${totalCost}`,
    totalCost,
  });

  return steps;
};
