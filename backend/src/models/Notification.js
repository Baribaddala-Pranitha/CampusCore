import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["alert", "info", "success"], default: "info" },
    title: { type: String, required: true },
    message: { type: String, required: true },
    unread: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);


