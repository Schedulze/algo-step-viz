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

export interface FloydWarshallStep {
  k: number;
  i: number;
  j: number;
  distances: number[][];
  description: string;
}

export const runFloydWarshall = (nodes: WeightedGraphNode[], edges: WeightedGraphEdge[]): FloydWarshallStep[] => {
  const steps: FloydWarshallStep[] = [];
  const n = nodes.length;
  const INF = 9999;
  const dist: number[][] = Array.from({ length: n }, () => Array(n).fill(INF));

  // Initialize distances
  for (let i = 0; i < n; i++) {
    dist[i][i] = 0;
  }

  edges.forEach((edge) => {
    dist[edge.from][edge.to] = edge.weight;
  });

  steps.push({
    k: -1,
    i: -1,
    j: -1,
    distances: dist.map((row) => [...row]),
    description: "Initialize distance matrix with direct edge weights",
  });

  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        steps.push({
          k,
          i,
          j,
          distances: dist.map((row) => [...row]),
          description: `Checking if path ${i} → ${k} → ${j} is shorter than ${i} → ${j}`,
        });

        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
          steps.push({
            k,
            i,
            j,
            distances: dist.map((row) => [...row]),
            description: `Updated: dist[${i}][${j}] = ${dist[i][j]} (via node ${k})`,
          });
        }
      }
    }
  }

  steps.push({
    k: n,
    i: -1,
    j: -1,
    distances: dist.map((row) => [...row]),
    description: "All-pairs shortest paths computed!",
  });

  return steps;
};
