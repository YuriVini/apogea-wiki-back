import { type FastifyInstance } from "fastify";

import { listEquipments } from "./list-equipments";
import { createEquipment } from "./create-equipment";
import { updateEquipment } from "./update-equipment";
import { deleteEquipment } from "./delete-equipment";
import { getEquipmentById } from "./get-equipment-by-id";

export async function equipmentsRoutes(app: FastifyInstance) {
  app.register(listEquipments);
  app.register(createEquipment);
  app.register(updateEquipment);
  app.register(deleteEquipment);
  app.register(getEquipmentById);
}
