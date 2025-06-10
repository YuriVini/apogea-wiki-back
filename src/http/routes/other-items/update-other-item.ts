import z from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../../../lib/prisma";
import { auth } from "../../../http/middlewares/auth";
import { otherItemSchema } from "./get-other-item-by-id";

export const updateOtherItem = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      "/other-items/:id",
      {
        schema: {
          tags: ["other-items"],
          summary: "Update other item",
          params: z.object({
            id: z.string().uuid(),
          }),
          response: {
            200: z.object({
              item: otherItemSchema,
            }),
          },
          body: z.object({
            hp: z.string().optional(),
            exp: z.string().optional(),
            name: z.string().optional(),
            type: z.string().optional(),
            loot: z.string().optional(),
            text: z.string().optional(),
            notes: z.string().optional(),
            buffs: z.string().optional(),
            weight: z.string().optional(),
            sellTo: z.string().optional(),
            dropBy: z.string().optional(),
            author: z.string().optional(),
            imageUrl: z.string().optional(),
            location: z.string().optional(),
            abilities: z.string().optional(),
            description: z.string().optional(),
            satiateTime: z.string().optional(),
            npcLocation: z.string().optional(),
            requirements: z.string().optional(),
          }),
        },
      },
      async (request, reply) => {
        await request.isAdmin();

        const { id } = request.params;
        const data = request.body;

        const item = await prisma.otherItem.update({
          data,
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
