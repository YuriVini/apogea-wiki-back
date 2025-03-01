import { type FastifyInstance } from "fastify";
import { fastifyPlugin } from "fastify-plugin";

import { UnauthorizedError } from "../routes/_errors/unauthorized";

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook("preHandler", async (request) => {
    request.getCurrentUserId = async () => {
      try {
        const { sub: userId } = await request.jwtVerify<{ sub: string }>();
        console.log("userId", userId);
        return userId;
      } catch (error) {
        throw new UnauthorizedError("Invalid auth token");
      }
    };
  });
});
