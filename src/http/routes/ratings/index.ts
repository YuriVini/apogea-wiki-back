import { type FastifyInstance } from "fastify";

import { createRating } from "./create-rating";
import { updateRating } from "./update-rating";

export async function ratingsRoutes(app: FastifyInstance) {
  app.register(createRating);
  app.register(updateRating);
}
