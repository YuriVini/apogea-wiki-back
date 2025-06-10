import z from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../../../lib/prisma";
import { guideSchema } from "./get-guide-by-id";
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
          200: z.object({
            guides: z.array(guideSchema),
          }),
        },
      },
    },
    async (request, reply) => {
      const { userId } = request.params;

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new NotFoundError("Usuário não encontrado");
      }

      const guides = await prisma.guide.findMany({
        where: {
          userId,
        },
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

      const formattedGuides = guides.map((guide) => ({
        ...guide,
        userId: guide.userId,
        author: guide.user.name,
        steps: guide.steps.map((step) => ({
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
      }));

      return reply.status(200).send({
        guides: formattedGuides,
      });
    }
  );
};
