// prisma/quick-seed.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding test data...");

  // Clear existing data (optional, so reruns stay clean)
  await db.activity.deleteMany();
  await db.project.deleteMany();
  await db.user.deleteMany();

  // Create a test user
  const password = await bcrypt.hash("password123", 12);
  const user = await db.user.create({
    data: {
      email: "carywwhite@live.com",
      password,
      name: "Cary White",
    },
  });

  // Create multiple projects
  const projectTitles = [
    "Space Colony Alpha",
    "AI Research Notes",
    "Ocean Cleanup Prototype",
    "Family Budget Tracker",
    "Recipe Organizer",
  ];

  for (const [i, title] of projectTitles.entries()) {
    await db.project.create({
      data: {
        title,
        description: `Demo project #${i + 1}`,
        status: i % 2 === 0 ? "in_progress" : "todo",
        ownerId: user.id,
      },
    });
  }

  console.log("✅ Seed complete!");
  console.log(`User: ${user.email} / password123`);
}

main()
  .catch((e) => console.error(e))
  .finally(() => db.$disconnect());
