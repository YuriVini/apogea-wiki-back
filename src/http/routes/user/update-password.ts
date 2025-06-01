// src/http/routes/user/update-password.ts

import z from "zod";
import { hash, compare } from "bcryptjs";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../../../lib/prisma";
import { auth } from "../../middlewares/auth";
import { BadRequestError } from "../_errors/bad-request";
import { UnauthorizedError } from "../_errors/unauthorized";

export const updatePassword = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      "/me/update-password",
      {
        schema: {
          tags: ["user"],
          summary: "Update user password",
          body: z.object({
            new_password: z.string().min(6, "Nova senha deve ter pelo menos 6 caracteres"),
            current_password: z.string().min(6, "Senha atual deve ter pelo menos 6 caracteres"),
          }),
          response: {
            200: z.object({
              message: z.string(),
            }),
            400: z.object({
              message: z.string(),
            }),
            401: z.object({
              message: z.string(),
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
          const { new_password, current_password } = request.body;

          const user = await prisma.user.findUnique({
            where: { id: userId },
          });

          if (!user) {
            throw new UnauthorizedError("Usuário não encontrado");
          }

          const isPasswordValid = await compare(current_password, user.passwordHash);

          if (!isPasswordValid) {
            throw new BadRequestError("Senha atual está incorreta");
          }

          const newPasswordHash = await hash(new_password, 6);

          await prisma.user.update({
            where: { id: userId },
            data: {
              updatedAt: new Date(),
              passwordHash: newPasswordHash,
            },
          });

          return reply.status(200).send({ message: "Senha atualizada com sucesso" });
        } catch (error) {
          console.error("Erro ao buscar flight issue por ID:", error);
          return reply.status(500).send({ message: "Internal Server Error" });
        }
      }
    );
};
