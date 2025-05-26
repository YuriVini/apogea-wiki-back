import z from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "@/lib/prisma";
import { auth } from "@/http/middlewares/auth";

import { NotFoundError } from "../_errors/not-found";

export const profile = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      "/me",
      {
        schema: {
          tags: ["user"],
          summary: "Get user information",
          response: {
            404: z.object({
              message: z.string(),
            }),
            401: z.object({
              message: z.string(),
            }),
            200: z.object({
              name: z.string(),
              createdAt: z.date(),
              id: z.string().uuid(),
              email: z.string().email(),
              avatar_url: z.string().nullable(),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId();

        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            avatarUrl: true,
          },
        });

        if (!user) {
          throw new NotFoundError("Usuário não encontrado");
        }

        return reply.status(200).send({ ...user, avatar_url: user.avatarUrl });
      }
    );
};
