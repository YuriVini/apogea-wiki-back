import z from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../../../lib/prisma";
import { NotFoundError } from "../_errors/not-found";

export const getGuidesByUserId = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/guides/user/:userId",
    {
      schema: {
        tags: ["guides"],
        summary: "Get guides by user ID",
        params: z.object({
          userId: z.string().uuid(),
        }),
        response: {
          404: z.object({
            message: z.string(),
          }),
          200: z.array(
            z.object({
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
            })
          ),
        },
      },
    },
    async (request, reply) => {
      const { userId } = request.params;

      const guides = await prisma.guide.findMany({
        where: {
          userId,
        },
      });

      if (!guides.length) {
        throw new NotFoundError("No guides found for this user");
      }

      const formattedGuides = guides.map((guide) => ({
        ...guide,
        steps: JSON.parse(guide.steps),
      }));

      return reply.status(200).send(formattedGuides);
    }
  );
};
