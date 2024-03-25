import mongoose from "mongoose";

const resetTokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now, expires: "1h" },
  tokenVerified: { type: Boolean, required: true, default: false },
});

const ResetToken =
  mongoose.models.resettokens ||
  mongoose.model("resettokens", resetTokenSchema);

export default ResetToken;
