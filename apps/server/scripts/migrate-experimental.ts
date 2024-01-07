/**
 * 💀 THIS FILE IS UNUSED. KEPT IT FOR FUTURE REFERENCE.
 *
 * This is very WIP. I tried building my own Goose in Bun.
 * Instead, I just decided to install Go and Goose. It works great, even
 * outside of Go projects.
 */
import postgres from "postgres";
import fs from "node:fs";
import path from "node:path";

/** Schema Path relative to root. */
const SCHEMA_PATH = "src/database/schema";

// ===========================================================================
// Connection
// ===========================================================================
const CONNECTION_STRING =
  Bun.env.DATABASE_URL ??
  "postgresql://postgres:password123@127.0.0.1:5432/postgis_playground";

const sql = postgres(CONNECTION_STRING);

// ===========================================================================
// Run Migration
// ===========================================================================
async function main() {
  // await sql`
  //   create table if not exists public.changelog (
  //       id SERIAL PRIMARY KEY,
  //       file_name VARCHAR(255) NOT NULL,
  //       date_applied TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  //   )
  //   `;

  const schemaFiles = fs.readdirSync(path.resolve(SCHEMA_PATH));

  console.log(schemaFiles);

  sql.end();
}

main();
