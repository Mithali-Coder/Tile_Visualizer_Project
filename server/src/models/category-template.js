import mongoose from "mongoose";
import {
  ROOM_IDS,
  TEMPLATE_TYPES,
} from "@tile-visualizer/shared/schemas/index.js";

const categoryTemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    room: { type: String, required: true, enum: ROOM_IDS },
    type: { type: String, required: true, enum: TEMPLATE_TYPES },
    layout: { type: String },
    previewImage: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const CategoryTemplate =
  mongoose.models.CategoryTemplate ||
  mongoose.model("CategoryTemplate", categoryTemplateSchema);
