import z from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../../../lib/prisma";
import { otherItemSchema } from "./get-other-item-by-id";

export const getAllOtherItems = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/other-items",
    {
      schema: {
        tags: ["other-items"],
        summary: "List all other items",
        response: {
          200: z.object({
            items: z.array(otherItemSchema),
          }),
        },
      },
    },
    async (request, reply) => {
      const items = await prisma.otherItem.findMany();

      return reply.status(200).send({
        items,
      });
    }
  );
};
