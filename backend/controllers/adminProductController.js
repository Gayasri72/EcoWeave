import AdminProduct from "../models/AdminProduct.js";

export const listAdminProducts = async (req, res) => {
  try {
    const list = await AdminProduct.find().sort({ createdAt: -1 });
    return res.json(list);
  } catch (err) {
    console.error("listAdminProducts error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAdminProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId)
      return res.status(400).json({ message: "productId is required" });
    const p = await AdminProduct.findOne({ productId });
    if (!p) return res.status(404).json({ message: "Admin product not found" });
    return res.json(p);
  } catch (err) {
    console.error("getAdminProduct error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export default { listAdminProducts, getAdminProduct };
