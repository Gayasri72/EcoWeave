import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const metrics = [
  { key: "water", label: "Water Usage (L)" },
  { key: "co2", label: "Carbon Emissions (kg CO₂)" },
  { key: "energy", label: "Energy Consumption (kWh)" },
];

function StatCard({ label, value, hint }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
      {hint && <div className="text-xs text-gray-400 mt-1">{hint}</div>}
    </div>
  );
}

export default function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const API_BASE =
          import.meta.env.VITE_API_BASE || "http://localhost:5000";

        const res = await fetch(
          `${API_BASE}/api/admin-products/${encodeURIComponent(productId)}`
        );
        if (!res.ok) throw new Error(`Server error ${res.status}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message || String(err));
      }
    };
    load();
  }, [productId]);

  const comparisons = useMemo(
    () => product?.report?.comparisons || {},
    [product]
  );
  const stages = useMemo(() => Object.keys(comparisons), [comparisons]);

  // CHART DATA
  const charts = useMemo(() => {
    if (!stages.length) return {};
    const result = {};

    metrics.forEach((m) => {
      const actual = stages.map((s) => comparisons[s]?.actual?.[m.key] ?? 0);
      const standard = stages.map(
        (s) => comparisons[s]?.standard?.[m.key] ?? 0
      );

      result[m.key] = {
        labels: stages.map((s) => s.replace(/[-_]/g, " ")),
        datasets: [
          {
            label: "Industry Standard",
            data: standard,
            backgroundColor: "rgba(34,197,94,0.5)",
            borderRadius: 6,
          },
          {
            label: "Product Actual",
            data: actual,
            backgroundColor: "rgba(14,165,233,0.7)",
            borderRadius: 6,
          },
        ],
      };
    });

    return result;
  }, [comparisons, stages]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Error Loading Product
          </h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-6">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-green-600 mx-auto mb-4"
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
          <p className="text-gray-600 font-medium">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
        {/* TOP HERO SECTION */}
        <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <svg
                  className="w-7 h-7"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Sustainability Report
              </h1>
            </div>
            <p className="text-green-50 text-lg">
              Complete environmental impact analysis for{" "}
              <span className="font-semibold">{product.productId}</span>
            </p>
          </div>
        </div>

        {/* PRODUCT SUMMARY */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-green-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              Product Information
            </h2>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* IMAGE */}
              <div className="md:w-48 flex-shrink-0">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-xl shadow-lg border-2 border-green-100"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* INFO */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {product.name || product.productId}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-gray-500">
                        ID: {product.productId}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 capitalize">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  {product.report?.overallWithinStandard ? (
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full border border-green-300">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm font-semibold text-green-800">
                        Meets Standards
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full border border-amber-300">
                      <svg
                        className="w-5 h-5 text-amber-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm font-semibold text-amber-800">
                        Exceeds Standards
                      </span>
                    </div>
                  )}
                </div>

                {product.description && (
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {product.description}
                  </p>
                )}

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                    <div className="text-3xl font-bold text-blue-600">
                      {stages.length}
                    </div>
                    <div className="text-xs text-blue-700 font-medium mt-1">
                      Production Stages
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                    <div className="text-3xl font-bold text-green-600">
                      {product.report?.sustainabilityScore?.toFixed(0) ?? "—"}
                    </div>
                    <div className="text-xs text-green-700 font-medium mt-1">
                      Sustainability Score
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                    <div className="text-sm font-bold text-purple-600">
                      {product.updatedAt
                        ? new Date(product.updatedAt).toLocaleDateString()
                        : "—"}
                    </div>
                    <div className="text-xs text-purple-700 font-medium mt-1">
                      Last Updated
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ENVIRONMENTAL METRICS - SIMPLIFIED */}
        {stages.length > 0 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Environmental Impact Analysis
              </h2>
              <p className="text-gray-600">
                Green bars = Industry standard • Blue bars = This product
              </p>
            </div>

            {/* METRICS CHARTS */}
            {metrics.map((m, idx) => (
              <div
                key={m.key}
                className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
              >
                <div
                  className={`px-6 py-4 flex items-center justify-between ${
                    idx === 0
                      ? "bg-gradient-to-r from-blue-50 to-cyan-50"
                      : idx === 1
                      ? "bg-gradient-to-r from-orange-50 to-red-50"
                      : "bg-gradient-to-r from-yellow-50 to-amber-50"
                  }`}
                >
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    {idx === 0 && <span className="text-2xl">💧</span>}
                    {idx === 1 && <span className="text-2xl">🌍</span>}
                    {idx === 2 && <span className="text-2xl">⚡</span>}
                    {m.label}
                  </h3>
                  <div className="text-sm text-gray-600 font-medium">
                    Lower is better
                  </div>
                </div>

                <div className="p-6">
                  <Bar
                    data={charts[m.key]}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: {
                        legend: {
                          position: "top",
                          labels: {
                            font: { size: 14, weight: "bold" },
                            padding: 15,
                          },
                        },
                        tooltip: {
                          backgroundColor: "rgba(0,0,0,0.8)",
                          padding: 12,
                          titleFont: { size: 14, weight: "bold" },
                          bodyFont: { size: 13 },
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: { color: "rgba(0,0,0,0.05)" },
                          ticks: { font: { size: 12, weight: "bold" } },
                        },
                        x: {
                          grid: { display: false },
                          ticks: {
                            font: { size: 13, weight: "bold" },
                            color: "#374151",
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            ))}

            {/* STAGE BREAKDOWN */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-800">
                  Detailed Stage Breakdown
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Compare actual usage vs industry standards
                </p>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                {stages.map((s, idx) => (
                  <div
                    key={s}
                    className="bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200 p-5 hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
                          idx === 0
                            ? "bg-green-100"
                            : idx === 1
                            ? "bg-purple-100"
                            : "bg-amber-100"
                        }`}
                      >
                        {idx === 0 && "🧶"}
                        {idx === 1 && "✨"}
                        {idx === 2 && "✂️"}
                      </div>
                      <h4 className="capitalize font-bold text-gray-800 text-lg">
                        {s.replace(/[-_]/g, " ")}
                      </h4>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                        <span className="text-sm font-medium text-gray-600">
                          💧 Water (L)
                        </span>
                        <div className="text-right">
                          <div
                            className={`text-lg font-bold ${
                              comparisons[s]?.within?.water
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {comparisons[s]?.actual?.water ?? "—"}
                          </div>
                          <div className="text-xs text-gray-500">
                            std: {comparisons[s]?.standard?.water ?? "—"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                        <span className="text-sm font-medium text-gray-600">
                          🌍 CO₂ (kg)
                        </span>
                        <div className="text-right">
                          <div
                            className={`text-lg font-bold ${
                              comparisons[s]?.within?.co2
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {comparisons[s]?.actual?.co2 ?? "—"}
                          </div>
                          <div className="text-xs text-gray-500">
                            std: {comparisons[s]?.standard?.co2 ?? "—"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">
                          ⚡ Energy (kWh)
                        </span>
                        <div className="text-right">
                          <div
                            className={`text-lg font-bold ${
                              comparisons[s]?.within?.energy
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {comparisons[s]?.actual?.energy ?? "—"}
                          </div>
                          <div className="text-xs text-gray-500">
                            std: {comparisons[s]?.standard?.energy ?? "—"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
