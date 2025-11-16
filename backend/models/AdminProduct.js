import mongoose from "mongoose";

const { Schema, model } = mongoose;

const adminProductSchema = new Schema(
  {
    productId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, trim: true },
    description: { type: String },
    category: { type: String, enum: ["cotton", "silk"], required: true },
    imageUrl: { type: String },
    qrCodeDataUrl: { type: String },
    // snapshot of the latest comparison/report generated from staff submissions
    report: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

adminProductSchema.index({ productId: 1 });

export default model("AdminProduct", adminProductSchema);
