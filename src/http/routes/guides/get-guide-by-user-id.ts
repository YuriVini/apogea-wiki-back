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
          200: z.array(guideSchema),
          404: z.object({
            message: z.string(),
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
      });

      const formattedGuides = guides.map((guide) => ({
        ...guide,
        steps: JSON.parse(guide.steps),
      }));

      return reply.status(200).send(formattedGuides);
    }
  );
};
