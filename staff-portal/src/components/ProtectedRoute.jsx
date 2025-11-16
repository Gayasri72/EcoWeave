import React from "react";
import { Navigate } from "react-router-dom";

// Props: children, requiredRole (optional)
export default function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token) return <Navigate to="/login" replace />;
  if (requiredRole && role !== requiredRole)
    return <Navigate to="/login" replace />;
  return children;
}
