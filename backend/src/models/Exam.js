import mongoose from "mongoose";

const ExamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    className: { type: String, required: true },
    subject: { type: String, required: true },
    date: { type: Date, required: true },
    maxMarks: { type: Number, default: 100 },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    gradedCount: { type: Number, default: 0 },
    totalCount: { type: Number, default: 0 },
    status: { type: String, enum: ["Upcoming", "Grading", "Graded"], default: "Upcoming" }
  },
  { timestamps: true }
);

export default mongoose.models.Exam || mongoose.model("Exam", ExamSchema);



