import {
  ConvexProvider as OriginalConvexProvider,
  ConvexReactClient,
} from "convex/react";
import React from "react";

// Get URL from environment or use a fallback
const getConvexUrl = () => {
  // Try both CRA and Vite style environment variables
  const url =
    process.env.REACT_APP_CONVEX_URL ||
    (typeof import.meta !== "undefined" && import.meta.env
      ? import.meta.env.VITE_CONVEX_URL
      : undefined);

  if (!url) {
    console.warn(
      "No Convex URL found in environment variables. Using development fallback."
    );
    return "https://your-development-url.convex.cloud"; // Replace with your dev URL
  }

  return url;
};

// Create a client with error handling
const createClient = () => {
  try {
    return new ConvexReactClient(getConvexUrl());
  } catch (error) {
    console.error("Failed to create Convex client:", error);
    // Return a dummy client or null depending on your error handling strategy
    return null;
  }
};

// Create a singleton client
const convexClient = createClient();

export const ConvexProvider = ({ children }) => {
  if (!convexClient) {
    // Handle the case where client creation failed
    return (
      <div className="error-container">
        <h2>Connection Error</h2>
        <p>
          Could not connect to the backend service. Please check your
          configuration.
        </p>
      </div>
    );
  }

  return (
    <OriginalConvexProvider client={convexClient}>
      {children}
    </OriginalConvexProvider>
  );
};

export default ConvexProvider;
