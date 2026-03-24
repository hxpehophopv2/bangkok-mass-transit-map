import "dotenv/config";
import pkg from "pg";
const { Client } = pkg;

// UNLOCK
const client = new Client({
  user: "postgres",
  password: process.env.POSTGRES_PASSWORD,
  host: "localhost",
  port: 5432,
  database: "through_metro",
});

// CONNECTS
const connectDB = async () => {
  try {
    await client.connect();
    console.log("🔌 PostgreSQL is unlocked and ready!");
  } catch (error) {
    console.error("ERROR:", error);
    process.exit(1);
  }
};

// 3. Export the client and the connect function so the rest of the app can use them
export { client, connectDB };
