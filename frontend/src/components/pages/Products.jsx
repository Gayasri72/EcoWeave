import React, { useEffect, useState } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const API_BASE =
          import.meta.env.VITE_API_BASE || "http://localhost:5000";
        const res = await fetch(`${API_BASE}/api/admin-products`);
        if (!res.ok) throw new Error(`Server error ${res.status}`);
        const data = await res.json();
        setProducts(data || []);
      } catch (err) {
        setError(err.message);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Products</h2>
      {error && <div className="text-red-600 mb-3">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p._id} className="border rounded p-3 bg-white">
            <div className="font-medium text-lg">{p.name || p.productId}</div>
            <div className="text-sm text-gray-600">ID: {p.productId}</div>
            <div className="text-sm text-gray-600">Category: {p.category}</div>
            {p.imageUrl && (
              <img
                src={p.imageUrl}
                alt={p.name}
                className="mt-2 w-full h-40 object-cover rounded"
              />
            )}
            {/* QR removed from public listing — show admin-submitted product info only */}
            <div className="mt-3">
              <a
                href={`/products/${encodeURIComponent(p.productId)}`}
                className="text-indigo-600 hover:underline"
              >
                View product
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
