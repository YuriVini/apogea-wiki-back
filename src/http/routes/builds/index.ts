import { type FastifyInstance } from "fastify";

import { listBuilds } from "./list-build";
import { createBuild } from "./create-build";
import { updateBuild } from "./update-build";
import { deleteBuild } from "./delete-build";
import { listBuildsByUser } from "./list-build-by-user";

export async function buildsRoutes(app: FastifyInstance) {
  app.register(createBuild);
  app.register(listBuilds);
  app.register(listBuildsByUser);
  app.register(updateBuild);
  app.register(deleteBuild);
}
