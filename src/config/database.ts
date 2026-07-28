//Import libraries
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// Following list env. variables
const required_env_varibles = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];
for (const env_var of required_env_varibles) {
  if (!process.env[env_var]) {
    throw new Error(
      `Critical Config Erros: Envirnoment varible ${env_var} is missing...`,
    );
  }
}

// Implemented Connection Pool
export const db = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 20, //Conn. Channels
  idleTimeoutMillis: 10000, //Idle Wait TimeOut
  connectionTimeoutMillis: 2000, //Channel Connect TimeOut
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: true }
      : false, // Security related to production or Staging/Development
});

// Connected to Postgres DB
db.on("connect", () => {
  console.log(`Postgresql Pool Connected Successfully.`);
});

// Error While Connecting To Postgres DB
db.on("error", (error) => {
  console.error(`Unexpected database error: ${error}`);
  //process.exit(-1);
});

/*Handling The Failed Conn. Pool
There is an sudden Interption then this function will take care off to clear the request & stops ccepting requests & clearts the connection pool & then exit.
SIGINT & SIGTERM are Operating System commands. Used to terminate or stop. 
*/
const handleShutdown = async () => {
  console.log(`Closing Connection Pool...`);
  await db.end();
  console.log(`Postgresql Pool Closed`);
  process.exit(0);
};

process.on("SIGTERM", handleShutdown);
process.on("SIGINT", handleShutdown);
