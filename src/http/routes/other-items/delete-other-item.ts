import z from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../../../lib/prisma";
import { auth } from "../../../http/middlewares/auth";

export const deleteOtherItem = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      "/other-items/:id",
      {
        schema: {
          tags: ["other-items"],
          summary: "Delete other item",
          response: {
            204: z.null(),
          },
          params: z.object({
            id: z.string().uuid(),
          }),
        },
      },
      async (request, reply) => {
        await request.isAdmin();

        const { id } = request.params;

        await prisma.otherItem.delete({
          where: {
            id,
          },
        });

        return reply.status(204).send();
      }
    );
};
