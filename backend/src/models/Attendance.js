import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    className: { type: String, required: true },
    subject: { type: String, required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    entries: [
      {
        studentName: String,
        rollNo: String,
        present: { type: Boolean, default: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Attendance || mongoose.model("Attendance", AttendanceSchema);



