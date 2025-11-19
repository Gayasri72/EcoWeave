import React, { useState, useEffect } from "react";
import axios from "../api/axiosConfig";
import StaffHeader from "../components/StaffHeader";
import {
  BeakerIcon,
  ScissorsIcon,
  BoltIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

export default function SewingDashboard() {
  const [productId, setProductId] = useState("");
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState(null);
  const [water, setWater] = useState("");
  const [co2, setCo2] = useState("");
  const [energy, setEnergy] = useState("");
  const [msg, setMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setIsSubmitting(true);
    try {
      await axios.put(`/api/products/${productId}/stage/sewing`, {
        water: Number(water),
        co2: Number(co2),
        energy: Number(energy),
      });
      setMsg({
        ok: true,
        text: "Sewing stage metrics submitted successfully!",
      });
      setWater("");
      setCo2("");
      setEnergy("");
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      <StaffHeader />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
              <ScissorsIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                Sewing Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Final stage - add sewing & assembly metrics to products
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form Card */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Sewing Metrics</h2>
                <p className="text-amber-50 text-sm mt-1">
                  Submit stitching, assembly & packaging data
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
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
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <BeakerIcon className="w-5 h-5 text-amber-600" />
                    Environmental Impact Metrics
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        💧 Water Usage
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
                        Liters consumed
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        🌍 Carbon Emissions
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
                        CO₂ emissions
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <BoltIcon className="w-4 h-4 text-yellow-500" />
                        Energy Consumption
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
                        Kilowatt-hours
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !productId}
                    className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6 py-3.5 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        Submit Sewing Metrics
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
                Sewing Stage
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">→</span>
                  Final production stage
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">→</span>
                  Covers stitching & assembly
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">→</span>
                  Completes product lifecycle tracking
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
                  <span>Verify product selection carefully</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Include all assembly operations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Account for packaging materials</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Record machine & manual work</span>
                </li>
              </ul>
            </div>

            {/* Standards Reference */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl shadow-lg p-6 border border-emerald-200">
              <h3 className="text-lg font-bold text-emerald-900 mb-4">
                📊 Target Standards
              </h3>
              <div className="space-y-3 text-sm">
                <div className="bg-white rounded-lg p-3">
                  <p className="font-semibold text-gray-700">Cotton Sewing</p>
                  <p className="text-gray-600 text-xs mt-1">
                    Water: ≤100L • CO₂: ≤0.5kg • Energy: ≤2kWh
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="font-semibold text-gray-700">Silk Sewing</p>
                  <p className="text-gray-600 text-xs mt-1">
                    Water: ≤150L • CO₂: ≤0.7kg • Energy: ≤3kWh
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
