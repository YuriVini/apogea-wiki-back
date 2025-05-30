import { type FastifyInstance } from "fastify";

import { listBuilds } from "./list-build";
import { createBuild } from "./create-build";
import { updateBuild } from "./update-build";
import { deleteBuild } from "./delete-build";
import { getBuildById } from "./get-build-by-id";
import { listBuildsByUser } from "./list-build-by-user";

export async function buildsRoutes(app: FastifyInstance) {
  app.register(listBuilds);
  app.register(listBuildsByUser);
  app.register(getBuildById);
  app.register(createBuild);
  app.register(updateBuild);
  app.register(deleteBuild);
}
