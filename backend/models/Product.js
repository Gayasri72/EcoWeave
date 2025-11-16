import mongoose from "mongoose";

const { Schema, model } = mongoose;

// Sub-schema for environmental metrics
const metricSchema = new Schema(
  {
    water: { type: Number, default: 0 },
    co2: { type: Number, default: 0 },
    energy: { type: Number, default: 0 },
    submittedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    submittedAt: { type: Date, default: null },
  },
  { _id: false }
);

const productSchema = new Schema(
  {
    productId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, trim: true },
    description: { type: String },
    // images are no longer required for products; category is primary
    qrCodeUrl: { type: String },
    category: {
      type: String,
      enum: ["cotton", "silk"],
      required: true,
    },
    knitting: {
      type: metricSchema,
      default: () => ({
        water: 0,
        co2: 0,
        energy: 0,
        submittedBy: null,
        submittedAt: null,
      }),
    },
    finishing: {
      type: metricSchema,
      default: () => ({
        water: 0,
        co2: 0,
        energy: 0,
        submittedBy: null,
        submittedAt: null,
      }),
    },
    sewing: {
      type: metricSchema,
      default: () => ({
        water: 0,
        co2: 0,
        energy: 0,
        submittedBy: null,
        submittedAt: null,
      }),
    },
    sustainabilityScore: { type: Number, default: 0 },
    isSustainable: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Optional: create an index for faster lookup by productId
productSchema.index({ productId: 1 });

const Product = model("Product", productSchema);

export default Product;
