import { z } from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../../../lib/prisma";
import { auth } from "../../middlewares/auth";
import { NotFoundError } from "../_errors/not-found";
import { UnauthorizedError } from "../_errors/unauthorized";

const updateEquipmentBodySchema = z.object({
  name: z.string().optional(),
  type: z.string().optional(),
  slot: z.string().optional(),
  category: z.string().optional(),
  imageUrl: z.string().optional(),
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

export async function updateEquipment(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      "/equipments/:id",
      {
        schema: {
          tags: ["equipments"],
          summary: "Update an equipment",
          body: updateEquipmentBodySchema,
          params: z.object({
            id: z.string().uuid(),
          }),
          response: {
            204: z.null(),
            400: z.object({
              message: z.string(),
            }),
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
          throw new UnauthorizedError("Você não tem permissão para atualizar um equipamento");
        }

        const data = updateEquipmentBodySchema.parse(request.body);

        const equipment = await prisma.equipment.findUnique({
          where: { id },
        });

        if (!equipment) {
          throw new NotFoundError("Equipment not found");
        }

        await prisma.equipment.update({
          data,
          where: { id },
        });

        return reply.status(204).send();
      }
    );
}
