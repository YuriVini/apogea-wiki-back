import z from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../../../lib/prisma";
import { NotFoundError } from "../_errors/not-found";
import { equipmentSchema } from "../equipments/list-equipments";
import { otherItemSchema } from "../other-items/get-other-item-by-id";

export const stepsSchema = z.object({
  hint: z.string().optional(),
  note: z.string().optional(),
  title: z.string().optional(),
  advice: z.string().optional(),
  benefit: z.string().optional(),
  image_url: z.string().optional(),
  description: z.string().optional(),
  items: z.array(z.string().uuid()).optional(),
  equipments: z.array(z.string().uuid()).optional(),
});

export const stepsSchemaResponse = z.object({
  hint: z.string().optional(),
  note: z.string().optional(),
  title: z.string().optional(),
  advice: z.string().optional(),
  benefit: z.string().optional(),
  image_url: z.string().optional(),
  description: z.string().optional(),
  items: z.array(otherItemSchema).optional(),
  equipments: z.array(equipmentSchema).optional(),
});

export const guideSchema = z.object({
  id: z.string(),
  title: z.string(),
  userId: z.string(),
  author: z.string(),
  description: z.string().optional(),
  footer_text: z.string().optional(),
  steps: z.array(stepsSchemaResponse),
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
          200: z.object({
            guide: guideSchema,
          }),
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
          steps: {
            orderBy: {
              order: "asc",
            },
            include: {
              items: true,
              equipments: true,
            },
          },
        },
      });

      if (!guide) {
        throw new NotFoundError("Guia não encontrado");
      }

      return reply.status(200).send({
        guide: {
          ...guide,
          userId: guide.userId,
          author: guide.user.name,
          footer_text: guide.footerText || undefined,
          steps: guide.steps.map((step) => ({
            hint: step.hint || undefined,
            note: step.note || undefined,
            title: step.title || undefined,
            advice: step.advice || undefined,
            benefit: step.benefit || undefined,
            image_url: step.imageUrl || undefined,
            description: step.description || undefined,
            items: step.items?.length > 0 ? step.items : undefined,
            equipments: step.equipments?.length > 0 ? step.equipments : undefined,
          })),
        },
      });
    }
  );
};
