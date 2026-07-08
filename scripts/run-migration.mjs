import pg from "pg";
import fs from "fs";

const password = encodeURIComponent(process.argv[3]);
const conn = `postgresql://postgres:${password}@db.ddgtoebsmmyneumolycy.supabase.co:5432/postgres`;

const client = new pg.Client({ connectionString: conn, ssl: { rejectUnauthorized: false } });
const sql = fs.readFileSync(process.argv[2], "utf8");

try {
  await client.connect();
  await client.query(sql);
  console.log("OK: migration aplicada");
} catch (e) {
  console.error("ERRO:", e.message);
  process.exit(1);
} finally {
  await client.end();
}
