import { z } from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../../../lib/prisma";
import { buildSchema } from "./list-build-by-user";
import { NotFoundError } from "../_errors/not-found";

export async function getBuildById(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/builds/:buildId",
    {
      schema: {
        tags: ["builds"],
        summary: "Get a build by id",
        params: z.object({
          buildId: z.string().uuid(),
        }),
        response: {
          500: z.null(),
          200: buildSchema,
        },
      },
    },
    async (request, reply) => {
      const { buildId } = request.params;

      const build = await prisma.build.findUnique({
        where: {
          id: buildId,
        },
        include: {
          legs: true,
          ring: true,
          boots: true,
          chest: true,
          helmet: true,
          leftHand: true,
          backpack: true,
          necklace: true,
          rightHand: true,
          accessory: true,
        },
      });

      if (!build) {
        throw new NotFoundError("Build não encontrada");
      }

      const buildsFormatted: z.infer<typeof buildSchema> = {
        id: build?.id,
        title: build?.title,
        userId: build?.userId,
        overview: build?.overview,
        createdAt: build?.createdAt,
        updatedAt: build?.updatedAt,
        characterClass: build?.characterClass,
        strategy: build?.strategy.split("/-/"),
        characterStats: JSON.parse(build?.characterStats),
        equipment: {
          ring: build?.ring,
          legs: build?.legs,
          boots: build?.boots,
          chest: build?.chest,
          helmet: build?.helmet,
          necklace: build?.necklace,
          leftHand: build?.leftHand,
          backpack: build?.backpack,
          rightHand: build?.rightHand,
          accessory: build?.accessory,
        },
      };

      return reply.send(buildsFormatted);
    }
  );
}
