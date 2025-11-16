import React, { useState } from "react";
import axios from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="min-h-screen bg-gray-50 flex items-center">
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Left welcome panel */}
          <div className="md:w-1/2 bg-gradient-to-br from-green-600 to-teal-500 text-white p-10 flex flex-col justify-center">
            <div>
              <h1 className="text-3xl font-extrabold">
                Welcome to Eco Journey
              </h1>
              <p className="mt-2 text-sm opacity-90">
                Staff Portal — submit stage metrics, view reports, and support
                our sustainability efforts.
              </p>
            </div>
            <ul className="mt-6 text-sm opacity-95 space-y-2">
              <li>• Secure staff sign-in</li>
              <li>• Submit knitting / finishing / sewing metrics</li>
              <li>• Real-time sustainability reports for admins</li>
            </ul>
            <div className="mt-8 text-xs opacity-90">
              Need help? Contact{" "}
              <span className="underline">gayasripethum1@gmail.com</span>
            </div>
          </div>

          {/* Right login panel */}
          <div className="md:w-1/2 p-8">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold">Staff Portal Login</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Sign in with your staff credentials
                </p>
              </div>

              <form onSubmit={submit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    aria-label="username"
                    required
                    className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    aria-label="password"
                    required
                    type="password"
                    className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-teal-600"
                    />
                    <span className="text-gray-600">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setToast(
                        "Please contact gayasripethum1@gmail.com to reset your password."
                      );
                      setTimeout(() => setToast(null), 5000);
                    }}
                    className="text-teal-600 hover:underline"
                  >
                    Forgot?
                  </button>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded font-medium shadow"
                  >
                    Sign In
                  </button>
                </div>
              </form>

              {toast && (
                <div className="fixed top-6 right-6 bg-black text-white px-4 py-2 rounded shadow z-50">
                  {toast}
                </div>
              )}

              {error && (
                <div className="mt-4 text-red-600 text-center">{error}</div>
              )}

              <div className="mt-6 text-xs text-center text-gray-500">
                By signing in you agree to the staff portal policies.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
