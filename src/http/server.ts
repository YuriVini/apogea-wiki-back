import { fastify } from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import { validatorCompiler, serializerCompiler, jsonSchemaTransform, type ZodTypeProvider } from "fastify-type-provider-zod";

import { authRoutes } from "./routes/auth";
import { userRoutes } from "./routes/user";
import { newsRoutes } from "./routes/news";
import { buildsRoutes } from "./routes/builds";
import { guidesRoutes } from "./routes/guides";
import { errorHandler } from "./error-handling";
import { ratingsRoutes } from "./routes/ratings";
import { equipmentsRoutes } from "./routes/equipments";

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

app.register(
  async (fastify) => {
    fastify.register(authRoutes);
    fastify.register(userRoutes);
    fastify.register(guidesRoutes);
    fastify.register(buildsRoutes);
    fastify.register(equipmentsRoutes);
    fastify.register(ratingsRoutes);
    fastify.register(newsRoutes);
  },
  { prefix: "/api" }
);

const port = process.env.PORT ? parseInt(process.env.PORT) : 3333;
const host = "0.0.0.0";

app.listen({ port, host }).then(() => {
  console.log(`Server is running on http://${host}:${port}/api`);
});
