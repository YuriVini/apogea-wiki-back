import { type FastifyInstance } from "fastify";
import { fastifyPlugin } from "fastify-plugin";

import { prisma } from "../../lib/prisma";
import { UnauthorizedError } from "../routes/_errors/unauthorized";

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook("preHandler", async (request) => {
    request.getCurrentUserId = async () => {
      try {
        const { sub: userId } = await request.jwtVerify<{ sub: string }>();
        return userId;
      } catch (error) {
        throw new UnauthorizedError("Invalid auth token");
      }
    };

    request.isAdmin = async () => {
      try {
        const { sub: userId } = await request.jwtVerify<{ sub: string }>();
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { role: true },
        });

        if (!user || user.role !== "ADMIN") {
          throw new UnauthorizedError("Esse usuário não está autorizado a acessar essa rota");
        }

        return true;
      } catch (error) {
        throw new UnauthorizedError("Esse usuário não está autorizado a acessar essa rota");
      }
    };
  });
});
