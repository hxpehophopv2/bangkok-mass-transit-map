import express from "express";

import {
  getStations,
  getLines,
  getStationConnections,
  getHopFares,
  getDistanceFares,
  calculateRoute,
} from "../controllers/transit.controller.js";

const router = express.Router();

// The Traffic Cop: Pure, clean, and readable.
router.get("/stations", getStations);
router.get("/lines", getLines);
router.get("/station-connections", getStationConnections);
router.get("/hop-fares", getHopFares);
router.get("/distance-fares", getDistanceFares);
router.get("/route", calculateRoute);

export default router;
