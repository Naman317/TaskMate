import mongoose, { Schema } from "mongoose";

const invitationSchema = new Schema(
  {
    email: { type: String, default: "", lowercase: true, trim: true },
    isGeneral: { type: Boolean, default: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    title: { type: String, default: "Team Member" },
    token: { type: String, required: true, unique: true },
    invitedBy: { type: Schema.Types.ObjectId, ref: "User" },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours expiry
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "expired"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Invitation", invitationSchema);
