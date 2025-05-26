import z from "zod";
import { hash } from "bcryptjs";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "@/lib/prisma";
// import { sendWelcomeEmail } from "@/services/emailService";

import { BadRequestError } from "../_errors/bad-request";

export const register = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/register",
    {
      schema: {
        tags: ["auth"],
        summary: "Create a new account",
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string().min(6),
        }),
        response: {
          201: z.object({
            message: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body;

      const emailLowerCase = email.toLowerCase();

      const userWithSameEmail = await prisma.user.findUnique({
        where: { email: emailLowerCase },
      });

      if (userWithSameEmail) {
        throw new BadRequestError("User with same email already exists");
      }

      const passwordHash = await hash(password, 6);

      await prisma.user.create({
        data: {
          name,
          passwordHash,
          email: emailLowerCase,
        },
      });

      // await sendWelcomeEmail({ name, email, password });

      return reply.status(201).send({ message: "user created successfully" });
    }
  );
};
