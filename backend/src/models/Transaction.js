import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true },
    className: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["Tuition Fee", "Annual Fee", "Transport Fee", "Activity Fee", "Other"], required: true },
    status: { type: String, enum: ["Paid", "Pending"], default: "Paid" },
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);


