import z from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../../../lib/prisma";
import { auth } from "../../middlewares/auth";
import { BadRequestError } from "../_errors/bad-request";
import { UnauthorizedError } from "../_errors/unauthorized";

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
          body: z.object({
            title: z.string().optional(),
            footer_text: z.string().optional(),
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
          }),
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId();
        const { title, steps, footer_text, description } = request.body;

        if (!userId) {
          throw new UnauthorizedError("Você não está autorizado a criar um guia");
        }

        try {
          const guide = await prisma.guide.create({
            data: {
              userId,
              title: title || "",
              steps: JSON.stringify(steps),
              footerText: footer_text || "",
              description: description || "",
            },
          });

          if (!guide) {
            throw new BadRequestError("Ocorreu um erro ao criar o guia");
          }

          return reply.status(201).send({
            guideId: guide.id,
            message: "Guide created successfully",
          });
        } catch (error) {
          throw new BadRequestError("Ocorreu um erro ao criar o guia\n\n" + JSON.stringify(error));
        }
      }
    );
};
