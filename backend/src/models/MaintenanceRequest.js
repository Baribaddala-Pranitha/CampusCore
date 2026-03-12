import mongoose from "mongoose";

const MaintenanceRequestSchema = new mongoose.Schema(
  {
    facility: { type: String, required: true },
    issue: { type: String, required: true },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
  },
  { timestamps: true }
);

export default mongoose.models.MaintenanceRequest || mongoose.model("MaintenanceRequest", MaintenanceRequestSchema);


