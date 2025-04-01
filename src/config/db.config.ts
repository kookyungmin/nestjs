import { registerAs } from "@nestjs/config";

const supportedDbTypes = [
  'mysql',
  'postgres',
] as const;

type SupportedDbType = typeof supportedDbTypes[number];


interface DbInfo {
  type: 'mysql' | 'postgres';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  poolSize: number;
}

function validateDbType(type: string): SupportedDbType {
  if (supportedDbTypes.includes(type as SupportedDbType)) {
    return type as SupportedDbType;
  }
  throw new Error(`Unsupported database type: ${type}`);
}

export default registerAs<DbInfo> ('db', () => ({
  type: validateDbType(process.env.DB_TYPE || ''),
  host: process.env.DB_HOST || '',
  port: +(process.env.DB_PORT || 3306),
  username: process.env.DB_USER || '',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || '',
  poolSize: +(process.env.DB_POOL_SIZE || 10)
}));
