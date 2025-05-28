import { z } from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../../../lib/prisma";

export async function deleteBuild(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/builds/:id",
    {
      schema: {
        tags: ["builds"],
        summary: "Delete a build",
        params: z.object({
          id: z.string().uuid(),
        }),
        response: {
          204: z.null(),
          403: z.object({
            message: z.string(),
          }),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const userId = await request.getCurrentUserId();

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

      // Delete the build and all related data
      await prisma.build.delete({
        where: { id },
      });

      return reply.status(204).send();
    }
  );
}
