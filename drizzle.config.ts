import { defineConfig } from "drizzle-kit";

// Neon URLs carry sslmode=require, which pg v8.20+ prints a warning about
// (it treats prefer/require/verify-ca as aliases for verify-full). Rewriting it
// to verify-full keeps the exact same TLS behavior but with quiet output.
const rawUrl =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@127.0.0.1:5432/app_db";
const url = rawUrl.replace(/sslmode=(prefer|require|verify-ca)\b/i, "sslmode=verify-full");

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  dbCredentials: {
    url,
  },
});
