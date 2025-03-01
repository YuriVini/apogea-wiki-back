import z from "zod";
import { hash } from "bcryptjs";
import { TokenType } from "@prisma/client";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "@/lib/prisma";
import { isTokenExpired } from "@/services/isTokenExpired";

import { BadRequestError } from "../_errors/bad-request";

export const resetPassword = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/password/reset",
    {
      schema: {
        tags: ["auth"],
        summary: "Reset password",
        body: z.object({
          token: z.string().uuid(),
          new_password: z.string().min(6),
        }),
        response: {
          204: z.null(),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { token, new_password } = request.body;

      const tokenEntry = await prisma.token.findUnique({
        where: { id: token },
        include: { user: true },
      });

      if (!tokenEntry) {
        throw new BadRequestError("Invalid or expired token");
      }

      const lastToken = await prisma.token.findFirst({
        orderBy: { createdAt: "desc" },
        where: { userId: tokenEntry.userId, type: TokenType.PASSWORD_RECOVER },
      });

      if (lastToken?.id !== token || isTokenExpired(String(lastToken?.createdAt))) {
        throw new BadRequestError("Invalid or expired token");
      }

      const hashedPassword = await hash(new_password, 6);

      await prisma.user.update({
        where: { id: tokenEntry.userId },
        data: { passwordHash: hashedPassword },
      });

      await prisma.token.update({
        where: { id: lastToken.id },
        data: { type: TokenType.EXPIRED },
      });

      return reply.status(204).send();
    }
  );
};
