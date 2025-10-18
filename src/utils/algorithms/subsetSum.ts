export interface SubsetSumStep {
  dp: boolean[][];
  currentRow: number;
  currentCol: number;
  description: string;
  subset?: number[];
}

export const runSubsetSum = (numbers: number[], target: number): SubsetSumStep[] => {
  const steps: SubsetSumStep[] = [];
  const n = numbers.length;
  const dp: boolean[][] = Array.from({ length: n + 1 }, () => Array(target + 1).fill(false));

  for (let i = 0; i <= n; i++) {
    dp[i][0] = true;
  }

  steps.push({
    dp: dp.map((row) => [...row]),
    currentRow: 0,
    currentCol: 0,
    description: `Numbers: [${numbers.join(", ")}], Target: ${target}`,
  });

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= target; j++) {
      const num = numbers[i - 1];

      if (j < num) {
        dp[i][j] = dp[i - 1][j];
        steps.push({
          dp: dp.map((row) => [...row]),
          currentRow: i,
          currentCol: j,
          description: `${num} > ${j}: exclude ${num}`,
        });
      } else {
        dp[i][j] = dp[i - 1][j] || dp[i - 1][j - num];
        steps.push({
          dp: dp.map((row) => [...row]),
          currentRow: i,
          currentCol: j,
          description: `Check: exclude ${num} OR include ${num} (use ${j - num})`,
        });
      }
    }
  }

  // Backtrack to find subset
  const subset: number[] = [];
  if (dp[n][target]) {
    let i = n,
      j = target;
    while (i > 0 && j > 0) {
      if (!dp[i - 1][j]) {
        subset.push(numbers[i - 1]);
        j -= numbers[i - 1];
      }
      i--;
    }
  }

  steps.push({
    dp: dp.map((row) => [...row]),
    currentRow: n,
    currentCol: target,
    description: dp[n][target]
      ? `Solution found! Subset: [${subset.reverse().join(", ")}]`
      : "No subset found",
    subset: dp[n][target] ? subset : undefined,
  });

  return steps;
};
