import { z } from "zod";
import { type FastifyInstance } from "fastify";

import { prisma } from "../../../lib/prisma";
import { NotFoundError } from "../_errors/not-found";

const updateGuideBodySchema = z.object({
  title: z.string().optional(),
  footerText: z.string().optional(),
  description: z.string().optional(),
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
});

const updateGuideParamsSchema = z.object({
  id: z.string().uuid(),
});

export async function updateGuide(app: FastifyInstance) {
  app.put(
    "/guides/:id",
    {
      schema: {
        tags: ["Guides"],
        summary: "Update a guide",
        body: updateGuideBodySchema,
        security: [{ bearerAuth: [] }],
        params: updateGuideParamsSchema,
      },
    },
    async (request, reply) => {
      const { id } = updateGuideParamsSchema.parse(request.params);
      const { title, steps, footerText, description } = updateGuideBodySchema.parse(request.body);

      const existingGuide = await prisma.guide.findUnique({
        where: { id },
      });

      if (!existingGuide) {
        throw new NotFoundError("Guide not found");
      }

      const updatedGuide = await prisma.guide.update({
        where: { id },
        data: {
          title,
          footerText,
          description,
          steps: JSON.stringify(steps),
        },
      });

      return reply.status(200).send(updatedGuide);
    }
  );
}
