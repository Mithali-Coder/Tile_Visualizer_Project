import { z } from "zod";
import { MongoObjectId } from "./id.schema.js";

/** Map of surface label → tile id (`projects.appliedTiles`). */
export const AppliedTilesSchema = z.record(z.string(), MongoObjectId);

/** Project document shape (`projects` collection). */
export const ProjectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  adminId: MongoObjectId,
  roomId: z.string().optional(),
  appliedTiles: AppliedTilesSchema.optional(),
  previewCanvasUrl: z.string().optional(),
});
