import z from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "@/lib/prisma";

export const checkIdDocument = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/users/check-cpf",
    {
      schema: {
        tags: ["users"],
        summary: "Verifica se um usuário existe com base no CPF",
        querystring: z.object({
          idDocument: z.string(),
        }),
        response: {
          200: z.object({
            exists: z.boolean(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { idDocument } = request.query;

      const user = await prisma.user.findUnique({
        where: { idDocument },
      });

      return reply.status(200).send({ exists: !!user });
    }
  );
};
