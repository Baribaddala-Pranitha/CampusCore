import mongoose from "mongoose";

const BusStopSchema = new mongoose.Schema(
  {
    busId: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
    name: { type: String, required: true },
    eta: { type: String, required: true },
    students: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.BusStop || mongoose.model("BusStop", BusStopSchema);




