import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";
import {
  ArrowLeftOnRectangleIcon,
  EyeIcon,
  XMarkIcon,
  ChartBarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowDownTrayIcon,
  ArrowTopRightOnSquareIcon,
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

  const sustainableCount = products.filter((p) => p.isSustainable).length;
  const avgScore =
    products.length > 0
      ? products.reduce((sum, p) => sum + (p.sustainabilityScore || 0), 0) /
        products.length
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <ChartBarIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Admin Reports Dashboard
                </h1>
                <p className="text-indigo-100 text-sm mt-1">
                  Monitor product sustainability metrics and performance
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-xl hover:bg-opacity-30 transition-all duration-200 border border-white border-opacity-30"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5" />
              <span className="font-semibold">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800">
              {products.length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Total Products</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800">
              {sustainableCount}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Sustainable Products
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <XCircleIcon className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800">
              {products.length - sustainableCount}
            </div>
            <div className="text-sm text-gray-600 mt-1">Needs Improvement</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800">
              {avgScore.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600 mt-1">Average Score</div>
          </div>
        </div>

        {/* TABLE CARD */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-5 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <svg
                className="w-6 h-6 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Product Performance Overview
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Detailed sustainability metrics for all products
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Product ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                            />
                          </svg>
                        </div>
                        <p className="text-gray-500 font-medium">
                          No products found
                        </p>
                        <p className="text-sm text-gray-400">
                          Products will appear here once they are created
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr
                      key={p._id}
                      className="hover:bg-indigo-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-gray-800">
                          {p.productId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 capitalize">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="text-2xl font-bold text-indigo-600">
                            {p.sustainabilityScore?.toFixed(1) ?? "N/A"}
                          </div>
                          <div className="text-xs text-gray-500">/ 100</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {p.isSustainable ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                            <CheckCircleIcon className="w-4 h-4" />
                            Sustainable
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                            <XCircleIcon className="w-4 h-4" />
                            Not Sustainable
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={async () => {
                            setSelectedProductId(p.productId);
                            setIsModalOpen(true);
                            if (!comparisons[p.productId]) {
                              await analyzeProduct(p.productId);
                            }
                          }}
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                        >
                          <EyeIcon className="w-4 h-4" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ENHANCED MODAL */}
      {isModalOpen && selectedProductId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full overflow-hidden max-h-[90vh] flex flex-col">
            {/* MODAL HEADER */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <ChartBarIcon className="w-6 h-6 text-white" />
                  </div>
                  Product Details
                </h3>
                <p className="text-indigo-100 text-sm mt-1">
                  ID: {selectedProductId}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg flex items-center justify-center transition-all duration-200"
              >
                <XMarkIcon className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* MODAL CONTENT */}
            <div className="overflow-y-auto flex-1 p-6 space-y-6">
              {/* SUSTAINABILITY ANALYSIS */}
              <div>
                <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-indigo-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  Sustainability Analysis
                </h4>

                {comparisons[selectedProductId]?.loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <svg
                        className="animate-spin h-10 w-10 text-indigo-600"
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
                        Loading sustainability comparison...
                      </p>
                    </div>
                  </div>
                ) : comparisons[selectedProductId]?.data ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {Object.entries(
                      comparisons[selectedProductId].data.comparisons
                    ).map(([stage, info]) => (
                      <div
                        key={stage}
                        className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-200"
                      >
                        <h5 className="font-bold text-gray-800 capitalize text-lg mb-4 flex items-center gap-2">
                          {stage === "knitting" && "🧶"}
                          {stage === "finishing" && "✨"}
                          {stage === "sewing" && "✂️"}
                          {stage}
                        </h5>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">
                              💧 Water
                            </span>
                            <span
                              className={`text-sm font-bold ${
                                info.within.water
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {info.actual.water}L / {info.standard.water}L
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">
                              🌍 CO₂
                            </span>
                            <span
                              className={`text-sm font-bold ${
                                info.within.co2
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {info.actual.co2}kg / {info.standard.co2}kg
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">
                              ⚡ Energy
                            </span>
                            <span
                              className={`text-sm font-bold ${
                                info.within.energy
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {info.actual.energy}kWh / {info.standard.energy}
                              kWh
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : comparisons[selectedProductId]?.error ? (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                    <XCircleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-800 font-semibold">
                        Error loading comparison
                      </p>
                      <p className="text-red-600 text-sm mt-1">
                        {comparisons[selectedProductId].error}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* QR CODE SECTION */}
              <div className="pt-6 border-t border-gray-200">
                <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                      />
                    </svg>
                  </div>
                  QR Code & Public Link
                </h4>

                {(() => {
                  const ap = adminProducts.find(
                    (a) => a.productId === selectedProductId
                  );

                  if (!ap) {
                    return (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div>
                          <p className="text-amber-800 font-semibold">
                            QR Code Not Available
                          </p>
                          <p className="text-amber-700 text-sm mt-1">
                            No QR code has been generated for this product yet.
                          </p>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                      <div className="flex flex-col md:flex-row gap-6 items-start">
                        {/* QR Code Image */}
                        <div className="flex-shrink-0">
                          {ap.qrCodeDataUrl ? (
                            <div className="bg-white p-3 rounded-xl shadow-lg border-2 border-purple-200">
                              <img
                                src={ap.qrCodeDataUrl}
                                alt="QR Code"
                                className="w-40 h-40 rounded-lg"
                              />
                            </div>
                          ) : (
                            <div className="w-40 h-40 bg-gray-200 rounded-xl flex items-center justify-center">
                              <span className="text-gray-500 text-sm font-medium">
                                No QR
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex-1 space-y-3">
                          <p className="text-gray-700 text-sm">
                            Share this QR code with customers to let them view
                            the product's sustainability details on the public
                            website.
                          </p>

                          <div className="flex flex-wrap gap-3">
                            {ap.qrCodeDataUrl && (
                              <a
                                href={ap.qrCodeDataUrl}
                                download={`qr-${ap.productId}.png`}
                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                              >
                                <ArrowDownTrayIcon className="w-4 h-4" />
                                Download QR Code
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
                              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                            >
                              <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                              Open Product Page
                            </button>
                          </div>
                        </div>
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
