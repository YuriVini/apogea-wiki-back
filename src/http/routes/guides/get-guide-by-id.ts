import z from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "@/lib/prisma";

import { NotFoundError } from "../_errors/not-found";

export const getGuideById = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/guides/:id",
    {
      schema: {
        tags: ["guides"],
        summary: "Get guide by ID",
        params: z.object({
          id: z.string().uuid(),
        }),
        response: {
          404: z.object({
            message: z.string(),
          }),
          200: z.object({
            guide: z.object({
              id: z.string(),
              title: z.string(),
              description: z.string().optional(),
              footer_text: z.string().optional(),
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
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const guide = await prisma.guide.findUnique({
        where: { id },
      });

      if (!guide) {
        throw new NotFoundError("Guide not found");
      }

      return reply.status(200).send({
        guide: {
          ...guide,
          steps: JSON.parse(guide.steps),
        },
      });
    }
  );
};
