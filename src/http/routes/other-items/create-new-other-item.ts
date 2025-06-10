import z from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../../../lib/prisma";
import { auth } from "../../../http/middlewares/auth";
import { otherItemSchema } from "./get-other-item-by-id";

const otherItemSchemaRequest = otherItemSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const createNewOtherItem = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      "/other-items",
      {
        schema: {
          tags: ["other-items"],
          body: otherItemSchemaRequest,
          summary: "Create new other item",
          response: {
            201: z.object({
              message: z.string(),
              id: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        await request.isAdmin();
        const data = request.body;

        const item = await prisma.otherItem.create({
          data,
        });

        return reply.status(201).send({
          id: item.id,
          message: "Other item created successfully",
        });
      }
    );
};
