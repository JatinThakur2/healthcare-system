import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import theme from "./theme";

// Components
import LoadingSpinner from "./components/common/LoadingSpinner";

// Pages
import LandingPage from "./pages/landing/LandingPage";
import Login from "./pages/auth/Login";
import RegisterMainHead from "./pages/auth/RegisterMainHead";
import MainHeadDashboard from "./pages/dashboard/MainHeadDashboard";
import DoctorDashboard from "./pages/dashboard/DoctorDashboard";
import DoctorManagement from "./pages/doctors/DoctorManagement";
import PatientsList from "./pages/patients/PatientsList";
import PatientForm from "./pages/patients/PatientForm";
import PatientView from "./pages/patients/PatientView";
import ReportsPage from "./pages/reports/ReportsPage";
import NotFound from "./pages/NotFound";

// Layout
import AppLayout from "./components/layout/AppLayout";

// Initialize Convex client
const convex = new ConvexReactClient(process.env.REACT_APP_CONVEX_URL);

// Protected route component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Authenticating..." />;
  }

  if (!user) {
    return <Navigate to="/landing" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

// Public route component that redirects authenticated users
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Authenticating..." />;
  }

  if (user) {
    // Redirect to appropriate dashboard based on user role
    if (user.role === "mainHead") {
      return <Navigate to="/" />;
    } else if (user.role === "doctor") {
      return <Navigate to="/doctor-dashboard" />;
    }
  }

  return children;
};

function App() {
  return (
    <ConvexProvider client={convex}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AuthProvider>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Public Routes */}
                <Route
                  path="/landing"
                  element={
                    <PublicRoute>
                      <LandingPage />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicRoute>
                      <RegisterMainHead />
                    </PublicRoute>
                  }
                />

                {/* Protected Routes - Rendered within AppLayout (with sidebar) */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  {/* Main Head Routes */}
                  <Route
                    index
                    element={
                      <ProtectedRoute requiredRole="mainHead">
                        <MainHeadDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="doctors"
                    element={
                      <ProtectedRoute requiredRole="mainHead">
                        <DoctorManagement />
                      </ProtectedRoute>
                    }
                  />
                  {/* Corrected: Reports Page is now a child route */}
                  <Route
                    path="reports"
                    element={
                      <ProtectedRoute requiredRole="mainHead">
                        <ReportsPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Doctor Routes */}
                  <Route
                    path="doctor-dashboard"
                    element={
                      <ProtectedRoute requiredRole="doctor">
                        <DoctorDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Common Routes */}
                  <Route
                    path="patients"
                    element={
                      <ProtectedRoute>
                        <PatientsList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="patients/new"
                    element={
                      <ProtectedRoute>
                        <PatientForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="patients/:id"
                    element={
                      <ProtectedRoute>
                        <PatientView />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="patients/:id/edit"
                    element={
                      <ProtectedRoute>
                        <PatientForm />
                      </ProtectedRoute>
                    }
                  />
                </Route>

                {/* Redirect root to landing by default */}
                <Route path="" element={<Navigate to="/landing" replace />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </ConvexProvider>
  );
}

export default App;
