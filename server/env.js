// Load .env from this directory, regardless of cwd.
// Imported first by index.js and claude.js so process.env is populated
// before any other module (like the Anthropic client) reads it.
import { config } from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '.env') });
