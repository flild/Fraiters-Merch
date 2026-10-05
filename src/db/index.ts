import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const sqlite = new Database(path.resolve(process.cwd(), process.env.DATABASE_URL || 'sqlite.db'));

export const db = drizzle(sqlite, { schema });
