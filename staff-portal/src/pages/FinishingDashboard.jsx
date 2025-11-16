import React, { useState, useEffect } from "react";
import axios from "../api/axiosConfig";
import StaffHeader from "../components/StaffHeader";

export default function FinishingDashboard() {
  const [productId, setProductId] = useState("");
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState(null);
  const [water, setWater] = useState("");
  const [co2, setCo2] = useState("");
  const [energy, setEnergy] = useState("");
  const [msg, setMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      const res = await axios.put(
        `/api/products/${productId}/stage/finishing`,
        { water: Number(water), co2: Number(co2), energy: Number(energy) }
      );
      setMsg({ ok: true, text: "Stage updated", data: res.data });
    } catch (err) {
      setMsg({ ok: false, text: err.response?.data?.message || err.message });
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
    <div className="min-h-screen bg-gray-50">
      <StaffHeader />
      <div className="container mx-auto p-6">
        <div className="max-w-3xl mx-auto bg-white rounded shadow">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-semibold">Finishing Dashboard</h2>
            <p className="text-sm text-gray-600 mt-1">
              Select a knitting-created product and submit finishing-stage
              metrics.
            </p>
          </div>

          <div className="p-6">
            <form onSubmit={submit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product
                </label>
                <div className="mt-1">
                  {loadingProducts ? (
                    <div className="text-sm text-gray-500">
                      Loading products...
                    </div>
                  ) : productsError ? (
                    <div className="text-sm text-red-600">{productsError}</div>
                  ) : products.length === 0 ? (
                    <div className="text-sm text-gray-500">
                      No products available. Create product from Knitting
                      dashboard first.
                    </div>
                  ) : (
                    <select
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      value={productId}
                      onChange={(e) => setProductId(e.target.value)}
                      required
                    >
                      <option value="">Select product</option>
                      {products.map((p) => (
                        <option key={p.productId} value={p.productId}>
                          {p.category} — {p.productId}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Water
                  </label>
                  <input
                    className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    placeholder="liters"
                    value={water}
                    onChange={(e) => setWater(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    CO₂
                  </label>
                  <input
                    className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    placeholder="kg"
                    value={co2}
                    onChange={(e) => setCo2(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Energy
                  </label>
                  <input
                    className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    placeholder="kWh"
                    value={energy}
                    onChange={(e) => setEnergy(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded shadow"
                  type="submit"
                >
                  Submit metrics
                </button>
              </div>
            </form>

            {msg && (
              <div
                className={`mt-4 ${msg.ok ? "text-green-600" : "text-red-600"}`}
              >
                {msg.text}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
