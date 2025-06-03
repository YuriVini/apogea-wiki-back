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
        querystring: z.object({
          maxLength: z.string().optional(),
        }),
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              url: z.string(),
              title: z.string(),
              author: z.string(),
              content: z.string(),
            })
          ),
        },
      },
    },
    async (request, reply) => {
      const { maxLength } = request.query;
      const news = await SteamService.getNews(parseInt(maxLength ?? "100"));

      const newsFormatted = news?.appnews?.newsitems?.map((item) => ({
        id: item?.gid,
        url: item?.url,
        title: item?.title,
        author: item?.author,
        content: item?.contents,
      }));

      return reply.status(200).send(newsFormatted);
    }
  );
}
