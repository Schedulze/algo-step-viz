export interface EditDistanceStep {
  dp: number[][];
  currentRow: number;
  currentCol: number;
  description: string;
  operations?: string[];
}

export const runEditDistance = (word1: string, word2: string): EditDistanceStep[] => {
  const steps: EditDistanceStep[] = [];
  const m = word1.length;
  const n = word2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  steps.push({
    dp: dp.map((row) => [...row]),
    currentRow: 0,
    currentCol: 0,
    description: `Transform "${word1}" to "${word2}"`,
  });

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
        steps.push({
          dp: dp.map((row) => [...row]),
          currentRow: i,
          currentCol: j,
          description: `'${word1[i - 1]}' = '${word2[j - 1]}': no operation needed`,
        });
      } else {
        const insertCost = dp[i][j - 1] + 1;
        const deleteCost = dp[i - 1][j] + 1;
        const replaceCost = dp[i - 1][j - 1] + 1;

        dp[i][j] = Math.min(insertCost, deleteCost, replaceCost);

        let operation = "";
        if (dp[i][j] === replaceCost) operation = "replace";
        else if (dp[i][j] === deleteCost) operation = "delete";
        else operation = "insert";

        steps.push({
          dp: dp.map((row) => [...row]),
          currentRow: i,
          currentCol: j,
          description: `'${word1[i - 1]}' ≠ '${word2[j - 1]}': ${operation} (cost: ${dp[i][j]})`,
        });
      }
    }
  }

  // Backtrack to find operations
  const operations: string[] = [];
  let i = m,
    j = n;
  while (i > 0 || j > 0) {
    if (i === 0) {
      operations.push(`Insert '${word2[j - 1]}'`);
      j--;
    } else if (j === 0) {
      operations.push(`Delete '${word1[i - 1]}'`);
      i--;
    } else if (word1[i - 1] === word2[j - 1]) {
      i--;
      j--;
    } else {
      const replaceCost = dp[i - 1][j - 1];
      const deleteCost = dp[i - 1][j];
      const insertCost = dp[i][j - 1];
      const minCost = Math.min(replaceCost, deleteCost, insertCost);

      if (minCost === replaceCost) {
        operations.push(`Replace '${word1[i - 1]}' with '${word2[j - 1]}'`);
        i--;
        j--;
      } else if (minCost === deleteCost) {
        operations.push(`Delete '${word1[i - 1]}'`);
        i--;
      } else {
        operations.push(`Insert '${word2[j - 1]}'`);
        j--;
      }
    }
  }

  steps.push({
    dp: dp.map((row) => [...row]),
    currentRow: m,
    currentCol: n,
    description: `Minimum operations: ${dp[m][n]}`,
    operations: operations.reverse(),
  });

  return steps;
};
