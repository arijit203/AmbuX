"use client";

import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const DriverLocationContext = createContext({
  driverLocation: null,
  setDriverLocation: () => {},
});

export const DriverLocationProvider = ({ children }) => {
  const [driverLocation, setDriverLocation] = useState(null);

  // Update driver location in database every 10 minutes
  useEffect(() => {
    let interval;

    const updateDriverLocation = async () => {
      if (driverLocation) {
        try {
          await axios.post("/api/driver/updateLocation", {
            location: driverLocation,
          });
        } catch (error) {
          console.error("Failed to update driver location:", error);
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Start the interval when the driver enters the dashboard
        interval = setInterval(updateDriverLocation, 10 * 60 * 1000); // 10 minutes
      } else {
        // Clear the interval when the driver leaves the dashboard
        clearInterval(interval);
      }
    };

    // Listen for visibility change
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Clean up on component unmount
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [driverLocation]);

  return (
    <DriverLocationContext.Provider
      value={{ driverLocation, setDriverLocation }}
    >
      {children}
    </DriverLocationContext.Provider>
  );
};
