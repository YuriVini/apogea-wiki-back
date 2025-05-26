import z from "zod";
import { randomUUID } from "crypto";
import { TokenType } from "@prisma/client";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "@/lib/prisma";
import { sendResetPasswordEmail } from "@/services/emailService";

export const recoverPassword = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/password/recover",
    {
      schema: {
        tags: ["auth"],
        summary: "Recover password - send email",
        body: z.object({
          email: z.string().email(),
          locale: z.enum(["br", "es", "us", "fr"]),
        }),
        response: {
          200: z.object({
            message: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email } = request.body;

      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return reply.status(200).send({ message: "Se esse e-mail estiver registrado, você receberá um e-mail." });
      }

      const token = randomUUID();
      await prisma.token.create({
        data: {
          id: token,
          userId: user.id,
          type: TokenType.PASSWORD_RECOVER,
        },
      });

      await sendResetPasswordEmail({ token, name: user.name, email: user.email });

      return reply.status(200).send({ message: "Se esse e-mail estiver registrado, você receberá um e-mail." });
    }
  );
};
