import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["knitting", "finishing", "sewing", "admin"],
      required: true,
    },
  },
  { timestamps: true }
);

// Remove sensitive fields when converting to JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

const User = model("User", userSchema);

export default User;
