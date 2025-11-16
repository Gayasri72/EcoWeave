import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";
import {
  ArrowLeftOnRectangleIcon,
  EyeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function Reports() {
  const [products, setProducts] = useState([]);
  const [adminProducts, setAdminProducts] = useState([]);
  const [error, setError] = useState(null);
  const [comparisons, setComparisons] = useState({});
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
    } catch {}
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get("/api/products");
        setProducts(res.data || []);
      } catch (err) {
        setError(err.message);
      }
    };

    const loadAdmin = async () => {
      try {
        const res = await axios.get("/api/admin-products");
        setAdminProducts(res.data || []);
      } catch (err) {
        console.warn("Admin products error:", err);
      }
    };

    load();
    loadAdmin();
  }, []);

  const analyzeProduct = async (productId) => {
    setComparisons((c) => ({ ...c, [productId]: { loading: true } }));

    try {
      const res = await axios.get(`/api/products/${productId}/compare`);
      setComparisons((c) => ({
        ...c,
        [productId]: { loading: false, data: res.data },
      }));
    } catch (err) {
      setComparisons((c) => ({
        ...c,
        [productId]: { loading: false, error: err.message },
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* TOP BAR */}
      <div className="flex justify-between items-center max-w-6xl mx-auto mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Reports</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow"
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5" />
          Logout
        </button>
      </div>

      {/* TABLE CARD */}
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-5">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Product Performance Overview
        </h2>

        <table className="min-w-full border-collapse">
          <thead className="bg-gray-200 rounded-t-lg">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Product ID
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Category
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Score
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr
                key={p._id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3 text-sm">{p.productId}</td>
                <td className="px-4 py-3 text-sm">{p.category}</td>
                <td className="px-4 py-3 text-sm font-semibold text-indigo-700">
                  {p.sustainabilityScore?.toFixed(1) ?? "N/A"}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      p.isSustainable
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {p.isSustainable ? "Sustainable" : "Not Sustainable"}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <button
                    onClick={async () => {
                      setSelectedProductId(p.productId);
                      setIsModalOpen(true);
                      if (!comparisons[p.productId]) {
                        await analyzeProduct(p.productId);
                      }
                    }}
                    className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 text-sm shadow"
                  >
                    <EyeIcon className="w-4 h-4" /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && selectedProductId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full overflow-auto max-h-[90vh]">
            {/* HEADER */}
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">
                Product {selectedProductId} — Details
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-5 space-y-6">
              {/* ANALYSIS */}
              <div>
                <h4 className="text-lg font-bold text-gray-800">Sustainability Analysis</h4>

                {comparisons[selectedProductId]?.data ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                    {Object.entries(
                      comparisons[selectedProductId].data.comparisons
                    ).map(([stage, info]) => (
                      <div
                        key={stage}
                        className="p-4 bg-gray-50 rounded-lg border shadow-sm"
                      >
                        <h5 className="font-semibold capitalize">{stage}</h5>
                        <p className="text-sm mt-2">
                          <strong>Water:</strong> {info.actual.water} / {info.standard.water}
                        </p>
                        <p className="text-sm">
                          <strong>CO₂:</strong> {info.actual.co2} / {info.standard.co2}
                        </p>
                        <p className="text-sm">
                          <strong>Energy:</strong> {info.actual.energy} / {info.standard.energy}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    Loading sustainability comparison...
                  </div>
                )}
              </div>

              {/* QR CODE */}
              <div className="pt-4 border-t">
                <h4 className="text-lg font-bold text-gray-800">QR Code</h4>

                {(() => {
                  const ap = adminProducts.find(
                    (a) => a.productId === selectedProductId
                  );

                  if (!ap) {
                    return (
                      <p className="text-gray-500 mt-2">
                        No QR code available for this product.
                      </p>
                    );
                  }

                  return (
                    <div className="flex gap-6 mt-3 items-start">
                      {ap.qrCodeDataUrl ? (
                        <img
                          src={ap.qrCodeDataUrl}
                          alt="QR"
                          className="w-36 h-36 border rounded-lg shadow-sm"
                        />
                      ) : (
                        <div className="w-36 h-36 bg-gray-200 rounded-lg flex items-center justify-center text-sm text-gray-500">
                          No QR
                        </div>
                      )}

                      <div className="flex flex-col gap-2">
                        {ap.qrCodeDataUrl && (
                          <a
                            href={ap.qrCodeDataUrl}
                            download={`qr-${ap.productId}.png`}
                            className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 shadow"
                          >
                            Download QR
                          </a>
                        )}

                        <button
                          onClick={() => {
                            const FRONTEND_BASE =
                              import.meta.env.VITE_FRONTEND_URL ||
                              "http://192.168.227.1:5173";

                            window.open(
                              `${FRONTEND_BASE}/products/${ap.productId}`,
                              "_blank"
                            );
                          }}
                          className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 shadow"
                        >
                          Open Product Page
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
