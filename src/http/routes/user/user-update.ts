import z from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "@/lib/prisma";
import { auth } from "@/http/middlewares/auth";

import { BadRequestError } from "../_errors/bad-request";
import { UnauthorizedError } from "../_errors/unauthorized";

export const updateUser = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      "/me",
      {
        schema: {
          tags: ["user"],
          summary: "Update user profile",
          body: z.object({
            name: z.string().optional(),
            avatar_url: z.string().optional(),
          }),
          response: {
            400: z.object({
              message: z.string(),
            }),
            401: z.object({
              message: z.string(),
            }),
            200: z.object({
              message: z.string(),
              user: z.object({
                name: z.string(),
                email: z.string(),
                created_at: z.date(),
                updated_at: z.date(),
                role: z.enum(["ADMIN", "USER"]),
                avatar_url: z.string().nullable(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId();

        if (!userId) {
          throw new UnauthorizedError("Usuário não autenticado");
        }

        try {
          const { name, avatar_url } = request.body;

          const existingUser = await prisma.user.findUnique({ where: { id: userId } });
          if (!existingUser) {
            throw new BadRequestError("Usuário não encontrado");
          }

          const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { name, avatarUrl: avatar_url },
          });

          return reply.status(200).send({
            message: "Dados atualizados com sucesso",
            user: {
              name: updatedUser.name,
              role: updatedUser.role,
              email: updatedUser.email,
              created_at: updatedUser.createdAt,
              updated_at: updatedUser.updatedAt,
              avatar_url: updatedUser.avatarUrl,
            },
          });
        } catch (error) {
          throw new BadRequestError("Ocorreu um erro ao atualizar o usuário");
        }
      }
    );
};
