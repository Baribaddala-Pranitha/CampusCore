import mongoose from "mongoose";

const StaffAttendanceSchema = new mongoose.Schema(
  {
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ["Present", "Absent", "Leave"], default: "Present" },
    checkIn: { type: String },
    checkOut: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.StaffAttendance || mongoose.model("StaffAttendance", StaffAttendanceSchema);




