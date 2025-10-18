export interface MatrixChainStep {
  dp: number[][];
  splits: number[][];
  currentI: number;
  currentJ: number;
  currentK: number;
  description: string;
}

export const runMatrixChain = (dimensions: number[]): MatrixChainStep[] => {
  const steps: MatrixChainStep[] = [];
  const n = dimensions.length - 1;
  const dp: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  const splits: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

  steps.push({
    dp: dp.map((row) => [...row]),
    splits: splits.map((row) => [...row]),
    currentI: -1,
    currentJ: -1,
    currentK: -1,
    description: `Matrices: ${n}, Dimensions: [${dimensions.join(", ")}]`,
  });

  for (let len = 2; len <= n; len++) {
    for (let i = 0; i < n - len + 1; i++) {
      const j = i + len - 1;
      dp[i][j] = Infinity;

      for (let k = i; k < j; k++) {
        steps.push({
          dp: dp.map((row) => [...row]),
          splits: splits.map((row) => [...row]),
          currentI: i,
          currentJ: j,
          currentK: k,
          description: `Try split at k=${k}: M[${i}..${k}] × M[${k + 1}..${j}]`,
        });

        const cost = dp[i][k] + dp[k + 1][j] + dimensions[i] * dimensions[k + 1] * dimensions[j + 1];

        if (cost < dp[i][j]) {
          dp[i][j] = cost;
          splits[i][j] = k;

          steps.push({
            dp: dp.map((row) => [...row]),
            splits: splits.map((row) => [...row]),
            currentI: i,
            currentJ: j,
            currentK: k,
            description: `Updated: dp[${i}][${j}] = ${cost}, split at ${k}`,
          });
        }
      }
    }
  }

  steps.push({
    dp: dp.map((row) => [...row]),
    splits: splits.map((row) => [...row]),
    currentI: -1,
    currentJ: -1,
    currentK: -1,
    description: `Minimum operations: ${dp[0][n - 1]}`,
  });

  return steps;
};
