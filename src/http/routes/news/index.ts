import { type FastifyInstance } from "fastify";

import { getSteamNews } from "./get-steam-news";

export async function newsRoutes(app: FastifyInstance) {
  app.register(getSteamNews);
}
