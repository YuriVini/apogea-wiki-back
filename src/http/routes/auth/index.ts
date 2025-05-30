import { type FastifyInstance } from "fastify";

import { login } from "./login";
import { register } from "./register";
import { resetPassword } from "./password-reset";
import { recoverPassword } from "./password-recover";

export const authRoutes = async (app: FastifyInstance) => {
  app.register(login);
  app.register(register);
  app.register(resetPassword);
  app.register(recoverPassword);
};
