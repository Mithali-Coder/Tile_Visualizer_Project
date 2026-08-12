import { z } from "zod";

/** MongoDB ObjectId pattern (24 hex chars). */
export const MONGO_ID_PATTERN = /^[0-9a-fA-F]{24}$/;

/** Zod schema accepting a valid MongoDB ObjectId string. */
export const MongoObjectId = z
  .string()
  .regex(MONGO_ID_PATTERN, "Must be a valid 24-character MongoDB ObjectId");
