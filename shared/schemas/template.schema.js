import { z } from "zod";

/** Supported rooms (matches client `rooms.jsx` ids + exterior). */
export const ROOM_IDS = [
  "living-room",
  "kitchen",
  "bathroom",
  "bedroom",
  "staircase",
  "exterior",
];

/** Template/stencil surface types. */
export const TEMPLATE_TYPES = ["floor", "wall", "decor"];

/** CategoryTemplate document shape (`category_templates` collection). */
export const CategoryTemplateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  room: z.enum(ROOM_IDS),
  type: z.enum(TEMPLATE_TYPES),
  layout: z.string().optional(),
  previewImage: z.string().optional(),
  isActive: z.boolean().default(true),
});
