import pg from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

// We destructure Pool so we can use it as both a value and a type reference
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;