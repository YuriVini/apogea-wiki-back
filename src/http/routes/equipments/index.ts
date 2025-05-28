import { type FastifyInstance } from "fastify";

import { listEquipments } from "./list-equipments";

export async function equipmentsRoutes(app: FastifyInstance) {
  app.register(listEquipments);
}
