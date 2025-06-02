import { z } from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { SteamService } from "../../../services/steam";

export async function getSteamNews(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/news",
    {
      schema: {
        tags: ["News"],
        summary: "Get Steam news",
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
      const news = await SteamService.getNews(10);

      const newsFormatted = news?.appnews?.newsitems?.map((item) => ({
        id: item?.gid,
        title: item?.title,
        author: item?.author,
        image_url: item?.url,
        content: item?.contents,
      }));

      return reply.status(200).send(newsFormatted);
    }
  );
}
