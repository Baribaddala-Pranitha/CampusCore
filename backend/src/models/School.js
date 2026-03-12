import mongoose from "mongoose";

const SchoolSchema = new mongoose.Schema(
  {
    schoolName: { type: String, required: true },
    principalName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.models.School || mongoose.model("School", SchoolSchema);
