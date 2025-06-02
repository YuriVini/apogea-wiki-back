import { z } from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { SteamService } from "../../../services/steam";

const getSteamNewsQuerySchema = z.object({
  count: z.coerce.number().min(1).max(50).default(10),
});

export async function getSteamNews(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/news",
    {
      schema: {
        tags: ["News"],
        summary: "Get Steam news",
        querystring: getSteamNewsQuerySchema,
        description: "Get the latest news from the Apogea Steam page",
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              title: z.string(),
              content: z.string(),
              image_url: z.string(),
            })
          ),
        },
      },
    },
    async (request, reply) => {
      const { count } = getSteamNewsQuerySchema.parse(request.query);

      const news = await SteamService.getNews(count);

      return reply.status(200).send(
        news.appnews.newsitems.map((item) => ({
          id: item.gid,
          title: item.title,
          image_url: item.url,
          content: item.contents,
        }))
      );
    }
  );
}
