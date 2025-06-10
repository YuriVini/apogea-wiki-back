import { z } from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../../../lib/prisma";
import { auth } from "../../middlewares/auth";
import { NotFoundError } from "../_errors/not-found";
import { UnauthorizedError } from "../_errors/unauthorized";
import { equipmentSchema } from "../equipments/list-equipments";
import { otherItemSchema } from "../other-items/get-other-item-by-id";
import { PREFIX_URL, deleteFileHandler } from "../../../services/awsServices";

const stepsSchema = z.object({
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

const stepsSchemaResponse = z.object({
  hint: z.string().optional(),
  note: z.string().optional(),
  title: z.string().optional(),
  advice: z.string().optional(),
  benefit: z.string().optional(),
  items: z.array(otherItemSchema),
  image_url: z.string().optional(),
  description: z.string().optional(),
  equipments: z.array(equipmentSchema),
});

const guideSchema = z.object({
  id: z.string(),
  title: z.string(),
  userId: z.string(),
  author: z.string(),
  description: z.string().optional(),
  footer_text: z.string().optional(),
  steps: z.array(stepsSchemaResponse),
});

const updateGuideBodySchema = z.object({
  steps: z.array(stepsSchema),
  title: z.string().optional(),
  footerText: z.string().optional(),
  description: z.string().optional(),
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
            401: z.object({
              message: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId();
        const { id } = request.params;
        const { title, steps, footerText, description } = request.body;

        const existingGuide = await prisma.guide.findUnique({
          where: { id },
          include: {
            steps: {
              include: {
                items: true,
                equipments: true,
              },
            },
          },
        });

        if (!existingGuide) {
          throw new NotFoundError("Guia não encontrado");
        }

        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (existingGuide.userId === userId || user?.role === "ADMIN") {
          const oldSteps = existingGuide.steps.map((step) => ({
            ...step,
            image_url: step.imageUrl,
          }));

          const imagesToDelete = oldSteps
            .filter((oldStep) => {
              const newStep = steps.find((s) => s.title === oldStep.title);
              return oldStep.imageUrl && (!newStep?.image_url || newStep.image_url !== oldStep.imageUrl);
            })
            .map((step) => {
              if (step.imageUrl && typeof step.imageUrl === "string") {
                const parts = step.imageUrl.split(`${PREFIX_URL}/`);
                return parts.length > 1 ? parts[1] : null;
              }
              return null;
            })
            .filter((key): key is string => key !== null);

          await Promise.all(
            imagesToDelete.map(async (key: string) => {
              try {
                await deleteFileHandler(key);
              } catch (error) {
                console.error(`Failed to delete image ${key}:`, error);
              }
            })
          );

          const updatedGuide = await prisma.guide.update({
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
            data: {
              title,
              footerText,
              description,
              steps: {
                deleteMany: {},
                create: steps.map((step, index) => ({
                  order: index,
                  hint: step.hint || "",
                  note: step.note || "",
                  title: step.title || "",
                  advice: step.advice || "",
                  benefit: step.benefit || "",
                  description: step.description || "",
                  imageUrl: step.image_url ? `${PREFIX_URL}/${step.image_url}` : null,
                  items: {
                    connect: step.items?.map((id) => ({ id })) || [],
                  },
                  equipments: {
                    connect: step.equipments?.map((id) => ({ id })) || [],
                  },
                })),
              },
            },
          });

          const updatedGuideFormatted = {
            guide: {
              id: updatedGuide.id,
              title: updatedGuide.title,
              userId: updatedGuide.userId,
              author: updatedGuide.user.name,
              footer_text: updatedGuide.footerText,
              description: updatedGuide.description,
              steps: updatedGuide.steps.map((step) => ({
                hint: step.hint || undefined,
                note: step.note || undefined,
                items: step.items || undefined,
                title: step.title || undefined,
                advice: step.advice || undefined,
                benefit: step.benefit || undefined,
                image_url: step.imageUrl || undefined,
                equipments: step.equipments || undefined,
                description: step.description || undefined,
              })),
            },
          };

          return reply.status(200).send(updatedGuideFormatted);
        }

        throw new UnauthorizedError("Você não tem permissão para atualizar este guia");
      }
    );
}
