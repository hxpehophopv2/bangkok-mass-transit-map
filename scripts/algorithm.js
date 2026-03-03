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

// A simplified fare table using your array index logic!
// Index 0 = 0 hops (same station), Index 1 = 1 hop, Index 2 = 2 hops, etc.
const fareTables = {
  BTS: [17, 17, 21, 25, 28, 31, 34, 37, 40, 43, 47], // Core line caps at 47
  BEM: [17, 17, 20, 22, 25, 27, 30, 32, 35, 37, 40, 42, 45], // MRT Blue Line
};

export function calculateTotalFare(pathIds, transitGraph) {
  if (!pathIds || pathIds.length === 0) return 0;

  let netCost = 0;
  let currentSegment = [pathIds[0]];
  let currentOperator = transitGraph[pathIds[0]].line.operator;

  // We will create a helper function right inside here to count "billable" hops
  function getBillableHops(segmentArray) {
    let hops = 0;
    // Loop through the segment to check the connections between each step
    for (let j = 0; j < segmentArray.length - 1; j++) {
      let thisNode = transitGraph[segmentArray[j]];
      let nextNodeId = segmentArray[j + 1];

      // Find the specific connection data between these two nodes
      let connection = thisNode.connections.find(
        (c) => c.station.id === nextNodeId,
      );

      // If it is a transfer AND it's the same operator (like Siam to Siam), it's free!
      // Otherwise, add 1 to the hop count.
      if (connection && connection.isTransfer && !connection.isCrossOp) {
        // Do nothing! It's a free walk.
      } else {
        hops++;
      }
    }
    return hops;
  }

  for (let i = 1; i < pathIds.length; i++) {
    let stationId = pathIds[i];
    let operator = transitGraph[stationId].line.operator;

    if (operator === currentOperator) {
      currentSegment.push(stationId);
    } else {
      // USE OUR NEW SMART COUNTER HERE:
      let hops = getBillableHops(currentSegment);

      netCost +=
        fareTables[currentOperator][hops] ||
        fareTables[currentOperator][fareTables[currentOperator].length - 1];

      currentSegment = [stationId];
      currentOperator = operator;
    }
  }

  // AND USE IT FOR THE FINAL SEGMENT HERE:
  let finalHops = getBillableHops(currentSegment);
  netCost +=
    fareTables[currentOperator][finalHops] ||
    fareTables[currentOperator][fareTables[currentOperator].length - 1];

  return netCost;
}
