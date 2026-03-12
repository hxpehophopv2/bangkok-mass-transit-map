import { transitGraph } from "./network.js";
import { findPath } from "./routing.js";
import { calculateTotalFare } from "./pricing.js";
// import { calculateTotalFare, findPath } from "./algorithm.js";

// Test
// console.log("Asok's connections:", transitGraph["E4"]);
// console.log("Asok's connections:", transitGraph["E4"].connections.length);
// console.log("Asok's connections:", transitGraph["E4"].cnt());

// const route = findPath(transitGraph, "E3", "BL23", "time");
const route_time = findPath(transitGraph, "RN10", "A1", "time");
const route_cost = findPath(transitGraph, "RN10", "A1", "cost");
const fare = calculateTotalFare(route_time.path, transitGraph);
const fare2 = calculateTotalFare(route_cost.path, transitGraph);
console.log(route_time, fare);
console.log(route_cost, fare2);
