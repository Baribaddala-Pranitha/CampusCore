import mongoose from "mongoose";

const ExamResultSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    className: { type: String, required: true },
    examName: { type: String, required: true },
    subject: { type: String, required: true },
    score: { type: Number, required: true },
    maxMarks: { type: Number, default: 100 },
    percentage: { type: Number, default: 0 },
    grade: { type: String, required: true },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.ExamResult || mongoose.model("ExamResult", ExamResultSchema);



