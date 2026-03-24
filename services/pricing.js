export const calculateTotalFare = (
  pathIds,
  stations, // Raw array from DB
  connections, // Raw array from DB
  hopFares, // Raw array from DB
  distanceFares, // Raw array from DB
) => {
  const transferDiscounts = {
    BEM_BL_BEM_PP: 14, // Blue to Purple
    BEM_PP_BEM_BL: 14, // Purple to Blue
  };

  if (!pathIds || pathIds.length === 0) return 0;

  // Convert DB rows -> Maps
  const hopMap = {};
  hopFares.forEach((row) => {
    hopMap[row.operator] = row.fare_array;
  });

  const distMap = {};
  distanceFares.forEach((row) => {
    distMap[`${row.source_station_id}_${row.target_station_id}`] = row.fare;
  });

  const stationOpMap = {};
  stations.forEach((row) => {
    stationOpMap[row.station_id] = row.operator;
  });

  const connectionMap = {};
  connections.forEach((row) => {
    connectionMap[`${row.source_station_id}_${row.target_station_id}`] = row;
  });

  const getBillableHops = (segmentArray) => {
    let hops = 0;
    for (let j = 0; j < segmentArray.length - 1; j++) {
      let thisNodeId = segmentArray[j];
      let nextNodeId = segmentArray[j + 1];
      let conn = connectionMap[`${thisNodeId}_${nextNodeId}`];

      if (conn && conn.is_transfer && !conn.is_cross_op) {
        continue;
      }
      hops++;
    }
    return hops;
  };

  const calculateSegmentPrice = (operator, segment) => {
    let startStation = segment[0];
    let endStation = segment[segment.length - 1];

    if (!hopMap[operator] || hopMap[operator].length === 0) {
      return distMap[`${startStation}_${endStation}`] || 0;
    } else {
      let hops = getBillableHops(segment);
      let fareArray = hopMap[operator];
      return fareArray[hops] || fareArray[fareArray.length - 1];
    }
  };

  // ==========================================
  // PHASE 1: Build the Segments
  // ==========================================
  const segments = [];
  let currentSegment = [pathIds[0]];
  let currentOperator = stationOpMap[pathIds[0]];

  for (let i = 1; i < pathIds.length; i++) {
    let stationId = pathIds[i];
    let operator = stationOpMap[stationId];

    if (operator === currentOperator) {
      currentSegment.push(stationId);
    } else {
      segments.push({
        operator: currentOperator,
        price: calculateSegmentPrice(currentOperator, currentSegment),
      });
      currentSegment = [stationId];
      currentOperator = operator;
    }
  }
  // Push the final segment after the loop ends!
  segments.push({
    operator: currentOperator,
    price: calculateSegmentPrice(currentOperator, currentSegment),
  });

  // ==========================================
  // PHASE 2: Apply Discounts & Calculate Net
  // ==========================================
  let netCost = 0;
  let btsSessionFare = 0;

  for (let i = 0; i < segments.length; i++) {
    let seg = segments[i];
    let price = seg.price;
    let operator = seg.operator;

    // 1. Transfer Discount Logic
    if (i > 0) {
      let prevSeg = segments[i - 1];
      let operatorTransferCheck = `${prevSeg.operator}_${operator}`;

      if (operatorTransferCheck in transferDiscounts) {
        let discount = transferDiscounts[operatorTransferCheck];

        // Safely fetch the base fares for both operators
        let currBaseFare =
          hopMap[operator] && hopMap[operator].length > 0
            ? hopMap[operator][0]
            : 0;
        let prevBaseFare =
          hopMap[prevSeg.operator] && hopMap[prevSeg.operator].length > 0
            ? hopMap[prevSeg.operator][0]
            : 0;

        // THE GHOST CHARGE PATCH
        // If EITHER the previous ride or current ride was exactly 1 station (price == base fare),
        // we boost the discount to completely absorb that 17-baht ghost charge.
        if (
          (price === currBaseFare && currBaseFare > discount) ||
          (prevSeg.price === prevBaseFare && prevBaseFare > discount)
        ) {
          discount = Math.max(currBaseFare, prevBaseFare);
        }

        // Apply discount and prevent negative money
        price = Math.max(0, price - discount);
      }
    }

    // 2. Add to Net Cost & Handle BTS Cap
    if (operator === "BTSC" || operator === "BTSC_EXT") {
      btsSessionFare += price;

      // Look ahead: If this is the final segment, OR the next segment is not a BTS line, cash out the BTS fare.
      let nextOp = i + 1 < segments.length ? segments[i + 1].operator : null;
      if (nextOp !== "BTSC" && nextOp !== "BTSC_EXT") {
        netCost += Math.min(btsSessionFare, 65); // Cap it safely at 65
        btsSessionFare = 0; // Reset in case they transfer back to BTS later
      }
    } else {
      netCost += price;
    }
  }

  return netCost;
};
