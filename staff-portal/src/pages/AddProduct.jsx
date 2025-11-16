import React, { useState } from "react";
import axios from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import StaffHeader from "../components/StaffHeader";

export default function AddProduct() {
  const [productId, setProductId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      const body = {
        productId,
        name,
        description,
        category,
        imageUrl: qrCodeUrl,
      };
      const res = await axios.post("/api/admin-products", body);
      setMsg({ ok: true, text: "Product created", product: res.data });
      // navigate to reports after short delay
      setTimeout(() => navigate("/reports"), 900);
    } catch (err) {
      setMsg({ ok: false, text: err.response?.data?.message || err.message });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <StaffHeader />
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Add Product (Admin)</h2>
        <form onSubmit={submit} className="space-y-3">
          <input
            className="w-full border rounded p-2"
            placeholder="Product ID"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
          />
          <input
            className="w-full border rounded p-2"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            className="w-full border rounded p-2"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <select
            className="w-full border rounded p-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select category</option>
            <option value="cotton">cotton</option>
            <option value="silk">silk</option>
          </select>
          <input
            className="w-full border rounded p-2"
            placeholder="QR code / image URL (optional)"
            value={qrCodeUrl}
            onChange={(e) => setQrCodeUrl(e.target.value)}
          />

          <div>
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded"
              type="submit"
            >
              Create Product
            </button>
          </div>
        </form>
        {msg && (
          <div className={`mt-4 ${msg.ok ? "text-green-600" : "text-red-600"}`}>
            {msg.text}
          </div>
        )}
      </div>
    </div>
  );
}
