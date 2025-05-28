import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../../../lib/prisma";
import { buildSchemaResponse } from "./list-build-by-user";

export async function listBuilds(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/builds",
    {
      schema: {
        tags: ["builds"],
        summary: "List all builds",
        response: {
          200: buildSchemaResponse,
        },
      },
    },
    async (_request, reply) => {
      const builds = await prisma.build.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          strategy: true,
          equipment: true,
          mainSkills: true,
          requirements: true,
          supportSkills: true,
          characterStats: true,
          user: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
      });

      return reply.send(buildSchemaResponse.parse(builds));
    }
  );
}
