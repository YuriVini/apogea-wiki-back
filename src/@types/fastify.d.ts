import "fastify";

declare module "fastify" {
  export interface FastifyRequest {
    isAdmin: () => Promise<boolean>;
    getCurrentUserId: () => Promise<string>;
  }
}
