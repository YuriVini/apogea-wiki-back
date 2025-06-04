import { z } from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../../../lib/prisma";
import { auth } from "../../middlewares/auth";
import { UnauthorizedError } from "../_errors/unauthorized";

const createEquipmentBodySchema = z.object({
  name: z.string(),
  type: z.string(),
  category: z.string(),
  imageUrl: z.string(),
  size: z.string().nullable().optional(),
  range: z.string().nullable().optional(),
  armor: z.string().nullable().optional(),
  damage: z.string().nullable().optional(),
  weight: z.string().nullable().optional(),
  dropBy: z.string().nullable().optional(),
  rarity: z.string().nullable().optional(),
  sellTo: z.string().nullable().optional(),
  buyFrom: z.string().nullable().optional(),
  defense: z.string().nullable().optional(),
  attributes: z.string().nullable().optional(),
  attackSpeed: z.string().nullable().optional(),
});

export async function createEquipment(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      "/equipments",
      {
        schema: {
          tags: ["equipments"],
          body: createEquipmentBodySchema,
          summary: "Create a new equipment",
          response: {
            400: z.object({
              message: z.string(),
            }),
            201: z.object({
              id: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId();

        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (!userId || user?.role !== "ADMIN") {
          throw new UnauthorizedError("Você não tem permissão para criar um equipamento");
        }

        const data = request.body;

        const equipment = await prisma.equipment.create({
          data,
        });

        return reply.status(201).send({
          id: equipment.id,
        });
      }
    );
}
