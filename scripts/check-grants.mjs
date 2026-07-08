import pg from "pg";
const password = encodeURIComponent(process.argv[2]);
const conn = `postgresql://postgres:${password}@db.ddgtoebsmmyneumolycy.supabase.co:5432/postgres`;
const client = new pg.Client({ connectionString: conn, ssl: { rejectUnauthorized: false } });
await client.connect();

const res = await client.query(`
  select grantee, privilege_type
  from information_schema.role_table_grants
  where table_name = 'product_completion_rules'
`);
console.log(res.rows);

const rls = await client.query(`
  select relname, relrowsecurity, relforcerowsecurity
  from pg_class
  where relname = 'product_completion_rules'
`);
console.log(rls.rows);

await client.end();
