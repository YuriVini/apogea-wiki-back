import z from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../../../lib/prisma";

export const otherItemSchema = z.object({
  name: z.string(),
  type: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  id: z.string().uuid(),
  hp: z.string().nullable(),
  exp: z.string().nullable(),
  loot: z.string().nullable(),
  text: z.string().nullable(),
  notes: z.string().nullable(),
  buffs: z.string().nullable(),
  weight: z.string().nullable(),
  sellTo: z.string().nullable(),
  dropBy: z.string().nullable(),
  author: z.string().nullable(),
  imageUrl: z.string().nullable(),
  location: z.string().nullable(),
  abilities: z.string().nullable(),
  description: z.string().nullable(),
  satiateTime: z.string().nullable(),
  npcLocation: z.string().nullable(),
  requirements: z.string().nullable(),
});

export const getOtherItemById = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/other-items/item/:id",
    {
      schema: {
        tags: ["other-items"],
        summary: "Get other item by id",
        params: z.object({
          id: z.string().uuid(),
        }),
        response: {
          200: z.object({
            item: otherItemSchema,
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const item = await prisma.otherItem.findUniqueOrThrow({
        where: {
          id,
        },
      });

      return reply.status(200).send({
        item,
      });
    }
  );
};
