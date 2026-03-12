import mongoose from "mongoose";

const ParentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    address: { type: String },
    preferences: {
      emailNotifications: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Parent || mongoose.model("Parent", ParentSchema);



