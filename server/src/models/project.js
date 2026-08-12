import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    roomId: { type: String },
    appliedTiles: {
      type: Map,
      of: mongoose.Schema.Types.ObjectId,
      ref: "Tile",
      default: {},
    },
    previewCanvasUrl: { type: String },
  },
  { timestamps: true }
);

export const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);
