import { fastify } from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import { validatorCompiler, serializerCompiler, jsonSchemaTransform, type ZodTypeProvider } from "fastify-type-provider-zod";

import { login } from "./routes/auth/login";
import { errorHandler } from "./error-handling";
import { register } from "./routes/auth/register";
import { profile } from "./routes/user/my-profile";
import { updateUser } from "./routes/user/user-update";
import { listGuides } from "./routes/guides/list-guides";
import { createGuide } from "./routes/guides/create-guide";
import { updateGuide } from "./routes/guides/update-guide";
import { deleteGuide } from "./routes/guides/delete-guide";
import { resetPassword } from "./routes/auth/password-reset";
import { updatePassword } from "./routes/user/update-password";
import { getGuideById } from "./routes/guides/get-guide-by-id";
import { recoverPassword } from "./routes/auth/password-recover";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);
app.setErrorHandler(errorHandler);

app.register(fastifySwagger, {
  transform: jsonSchemaTransform,
  openapi: {
    servers: [],
    info: {
      version: "1.0.0",
      title: "Apogea API",
      description: "API for managing Apogea applications.",
    },
  },
});
app.register(fastifySwaggerUI, {
  routePrefix: "/docs",
});
app.register(fastifyJwt, {
  secret: "secret-key",
});
app.register(fastifyCors);

app.register(register);
app.register(login);
app.register(resetPassword);
app.register(recoverPassword);
app.register(profile);
app.register(updateUser);
app.register(updatePassword);

app.register(createGuide);
app.register(listGuides);
app.register(getGuideById);
app.register(updateGuide);
app.register(deleteGuide);

const port = process.env.PORT ? parseInt(process.env.PORT) : 3333;
// const host = "0.0.0.0";

app.listen({ port }).then(() => {
  console.log(`Server is running on http://localhost:${port}/`);
});
