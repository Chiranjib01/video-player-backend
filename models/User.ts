import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: "/no-profile-picture.png" },
    subscribers: [{ channelId: { type: String } }],
    subscriberCount: { type: Number, default: 0 },
    subscribed: [{ channelId: { type: String } }],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPasswords = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.index({ name: "text" });

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
