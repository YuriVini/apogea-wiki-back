import { type FastifyInstance } from "fastify";

import { listGuides } from "./list-guides";
import { createGuide } from "./create-guide";
import { updateGuide } from "./update-guide";
import { deleteGuide } from "./delete-guide";
import { getGuideById } from "./get-guide-by-id";
import { getGuidesByUserId } from "./get-guide-by-user-id";

export const guidesRoutes = async (app: FastifyInstance) => {
  app.register(createGuide);
  app.register(listGuides);
  app.register(getGuideById);
  app.register(updateGuide);
  app.register(deleteGuide);
  app.register(getGuidesByUserId);
};
