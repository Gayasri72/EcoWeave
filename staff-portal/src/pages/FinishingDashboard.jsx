import React, { useState, useEffect } from "react";
import axios from "../api/axiosConfig";
import StaffHeader from "../components/StaffHeader";
import {
  BeakerIcon,
  SparklesIcon,
  BoltIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

export default function FinishingDashboard() {
  const [productId, setProductId] = useState("");
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState(null);
  const [water, setWater] = useState("");
  const [co2, setCo2] = useState("");
  const [energy, setEnergy] = useState("");
  const [numberOfProducts, setNumberOfProducts] = useState("");
  const [msg, setMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setIsSubmitting(true);
    try {
      await axios.put(`/api/products/${productId}/stage/finishing`, {
        water: Number(water),
        co2: Number(co2),
        energy: Number(energy),
        numberOfProducts: Number(numberOfProducts),
      });
      setMsg({
        ok: true,
        text: "Finishing stage metrics submitted successfully!",
      });
      setWater("");
      setCo2("");
      setEnergy("");
      setNumberOfProducts("");
    } catch (err) {
      setMsg({ ok: false, text: err.response?.data?.message || err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoadingProducts(true);
      setProductsError(null);
      try {
        const res = await axios.get("/api/products");
        if (!mounted) return;
        const available = (res.data || []).filter((p) => {
          // include products that have knitting data (created in knitting stage)
          return (
            p.knitting &&
            (p.knitting.submittedAt ||
              p.knitting.co2 ||
              p.knitting.water ||
              p.knitting.energy)
          );
        });
        setProducts(available);
      } catch (err) {
        if (!mounted) return;
        setProductsError(err.response?.data?.message || err.message);
      } finally {
        if (mounted) setLoadingProducts(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <StaffHeader />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <SparklesIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                Finishing Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Add finishing stage metrics to existing products
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form Card */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white">
                  Finishing Metrics
                </h2>
                <p className="text-indigo-50 text-sm mt-1">
                  Submit dyeing, washing & treatment data
                </p>
              </div>

              <form onSubmit={submit} className="p-6 space-y-6">
                {/* Product Selection */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Select Product <span className="text-red-500">*</span>
                  </label>

                  {loadingProducts ? (
                    <div className="flex items-center gap-3 text-gray-600 py-3">
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
                      <span>Loading available products...</span>
                    </div>
                  ) : productsError ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
                      <ExclamationCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{productsError}</span>
                    </div>
                  ) : products.length === 0 ? (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg flex items-start gap-2">
                      <ExclamationCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold">No products available</p>
                        <p className="mt-1">
                          Create a product from the Knitting dashboard first.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      value={productId}
                      onChange={(e) => setProductId(e.target.value)}
                      required
                    >
                      <option value="">Choose a product to update</option>
                      {products.map((p) => (
                        <option key={p.productId} value={p.productId}>
                          {p.productId} —{" "}
                          {p.category.charAt(0).toUpperCase() +
                            p.category.slice(1)}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Environmental Metrics */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <BeakerIcon className="w-5 h-5 text-indigo-600" />
                    Environmental Impact Metrics
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
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

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
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

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
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
                          className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition placeholder-gray-400"
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
                    disabled={isSubmitting || !productId}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3.5 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        Submit Finishing Metrics
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
                Finishing Stage
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold mt-0.5">→</span>
                  Second stage after knitting
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold mt-0.5">→</span>
                  Covers dyeing, washing & treatment
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold mt-0.5">→</span>
                  Updates existing product records
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
                  <span>Select correct product from dropdown</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Include all treatment processes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Measure water usage accurately</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Record chemical treatment impacts</span>
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
                  <p className="font-semibold text-gray-700">
                    Cotton Finishing
                  </p>
                  <p className="text-gray-600 text-xs mt-1">
                    Water: ≤250L • CO₂: ≤1.2kg • Energy: ≤4kWh
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="font-semibold text-gray-700">Silk Finishing</p>
                  <p className="text-gray-600 text-xs mt-1">
                    Water: ≤350L • CO₂: ≤1.8kg • Energy: ≤5kWh
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
