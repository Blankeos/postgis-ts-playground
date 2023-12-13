// db.js
import postgres from "postgres";

const connectionString =
  Bun.env.DATABASE_URL ??
  "postgresql://postgres:password123@127.0.0.1:5432/postgis_playground";

const sql = postgres(connectionString);

export default sql;
