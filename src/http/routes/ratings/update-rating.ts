import { z } from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "@/lib/prisma";
import { auth } from "@/http/middlewares/auth";

import { NotFoundError } from "../_errors/not-found";
import { UnauthorizedError } from "../_errors/unauthorized";

const updateRatingBodySchema = z.object({
  comment: z.string().optional(),
  value: z.number().min(1).max(5),
});

const updateRatingParamsSchema = z.object({
  ratingId: z.string().uuid(),
});

export async function updateRating(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      "/ratings/:ratingId",
      {
        schema: {
          tags: ["ratings"],
          summary: "Update a rating",
          body: updateRatingBodySchema,
          params: updateRatingParamsSchema,
          response: {
            400: z.object({
              message: z.string(),
            }),
            401: z.object({
              message: z.string(),
            }),
            404: z.object({
              message: z.string(),
            }),
            200: z.object({
              message: z.string(),
              rating: z.object({
                value: z.number(),
                createdAt: z.date(),
                updatedAt: z.date(),
                id: z.string().uuid(),
                comment: z.string().nullable(),
                buildId: z.string().uuid().nullable(),
                guideId: z.string().uuid().nullable(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId();
        const { ratingId } = updateRatingParamsSchema.parse(request.params);
        const { value, comment } = updateRatingBodySchema.parse(request.body);

        if (!userId) {
          throw new UnauthorizedError("Usuário não autenticado");
        }

        const rating = await prisma.rating.findUnique({
          where: { id: ratingId },
        });

        if (!rating) {
          throw new NotFoundError("Avaliação não encontrada");
        }

        if (rating.userId !== userId) {
          throw new UnauthorizedError("Você só pode atualizar suas próprias avaliações");
        }

        const updatedRating = await prisma.rating.update({
          where: { id: ratingId },
          data: {
            value,
            comment,
          },
        });

        return reply.status(200).send({
          message: "Avaliação atualizada com sucesso",
          rating: {
            id: updatedRating.id,
            value: updatedRating.value,
            buildId: updatedRating.buildId,
            comment: updatedRating.comment,
            guideId: updatedRating.guideId,
            createdAt: updatedRating.createdAt,
            updatedAt: updatedRating.updatedAt,
          },
        });
      }
    );
}
