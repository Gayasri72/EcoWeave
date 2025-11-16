import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
        setError(err.message);
      }
    };
    load();
  }, [productId]);

  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!product) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded">
      <h2 className="text-2xl font-semibold">
        {product.name || product.productId}
      </h2>
      <div className="text-sm text-gray-600">ID: {product.productId}</div>
      <div className="mt-3">Category: {product.category}</div>
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="mt-3 w-full max-h-72 object-cover rounded"
        />
      )}
      {/* QR code removed from public product detail — page shows admin-submitted product data */}
      <div className="mt-4">{product.description}</div>
      {product.report && (
        <div className="mt-6 bg-gray-50 p-4 rounded">
          <div className="text-sm">
            Overall within standard:{" "}
            <strong
              className={
                product.report.overallWithinStandard
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {product.report.overallWithinStandard ? "Yes" : "No"}
            </strong>
          </div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
            {Object.entries(product.report.comparisons || {}).map(
              ([stage, info]) => (
                <div key={stage} className="p-2 border rounded bg-white">
                  <div className="font-semibold capitalize">{stage}</div>
                  <div className="text-sm mt-1">
                    <div>
                      Water: {info.actual.water} / {info.standard.water}
                    </div>
                    <div>
                      CO₂: {info.actual.co2} / {info.standard.co2}
                    </div>
                    <div>
                      Energy: {info.actual.energy} / {info.standard.energy}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
