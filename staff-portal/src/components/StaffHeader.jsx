import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";

export default function StaffHeader() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
    } catch (err) {
      // ignore
    }
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    } catch (e) {}
    navigate("/login");
  };

  return (
    <div className="bg-white border-b p-3 flex justify-end">
      <button
        onClick={handleLogout}
        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
      >
        Sign Out
      </button>
    </div>
  );
}
