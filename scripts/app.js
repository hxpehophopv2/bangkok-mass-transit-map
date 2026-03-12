import { findPath } from "./routing.js";
import { Line, Station } from "./models.js";
import { calculateTotalFare } from "./pricing.js";

const originInput = document.getElementById("originInput");
const destInput = document.getElementById("destInput");
const originStations = document.getElementById("originStations");
const destStations = document.getElementById("destStations");
const searchBtn = document.getElementById("searchBtn");
const outputEl = document.getElementById("output");
let transitGraph = {};
let purpleMatrix = null;
let redMatrix = null;
let pinkMatrix = null;
let yellowMatrix = null;

async function initApp() {
  const [
    res1,
    res2,
    res3,
    res4,
    res5,
    res6,
    res7,
    res8,
    res9,
    res10,
    res11,
    res12,
    res13,
    res14,
  ] = await Promise.all([
    fetch("../data/arl.json"),
    fetch("../data/btsSilom.json"),
    fetch("../data/btsSukhumvit.json"),
    fetch("../data/mrtBL.json"),
    fetch("../data/mrtPK.json"),
    fetch("../data/mrtPP.json"),
    fetch("../data/mrtYL.json"),
    fetch("../data/srtRN.json"),
    fetch("../data/srtRW.json"),
    fetch("../data/btsG.json"),
    fetch("../data/fareMatrices/mrtPKFare.json"),
    fetch("../data/fareMatrices/mrtPPFare.json"),
    fetch("../data/fareMatrices/mrtYLFare.json"),
    fetch("../data/fareMatrices/srtRFare.json"),
  ]);

  const [
    arl,
    btsSilom,
    btsSukhumvit,
    mrtBL,
    mrtPK,
    mrtPP,
    mrtYL,
    srtRN,
    srtRW,
    btsG, // The 10 Arrays
    pkFare,
    ppFare,
    ylFare,
    srtFare, // The 4 Matrices
  ] = await Promise.all([
    res1.json(),
    res2.json(),
    res3.json(),
    res4.json(),
    res5.json(),
    res6.json(),
    res7.json(),
    res8.json(),
    res9.json(),
    res10.json(),
    res11.json(),
    res12.json(),
    res13.json(),
    res14.json(),
  ]);
  purpleMatrix = ppFare;
  redMatrix = srtFare;
  pinkMatrix = pkFare;
  yellowMatrix = ylFare;
  const allStations = [
    ...arl,
    ...btsSilom,
    ...btsSukhumvit,
    ...mrtBL,
    ...mrtPK,
    ...mrtPP,
    ...mrtYL,
    ...srtRN,
    ...srtRW,
    ...btsG,
  ];
  console.log("Total stations loaded:", allStations.length);

  const lines = {
    btsSukhumvit: new Line("Sukhumvit", "Light Green", "#009E60", "BTS"),
    btsSilom: new Line("Silom", "Dark Green", "#005E41", "BTS"),
    btsSukhumvitExt: new Line(
      "Sukhumvit Extension",
      "Light Green",
      "#009E60",
      "BTS_EXT",
    ),
    btsSilomExt: new Line(
      "Silom Extension",
      "Dark Green",
      "#005E41",
      "BTS_EXT",
    ),
    arl: new Line("Airport Rail Link", "ARL", "#441903", "Asia Era One"),
    mrtBL: new Line("Blue", "Chaloem Ratchamongkol", "#0000FF", "BEM"),
    mrtPP: new Line("Purple", "Chalong Ratchatham", "#800080", "mrtPP"),
    srtRN: new Line("Dark Red", "Dark Red", "#761212", "SRT"),
    srtRW: new Line("Light Red", "Light Red", "#b14444", "SRT"),
    mrtYL: new Line("Yellow", "Yellow", "#FFFF00", "EBM"), // Eastern Bangkok Monorail
    mrtPK: new Line("Pink", "Pink", "#dc1170", "NBM"), // Northern Bangkok Monorail
    btsG: new Line("Gold", "Gold", "#967c14", "BTS_G"),
  };

  // --- PASS 1: Build the dots (Stations) ---
  for (let data of allStations) {
    let stationLine = lines[data.line];
    transitGraph[data.id] = new Station(
      data.id,
      data.thName,
      data.enName,
      stationLine,
    );
  }

  // --- PASS 2: Draw the lines (Connections) ---
  for (let data of allStations) {
    let currentStation = transitGraph[data.id];
    if (!data.connections) {
      console.log("🚨 FOUND THE BROKEN DATA:", data);
    }

    for (let conn of data.connections) {
      let targetStation = transitGraph[conn.target];

      if (targetStation === undefined) {
        console.log(
          `🚨 RED ALERT! Station ${data.id} is trying to connect to a ghost target: "${conn.target}"`,
        );
      }

      currentStation.connects(
        targetStation,
        conn.time,
        conn.isTransfer || false,
        conn.isCrossOp || false,
      );
    }
  }

  for (let station of Object.values(transitGraph)) {
    // Create an option for the Origin
    const optOrigin = document.createElement("option");
    optOrigin.value = station.id + " - " + station.enName;
    originStations.appendChild(optOrigin); // Make sure you use the variable from the top of your file!

    // Create a SECOND option for the Destination
    const optDest = document.createElement("option");
    optDest.value = station.id + " - " + station.enName;
    destStations.appendChild(optDest);
  }
  console.log("App is ready");
}

initApp();

searchBtn.addEventListener("click", () => {
  console.log("searching...");

  const originID = originInput.value.split(" - ")[0];
  const destID = destInput.value.split(" - ")[0];
  if (!originID || !destID) return;
  else console.log(`Origin from ${originID} and going to ${destID}`);

  console.log("INSPECTING ORIGIN:", transitGraph[originID]);

  const routeResult = findPath(transitGraph, originID, destID, "cost");
  const routeCost = calculateTotalFare(
    routeResult.path,
    transitGraph,
    purpleMatrix,
    redMatrix,
    pinkMatrix,
    yellowMatrix,
  );
  console.log(routeResult);

  if (routeResult.error) {
    outputEl.innerText = "Error: " + routeResult.error;
  } else {
    // Print the beautiful path!
    outputEl.innerText =
      "Your Route: \n" +
      routeResult.path.join(" ➡️ ") +
      "\n\nTotal Fare: " +
      routeCost +
      " Baht";
  }
});
