import pg from "pg";

const password = encodeURIComponent(process.argv[2]);
const conn = `postgresql://postgres:${password}@db.ddgtoebsmmyneumolycy.supabase.co:5432/postgres`;
const client = new pg.Client({ connectionString: conn, ssl: { rejectUnauthorized: false } });

await client.connect();
const cols = await client.query(`
  select column_name, data_type, is_nullable
  from information_schema.columns
  where table_name = 'contacts'
  order by ordinal_position
`);
console.log("contacts columns:", cols.rows);

const count = await client.query(`select count(*) from contacts`);
console.log("contacts count:", count.rows[0]);

const sample = await client.query(`select * from contacts limit 3`);
console.log("sample:", sample.rows);

await client.end();
