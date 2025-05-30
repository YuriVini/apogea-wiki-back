import { z } from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../../../lib/prisma";
import { equipmentSchema } from "../equipments/list-equipments";

export const buildSchema = z.object({
  title: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  overview: z.string(),
  id: z.string().uuid(),
  strategy: z.array(z.string()),
  characterStats: z.object({
    mana: z.number(),
    level: z.number(),
    magic: z.number(),
    class: z.string(),
    health: z.number(),
    hpRegen: z.number(),
    mpRegen: z.number(),
    capacity: z.number(),
    pvpStatus: z.string(),
    weaponSkill: z.number(),
  }),
  equipment: z.object({
    legs: equipmentSchema.nullable(),
    ring: equipmentSchema.nullable(),
    boots: equipmentSchema.nullable(),
    chest: equipmentSchema.nullable(),
    helmet: equipmentSchema.nullable(),
    leftHand: equipmentSchema.nullable(),
    necklace: equipmentSchema.nullable(),
    backpack: equipmentSchema.nullable(),
    rightHand: equipmentSchema.nullable(),
    accessory: equipmentSchema.nullable(),
  }),
});

export const buildSchemaArrayResponse = z.array(buildSchema);

export async function listBuildsByUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/builds/user",
    {
      schema: {
        tags: ["builds"],
        summary: "List builds by current user",
        response: { 500: z.null(), 200: z.array(buildSchema) },
      },
    },
    async (request, reply) => {
      const userId = await request.getCurrentUserId();

      const builds = await prisma.build.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          ring: true,
          legs: true,
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
          overview: build.overview,
          createdAt: build.createdAt,
          updatedAt: build.updatedAt,
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

      return reply.send(buildsFormatted || []);
    }
  );
}
