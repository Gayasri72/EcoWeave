import React, { useState } from "react";
import axios from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post("/api/auth/login", { username, password });
      const data = res.data;
      if (res.status === 200 && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user?.role || "");
        // redirect based on role
        const role = data.user?.role;
        if (role === "knitting") navigate("/dashboard/knitting");
        else if (role === "finishing") navigate("/dashboard/finishing");
        else if (role === "sewing") navigate("/dashboard/sewing");
        else if (role === "admin") navigate("/reports");
        else navigate("/");
      } else {
        setError(data?.message || "Login failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-green-50 flex items-center justify-center p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row bg-white shadow-2xl rounded-2xl overflow-hidden">
          {/* Left welcome panel */}
          <div className="md:w-1/2 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white p-12 flex flex-col justify-center relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full translate-y-48 -translate-x-48"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm mb-6">
                <svg
                  className="w-10 h-10"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.87-.78-7-4.18-7-8V8.3l7-3.11v14.82z" />
                </svg>
              </div>

              <h1 className="text-4xl font-bold mb-3 leading-tight">
                Welcome to
                <br />
                EcoJourney Staff Portal
              </h1>
              <p className="text-lg opacity-95 mb-8">
                Empowering sustainability through transparent tracking and
                reporting.
              </p>
            </div>

            <div className="relative z-10 text-sm opacity-90 pt-4 border-t border-white border-opacity-20">
              Need assistance? Contact us at{" "}
              <a
                href="mailto:gayasripethum1@gmail.com"
                className="font-semibold underline hover:text-teal-100 transition"
              >
                gayasripethum1@gmail.com
              </a>
            </div>
          </div>

          {/* Right login panel */}
          <div className="md:w-1/2 p-10 flex items-center justify-center">
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl mb-4 shadow-lg">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800">
                  Staff Login
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                  Enter your credentials to access the portal
                </p>
              </div>

              <form onSubmit={submit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    aria-label="username"
                    required
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition shadow-sm"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      aria-label="password"
                      required
                      type={showPassword ? "text" : "password"}
                      className="block w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition shadow-sm"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="inline-flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-teal-600 rounded border-gray-300 focus:ring-2 focus:ring-teal-500 transition"
                    />
                    <span className="text-gray-600 group-hover:text-gray-800 transition">
                      Remember me
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setToast(
                        "Please contact gayasripethum1@gmail.com to reset your password."
                      );
                      setTimeout(() => setToast(null), 5000);
                    }}
                    className="text-teal-600 hover:text-teal-700 font-medium transition"
                  >
                    Forgot password?
                  </button>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                    <svg
                      className="w-5 h-5 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3.5 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <span>Sign In</span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </button>
                </div>
              </form>

              {toast && (
                <div className="fixed top-6 right-6 bg-gray-900 text-white px-5 py-3 rounded-lg shadow-2xl z-50 animate-fade-in-down flex items-start gap-3 max-w-sm">
                  <svg
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm">{toast}</span>
                </div>
              )}

              <div className="mt-8 text-center">
                <p className="text-xs text-gray-500">
                  Protected by EcoWeave security. By signing in, you agree to
                  our{" "}
                  <button className="text-teal-600 hover:underline">
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button className="text-teal-600 hover:underline">
                    Privacy Policy
                  </button>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
