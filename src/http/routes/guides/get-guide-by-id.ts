import z from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../../../lib/prisma";
import { NotFoundError } from "../_errors/not-found";

export const stepsSchema = z.object({
  hint: z.string().optional(),
  note: z.string().optional(),
  title: z.string().optional(),
  advice: z.string().optional(),
  benefit: z.string().optional(),
  image_url: z.string().optional(),
  description: z.string().optional(),
  items: z.array(z.string()).optional(),
});

export const guideSchema = z.object({
  id: z.string(),
  title: z.string(),
  userId: z.string(),
  author: z.string(),
  steps: z.array(stepsSchema),
  description: z.string().optional(),
  footer_text: z.string().optional(),
});

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
          200: guideSchema,
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const guide = await prisma.guide.findUnique({
        where: { id },
        include: {
          user: true,
        },
      });

      if (!guide) {
        throw new NotFoundError("Guia não encontrado");
      }

      const steps = JSON.parse(guide.steps) as Array<z.infer<typeof stepsSchema>>;

      return reply.status(200).send({
        ...guide,
        steps,
        userId: guide.userId,
        author: guide.user.name,
      });
    }
  );
};
