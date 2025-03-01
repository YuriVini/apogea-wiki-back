import z from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "@/lib/prisma";
import { auth } from "@/http/middlewares/auth";

import { BadRequestError } from "../_errors/bad-request";

export const updateUser = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      "/user/update",
      {
        schema: {
          tags: ["user"],
          summary: "Update user profile",
          body: z.object({
            email: z.string().email("E-mail inválido"),
            name: z.string().min(1, "Nome é obrigatório"),
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
          return reply.status(401).send({ message: "User not authenticated" });
        }

        try {
          console.log("entrei");
          const { name, email } = request.body;

          const existingUser = await prisma.user.findUnique({ where: { email } });
          if (existingUser && existingUser.id !== userId) {
            throw new BadRequestError("E-mail já está em uso por outro usuário");
          }

          await prisma.user.update({
            where: { id: userId },
            data: { name, email },
          });

          return reply.status(200).send({ message: "Dados atualizados com sucesso" });
        } catch (error) {
          console.log(error);
          return reply.status(500).send({ message: "Internal Server Error" });
        }
      }
    );
};
