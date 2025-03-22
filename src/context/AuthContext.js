import React, { createContext, useState, useContext, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState({});

  // Get the current user from the database
  // Get token from localStorage to pass to the query
  const storedToken = localStorage.getItem("authToken");

  // Pass the token to getCurrentUser query
  const currentUser = useQuery(
    api.auth.getCurrentUser,
    storedToken ? { token: storedToken } : undefined
  );

  const logoutMutation = useMutation(api.auth.logout);

  // Debug effect to log state changes
  useEffect(() => {
    console.log("AuthContext state:", {
      currentUser,
      hasToken: !!storedToken,
      loading,
      userSet: !!user,
    });

    setDebugInfo({
      currentUser: currentUser ? "defined" : "undefined",
      hasToken: !!storedToken,
      loading,
      userSet: !!user,
      timestamp: new Date().toISOString(),
    });
  }, [currentUser, storedToken, loading, user]);

  // Handle auth state updates
  useEffect(() => {
    console.log("Current user update:", currentUser);

    // Only update state after currentUser query has resolved (even if null)
    if (currentUser !== undefined) {
      setUser(currentUser);
      setLoading(false);
    }
  }, [currentUser]);

  // Function to store authentication data
  const storeAuthToken = (token, expiresAt) => {
    if (!token) return;

    // Use provided expiry time or calculate default (7 days)
    const expiryTime = expiresAt || Date.now() + 7 * 24 * 60 * 60 * 1000;

    localStorage.setItem("authToken", token);
    localStorage.setItem("tokenExpiry", expiryTime.toString());

    console.log(
      "Auth token stored with expiry:",
      new Date(expiryTime).toLocaleString()
    );
  };

  // Function to logout
  const logout = async () => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem("authToken");

      setLoading(true);

      // Call logout mutation with token if available
      if (token) {
        await logoutMutation({ token });
      } else {
        await logoutMutation();
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local storage and user state
      localStorage.removeItem("authToken");
      localStorage.removeItem("tokenExpiry");
      setUser(null);
      setLoading(false);
    }
  };

  // For debugging - force a reset of the loading state after a timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        console.log("Forcing loading state to false after timeout");
        setLoading(false);
      }
    }, 5000); // 5 second timeout as a fallback

    return () => clearTimeout(timer);
  }, [loading]);

  const value = {
    user,
    setUser,
    loading,
    logout,
    storeAuthToken,
    debugInfo,
    isAuthenticated: !!user,
    isMainHead: user?.role === "mainHead",
    isDoctor: user?.role === "doctor",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Export as both default and named export to support both import styles
export { AuthProvider };
export default AuthProvider;
