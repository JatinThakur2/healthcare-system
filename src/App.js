import React from "react";
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

// Pages
import Login from "./pages/auth/Login";
import RegisterMainHead from "./pages/auth/RegisterMainHead";
import MainHeadDashboard from "./pages/dashboard/MainHeadDashboard";
import DoctorDashboard from "./pages/dashboard/DoctorDashboard";
import DoctorManagement from "./pages/doctors/DoctorManagement";
import PatientsList from "./pages/patients/PatientsList";
import PatientForm from "./pages/patients/PatientForm";
import PatientView from "./pages/patients/PatientView";
import NotFound from "./pages/NotFound";

// Layout
import AppLayout from "./components/layout/AppLayout";

// Initialize Convex client
const convex = new ConvexReactClient(process.env.REACT_APP_CONVEX_URL);

// Protected route component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <ConvexProvider client={convex}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<RegisterMainHead />} />

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
                  path="/"
                  element={
                    <ProtectedRoute requiredRole="mainHead">
                      <MainHeadDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/doctors"
                  element={
                    <ProtectedRoute requiredRole="mainHead">
                      <DoctorManagement />
                    </ProtectedRoute>
                  }
                />

                {/* Doctor Routes */}
                <Route
                  path="/doctor-dashboard"
                  element={
                    <ProtectedRoute requiredRole="doctor">
                      <DoctorDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Common Routes */}
                <Route
                  path="/patients"
                  element={
                    <ProtectedRoute>
                      <PatientsList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/patients/new"
                  element={
                    <ProtectedRoute>
                      <PatientForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/patients/:id"
                  element={
                    <ProtectedRoute>
                      <PatientView />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/patients/:id/edit"
                  element={
                    <ProtectedRoute>
                      <PatientForm />
                    </ProtectedRoute>
                  }
                />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ConvexProvider>
  );
}

export default App;
