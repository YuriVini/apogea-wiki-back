import { type FastifyInstance } from "fastify";

import { profile } from "./my-profile";
import { updateUser } from "./user-update";
import { updatePassword } from "./update-password";

export const userRoutes = async (app: FastifyInstance) => {
  app.register(profile);
  app.register(updateUser);
  app.register(updatePassword);
};
