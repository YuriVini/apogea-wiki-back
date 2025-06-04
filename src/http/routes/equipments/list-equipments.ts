import { z } from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../../../lib/prisma";

export const equipmentSchema = z.object({
  name: z.string(),
  type: z.string(),
  category: z.string(),
  id: z.string().uuid(),
  size: z.string().nullable(),
  range: z.string().nullable(),
  armor: z.string().nullable(),
  damage: z.string().nullable(),
  weight: z.string().nullable(),
  dropBy: z.string().nullable(),
  rarity: z.string().nullable(),
  sellTo: z.string().nullable(),
  buyFrom: z.string().nullable(),
  defense: z.string().nullable(),
  imageUrl: z.string().nullable(),
  attributes: z.string().nullable(),
  attackSpeed: z.string().nullable(),
});

const equipmentSchemaArray = z.array(equipmentSchema);

export async function listEquipments(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/equipments",
    {
      schema: {
        tags: ["equipments"],
        summary: "List all equipments",
        response: {
          200: equipmentSchemaArray,
        },
        params: z.object({
          type: z.string().optional(),
          category: z.string().optional(),
        }),
      },
    },
    async (request, reply) => {
      const { type, category } = request.params;

      const equipments = await prisma.equipment.findMany({
        where: {
          type: type || undefined,
          category: category || undefined,
        },
      });

      return reply.status(200).send(equipments);
    }
  );
}
