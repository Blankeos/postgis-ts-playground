// db.js
import postgres from "postgres";

const connectionString =
  Bun.env.DATABASE_URL ??
  "postgresql://postgres:password123@127.0.0.1:5432/postgis_playground";

const sql = postgres(connectionString);

try {
  await sql`SELECT 1`;
  console.log(
    "\x1b[32m[Postgres] Successfully connected to the database.\x1b[0m"
  );
} catch (error) {
  console.log("\x1b[31m[Postgres] Failed to connect to the database.");
  process.exit(1);
}


export default sql;
