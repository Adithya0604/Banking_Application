//import express, .env, db
import "dotenv/config";
import express, { Request, Response } from "express";
import { db } from "./config/database";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

//Health Check For DB.
app.get("/health", async (req: Request, res: Response) => {
  try {
    const dbcheck = await db.query(
      "SELECT NOW() AS CURRENT_TIME, CURRENT_DATABASE() AS DB_NAME;",
    );

    res.status(200).json({
      status: "UP",
      timeStamp: dbcheck.rows[0].CURRENT_TIME,
      database: dbcheck.rows[0].DB_NAME,
      message: "Core Banking Engine API Working",
    });
  } catch (error: any) {
    console.error(`Health Check Gone Worng... ${error}`);
    res.status(500).json({
      status: "DOWN",
      error: "Database Connection Gone Worng...",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Core Banking Running on http://localhost:${PORT}`);
});
