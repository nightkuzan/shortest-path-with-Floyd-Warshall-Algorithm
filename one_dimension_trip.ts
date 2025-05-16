function minEnergy(
  start: number,
  shops: number[],
  stations: number[],
  target: number
): number {
  const allPositions = new Set([start, ...shops, ...stations, target]);
  const positions = [...allPositions].sort((a, b) => a - b);

  const graph: Record<number, Record<number, number>> = {};

  for (const pos of positions) {
    graph[pos] = {};
    for (const nextPos of positions) {
      graph[pos][nextPos] = Math.abs(nextPos - pos);
    }
  }

  for (const station1 of stations) {
    for (const station2 of stations) {
      if (station1 !== station2) {
        graph[station1][station2] = 0;
      }
    }
  }

  for (const k of positions) {
    for (const i of positions) {
      for (const j of positions) {
        graph[i][j] = Math.min(graph[i][j], graph[i][k] + graph[k][j]);
      }
    }
  }

  const memo: Record<string, number> = {};

  const findMinEnergy = (pos: number, remainingShops: number[]): number => {
    const key = `${pos}-${remainingShops.sort().join(",")}`;

    if (memo[key] !== undefined) {
      return memo[key];
    }

    if (remainingShops.length === 0) {
      return graph[pos][target];
    }

    let minRequired = Infinity;

    for (let i = 0; i < remainingShops.length; i++) {
      const shop = remainingShops[i];
      const newRemaining = [
        ...remainingShops.slice(0, i),
        ...remainingShops.slice(i + 1),
      ];

      const energy = graph[pos][shop] + findMinEnergy(shop, newRemaining);
      minRequired = Math.min(minRequired, energy);
    }

    memo[key] = minRequired;
    return minRequired;
  };

  return findMinEnergy(start, [...shops]);
}
