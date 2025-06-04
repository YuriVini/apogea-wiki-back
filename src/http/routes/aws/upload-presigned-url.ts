import { z } from "zod";
import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

import { auth } from "../../middlewares/auth";
import { UnauthorizedError } from "../_errors/unauthorized";
import { uploadSignedUrlHandler } from "../../../services/awsServices";

const getPresignedUrlBodySchema = z.object({
  fileName: z.string(),
});

export async function uploadPresignedUrl(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      "/presigned-url",
      {
        schema: {
          tags: ["aws"],
          body: getPresignedUrlBodySchema,
          summary: "Get a presigned URL for S3 upload",
          response: {
            401: z.object({
              message: z.string(),
            }),
            200: z.object({
              signedUrl: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { fileName } = getPresignedUrlBodySchema.parse(request.body);
        try {
          const { signedUrl } = await uploadSignedUrlHandler(fileName);

          return reply.status(200).send({ signedUrl });
        } catch (error) {
          throw new UnauthorizedError("Failed to generate presigned URL");
        }
      }
    );
}
