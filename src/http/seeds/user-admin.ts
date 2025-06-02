import { hash } from "bcryptjs";

import { prisma } from "../../lib/prisma";

async function main() {
  console.log("Start seeding user admin...");

  const userAdmin = await prisma.user.findUnique({
    where: {
      email: "admin@admin.com",
    },
  });

  if (userAdmin) {
    console.log("No changes needed.");
    return;
  }

  const passwordHash = await hash(process.env.ADMIN_PASSWORD!, 6);

  await prisma.user.create({
    data: {
      passwordHash,
      name: "Admin",
      role: "ADMIN",
      email: "admin@admin.com",
    },
  });

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
