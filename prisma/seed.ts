import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { config } from "dotenv";

config({ path: ".env.local" });

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding transactions...");

  const user = await prisma.user.findFirst();

  // Check if user exists
  if (!user) {
    console.log("❌ No user found in the database. Please create a user first.");
    return;
  }

  const userId = user.id;

  const transactions = Array.from({ length: 50 }).map(() => ({
    amount: parseFloat(faker.finance.amount({ min: 100, max: 50000 })),
    type: faker.helpers.arrayElement(["income", "expense"]),
    category: faker.helpers.arrayElement([
      "Salary",
      "Groceries",
      "Rent",
      "Utilities",
      "Entertainment",
      "Travel",
      "Investment",
      "Medical",
      "Dining",
      "Shopping",
    ]),
    note: faker.lorem.sentence(),
    createdAt: faker.date.between({ from: "2024-01-01", to: new Date() }),
    userId: userId, // Using userId from fetched user
  }));

  try {
    await prisma.transaction.createMany({ data: transactions });
    console.log("✅ Seeding completed.");
  } catch (err) {
    console.error("❌ Error occurred while seeding transactions:", err);
  }
}

main()
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
