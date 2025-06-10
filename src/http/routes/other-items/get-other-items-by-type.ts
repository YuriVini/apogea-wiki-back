import z from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../../../lib/prisma";
import { otherItemSchema } from "./get-other-item-by-id";

export const getOtherItemsByType = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/other-items/type/:type",
    {
      schema: {
        tags: ["other-items"],
        summary: "Get other items by type",
        params: z.object({
          type: z.string(),
        }),
        response: {
          200: z.object({
            items: z.array(otherItemSchema),
          }),
        },
      },
    },
    async (request, reply) => {
      const { type } = request.params;

      const items = await prisma.otherItem.findMany({
        where: {
          type,
        },
      });

      return reply.status(200).send({
        items,
      });
    }
  );
};
