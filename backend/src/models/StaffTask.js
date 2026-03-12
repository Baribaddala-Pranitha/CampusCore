import mongoose from "mongoose";

const StaffTaskSchema = new mongoose.Schema(
  {
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
    title: { type: String, required: true },
    dueDate: { type: Date },
    status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
  },
  { timestamps: true }
);

export default mongoose.models.StaffTask || mongoose.model("StaffTask", StaffTaskSchema);




