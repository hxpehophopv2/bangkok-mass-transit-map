import fs from "fs";
import { Line, Station } from "./models.js";

// 1. Read and parse each file individually
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

const mrtBLRaw = fs.readFileSync(
  new URL("../data/mrtBL.json", import.meta.url),
);
const mrtBLData = JSON.parse(mrtBLRaw);

const mrtPPRaw = fs.readFileSync(
  new URL("../data/mrtPP.json", import.meta.url),
);
const mrtPPData = JSON.parse(mrtPPRaw);

const srtRNRaw = fs.readFileSync(
  new URL("../data/srtRN.json", import.meta.url),
);
const srtRNData = JSON.parse(srtRNRaw);

const srtRWRaw = fs.readFileSync(
  new URL("../data/srtRW.json", import.meta.url),
);
const srtRWData = JSON.parse(srtRWRaw);

// 2. YOUR BRILLIANT SPREAD OPERATOR LOGIC!
const stationsData = [
  ...sukhumvitData,
  ...silomData,
  ...mrtBLData,
  ...mrtPPData,
  ...arlData,
  ...srtRNData,
  ...srtRWData,
];

export const transitGraph = {};

const lines = {
  btsSukhumvit: new Line("Sukhumvit", "Light Green", "#009E60", "BTS"),
  btsSilom: new Line("Silom", "Dark Green", "#005E41", "BTS"),
  btsSukhumvitExt: new Line(
    "Sukhumvit Extension",
    "Light Green",
    "#009E60",
    "BTS_EXT",
  ),
  btsSilomExt: new Line("Silom Extension", "Dark Green", "#005E41", "BTS_EXT"),
  arl: new Line("Airport Rail Link", "ARL", "#441903", "Asia Era One"),
  mrtBL: new Line("Blue", "Chaloem Ratchamongkol", "#0000FF", "BEM"),
  mrtPP: new Line("Purple", "Chalong Ratchatham", "#800080", "mrtPP"),
  srtRN: new Line("Dark Red", "Dark Red", "#761212", "SRT"),
  srtRW: new Line("Light Red", "Light Red", "#b14444", "SRT"),
  btsG: new Line("Gold", "Gold", "#867e12", "btsG"),
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
