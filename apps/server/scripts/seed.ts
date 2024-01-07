import path from "path";
import postgres from "postgres";

const CONNECTION_STRING =
  Bun.env.DATABASE_URL ??
  "postgresql://postgres:password123@127.0.0.1:5432/postgis_playground";

const sql = postgres(CONNECTION_STRING);

const fileName = Bun.argv[2];

if (!fileName) {
  console.log(
    "Please provide the name of the .sql file in src/database/seed/* as an argument."
  );
  process.exit(1);
}

const main = async () => {
  const filePath = path.join("src/database/seed/", fileName);
  const result = await sql.file(filePath);

  console.log(`-- ✨ --`);
  console.log("Finished seeding...");
  sql.end();
};

main();
// const queries = fileContent
//   .replace(/(\r\n|\n|\r)/gm, " ") // remove newlines
//   .replace(/\s+/g, " ") // excess white space
//   .split(";") // split into all statements
//   .map(Function.prototype.call, String.prototype.trim)
//   .filter(function (el) {
//     return el.length != 0;
//   }); // remove any empty ones

// queries.forEach(async (query) => {
//   try {
//     await sql`${query}`;
//   } catch (error) {
//     console.log(`Failed to execute query: ${query}`, error);
//   }
// });
