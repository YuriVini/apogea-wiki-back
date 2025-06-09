import { z } from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../../../lib/prisma";
import { buildSchema } from "./list-build-by-user";

export async function listBuilds(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/builds",
    {
      schema: {
        tags: ["builds"],
        summary: "List all builds",
        response: {
          500: z.null(),
          200: z.array(buildSchema),
        },
      },
    },
    async (_request, reply) => {
      const builds = await prisma.build.findMany({
        include: {
          legs: true,
          ring: true,
          user: true,
          boots: true,
          chest: true,
          helmet: true,
          leftHand: true,
          backpack: true,
          necklace: true,
          rightHand: true,
          accessory: true,
        },
      });

      const buildsFormatted = builds.map((build) => {
        return {
          id: build.id,
          title: build.title,
          userId: build.userId,
          author: build.user.name,
          overview: build.overview,
          createdAt: build.createdAt,
          updatedAt: build.updatedAt,
          characterClass: build.characterClass,
          strategy: build.strategy.split("/-/"),
          characterStats: JSON.parse(build.characterStats),
          equipment: {
            ring: build.ring,
            legs: build.legs,
            boots: build.boots,
            chest: build.chest,
            helmet: build.helmet,
            necklace: build.necklace,
            leftHand: build.leftHand,
            backpack: build.backpack,
            rightHand: build.rightHand,
            accessory: build.accessory,
          },
        };
      });

      return reply.send(buildsFormatted);
    }
  );
}
