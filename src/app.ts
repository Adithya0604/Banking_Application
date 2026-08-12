//import express, .env, db
import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import { db } from "./config/database";
import cors from "cors";
import helmet from "helmet";
import { rateLimit, ipKeyGenerator } from "express-rate-limit";
import authRoutes from "./routes/auth.routes";

const app = express();
const PORT = process.env.PORT;

/*Rules to talk with API's. CPS(Content_sercurity_policy), XSS(Scripts), etc. Basically, How should all other to be behaving while they talk to my API. */
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

/*Who are suppose to talk with my API */
app.use(
  cors({
    origin: process.env.AllowedOrigin ?? "",
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    credentials: true,
  }),
);

//Global Limter For All Public API's
const globalLimit = rateLimit({
  //windowTime
  windowMs: 60 * 15 * 1000,
  //Limit per Window For Each IP
  limit: 10,
  //Rate Limit Headers Return
  standardHeaders: "draft-7",
  //legacyheaders
  legacyHeaders: false,
  //Identification of IP.
  keyGenerator: (req) => ipKeyGenerator(req.ip ?? ""),
  //message for that requests.
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: "TOO_MANY_REQUEST",
        message: "Too Many Requests. Please Try Again After 15 Min...",
      },
    });
  },
  skipSuccessfulRequests: true,
});

//OTP Limter
const otpLimit = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req.ip ?? ""),
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: "TOO_MANY_REQUESTS",
        message: "Limit Crossed. Wait until cooling peroid...",
      },
    });
  },
  skipSuccessfulRequests: true,
});

// Payments Limiters

//Security Purpose
app.use(express.json({ strict: false }));
app.disable("x-powered-by");

//Logging Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`,
    );
  });
  next();
});

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

//User Creation
app.use("/api/v1/auth", globalLimit, authRoutes);

//Global Error hanlder
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(`[Internal Server Error]: ${err}`);
  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: err.message || "AN UNEXPECTED ERROR OCCURRED ON THE SERVER.",
    },
  });
});

//Port Listen
app.listen(PORT, () => {
  console.log(`Core Banking Running on http://localhost:${PORT}`);
});

export default app;
