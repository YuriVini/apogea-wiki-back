import z from "zod";
import { compare } from "bcryptjs";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "@/lib/prisma";

import { UnauthorizedError } from "../_errors/unauthorized";

export const login = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/login",
    {
      schema: {
        tags: ["auth"],
        summary: "Authentication by password",
        body: z.object({
          email: z.string().email(),
          password: z.string().min(6),
        }),
        response: {
          200: z.object({
            token: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new UnauthorizedError("Invalid credentials");
      }

      const isPasswordValid = await compare(password, user.passwordHash);

      if (!isPasswordValid) {
        throw new UnauthorizedError("Invalid credentials");
      }

      const token = await reply.jwtSign(
        { sub: user.id, name: user.name },
        {
          sign: {
            expiresIn: "7d",
          },
        }
      );
      return reply.status(200).send({ token });
    }
  );
};
