import { z } from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { auth } from "@/http/middlewares/auth";

import { prisma } from "../../../lib/prisma";
import { UnauthorizedError } from "../_errors/unauthorized";

export const buildSchemaRequest = z.object({
  title: z.string(),
  overview: z.string(),
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
    legs: z.string().uuid(),
    ring: z.string().uuid(),
    boots: z.string().uuid(),
    chest: z.string().uuid(),
    helmet: z.string().uuid(),
    necklace: z.string().uuid(),
    leftHand: z.string().uuid(),
    backpack: z.string().uuid(),
    rightHand: z.string().uuid(),
    accessory: z.string().uuid(),
  }),
});

export async function createBuild(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      "/builds",
      {
        schema: {
          tags: ["builds"],
          body: buildSchemaRequest,
          summary: "Create a new build",
          response: {
            500: z.null(),
            400: z.object({
              message: z.string(),
            }),
            401: z.object({
              message: z.string(),
            }),
            201: z.object({
              message: z.string(),
              buildId: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { title, overview, strategy, equipment, characterStats, characterClass } = request.body;
        const userId = await request.getCurrentUserId();

        if (!userId) {
          throw new UnauthorizedError("Usuário não autenticado");
        }

        const build = await prisma.build.create({
          data: {
            title,
            userId,
            overview,
            characterClass,
            legsId: equipment.legs,
            ringId: equipment.ring,
            bootsId: equipment.boots,
            chestId: equipment.chest,
            helmetId: equipment.helmet,
            strategy: strategy.join("/-/"),
            leftHandId: equipment.leftHand,
            backpackId: equipment.backpack,
            necklaceId: equipment.necklace,
            rightHandId: equipment.rightHand,
            accessoryId: equipment.accessory,
            characterStats: JSON.stringify(characterStats),
          },
        });

        return reply.status(201).send({
          buildId: build.id,
          message: "Build created successfully",
        });
      }
    );
}
