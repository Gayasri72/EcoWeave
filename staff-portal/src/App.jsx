import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import KnittingDashboard from "./pages/KnittingDashboard";
import FinishingDashboard from "./pages/FinishingDashboard";
import SewingDashboard from "./pages/SewingDashboard";
import Reports from "./pages/Reports";
import ProtectedRoute from "./components/ProtectedRoute";
import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/dashboard/knitting"
          element={
            <ProtectedRoute>
              <KnittingDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/finishing"
          element={
            <ProtectedRoute>
              <FinishingDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/sewing"
          element={
            <ProtectedRoute>
              <SewingDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute requiredRole="admin">
              <Reports />
            </ProtectedRoute>
          }
        />

        {/* Add-product removed: products are created automatically from staff submissions */}

        {/* fallback */}
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
