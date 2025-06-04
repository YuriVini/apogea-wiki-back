import { z } from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../../../lib/prisma";
import { auth } from "../../middlewares/auth";
import { NotFoundError } from "../_errors/not-found";
import { UnauthorizedError } from "../_errors/unauthorized";

export async function deleteBuild(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      "/builds/:id",
      {
        schema: {
          tags: ["builds"],
          summary: "Delete a build",
          params: z.object({
            id: z.string().uuid(),
          }),
          response: {
            500: z.null(),
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

        const build = await prisma.build.findUnique({
          where: { id },
        });

        if (!build) {
          throw new NotFoundError("Build não encontrada");
        }

        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (build.userId === userId || user?.role === "ADMIN") {
          await prisma.build.delete({
            where: { id },
          });

          return reply.status(204).send();
        }

        throw new UnauthorizedError("Não autorizado");
      }
    );
}
