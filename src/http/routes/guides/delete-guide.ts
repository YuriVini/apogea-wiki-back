import z from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../../../lib/prisma";
import { auth } from "../../middlewares/auth";
import { NotFoundError } from "../_errors/not-found";
import { UnauthorizedError } from "../_errors/unauthorized";
import { PREFIX_URL, deleteFileHandler } from "../../../services/awsServices";

export const deleteGuide = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      "/guides/:guideId",
      {
        schema: {
          tags: ["guides"],
          summary: "Delete a guide",
          params: z.object({
            guideId: z.string().uuid(),
          }),
          response: {
            204: z.null(),
            400: z.object({
              message: z.string(),
            }),
            401: z.object({
              message: z.string(),
            }),
            404: z.object({
              message: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId();
        const { guideId } = request.params;

        if (!userId) {
          throw new UnauthorizedError("Você não está autorizado a deletar um guia");
        }

        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        const guide = await prisma.guide.findUnique({
          where: { id: guideId },
          include: {
            steps: true,
          },
        });

        if (!guide) {
          throw new NotFoundError("Guia não encontrado");
        }

        if (guide.userId === userId || user?.role === "ADMIN") {
          await Promise.all(
            guide.steps.map(async (step) => {
              if (step.imageUrl && typeof step.imageUrl === "string") {
                const parts = step.imageUrl.split(`${PREFIX_URL}/`);
                if (parts.length > 1) {
                  const key = parts[1];
                  if (typeof key === "string") {
                    await deleteFileHandler(key);
                  }
                }
              }
            })
          );

          await prisma.guide.delete({
            where: { id: guideId },
          });

          return reply.status(204).send();
        }

        throw new UnauthorizedError("Você não tem permissão para deletar este guia");
      }
    );
};
