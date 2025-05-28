import { z } from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../../../lib/prisma";
import { UnauthorizedError } from "../_errors/unauthorized";

export async function createBuild(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/builds",
    {
      schema: {
        tags: ["builds"],
        summary: "Create a new build",
        response: {
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
        body: z.object({
          title: z.string(),
          overview: z.string(),
          strategy: z.array(z.string()),
          mainSkills: z.array(z.string()),
          requirements: z.array(z.string()),
          supportSkills: z.array(z.string()),
          equipment: z.array(
            z.object({
              name: z.string(),
              type: z.string(),
              slot: z.string(),
              category: z.string(),
              imageUrl: z.string(),
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
            pvpStatus: z.string(),
            weaponSkill: z.number(),
          }),
        }),
      },
    },
    async (request, reply) => {
      const { title, overview, strategy, equipment, mainSkills, requirements, supportSkills, characterStats } = request.body;

      const userId = await request.getCurrentUserId();

      if (!userId) {
        throw new UnauthorizedError("Usuário não autenticado");
      }

      const build = await prisma.build.create({
        include: {
          strategy: true,
          equipment: true,
          mainSkills: true,
          requirements: true,
          supportSkills: true,
          characterStats: true,
        },
        data: {
          title,
          userId,
          overview,
          equipment: {
            create: equipment,
          },
          characterStats: {
            create: characterStats,
          },
          mainSkills: {
            create: mainSkills.map((name) => ({ name })),
          },
          strategy: {
            create: strategy.map((content) => ({ content })),
          },
          requirements: {
            create: requirements.map((name) => ({ name })),
          },

          supportSkills: {
            connectOrCreate: supportSkills.map((name) => ({
              create: { name },
              where: { id: name },
            })),
          },
        },
      });

      return reply.status(201).send({
        buildId: build.id,
        message: "Build created successfully",
      });
    }
  );
}
