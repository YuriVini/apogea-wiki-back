import z from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../../../lib/prisma";
import { guideSchema } from "./get-guide-by-id";

export const listGuides = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/guides",
    {
      schema: {
        tags: ["guides"],
        summary: "List all guides",
        response: {
          200: z.array(guideSchema),
        },
      },
    },
    async (_request, reply) => {
      const guides = await prisma.guide.findMany();

      const formattedGuides = guides.map((guide) => ({
        ...guide,
        steps: JSON.parse(guide.steps),
      }));

      return reply.status(200).send(formattedGuides);
    }
  );
};
