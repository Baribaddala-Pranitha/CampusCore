import mongoose from "mongoose";

const ClassSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    teacherName: { type: String, required: true },
    studentsCount: { type: Number, default: 0 },
    subjectsCount: { type: Number, default: 0 },
    syllabus: [{ topic: String, unit: String }],
    timetable: [{ day: String, period: String, subject: String }]
  },
  { timestamps: true }
);

export default mongoose.models.Classroom || mongoose.model("Classroom", ClassSchema);


