import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  baseUrl: process.env.BASE_URL ?? 'https://ctdevwebfrontend.cma.com.br/CMA/TROM/TRADING-BANRISUL',
  user: process.env.TROM_USER ?? '',
  password: process.env.TROM_PASSWORD ?? '',
};
