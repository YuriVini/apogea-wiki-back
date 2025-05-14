import z from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "@/lib/prisma";

export const listGuides = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/guides",
    {
      schema: {
        tags: ["guides"],
        summary: "List all guides",
        response: {
          400: z.object({
            message: z.string(),
          }),
          200: z.object({
            guides: z.array(
              z.object({
                title: z.string(),
                footer_text: z.string(),
                description: z.string(),
                steps: z.array(
                  z.object({
                    hint: z.string().optional(),
                    note: z.string().optional(),
                    title: z.string().optional(),
                    advice: z.string().optional(),
                    benefit: z.string().optional(),
                    image_url: z.string().optional(),
                    description: z.string().optional(),
                    items: z.array(z.string()).optional(),
                  })
                ),
              })
            ),
          }),
        },
      },
    },
    async (_request, reply) => {
      const guides = await prisma.guide.findMany();

      const formattedGuides = guides.map((guide) => ({
        ...guide,
        steps: JSON.parse(guide.steps),
      }));

      return reply.status(200).send({ guides: formattedGuides });
    }
  );
};
