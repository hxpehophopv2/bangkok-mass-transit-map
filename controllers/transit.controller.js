import {
  fetchAllStations,
  fetchAllLines,
  fetchAllConnections,
  fetchAllHopFares,
  fetchAllDistanceFares,
} from "../models/transit.model.js";
import { findPath } from "../services/findPath.js";
import { calculateTotalFare } from "../services/pricing.js";
import { calculateTotalTime } from "../services/timing.js";
import { calculateTransfers } from "../services/transfers.js";

export const getStations = async (req, res) => {
  try {
    const stations = await fetchAllStations();
    res.json(stations);
  } catch (error) {
    console.error("Controller Error (Stations):", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getLines = async (req, res) => {
  try {
    const lines = await fetchAllLines();
    res.json(lines);
  } catch (error) {
    console.error("Controller Error (Lines):", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getStationConnections = async (req, res) => {
  try {
    const connections = await fetchAllConnections();
    res.json(connections);
  } catch (error) {
    console.error("Controller Error (Connections):", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getHopFares = async (req, res) => {
  try {
    const fares = await fetchAllHopFares();
    res.json(fares);
  } catch (error) {
    console.error("Controller Error (Hop Fares):", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getDistanceFares = async (req, res) => {
  try {
    const fares = await fetchAllDistanceFares();
    res.json(fares);
  } catch (error) {
    console.error("Controller Error (Distance Fares):", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 2. The Big Brain Route Handler
export const calculateRoute = async (req, res) => {
  try {
    const { start, end } = req.query;

    if (!start || !end)
      return res.status(400).json({ error: "Missing start or end!" });

    const stations = await fetchAllStations();
    const hopFares = await fetchAllHopFares();
    const distanceFares = await fetchAllDistanceFares();
    const connections = await fetchAllConnections();
    const graph = {};

    for (let row of connections) {
      const source = row.source_station_id;
      const target = row.target_station_id;

      if (!graph[source]) graph[source] = [];

      graph[source].push({
        node: target,
        time: row.travel_time_mins,
        costWeight: row.is_transfer ? 15 : 1,
      });
    }

    // Pass the user's preference into your math (defaults to "time" if they don't provide one)
    const timeRoute = findPath(graph, start, end, "time");
    const costRoute = findPath(graph, start, end, "cost");

    // TIME ROUTE
    timeRoute.totalFare = calculateTotalFare(
      timeRoute.path,
      stations,
      connections,
      hopFares,
      distanceFares,
    );
    timeRoute.totalTime = calculateTotalTime(timeRoute.path, connections);
    timeRoute.totalTransfers = calculateTransfers(timeRoute.path, connections);
    timeRoute.totalStations = timeRoute.path.length - 1;

    // COST ROUTE
    costRoute.totalFare = calculateTotalFare(
      costRoute.path,
      stations,
      connections,
      hopFares,
      distanceFares,
    );
    costRoute.totalTime = calculateTotalTime(costRoute.path, connections);
    costRoute.totalTransfers = calculateTransfers(costRoute.path, connections);
    costRoute.totalStations = costRoute.path.length - 1;

    res.json({
      timeOptimized: timeRoute,
      costOptimized: costRoute,
    });
  } catch (error) {
    console.error("🚨 Routing error:", error);
    res.status(500).json({ error: "Routing engine crashed" });
  }
};
