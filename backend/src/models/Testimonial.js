import mongoose from "mongoose";

const TestimonialSchema = new mongoose.Schema(
  {
    schoolName: { type: String, required: true },
    principalName: { type: String, required: true },
    review: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.models.Testimonial || mongoose.model("Testimonial", TestimonialSchema);
