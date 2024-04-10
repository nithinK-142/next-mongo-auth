import mongoose, { Document, Schema } from "mongoose";

export interface ResetToken extends Document {
  user: Schema.Types.ObjectId;
  token: string;
  createdAt: Date;
  tokenVerified: boolean;
}

const ResetTokenSchema: Schema<ResetToken> = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now, expires: "1h" },
  tokenVerified: { type: Boolean, required: true, default: false },
});

const ResetTokenModel =
  (mongoose.models.ResetToken as mongoose.Model<ResetToken>) ||
  mongoose.model("ResetToken", ResetTokenSchema);

export default ResetTokenModel;
