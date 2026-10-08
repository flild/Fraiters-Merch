import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const rawDbUrl = process.env.DATABASE_URL || 'sqlite.db';
const fileUrl = rawDbUrl.startsWith('file:') || rawDbUrl.startsWith('libsql:') || rawDbUrl.startsWith('http:') || rawDbUrl.startsWith('https:')
  ? rawDbUrl
  : `file:${path.resolve(process.cwd(), rawDbUrl)}`;

const client = createClient({
  url: fileUrl,
});

export const db = drizzle(client, { schema });
