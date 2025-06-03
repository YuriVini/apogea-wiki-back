import { z } from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../../../lib/prisma";
import { equipmentSchema } from "./list-equipments";
import { NotFoundError } from "../_errors/not-found";

export async function getEquipmentById(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/equipments/:id",
    {
      schema: {
        tags: ["equipments"],
        summary: "Get equipment by ID",
        params: z.object({
          id: z.string().uuid(),
        }),
        response: {
          200: equipmentSchema,
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const equipment = await prisma.equipment.findUnique({
        where: {
          id,
        },
      });

      if (!equipment) {
        throw new NotFoundError("Equipment not found");
      }

      return reply.status(200).send(equipment);
    }
  );
}
