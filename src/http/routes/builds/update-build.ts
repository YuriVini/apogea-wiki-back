import { z } from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../../../lib/prisma";
import { auth } from "../../middlewares/auth";
import { buildSchema } from "./list-build-by-user";
import { buildSchemaRequest } from "./create-build";
import { NotFoundError } from "../_errors/not-found";
import { UnauthorizedError } from "../_errors/unauthorized";

export async function updateBuild(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      "/builds/:id",
      {
        schema: {
          tags: ["builds"],
          body: buildSchemaRequest,
          summary: "Update a build",
          params: z.object({
            id: z.string().uuid(),
          }),
          response: {
            500: z.null(),
            200: buildSchema,
            403: z.object({
              message: z.string(),
            }),
            404: z.object({
              message: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId();
        const { id } = request.params;
        const body = request.body;

        const build = await prisma.build.findUnique({
          where: { id },
        });

        if (!build) {
          throw new NotFoundError("Build não encontrada");
        }

        if (build.userId !== userId) {
          throw new UnauthorizedError("Não autorizado");
        }

        const updatedBuild = await prisma.build.update({
          where: { id },
          include: {
            ring: true,
            legs: true,
            boots: true,
            chest: true,
            helmet: true,
            leftHand: true,
            backpack: true,
            necklace: true,
            rightHand: true,
            accessory: true,
          },
          data: {
            ...build,
            title: body.title,
            updatedAt: new Date(),
            overview: body.overview,
            ringId: body.equipment.ring,
            legsId: body.equipment.legs,
            bootsId: body.equipment.boots,
            chestId: body.equipment.chest,
            helmetId: body.equipment.helmet,
            necklaceId: body.equipment.necklace,
            leftHandId: body.equipment.leftHand,
            backpackId: body.equipment.backpack,
            rightHandId: body.equipment.rightHand,
            accessoryId: body.equipment.accessory,
            strategy: body?.strategy?.join("/-/") ?? "",
            characterStats: JSON.stringify(body.characterStats),
          },
        });

        const buildsFormatted = {
          id: updatedBuild?.id,
          title: updatedBuild?.title,
          overview: updatedBuild?.overview,
          createdAt: updatedBuild?.createdAt,
          updatedAt: updatedBuild?.updatedAt,
          characterClass: updatedBuild?.characterClass,
          strategy: updatedBuild?.strategy.split("/-/"),
          characterStats: JSON.parse(updatedBuild?.characterStats),
          equipment: {
            ring: updatedBuild?.ring,
            legs: updatedBuild?.legs,
            boots: updatedBuild?.boots,
            chest: updatedBuild?.chest,
            helmet: updatedBuild?.helmet,
            leftHand: updatedBuild?.leftHand,
            backpack: updatedBuild?.backpack,
            necklace: updatedBuild?.necklace,
            rightHand: updatedBuild?.rightHand,
            accessory: updatedBuild?.accessory,
          },
        };

        return reply.send(buildsFormatted);
      }
    );
}
