export interface CoinChangeStep {
  dp: number[];
  currentIndex: number;
  currentCoin: number;
  description: string;
  coins?: number[];
}

export const runCoinChange = (coins: number[], amount: number): CoinChangeStep[] => {
  const steps: CoinChangeStep[] = [];
  const dp: number[] = Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  steps.push({
    dp: [...dp],
    currentIndex: 0,
    currentCoin: 0,
    description: `Coins: [${coins.join(", ")}], Amount: ${amount}`,
  });

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      steps.push({
        dp: [...dp],
        currentIndex: i,
        currentCoin: coin,
        description: `For amount ${i}, trying coin ${coin}`,
      });

      if (coin <= i && dp[i - coin] !== Infinity) {
        if (dp[i - coin] + 1 < dp[i]) {
          dp[i] = dp[i - coin] + 1;
          steps.push({
            dp: [...dp],
            currentIndex: i,
            currentCoin: coin,
            description: `Updated: dp[${i}] = ${dp[i]} (using coin ${coin})`,
          });
        }
      }
    }
  }

  // Backtrack to find coins used
  const usedCoins: number[] = [];
  if (dp[amount] !== Infinity) {
    let remaining = amount;
    while (remaining > 0) {
      for (const coin of coins) {
        if (remaining >= coin && dp[remaining - coin] === dp[remaining] - 1) {
          usedCoins.push(coin);
          remaining -= coin;
          break;
        }
      }
    }
  }

  steps.push({
    dp: [...dp],
    currentIndex: amount,
    currentCoin: 0,
    description:
      dp[amount] !== Infinity
        ? `Minimum coins: ${dp[amount]}, Coins used: [${usedCoins.join(", ")}]`
        : "No solution possible",
    coins: dp[amount] !== Infinity ? usedCoins : undefined,
  });

  return steps;
};
