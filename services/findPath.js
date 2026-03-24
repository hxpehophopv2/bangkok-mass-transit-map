// WANG'S NOTE: This was adapted from the now deprecated ../scripts/routing.js
export const findPath = (graph, startId, endId, optimizeFor = "time") => {
  const distances = {};
  const previous = {};
  const unvisited = new Set();

  for (let id in graph) {
    distances[id] = Infinity;
    previous[id] = null;
    unvisited.add(id);
  }
  distances[startId] = 0;

  while (unvisited.size > 0) {
    let currNodeId = null;
    for (let id of unvisited) {
      if (currNodeId === null || distances[id] < distances[currNodeId]) {
        currNodeId = id;
      }
    }

    if (currNodeId === endId || distances[currNodeId] === Infinity) break;

    unvisited.delete(currNodeId);

    for (let conn of graph[currNodeId]) {
      let neighborId = conn.node;

      if (!unvisited.has(neighborId)) continue;

      let weight = optimizeFor === "time" ? conn.time : conn.costWeight;

      let newDistance = distances[currNodeId] + weight;

      if (newDistance < distances[neighborId]) {
        distances[neighborId] = newDistance;
        previous[neighborId] = currNodeId;
      }
    }
  }

  const path = [];
  let current = endId;
  while (current !== null) {
    path.unshift(current);
    current = previous[current];
  }

  if (path.length === 1 && startId !== endId) {
    return { error: "No path found between these stations." };
  }

  return {
    path: path,
    totalMetric: distances[endId],
    optimizedFor: optimizeFor,
  };
};
