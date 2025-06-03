import z from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../../../lib/prisma";
import { auth } from "../../middlewares/auth";
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
              id: z.string(),
              name: z.string(),
              created_at: z.date(),
              updated_at: z.date(),
              email: z.string().email(),
              role: z.enum(["ADMIN", "USER"]),
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
            role: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            avatarUrl: true,
          },
        });

        if (!user) {
          throw new NotFoundError("Usuário não encontrado");
        }

        return reply.status(200).send({
          id: user.id,
          name: user.name,
          role: user.role,
          email: user.email,
          created_at: user.createdAt,
          updated_at: user.updatedAt,
          avatar_url: user.avatarUrl,
        });
      }
    );
};
