declare module "*/lib/db.js" {
    import { Pool } from 'pg';
    const pool: Pool;
    export default pool;
}