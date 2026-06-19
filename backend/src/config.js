import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const currentDir = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(currentDir, "../.env");

dotenv.config({ path: envPath });

function requireEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing ${name}. Create backend/.env from backend/.env.example and set the database connection first.`
    );
  }

  return value;
}

export const config = {
  port: Number(process.env.PORT ?? 4000),
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",
  databaseUrl: requireEnv("DATABASE_URL")
};
