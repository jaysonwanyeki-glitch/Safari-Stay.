import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// The pool and db are created lazily so that importing this module never
// throws — even when DATABASE_URL is not set (e.g. during `next build`
// before env vars are available). The connection is only established when
// the first query actually runs.
const globalForDb = globalThis as typeof globalThis & {
  __safariPool?: Pool;
  __safariDb?: NodePgDatabase<Record<string, never>>;
};

export function getPool(): Pool {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add it to your .env file or your platform's environment variables."
    );
  }
  if (!globalForDb.__safariPool) {
    // Neon-style URLs carry sslmode=require, which pg v8.20+ prints a warning
    // about (it treats prefer/require/verify-ca as aliases for verify-full).
    // Normalize it into an explicit ssl option so the terminal stays quiet and
    // the TLS behavior is the same as before (verify-full against Neon).
    let connectionString = url;
    let ssl: boolean | { rejectUnauthorized: boolean } | undefined;
    try {
      const parsed = new URL(url);
      const sslmode = parsed.searchParams.get("sslmode");
      if (sslmode) parsed.searchParams.delete("sslmode");
      connectionString = parsed.toString();
      ssl = sslmode && sslmode !== "disable" ? { rejectUnauthorized: true } : false;
    } catch {
      // Not a parseable URL — let pg handle it as-is.
    }
    globalForDb.__safariPool = new Pool({ connectionString, ssl });
  }
  return globalForDb.__safariPool;
}

export function getDb(): NodePgDatabase<Record<string, never>> {
  if (!globalForDb.__safariDb) {
    globalForDb.__safariDb = drizzle(getPool());
  }
  return globalForDb.__safariDb;
}

// Lazily forwards every call (select, insert, execute, …) to the real db,
// which is created on first use. Preserves the original `db` import style.
export const db = new Proxy({} as NodePgDatabase<Record<string, never>>, {
  get(_target, prop) {
    const d = getDb();
    const value = Reflect.get(d, prop, d);
    return typeof value === "function" ? value.bind(d) : value;
  },
});
