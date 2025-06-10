import { type FastifyInstance } from "fastify";

import { updateOtherItem } from "./update-other-item";
import { deleteOtherItem } from "./delete-other-item";
import { getAllOtherItems } from "./get-all-other-items";
import { getOtherItemById } from "./get-other-item-by-id";
import { createNewOtherItem } from "./create-new-other-item";
import { getOtherItemsByType } from "./get-other-items-by-type";

export async function otherItemsRoutes(app: FastifyInstance) {
  app.register(getAllOtherItems);
  app.register(getOtherItemsByType);
  app.register(getOtherItemById);
  app.register(createNewOtherItem);
  app.register(updateOtherItem);
  app.register(deleteOtherItem);
}
