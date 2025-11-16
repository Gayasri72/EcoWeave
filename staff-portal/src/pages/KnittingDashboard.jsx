import React, { useState } from "react";
import axios from "../api/axiosConfig";
import StaffHeader from "../components/StaffHeader";

export default function KnittingDashboard() {
  const [productId, setProductId] = useState("");
  const [water, setWater] = useState("");
  const [co2, setCo2] = useState("");
  const [energy, setEnergy] = useState("");
  const [category, setCategory] = useState("");
  const [msg, setMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      const res = await axios.put(`/api/products/${productId}/stage/knitting`, {
        water: Number(water),
        co2: Number(co2),
        energy: Number(energy),
        category,
      });
      setMsg({ ok: true, text: "Knitting stage metrics submitted successfully!" });
    } catch (err) {
      setMsg({
        ok: false,
        text: err.response?.data?.message || "Error submitting metrics",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <StaffHeader />

      <div className="container mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Knitting Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Create product entries and submit knitting stage sustainability metrics.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white shadow-lg rounded-xl p-6 max-w-3xl mx-auto border border-gray-200">
          <form onSubmit={submit} className="space-y-6">

            {/* Product ID + Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product ID
                </label>
                <input
                  required
                  className="mt-2 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
                  placeholder="e.g., P001"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  required
                  className="mt-2 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select category</option>
                  <option value="cotton">Cotton</option>
                  <option value="silk">Silk</option>
                </select>
              </div>
            </div>

            {/* Metrics */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Knitting-stage Metrics
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Water (L)
                  </label>
                  <input
                    className="mt-2 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
                    placeholder="liters"
                    value={water}
                    onChange={(e) => setWater(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    CO₂ (kg)
                  </label>
                  <input
                    className="mt-2 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
                    placeholder="kg"
                    value={co2}
                    onChange={(e) => setCo2(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Energy (kWh)
                  </label>
                  <input
                    className="mt-2 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
                    placeholder="kWh"
                    value={energy}
                    onChange={(e) => setEnergy(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                className="w-full md:w-auto px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700 transition"
                type="submit"
              >
                Submit Metrics
              </button>
            </div>
          </form>

          {/* Message Box */}
          {msg && (
            <div
              className={`mt-6 px-4 py-3 rounded-lg text-sm font-medium ${
                msg.ok ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"
              }`}
            >
              {msg.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
