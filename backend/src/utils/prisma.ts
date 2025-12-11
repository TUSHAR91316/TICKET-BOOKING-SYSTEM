import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

console.log('Env loaded:', process.env.DATABASE_URL);
const prisma = new PrismaClient();

export default prisma;
