import { z } from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../../../lib/prisma";

export const buildSchemaRequest = z.object({
  title: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  overview: z.string(),
  id: z.string().uuid(),
  userId: z.string().uuid(),
  mainSkills: z.array(
    z.object({
      name: z.string(),
      id: z.string().uuid(),
    })
  ),
  strategy: z.array(
    z.object({
      content: z.string(),
      id: z.string().uuid(),
    })
  ),
  requirements: z.array(
    z.object({
      name: z.string(),
      id: z.string().uuid(),
    })
  ),
  supportSkills: z.array(
    z.object({
      name: z.string(),
      id: z.string().uuid(),
    })
  ),
  equipment: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
      slot: z.string(),
      category: z.string(),
      imageUrl: z.string(),
      id: z.string().uuid(),
    })
  ),
  characterStats: z.object({
    mana: z.number(),
    level: z.number(),
    magic: z.number(),
    class: z.string(),
    health: z.number(),
    hpRegen: z.number(),
    mpRegen: z.number(),
    capacity: z.number(),
    id: z.string().uuid(),
    pvpStatus: z.string(),
    weaponSkill: z.number(),
  }),
});

export const buildSchemaResponse = z.array(buildSchemaRequest);

export async function listBuildsByUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/builds/user",
    {
      schema: {
        tags: ["builds"],
        summary: "List builds by current user",
        response: {
          200: buildSchemaResponse,
        },
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
          strategy: true,
          equipment: true,
          mainSkills: true,
          requirements: true,
          supportSkills: true,
          characterStats: true,
        },
      });

      return reply.send(buildSchemaResponse.parse(builds));
    }
  );
}
