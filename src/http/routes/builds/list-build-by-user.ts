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
  userId: z.string().uuid(),
  strategy: z.array(z.string()),
  characterClass: z.enum(["Knight", "Mage", "Squire", "Rogue"]),
  characterStats: z.object({
    mana: z.number(),
    level: z.number(),
    magic: z.number(),
    health: z.number(),
    hpRegen: z.number(),
    mpRegen: z.number(),
    capacity: z.number(),
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
    "/builds/user/:userId",
    {
      schema: {
        tags: ["builds"],
        summary: "List builds by current user",
        response: { 500: z.null(), 200: z.array(buildSchema) },
        params: z.object({
          userId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      console.log("userId");
      const { userId } = request.params;

      const builds = await prisma.build.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          legs: true,
          ring: true,
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

      const buildsFormatted: z.infer<typeof buildSchemaArrayResponse> = builds.map((build) => {
        return {
          id: build.id,
          title: build.title,
          userId: build.userId,
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
