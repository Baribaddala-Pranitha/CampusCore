import mongoose from "mongoose";

const BusAttendanceSchema = new mongoose.Schema(
  {
    busId: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
    date: { type: Date, required: true },
    entries: [
      {
        studentName: String,
        stop: String,
        status: { type: String, enum: ["Onboard", "Offboard", "Pending"], default: "Pending" },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.BusAttendance || mongoose.model("BusAttendance", BusAttendanceSchema);




