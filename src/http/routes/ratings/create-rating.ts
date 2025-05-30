import { z } from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "@/lib/prisma";
import { auth } from "@/http/middlewares/auth";

import { BadRequestError } from "../_errors/bad-request";
import { UnauthorizedError } from "../_errors/unauthorized";

const createRatingBodySchema = z.object({
  comment: z.string().optional(),
  value: z.number().min(1).max(5),
  buildId: z.string().uuid().optional(),
  guideId: z.string().uuid().optional(),
});

export async function createRating(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      "/ratings",
      {
        schema: {
          tags: ["ratings"],
          body: createRatingBodySchema,
          summary: "Create a rating for a build or guide",
          response: {
            400: z.object({
              message: z.string(),
            }),
            401: z.object({
              message: z.string(),
            }),
            201: z.object({
              message: z.string(),
              ratingId: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId();
        const { value, comment, buildId, guideId } = createRatingBodySchema.parse(request.body);

        if (!userId) {
          throw new UnauthorizedError("Usuário não autenticado");
        }

        if (!buildId && !guideId) {
          throw new BadRequestError("É necessário fornecer um buildId ou guideId");
        }

        if (buildId && guideId) {
          throw new BadRequestError("Não é possível avaliar uma build e um guia ao mesmo tempo");
        }

        const existingRating = await prisma.rating.findFirst({
          where: {
            userId,
            OR: [{ buildId }, { guideId }],
          },
        });

        if (existingRating) {
          throw new BadRequestError("Você já avaliou este item");
        }

        const rating = await prisma.rating.create({
          data: {
            value,
            userId,
            buildId,
            comment,
            guideId,
          },
        });

        return reply.status(201).send({
          ratingId: rating.id,
          message: "Avaliação criada com sucesso",
        });
      }
    );
}
