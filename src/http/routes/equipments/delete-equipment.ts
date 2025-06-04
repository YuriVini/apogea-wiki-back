import { z } from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../../../lib/prisma";
import { auth } from "../../middlewares/auth";
import { UnauthorizedError } from "../_errors/unauthorized";

export async function deleteEquipment(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      "/equipments/:id",
      {
        schema: {
          tags: ["equipments"],
          summary: "Delete an equipment",
          params: z.object({
            id: z.string().uuid(),
          }),
          response: {
            204: z.null(),
            404: z.object({
              message: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { id } = request.params;

        const userId = await request.getCurrentUserId();

        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (!userId || user?.role !== "ADMIN") {
          throw new UnauthorizedError("Você não tem permissão para deletar um equipamento");
        }

        const equipment = await prisma.equipment.findUnique({
          where: { id },
        });

        if (!equipment) {
          return reply.status(404).send({
            message: "Equipment not found",
          });
        }

        await prisma.equipment.delete({
          where: { id },
        });

        return reply.status(204).send();
      }
    );
}
