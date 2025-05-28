import { z } from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../../../lib/prisma";

const equipmentSchema = z.array(
  z.object({
    name: z.string(),
    type: z.string(),
    slot: z.string(),
    category: z.string(),
    imageUrl: z.string(),
    id: z.string().uuid(),
    size: z.string().nullable().nullish().optional(),
    range: z.string().nullable().nullish().optional(),
    damage: z.string().nullable().nullish().optional(),
    weight: z.string().nullable().nullish().optional(),
    dropBy: z.string().nullable().nullish().optional(),
    rarity: z.string().nullable().nullish().optional(),
    sellTo: z.string().nullable().nullish().optional(),
    buyFrom: z.string().nullable().nullish().optional(),
    defense: z.string().nullable().nullish().optional(),
    attributes: z.string().nullable().nullish().optional(),
    attackSpeed: z.string().nullable().nullish().optional(),
  })
);

export async function listEquipments(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/equipments",
    {
      schema: {
        tags: ["equipments"],
        summary: "List all equipments",
        querystring: z.object({
          type: z.string().optional(),
          category: z.string().optional(),
        }),
        response: {
          200: equipmentSchema,
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { type, category } = request.query;

      const equipments = await prisma.equipment.findMany({
        orderBy: {
          name: "asc",
        },
        where: {
          ...(type && { type }),
          ...(category && { category }),
        },
      });

      const equipmentsFormatted = equipmentSchema.parse(equipments);

      return reply.status(200).send(equipmentsFormatted);
    }
  );
}
