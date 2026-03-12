import mongoose from "mongoose";

const AssetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    count: { type: Number, default: 0 },
    capacity: { type: Number, default: 0 },
    utilization: { type: String, default: "0%" },
    status: { type: String, default: "Good" },
    icon: { type: String },
    color: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Asset || mongoose.model("Asset", AssetSchema);


