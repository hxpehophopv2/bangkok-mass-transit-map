export const calculateTotalTime = (path, connections) => {
  let totalTime = 0;

  // Create a map to check if a connection is a free transfer
  const timeMap = {};
  connections.forEach((row) => {
    timeMap[`${row.source_station_id}_${row.target_station_id}`] =
      row.travel_time_mins;
  });

  for (let station = 0; station < path.length - 1; station++) {
    let currentStation = path[station];
    let nextStation = path[station + 1];
    const time = timeMap[`${currentStation}_${nextStation}`] || 0;

    totalTime += time;
  }

  return totalTime;
};
