import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { config } from "dotenv";
config({ path: ".env.local" });
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding transactions...");

  const transactions = Array.from({ length: 100 }).map(() => ({
    amount: parseFloat(faker.finance.amount({ min: 100, max: 50000 })),
    type: faker.helpers.arrayElement(['income', 'expense']),
    category: faker.helpers.arrayElement([
      'Salary',
      'Groceries',
      'Rent',
      'Utilities',
      'Entertainment',
      'Travel',
      'Investment',
      'Medical',
      'Dining',
      'Shopping'
    ]),
    note: faker.lorem.sentence(),
    createdAt: faker.date.between({ from: '2024-01-01', to: new Date() }),
  }));

  await prisma.transaction.createMany({ data: transactions });

  console.log("✅ Seeding completed.");
}

main()
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
