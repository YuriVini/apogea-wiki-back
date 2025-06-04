import { z } from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../../../lib/prisma";
import { auth } from "../../middlewares/auth";
import { type stepsSchema } from "./get-guide-by-id";
import { NotFoundError } from "../_errors/not-found";
import { PREFIX_URL } from "../../../services/awsServices";
import { UnauthorizedError } from "../_errors/unauthorized";

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
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      "/guides/:id",
      {
        schema: {
          tags: ["Guides"],
          summary: "Update a guide",
          body: updateGuideBodySchema,
          params: updateGuideParamsSchema,
          response: {
            404: z.object({
              message: z.string(),
            }),
            401: z.object({
              message: z.string(),
            }),
            200: z.object({
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
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId();
        const { id } = updateGuideParamsSchema.parse(request.params);
        const { title, steps, footerText, description } = updateGuideBodySchema.parse(request.body);

        const existingGuide = await prisma.guide.findUnique({
          where: { id },
        });

        if (!existingGuide) {
          throw new NotFoundError("Guia não encontrado");
        }

        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        const stepsWithImageUrls = await Promise.all(
          steps.map(async (step: z.infer<typeof stepsSchema>) => {
            if (step.image_url) {
              return {
                ...step,
                image_url: `${PREFIX_URL}/${step.image_url}`,
              };
            }
            return step;
          })
        );

        if (existingGuide.userId === userId || user?.role === "ADMIN") {
          const updatedGuide = await prisma.guide.update({
            where: { id },
            data: {
              title,
              footerText,
              description,
              steps: JSON.stringify(stepsWithImageUrls),
            },
          });

          const updatedGuideFormatted = {
            id: updatedGuide.id,
            title: updatedGuide.title,
            steps: stepsWithImageUrls,
            footer_text: updatedGuide.footerText,
            description: updatedGuide.description,
          };

          return reply.status(200).send(updatedGuideFormatted);
        }

        throw new UnauthorizedError("Você não tem permissão para atualizar este guia");
      }
    );
}
