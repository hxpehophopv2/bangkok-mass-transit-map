import { transitGraph } from "./network.js";
import { calculateTotalFare, findPath } from "./algorithm.js";

// Test
// console.log("Asok's connections:", transitGraph["E4"]);
// console.log("Asok's connections:", transitGraph["E4"].connections.length);
// console.log("Asok's connections:", transitGraph["E4"].cnt());

// const route = findPath(transitGraph, "E3", "BL23", "time");
const route = findPath(transitGraph, "S5", "N1", "time");
const fare = calculateTotalFare(route.path, transitGraph);
console.log(route, fare);
