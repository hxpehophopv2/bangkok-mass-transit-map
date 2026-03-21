import "dotenv/config";
import fs from "fs";
import pkg from "pg";
const { Client } = pkg;

// 1. Connect to your Postgres Database
// Replace these with your actual database credentials!
const client = new Client({
  user: "postgres",
  password: process.env.POSTGRES_PASSWORD,
  host: "localhost",
  port: 5432,
  database: "through_metro",
});

async function runSeed() {
  await client.connect();
  console.log("🔌 Connected to PostgreSQL!");

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

  const btsGRaw = fs.readFileSync(
    new URL("../data/btsG.json", import.meta.url),
  );
  const btsGData = JSON.parse(btsGRaw);

  const mrtPKRaw = fs.readFileSync(
    new URL("../data/mrtPK.json", import.meta.url),
  );
  const mrtPKData = JSON.parse(mrtPKRaw);

  const mrtYLRaw = fs.readFileSync(
    new URL("../data/mrtYL.json", import.meta.url),
  );
  const mrtYLData = JSON.parse(mrtYLRaw);

  // 2. YOUR BRILLIANT SPREAD OPERATOR LOGIC!
  const allStations = [
    ...sukhumvitData,
    ...silomData,
    ...mrtBLData,
    ...mrtPPData,
    ...arlData,
    ...srtRNData,
    ...srtRWData,
    ...btsGData,
    ...mrtPKData,
    ...mrtYLData,
  ];

  console.log(
    `📦 Found ${allStations.length} stations in JSON. Starting Pass 1...`,
  );

  // --- THE TRANSLATION DICTIONARY ---
  // This converts your old JSON line names into your new Postgres line_id primary keys
  const lineMapping = {
    btsSukhumvit: "SUK",
    btsSilom: "SIL",
    btsSukhumvitExt: "SUK_EXT", // (Just in case your JSON uses these)
    btsSilomExt: "SIL_EXT", // (Just in case your JSON uses these)
    mrtBL: "BL",
    mrtPP: "PP",
    arl: "ARL",
    srtRN: "RN",
    srtRW: "RW",
    mrtPK: "PK",
    mrtYL: "YL",
    btsG: "G",
  };

  // --- PASS 1: INSERT STATIONS ---
  for (let station of allStations) {
    const insertStationSQL = `
      INSERT INTO station (station_id, line_id, th_name, en_name)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (station_id) DO NOTHING;
    `;

    // The $1, $2 variables map exactly to this array to prevent SQL injection
    const sqlLineId = lineMapping[station.line] || station.line;
    const values = [station.id, sqlLineId, station.thName, station.enName];

    try {
      await client.query(insertStationSQL, values);
    } catch (error) {
      console.log("\n🚨 CAUGHT THE CULPRIT!");
      console.log(`Station ID: "${station.id}" (Length: ${station.id.length})`);
      console.log(
        `Line ID trying to insert: "${sqlLineId}" (Length: ${sqlLineId?.length})`,
      );
      console.log(`Original JSON line property: "${station.line}"\n`);
      throw error; // Stop the script
    }
  }
  console.log("✅ Pass 1 Complete: All stations inserted!");

  // --- PASS 2: INSERT CONNECTIONS ---
  console.log("🔗 Starting Pass 2: Linking stations together...");

  for (let station of allStations) {
    if (!station.connections) continue; // Skip if no connections

    for (let conn of station.connections) {
      const insertConnSQL = `
        INSERT INTO station_connection (source_station_id, target_station_id, travel_time_mins, is_transfer, is_cross_operator)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (source_station_id, target_station_id) DO NOTHING;
      `;

      const values = [
        station.id,
        conn.target,
        conn.time,
        conn.isTransfer || false,
        conn.isCrossOp || false,
      ];

      await client.query(insertConnSQL, values);
    }
  }

  console.log("✅ Pass 2 Complete: All connections created!");

  console.log("💸 Phase 3: Injecting Distance Fares...");

  // 1. Read the massive JSON matrix
  const mrtPKFareRaw = fs.readFileSync(
    new URL("../data/fareMatrices/mrtPKFare.json", import.meta.url),
  );
  const mrtPPFareRaw = fs.readFileSync(
    new URL("../data/fareMatrices/mrtPPFare.json", import.meta.url),
  );
  const mrtYLFareRaw = fs.readFileSync(
    new URL("../data/fareMatrices/mrtYLFare.json", import.meta.url),
  );
  const srtRFareRaw = fs.readFileSync(
    new URL("../data/fareMatrices/srtRFare.json", import.meta.url),
  );
  const mrtPKFare = JSON.parse(mrtPKFareRaw);
  const mrtPPFare = JSON.parse(mrtPPFareRaw);
  const mrtYLFare = JSON.parse(mrtYLFareRaw);
  const srtRFare = JSON.parse(srtRFareRaw);
  const distanceFares = {
    ...mrtPKFare,
    ...mrtPPFare,
    ...mrtYLFare,
    ...srtRFare,
  };

  // 2. The Double Loop
  // The outer loop grabs the source station (e.g., "RW06")
  for (const [sourceStation, targetList] of Object.entries(distanceFares)) {
    // The inner loop grabs every target and fare for that specific source
    for (const [targetStation, fareAmount] of Object.entries(targetList)) {
      const insertFareSQL = `
      INSERT INTO distance_fare (source_station_id, target_station_id, fare)
      VALUES ($1, $2, $3)
      ON CONFLICT (source_station_id, target_station_id) DO NOTHING;
    `;

      // Pass the exact variables to the query
      const values = [sourceStation, targetStation, fareAmount];

      await client.query(insertFareSQL, values);
    }
  }

  console.log("✅ Distance fares locked and loaded!");

  await client.end();
  console.log("👋 Disconnected from database.");
}

// Run the script!
runSeed().catch((err) => console.error("🚨 Error seeding database:", err));
