import { client } from "../config/db.config.js";

export const fetchAllStations = async () => {
  const query = `
    SELECT station.*, line.operator 
    FROM station JOIN line
    ON station.line_id = line.line_id;
  `;

  const result = await client.query(query);
  return result.rows;
};

export const fetchAllLines = async () => {
  const result = await client.query("SELECT * FROM line");
  return result.rows;
};

export const fetchAllConnections = async () => {
  const result = await client.query("SELECT * FROM station_connection");
  return result.rows;
};

export const fetchAllHopFares = async () => {
  const result = await client.query("SELECT * FROM hop_fare");
  return result.rows;
};

export const fetchAllDistanceFares = async () => {
  const result = await client.query("SELECT * FROM distance_fare");
  return result.rows;
};
