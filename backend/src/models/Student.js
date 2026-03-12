import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    className: { type: String, required: true },
    rollNo: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    // Transport onboard flag for today's status (simple boolean; production would scope by date)
    onBoard: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.models.Student || mongoose.model("Student", StudentSchema);


