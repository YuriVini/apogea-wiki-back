import { ZodError } from "zod";
import { type FastifyInstance } from "fastify";

import { NotFoundError } from "./routes/_errors/not-found";
import { BadRequestError } from "./routes/_errors/bad-request";
import { UnauthorizedError } from "./routes/_errors/unauthorized";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandler = (error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Validation error",
      errors: error.flatten().fieldErrors,
    });
  }

  if (error instanceof BadRequestError) {
    return reply.status(400).send({ message: error.message });
  }

  if (error instanceof UnauthorizedError) {
    return reply.status(401).send({ message: error.message });
  }

  if (error instanceof NotFoundError) {
    return reply.status(404).send({ message: error.message });
  }

  return reply.status(500).send({ message: "Internal Server Error" });
};
