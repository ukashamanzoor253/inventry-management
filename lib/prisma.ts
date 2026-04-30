// import { PrismaClient } from '../app/generated/prisma/client'; // Use generated client
// import { PrismaPg } from '@prisma/adapter-pg';

// const adapter = new PrismaPg({ 
//   connectionString: process.env.DATABASE_URL! 
// });

// const globalForPrisma = global as unknown as { prisma: PrismaClient };

// export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;



import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };