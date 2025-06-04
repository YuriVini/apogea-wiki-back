import { type FastifyInstance } from "fastify";

import { uploadPresignedUrl } from "./upload-presigned-url";

export async function awsRoutes(app: FastifyInstance) {
  app.register(uploadPresignedUrl);
}
