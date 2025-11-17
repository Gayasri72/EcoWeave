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

  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!product) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">

      {/* TOP HERO SECTION */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-xl shadow-lg p-6 text-white">
        <h1 className="text-2xl font-bold">Sustainability Impact Report</h1>
        <p className="opacity-90 text-sm">
          Transparent environmental performance for this product.
        </p>
      </div>

      {/* PRODUCT SUMMARY */}
      <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
        <div className="md:flex md:items-start md:gap-6">
          
          {/* IMAGE */}
          <div className="md:w-48 w-full">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg shadow-sm"
              />
            ) : (
              <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
          </div>

          {/* INFO */}
          <div className="flex-1 mt-4 md:mt-0">
            <h2 className="text-2xl font-semibold text-gray-800">
              {product.name || product.productId}
            </h2>

            <div className="text-sm text-gray-500">
              ID: {product.productId} • {product.category}
            </div>

            <p className="mt-3 text-gray-700">{product.description}</p>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                label="Overall Standard Compliance"
                value={product.report?.overallWithinStandard ? "Within Standard" : "Exceeded Standard"}
                hint={product.report?.score ? `Score: ${product.report.score}` : null}
              />

              <StatCard label="Total Stages" value={stages.length} />

              <StatCard
                label="Last Updated"
                value={
                  product.updatedAt
                    ? new Date(product.updatedAt).toLocaleDateString()
                    : "—"
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS SECTION */}
      {stages.length > 0 && (
        <>
          <h2 className="text-xl font-semibold text-gray-800">
            Environmental Metrics Comparison
          </h2>

          <div className="grid grid-cols-1 gap-6">
            {metrics.map((m) => (
              <div
                key={m.key}
                className="bg-white rounded-xl shadow p-5 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">{m.label}</h3>
                  <span className="text-sm text-gray-500">
                    Standard vs Actual
                  </span>
                </div>

                <Bar
                  data={charts[m.key]}
                  options={{
                    responsive: true,
                    plugins: { legend: { position: "top" } },
                    scales: { y: { beginAtZero: true } },
                  }}
                />
              </div>
            ))}
          </div>

          {/* STAGE DETAILS */}
          <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Stage-by-Stage Breakdown
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stages.map((s) => (
                <div
                  key={s}
                  className="rounded-lg border border-gray-200 p-4 bg-gray-50"
                >
                  <h4 className="capitalize font-medium text-gray-800 mb-2">
                    {s.replace(/[-_]/g, " ")}
                  </h4>

                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Water:</strong>{" "}
                      {comparisons[s]?.actual?.water ?? "—"}{" "}
                      <span className="text-gray-500">
                        / {comparisons[s]?.standard?.water ?? "—"}
                      </span>
                    </p>

                    <p>
                      <strong>CO₂:</strong>{" "}
                      {comparisons[s]?.actual?.co2 ?? "—"}{" "}
                      <span className="text-gray-500">
                        / {comparisons[s]?.standard?.co2 ?? "—"}
                      </span>
                    </p>

                    <p>
                      <strong>Energy:</strong>{" "}
                      {comparisons[s]?.actual?.energy ?? "—"}{" "}
                      <span className="text-gray-500">
                        / {comparisons[s]?.standard?.energy ?? "—"}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
