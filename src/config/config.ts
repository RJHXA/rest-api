import { config as dotenvConfig } from 'dotenv';
import * as path from 'path';

const cwd = process.cwd();

const root = path.join.bind(cwd);

dotenvConfig({
  path: root('.env'),
});

export const Config = {
  USERS_FILE: process.env.USERS_FILE,
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
};
