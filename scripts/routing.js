export function findPath(graph, startId, endId, optimizeFor = "time") {
  const distances = {};
  const previous = {};
  const unvisited = new Set();

  // 1. INIT: Set all distances to Infinity, set the start node
  for (let id in graph) {
    distances[id] = Infinity;
    previous[id] = null;
    unvisited.add(id);
  }
  distances[startId] = 0;

  // 2. Main Loop: Keep going if are unvisited stations
  while (unvisited.size > 0) {
    // Find the unvisited station with the smallest known distance/cost
    let currNodeId = null;
    for (let id of unvisited) {
      if (currNodeId === null || distances[id] < distances[currNodeId]) {
        currNodeId = id;
      }
    }

    // If it reached the destination or all remaining nodes are unreachable, stop looking
    if (currNodeId === endId || distances[currNodeId] === Infinity) {
      break;
    }

    // MARKS: Removing visited stations it from the set
    unvisited.delete(currNodeId);
    let currStation = graph[currNodeId];

    // 3. Check the neighbors of the current station
    for (let conn of currStation.connections) {
      let neighborId = conn.station.id;

      // If visited already, SKIP
      if (!unvisited.has(neighborId)) continue;

      // WEIGHT CHOICE: time or cost hops?
      let weight = optimizeFor === "time" ? conn.time : conn.costWeight;

      // Calculate the total distance/cost to this neighbor through the current station
      let newDistance = distances[currNodeId] + weight;

      // If we found a shorter/cheaper path to this neighbor, update our records
      if (newDistance < distances[neighborId]) {
        distances[neighborId] = newDistance;
        previous[neighborId] = currNodeId; // SAVEPOINT
      }
    }
  }

  // 4. CONFIRM: Reconstruct the path by working backward from the destination -> origin
  const path = [];
  let current = endId;
  while (current !== null) {
    path.unshift(current); // Add to the beginning of the array
    current = previous[current];
  }

  // ERROR: If the path only contains the start (and start !== end), no path
  if (path.length === 1 && startId !== endId) {
    return { error: "No path found between these stations." };
  }

  return {
    path: path, // Returns an array of Station IDs
    totalMetric: distances[endId], // Total time / cost hops
    optimizedFor: optimizeFor,
  };
}
