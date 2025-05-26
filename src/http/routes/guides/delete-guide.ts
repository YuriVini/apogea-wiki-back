import z from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "@/lib/prisma";
import { auth } from "@/http/middlewares/auth";

import { NotFoundError } from "../_errors/not-found";
import { UnauthorizedError } from "../_errors/unauthorized";

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

        const guide = await prisma.guide.findUnique({
          where: { id: guideId },
        });

        if (!guide) {
          throw new NotFoundError("Guia não encontrado");
        }

        if (guide.userId !== userId) {
          throw new UnauthorizedError("Você não tem permissão para deletar este guia");
        }

        await prisma.guide.delete({
          where: { id: guideId },
        });

        return reply.status(204).send();
      }
    );
};
