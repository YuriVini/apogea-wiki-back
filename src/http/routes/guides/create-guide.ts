import z from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../../../lib/prisma";
import { auth } from "../../middlewares/auth";
import { BadRequestError } from "../_errors/bad-request";
import { PREFIX_URL } from "../../../services/awsServices";
import { UnauthorizedError } from "../_errors/unauthorized";

const stepSchema = z.object({
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

type Step = z.infer<typeof stepSchema>;

export const createGuide = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      "/guides",
      {
        schema: {
          tags: ["guides"],
          summary: "Create a guide",
          body: z.object({
            steps: z.array(stepSchema),
            title: z.string().optional(),
            footer_text: z.string().optional(),
            description: z.string().optional(),
          }),
          response: {
            400: z.object({
              message: z.string(),
            }),
            401: z.object({
              message: z.string(),
            }),
            201: z.object({
              message: z.string(),
              guideId: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId();
        const { title, steps, footer_text, description } = request.body;

        if (!userId) {
          throw new UnauthorizedError("Você não está autorizado a criar um guia");
        }

        const guide = await prisma.guide.create({
          data: {
            title: title || "",
            footerText: footer_text || "",
            description: description || "",
            user: {
              connect: {
                id: userId,
              },
            },
            steps: {
              create: steps.map((step: Step, index) => ({
                order: index,
                hint: step.hint || "",
                note: step.note || "",
                title: step.title || "",
                advice: step.advice || "",
                benefit: step.benefit || "",
                description: step.description || "",
                imageUrl: step.image_url ? `${PREFIX_URL}/${step.image_url}` : null,
                items: step.items
                  ? {
                      connect: step.items.map((id) => ({ id })),
                    }
                  : undefined,
                equipments: step.equipments
                  ? {
                      connect: step.equipments.map((id) => ({ id })),
                    }
                  : undefined,
              })),
            },
          },
        });

        if (!guide) {
          throw new BadRequestError("Ocorreu um erro ao criar o guia");
        }

        return reply.status(201).send({
          guideId: guide.id,
          message: "Guide created successfully",
        });
      }
    );
};
