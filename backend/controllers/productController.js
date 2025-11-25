import Product from "../models/Product.js";
import AdminProduct from "../models/AdminProduct.js";
import qrcode from "qrcode";

// Helper to calculate sustainability score and flag
export function calculateSustainability(
  knitting = {},
  finishing = {},
  sewing = {}
) {
  const stages = [knitting, finishing, sewing];

  const totals = stages.reduce(
    (acc, s) => {
      acc.water += Number(s.water) || 0;
      acc.co2 += Number(s.co2) || 0;
      acc.energy += Number(s.energy) || 0;
      return acc;
    },
    { water: 0, co2: 0, energy: 0 }
  );

  const { water: totalWater, co2: totalCo2, energy: totalEnergy } = totals;

  // Formula:
  // score = 100 - (totalCo2*5 + totalWater*0.05 + totalEnergy*0.2)
  let score = 100 - (totalCo2 * 5 + totalWater * 0.05 + totalEnergy * 0.2);

  // Clamp
  if (Number.isNaN(score)) score = 0;
  score = Math.max(0, Math.min(100, score));

  const isSustainable = score >= 70;
  return { score, isSustainable, totals };
}

// Admin creates a new product
export const createProduct = async (req, res) => {
  try {
    const user = req.user;
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: admin only" });
    }
    const { productId, name, description, category } = req.body;
    if (!productId || !category) {
      return res
        .status(400)
        .json({ message: "productId and category are required" });
    }

    const existing = await Product.findOne({ productId });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Product with this productId already exists" });
    }

    const product = new Product({ productId, name, description, category });
    await product.save();

    return res.status(201).json(product);
  } catch (err) {
    console.error("createProduct error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get a product by productId
export const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId)
      return res.status(400).json({ message: "productId is required" });

    const product = await Product.findOne({ productId });
    if (!product) return res.status(404).json({ message: "Product not found" });

    return res.json(product);
  } catch (err) {
    console.error("getProductById error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Update a stage (knitting/finishing/sewing) with metrics
export const updateStage = async (req, res) => {
  try {
    const { productId, stage } = req.params;
    const allowed = ["knitting", "finishing", "sewing"];
    if (!productId || !stage)
      return res
        .status(400)
        .json({ message: "productId and stage are required" });
    if (!allowed.includes(stage))
      return res.status(400).json({ message: "Invalid stage" });

    const { water, co2, energy, numberOfProducts } = req.body;
    const { category } = req.body;

    let product = await Product.findOne({ productId });

    // If product does not exist: allow creation only from knitting stage
    if (!product) {
      if (stage !== "knitting") {
        return res.status(404).json({
          message:
            "Product not found. Products must be created in the knitting stage.",
        });
      }

      if (!category) {
        return res.status(400).json({
          message:
            "category is required when creating a product in knitting stage",
        });
      }

      // Calculate per-product values
      // CO2 is already input per product
      // Water and energy are input per month, so divide by numberOfProducts
      const numProducts = Number(numberOfProducts) || 1;
      const waterPerProduct = (Number(water) || 0) / numProducts;
      const energyPerProduct = (Number(energy) || 0) / numProducts;

      // create new product with initial knitting metrics
      const initial = {
        productId,
        name: undefined,
        description: undefined,
        category,
      };

      initial.knitting = {
        water: waterPerProduct,
        co2: Number(co2) || 0, // CO2 is already per product
        energy: energyPerProduct,
        numberOfProducts: numProducts,
        submittedBy: req.user ? req.user.id : null,
        submittedAt: new Date(),
      };

      product = new Product(initial);
    } else {
      // product exists: do not allow changing category
      if (category && category !== product.category) {
        return res.status(400).json({
          message: "Category cannot be changed after product creation",
        });
      }

      // Calculate per-product values
      // CO2 is already input per product
      // Water and energy are input per month, so divide by numberOfProducts
      const numProducts = Number(numberOfProducts) || 1;
      const waterPerProduct = water !== undefined ? (Number(water) || 0) / numProducts : undefined;
      const energyPerProduct = energy !== undefined ? (Number(energy) || 0) / numProducts : undefined;

      // Update nested stage
      product[stage] = product[stage] || {};
      if (waterPerProduct !== undefined) product[stage].water = waterPerProduct;
      if (co2 !== undefined) product[stage].co2 = Number(co2); // CO2 is already per product
      if (energyPerProduct !== undefined) product[stage].energy = energyPerProduct;
      if (numberOfProducts !== undefined) product[stage].numberOfProducts = numProducts;
      product[stage].submittedBy = req.user ? req.user.id : null;
      product[stage].submittedAt = new Date();
    }

    // Recalculate sustainability
    const { score, isSustainable } = calculateSustainability(
      product.knitting,
      product.finishing,
      product.sewing
    );
    product.sustainabilityScore = score;
    product.isSustainable = isSustainable;

    await product.save();

    // After saving, compute comparison snapshot to store with public admin product
    try {
      const report = (function computeReport(prod) {
        const STANDARDS_MAP = {
          cotton: {
            knitting: { water: 1, co2: 3.9, energy: 6 },
            finishing: { water: 70, co2: 4.8, energy: 14.5 },
            sewing: { water: 0, co2: 0.085, energy: 0.13 },
          },
          silk: {
            knitting: { water: 1000, co2: 3.2, energy: 8 },
            finishing: { water: 350, co2: 1.8, energy: 5 },
            sewing: { water: 150, co2: 0.7, energy: 3 },
          },
        };

        const category = prod.category;
        const STANDARDS = STANDARDS_MAP[category] || null;
        const stages = ["knitting", "finishing", "sewing"];

        const comparisons = {};
        const totals = { water: 0, co2: 0, energy: 0 };

        if (!STANDARDS) return null;

        for (const s of stages) {
          const actual = {
            water: Number(prod[s]?.water) || 0,
            co2: Number(prod[s]?.co2) || 0,
            energy: Number(prod[s]?.energy) || 0,
          };
          totals.water += actual.water;
          totals.co2 += actual.co2;
          totals.energy += actual.energy;
          const std = STANDARDS[s];
          const within = {
            water:
              std.water === 0 ? actual.water === 0 : actual.water <= std.water,
            co2: std.co2 === 0 ? actual.co2 === 0 : actual.co2 <= std.co2,
            energy:
              std.energy === 0
                ? actual.energy === 0
                : actual.energy <= std.energy,
          };
          const percent = {
            water: std.water === 0 ? null : (actual.water / std.water) * 100,
            co2: std.co2 === 0 ? null : (actual.co2 / std.co2) * 100,
            energy:
              std.energy === 0 ? null : (actual.energy / std.energy) * 100,
          };
          comparisons[s] = { actual, standard: std, within, percent };
        }

        const standardTotals = stages.reduce(
          (acc, s) => {
            acc.water += STANDARDS[s].water;
            acc.co2 += STANDARDS[s].co2;
            acc.energy += STANDARDS[s].energy;
            return acc;
          },
          { water: 0, co2: 0, energy: 0 }
        );

        const totalsWithin = {
          water: totals.water <= standardTotals.water,
          co2: totals.co2 <= standardTotals.co2,
          energy: totals.energy <= standardTotals.energy,
        };

        const overallWithinStandard =
          totalsWithin.water && totalsWithin.co2 && totalsWithin.energy;

        return {
          productId: prod.productId,
          category: prod.category,
          isSustainable: prod.isSustainable,
          sustainabilityScore: prod.sustainabilityScore,
          totals,
          standardTotals,
          comparisons,
          totalsWithin,
          overallWithinStandard,
        };
      })(product);

      if (report) {
        // generate QR that links to frontend product detail
        const FRONTEND_BASE =
          process.env.FRONTEND_URL || "http://192.168.227.1:5173";
        const productUrl = `${FRONTEND_BASE}/products/${encodeURIComponent(
          product.productId
        )}`;
        let qrCodeDataUrl = null;
        try {
          qrCodeDataUrl = await qrcode.toDataURL(productUrl);
        } catch (e) {
          console.warn("QR generation failed:", e && e.message);
        }

        await AdminProduct.findOneAndUpdate(
          { productId: product.productId },
          {
            $set: {
              productId: product.productId,
              category: product.category,
              report,
              qrCodeDataUrl,
            },
          },
          { upsert: true, new: true }
        );
      }
    } catch (err) {
      console.warn(
        "Failed to create/update public admin product:",
        err && err.message
      );
    }

    return res.json(product);
  } catch (err) {
    console.error("updateStage error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Compare cotton / silk to standard values
export const compareToStandard = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId)
      return res.status(400).json({ message: "productId is required" });

    const product = await Product.findOne({ productId });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const category = product.category;

    // 🌿 REAL-WORLD STANDARD VALUES
    const STANDARDS_MAP = {
      cotton: {
        knitting: { water: 1, co2: 3.9, energy: 6 },
        finishing: { water: 70, co2: 4.8, energy: 14.5 },
        sewing: { water: 0, co2: 0.085, energy: 0.13 },
      },
      silk: {
        knitting: { water: 1000, co2: 3.2, energy: 8 },
        finishing: { water: 350, co2: 1.8, energy: 5 },
        sewing: { water: 150, co2: 0.7, energy: 3 },
      },
    };

    const STANDARDS = STANDARDS_MAP[category];
    if (!STANDARDS) {
      return res.status(400).json({
        message: `No comparison standards for category '${category}'`,
      });
    }

    const stages = ["knitting", "finishing", "sewing"];

    const comparisons = {};
    const totals = { water: 0, co2: 0, energy: 0 };

    for (const s of stages) {
      const actual = {
        water: Number(product[s]?.water) || 0,
        co2: Number(product[s]?.co2) || 0,
        energy: Number(product[s]?.energy) || 0,
      };

      totals.water += actual.water;
      totals.co2 += actual.co2;
      totals.energy += actual.energy;

      const std = STANDARDS[s];
      const within = {
        water: std.water === 0 ? actual.water === 0 : actual.water <= std.water,
        co2: std.co2 === 0 ? actual.co2 === 0 : actual.co2 <= std.co2,
        energy:
          std.energy === 0 ? actual.energy === 0 : actual.energy <= std.energy,
      };

      const percent = {
        water: std.water === 0 ? null : (actual.water / std.water) * 100,
        co2: std.co2 === 0 ? null : (actual.co2 / std.co2) * 100,
        energy: std.energy === 0 ? null : (actual.energy / std.energy) * 100,
      };

      comparisons[s] = { actual, standard: std, within, percent };
    }

    const standardTotals = stages.reduce(
      (acc, s) => {
        acc.water += STANDARDS[s].water;
        acc.co2 += STANDARDS[s].co2;
        acc.energy += STANDARDS[s].energy;
        return acc;
      },
      { water: 0, co2: 0, energy: 0 }
    );

    const totalsWithin = {
      water: totals.water <= standardTotals.water,
      co2: totals.co2 <= standardTotals.co2,
      energy: totals.energy <= standardTotals.energy,
    };

    const overallWithinStandard =
      totalsWithin.water && totalsWithin.co2 && totalsWithin.energy;

    return res.json({
      productId: product.productId,
      category: product.category,
      isSustainable: product.isSustainable,
      sustainabilityScore: product.sustainabilityScore,
      totals,
      standardTotals,
      comparisons,
      totalsWithin,
      overallWithinStandard,
    });
  } catch (err) {
    console.error("compareToStandard error", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId)
      return res.status(400).json({ message: "productId is required" });

    const product = await Product.findOneAndDelete({ productId });
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Also remove from AdminProduct (public view)
    await AdminProduct.findOneAndDelete({ productId });

    return res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("deleteProduct error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Generate monthly report (CSV)
export const getMonthlyReport = async (req, res) => {
  try {
    const products = await Product.find().lean();

    // CSV Header
    let csv =
      "Product ID,Name,Category,Sustainability Score,Is Sustainable,Knitting Water,Knitting CO2,Knitting Energy,Finishing Water,Finishing CO2,Finishing Energy,Sewing Water,Sewing CO2,Sewing Energy\n";

    // CSV Rows
    products.forEach((p) => {
      const k = p.knitting || {};
      const f = p.finishing || {};
      const s = p.sewing || {};

      const row = [
        p.productId,
        p.name || "",
        p.category || "",
        p.sustainabilityScore || 0,
        p.isSustainable ? "Yes" : "No",
        k.water || 0,
        k.co2 || 0,
        k.energy || 0,
        f.water || 0,
        f.co2 || 0,
        f.energy || 0,
        s.water || 0,
        s.co2 || 0,
        s.energy || 0,
      ].join(",");
      csv += row + "\n";
    });

    res.header("Content-Type", "text/csv");
    res.attachment(`monthly-report-${new Date().toISOString().slice(0, 10)}.csv`);
    return res.send(csv);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

// Upload product image
export const uploadImage = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = `/${req.file.path.replace(/\\/g, "/")}`;

    const product = await Product.findOneAndUpdate(
      { productId },
      { imageUrl },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Also update AdminProduct
    await AdminProduct.findOneAndUpdate(
      { productId },
      { imageUrl },
      { upsert: true }
    );

    return res.json({
      message: "Image uploaded successfully",
      imageUrl,
      product,
    });
  } catch (err) {
    console.error("uploadImage error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export default {
  createProduct,
  getProductById,
  updateStage,
  calculateSustainability,
  compareToStandard,
  deleteProduct,
  getMonthlyReport,
  uploadImage,
};
