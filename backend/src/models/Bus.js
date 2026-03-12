import mongoose from "mongoose";

const BusSchema = new mongoose.Schema(
  {
    number: { type: String, required: true, unique: true },
    route: { type: String, required: true },
    students: { type: Number, default: 0 },
    driver: { type: String, required: true },
    status: { type: String, enum: ["Active", "Maintenance"], default: "Active" },
    maintenance: { type: String, enum: ["Good", "Due", "In Progress"], default: "Good" }
  },
  { timestamps: true }
);

export default mongoose.models.Bus || mongoose.model("Bus", BusSchema);


