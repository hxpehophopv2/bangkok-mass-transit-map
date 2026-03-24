export const calculateTransfers = (path, connections) => {
  let transferCount = 0;

  // Dictionary/map for connections
  const connectionMap = {};
  connections.forEach((row) => {
    connectionMap[`${row.source_station_id}_${row.target_station_id}`] =
      row.is_transfer;
  });

  for (let station = 0; station < path.length - 1; station++) {
    let currentStation = path[station];
    let nextStation = path[station + 1];
    const isTransfer = connectionMap[`${currentStation}_${nextStation}`];

    if (isTransfer) transferCount++;
  }

  return transferCount;
};
