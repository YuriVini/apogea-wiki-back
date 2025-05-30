import { z } from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../../../lib/prisma";

export const equipmentSchema = z.object({
  name: z.string(),
  type: z.string(),
  category: z.string(),
  id: z.string().uuid(),
  range: z.string().nullable().optional(),
  damage: z.string().nullable().optional(),
  weight: z.string().nullable().optional(),
  dropBy: z.string().nullable().optional(),
  rarity: z.string().nullable().optional(),
  sellTo: z.string().nullable().optional(),
  buyFrom: z.string().nullable().optional(),
  defense: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  attributes: z.string().nullable().optional(),
  attackSpeed: z.string().nullable().optional(),
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
