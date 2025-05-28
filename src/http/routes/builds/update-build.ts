import { z } from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../../../lib/prisma";
import { buildSchemaRequest } from "./list-build-by-user";

export async function updateBuild(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    "/builds/:id",
    {
      schema: {
        tags: ["builds"],
        summary: "Update a build",
        params: z.object({
          id: z.string().uuid(),
        }),
        response: {
          200: buildSchemaRequest,
          403: z.object({
            message: z.string(),
          }),
          404: z.object({
            message: z.string(),
          }),
        },
        body: z.object({
          title: z.string().optional(),
          overview: z.string().optional(),
          strategy: z.array(z.string()).optional(),
          mainSkills: z.array(z.string()).optional(),
          requirements: z.array(z.string()).optional(),
          supportSkills: z.array(z.string()).optional(),
          equipment: z
            .array(
              z.object({
                name: z.string(),
                type: z.string(),
                slot: z.string(),
                category: z.string(),
                imageUrl: z.string(),
              })
            )
            .optional(),
          characterStats: z
            .object({
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
            })
            .optional(),
        }),
      },
    },
    async (request, reply) => {
      const userId = await request.getCurrentUserId();
      const { id } = request.params;
      const updateData = request.body;

      // Verify if the build belongs to the user
      const build = await prisma.build.findUnique({
        where: { id },
      });

      if (!build) {
        return reply.status(404).send({ message: "Build not found" });
      }

      if (build.userId !== userId) {
        return reply.status(403).send({ message: "Not authorized" });
      }

      // Update the build
      const updatedBuild = await prisma.build.update({
        where: { id },
        include: {
          strategy: true,
          equipment: true,
          mainSkills: true,
          requirements: true,
          supportSkills: true,
          characterStats: true,
        },
        data: {
          title: updateData.title,
          overview: updateData.overview,
          characterStats: updateData.characterStats
            ? {
                update: updateData.characterStats,
              }
            : undefined,
          equipment: updateData.equipment
            ? {
                deleteMany: {},
                create: updateData.equipment,
              }
            : undefined,
          strategy: updateData.strategy
            ? {
                deleteMany: {},
                create: updateData.strategy.map((content) => ({ content })),
              }
            : undefined,
          requirements: updateData.requirements
            ? {
                deleteMany: {},
                create: updateData.requirements.map((name) => ({ name })),
              }
            : undefined,
          mainSkills: updateData.mainSkills
            ? {
                set: [],
                connectOrCreate: updateData.mainSkills.map((name) => ({
                  create: { name },
                  where: { id: name },
                })),
              }
            : undefined,
          supportSkills: updateData.supportSkills
            ? {
                set: [],
                connectOrCreate: updateData.supportSkills.map((name) => ({
                  create: { name },
                  where: { id: name },
                })),
              }
            : undefined,
        },
      });

      return reply.send(buildSchemaRequest.parse(updatedBuild));
    }
  );
}
