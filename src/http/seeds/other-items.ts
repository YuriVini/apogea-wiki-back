import { PrismaClient } from "@prisma/client";

import { OTHER_DATABASE } from "../routes/other-items/const";

const prisma = new PrismaClient();

async function main() {
  // Seed other items
  for (const item of OTHER_DATABASE) {
    await prisma.otherItem.create({
      data: {
        hp: item.hp,
        exp: item.exp,
        name: item.name,
        type: item.type,
        loot: item.loot,
        text: item.text,
        notes: item.notes,
        buffs: item.buffs,
        weight: item.weight,
        sellTo: item.sellTo,
        dropBy: item.dropBy,
        author: item.author,
        imageUrl: item.imageUrl,
        location: item.location,
        abilities: item.abilities,
        npcLocation: item.location,
        description: item.description,
        satiateTime: item.satiateTime,
        requirements: item.requirements,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
