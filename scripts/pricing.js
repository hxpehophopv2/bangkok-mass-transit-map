import fs from "fs";

// ====================================================================================================

const rawPPFare = fs.readFileSync(
  new URL("../data/fareMatrices/mrtPPFare.json", import.meta.url),
);
const purpleFareMatrix = JSON.parse(rawPPFare);
// A simplified fare table using your array index logic!
// Index 0 = 0 hops (same station), Index 1 = 1 hop, Index 2 = 2 hops, etc.

const rawRedFare = fs.readFileSync(
  new URL("../data/fareMatrices/srtRFare.json", import.meta.url),
);
const redFareMatrix = JSON.parse(rawRedFare);

const fareTables = {
  BTS: [17, 17, 21, 25, 28, 31, 34, 37, 40, 43, 47], // Core line caps at 47
  BTS_EXT: [17, 17, 19, 22, 24, 27, 29, 32, 34, 37, 39, 42, 44, 45],
  BEM: [17, 17, 20, 22, 25, 27, 30, 32, 35, 37, 40, 42, 45], // MRT Blue Line
  "Asia Era One": [15, 15, 20, 25, 30, 35, 40, 45],
};

// ====================================================================================================

export function calculateTotalFare(pathIds, transitGraph) {
  if (!pathIds || pathIds.length === 0) return 0;

  let netCost = 0;
  let btsSessionFare = 0;
  let currentSegment = [pathIds[0]];
  let currentOperator = transitGraph[pathIds[0]].line.operator;

  function getBillableHops(segmentArray) {
    let hops = 0;
    for (let j = 0; j < segmentArray.length - 1; j++) {
      let thisNode = transitGraph[segmentArray[j]];
      let nextNodeId = segmentArray[j + 1];

      let connection = thisNode.connections.find(
        (c) => c.station.id === nextNodeId,
      );

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
      let segmentPrice = 0;

      // FORK IN THE ROAD: Which matrix do we use?
      if (currentOperator === "mrtPP") {
        let startStation = currentSegment[0];
        let endStation = currentSegment[currentSegment.length - 1];
        segmentPrice = purpleFareMatrix[startStation][endStation];
      } else if (currentOperator === "SRT") {
        // NEW SRT LOGIC!
        let startStation = currentSegment[0];
        let endStation = currentSegment[currentSegment.length - 1];
        segmentPrice = redFareMatrix[startStation][endStation];
      } else {
        // Classic 1D Hop-Counting for BTS, BTS_EXT, and MRT Blue
        let hops = getBillableHops(currentSegment);
        segmentPrice =
          fareTables[currentOperator][hops] ||
          fareTables[currentOperator][fareTables[currentOperator].length - 1];
      }

      // LOGIC BRANCH: Are we on the BTS network?
      if (currentOperator === "BTS" || currentOperator === "BTS_EXT") {
        btsSessionFare += segmentPrice;

        if (operator !== "BTS" && operator !== "BTS_EXT") {
          if (btsSessionFare > 65) btsSessionFare = 65;
          netCost += btsSessionFare;
          btsSessionFare = 0;
        }
      } else {
        netCost += segmentPrice;
      }

      currentSegment = [stationId];
      currentOperator = operator;
    }
  }

  // FINAL SEGMENT CLEANUP
  let finalSegmentPrice = 0;

  if (currentOperator === "mrtPP") {
    let startStation = currentSegment[0];
    let endStation = currentSegment[currentSegment.length - 1];
    finalSegmentPrice = purpleFareMatrix[startStation][endStation];
  } else if (currentOperator === "SRT") {
    // NEW SRT LOGIC!
    let startStation = currentSegment[0];
    let endStation = currentSegment[currentSegment.length - 1];
    finalSegmentPrice = redFareMatrix[startStation][endStation];
  } else {
    let finalHops = getBillableHops(currentSegment);
    finalSegmentPrice =
      fareTables[currentOperator][finalHops] ||
      fareTables[currentOperator][fareTables[currentOperator].length - 1];
  }

  // ADD TO GRAND TOTAL
  if (currentOperator === "BTS" || currentOperator === "BTS_EXT") {
    btsSessionFare += finalSegmentPrice;
    if (btsSessionFare > 65) btsSessionFare = 65;
    netCost += btsSessionFare;
  } else {
    netCost += finalSegmentPrice;
  }

  return netCost;
}
