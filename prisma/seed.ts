import 'dotenv/config';

import { PrismaClient, Role, Schedule } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as process from 'process';

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.user.createMany({
    data: [
      { email: 'nurse@test.com', name: 'Nurse Joy', role: Role.NURSE },
      { email: 'witness@test.com', name: 'Dr. Smith', role: Role.WITNESS },
      { email: 'admin@test.com', name: 'Admin', role: Role.ADMIN },
    ],
  });

  await prisma.medication.createMany({
    data: [
      { name: 'Morphine', schedule: Schedule.II, unit: 'mg', stock: 100 },
      { name: 'Oxycodone', schedule: Schedule.II, unit: 'mg', stock: 50 },
      { name: 'Diazepam', schedule: Schedule.IV, unit: 'mg', stock: 200 },
      { name: 'Ketamine', schedule: Schedule.III, unit: 'ml', stock: 75 },
      { name: 'Lorazepam', schedule: Schedule.IV, unit: 'mg', stock: 120 },
    ],
  });

  console.log('🌱 Seed completed');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
