import mongoose from "mongoose";

const StaffPayrollSchema = new mongoose.Schema(
  {
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
    month: { type: String, required: true },
    gross: { type: Number, required: true },
    deductions: { type: Number, default: 0 },
    net: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.StaffPayroll || mongoose.model("StaffPayroll", StaffPayrollSchema);




