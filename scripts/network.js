import fs from "fs";
import { Line, Station } from "./models.js";

// 1. Read and parse each file individually
const mainRaw = fs.readFileSync(
  new URL("../data/stations.json", import.meta.url),
);
const mainData = JSON.parse(mainRaw);

const sukhumvitRaw = fs.readFileSync(
  new URL("../data/btsSukhumvit.json", import.meta.url),
);
const sukhumvitData = JSON.parse(sukhumvitRaw);

const silomRaw = fs.readFileSync(
  new URL("../data/btsSilom.json", import.meta.url),
);
const silomData = JSON.parse(silomRaw);

const arlRaw = fs.readFileSync(new URL("../data/arl.json", import.meta.url));
const arlData = JSON.parse(arlRaw);

const mrtBlueRaw = fs.readFileSync(
  new URL("../data/mrtBlue.json", import.meta.url),
);
const mrtBlueData = JSON.parse(mrtBlueRaw);

// 2. YOUR BRILLIANT SPREAD OPERATOR LOGIC!
const stationsData = [
  ...mainData,
  ...sukhumvitData,
  ...silomData,
  ...mrtBlueData,
  ...arlData,
];

export const transitGraph = {};

const lines = {
  btsSukhumvit: new Line("Sukhumvit", "Light Green", "#009E60", "BTS"),
  btsSilom: new Line("Silom", "Dark Green", "#005E41", "BTS"),
  arl: new Line("Airport Rail Link", "ARL", "#441903", "Era One"),
  mrtBlue: new Line("Blue", "Blue", "#0000FF", "BEM"),
};

// --- PASS 1: Build the dots (Stations) ---
for (let data of stationsData) {
  let stationLine = lines[data.line];
  transitGraph[data.id] = new Station(
    data.id,
    data.thName,
    data.enName,
    stationLine,
  );
}

// --- PASS 2: Draw the lines (Connections) ---
for (let data of stationsData) {
  let currentStation = transitGraph[data.id];

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
