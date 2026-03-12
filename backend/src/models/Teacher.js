import mongoose from "mongoose";

const TeacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    subject: { type: String, required: true },
    classes: [{ type: String }],
    experienceYears: { type: Number, default: 0 },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    status: { type: String, enum: ["Active", "On Leave", "Inactive"], default: "Active" }
  },
  { timestamps: true }
);

export default mongoose.models.Teacher || mongoose.model("Teacher", TeacherSchema);


