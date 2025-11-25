import React, { useState } from "react";
import axios from "../api/axiosConfig";
import StaffHeader from "../components/StaffHeader";
import {
  BeakerIcon,
  SwatchIcon,
  BoltIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

export default function KnittingDashboard() {
  const [productId, setProductId] = useState("");
  const [water, setWater] = useState("");
  const [co2, setCo2] = useState("");
  const [energy, setEnergy] = useState("");
  const [numberOfProducts, setNumberOfProducts] = useState("");
  const [category, setCategory] = useState("");
  const [msg, setMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setIsSubmitting(true);
    try {
      await axios.put(`/api/products/${productId}/stage/knitting`, {
        water: Number(water),
        co2: Number(co2),
        energy: Number(energy),
        numberOfProducts: Number(numberOfProducts),
        category,
      });
      setMsg({
        ok: true,
        text: "Knitting stage metrics submitted successfully!",
      });
      // Reset form
      setProductId("");
      setWater("");
      setCo2("");
      setEnergy("");
      setNumberOfProducts("");
      setCategory("");
    } catch (err) {
      setMsg({
        ok: false,
        text: err.response?.data?.message || "Error submitting metrics",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <StaffHeader />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                Knitting Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Create new products and track knitting stage environmental
                metrics
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form Card */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white">
                  Product Information
                </h2>
                <p className="text-green-50 text-sm mt-1">
                  Enter product details and sustainability metrics
                </p>
              </div>

              <form onSubmit={submit} className="p-6 space-y-6">
                {/* Product Details Section */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <SwatchIcon className="w-5 h-5 text-green-600" />
                    Product Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Product ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition placeholder-gray-400"
                        placeholder="e.g., ECO-2024-001"
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Material Category{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="">Select material type</option>
                        <option value="cotton">🌱 Cotton</option>
                        <option value="silk">🧵 Silk</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Environmental Metrics Section */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <BeakerIcon className="w-5 h-5 text-green-600" />
                    Environmental Impact Metrics
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Water Input */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        💧 Water Usage (per month)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.01"
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-gray-400"
                          placeholder="0.00"
                          value={water}
                          onChange={(e) => setWater(e.target.value)}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                          L
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Total monthly consumption
                      </p>
                    </div>

                    {/* CO2 Input */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        🌍 Carbon Emissions (per product)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.01"
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition placeholder-gray-400"
                          placeholder="0.00"
                          value={co2}
                          onChange={(e) => setCo2(e.target.value)}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                          kg
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Per product emissions
                      </p>
                    </div>

                    {/* Energy Input */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <BoltIcon className="w-4 h-4 text-yellow-500" />
                        Energy Consumption (per month)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.01"
                          className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition placeholder-gray-400"
                          placeholder="0.00"
                          value={energy}
                          onChange={(e) => setEnergy(e.target.value)}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                          kWh
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Total monthly consumption
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 mt-5">
                    {/* Number of Products Input */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        📦 Number of Products Manufactured
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="1"
                          min="1"
                          required
                          className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition placeholder-gray-400"
                          placeholder="1"
                          value={numberOfProducts}
                          onChange={(e) => setNumberOfProducts(e.target.value)}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                          units
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Total products made this month
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3.5 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="w-5 h-5" />
                        Submit Knitting Metrics
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Message Alert */}
              {msg && (
                <div
                  className={`mx-6 mb-6 px-5 py-4 rounded-xl border-2 flex items-start gap-3 ${
                    msg.ok
                      ? "bg-green-50 border-green-300 text-green-800"
                      : "bg-red-50 border-red-300 text-red-800"
                  }`}
                >
                  {msg.ok ? (
                    <CheckCircleIcon className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  ) : (
                    <ExclamationCircleIcon className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-semibold">
                      {msg.ok ? "Success!" : "Error"}
                    </p>
                    <p className="text-sm mt-0.5">{msg.text}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            {/* Stage Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Knitting Stage
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p className="flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-0.5">→</span>
                  First stage in the production process
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-0.5">→</span>
                  Creates new product entries in the system
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-0.5">→</span>
                  Track yarn processing & fabric creation
                </p>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-lg p-6 border border-blue-200">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                💡 Best Practices
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Use unique product IDs for tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Record metrics immediately after process</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Double-check measurements for accuracy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Select correct material category</span>
                </li>
              </ul>
            </div>

            {/* Standards Reference */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-lg p-6 border border-amber-200">
              <h3 className="text-lg font-bold text-amber-900 mb-4">
                📊 Target Standards
              </h3>
              <div className="space-y-3 text-sm">
                <div className="bg-white rounded-lg p-3">
                  <p className="font-semibold text-gray-700">Cotton Knitting</p>
                  <p className="text-gray-600 text-xs mt-1">
                    Water: ≤1L • CO₂: ≤3.9kg • Energy: ≤6kWh
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="font-semibold text-gray-700">Silk Knitting</p>
                  <p className="text-gray-600 text-xs mt-1">
                    Water: ≤1000L • CO₂: ≤3.2kg • Energy: ≤8kWh
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
