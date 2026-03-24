import express, { response } from "express";
import cors from "cors";
import { connectDB } from "../config/db.config.js";
import routes from "../routes/transit.routes.js";

// 1. Hire the Waiter
const app = express();
const port = 3000;

// 2. Bouncer at the door (Allows all frontend connections for now)
app.use(cors());
// This allows the Waiter to read JSON data sent by the Customer
app.use(express.json());

// 3. CONNECTS TO DB
await connectDB();

// 4. GET THE ROUTES (Menu)
// "For any URL request, check the transitRoutes file."
app.use("/", routes);

// 5. Open the Restaurant
app.listen(port, () => {
  console.log(`🚀 Waiter is standing by on http://localhost:${port}`);
});
