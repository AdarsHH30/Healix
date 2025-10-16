"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, MapPin, Phone, Navigation } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

interface EmergencyResult {
  success: boolean;
  to: string;
  sid?: string;
  error?: string;
}

interface EmergencyResponse {
  message: string;
  sms?: EmergencyResult[];
  calls?: EmergencyResult[];
}

export function EmergencyButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [locationError, setLocationError] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isTracking, setIsTracking] = useState(false);
  const { session } = useAuth();

  const watchIdRef = useRef<number | null>(null);

  // Start continuous location tracking
  useEffect(() => {
    if ("geolocation" in navigator) {
      // Request high-accuracy continuous tracking
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          });
          setLocationError("");
          setIsTracking(true);
        },
        (error) => {
          console.error("Location error:", error);
          setIsTracking(false);

          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationError(
                "Location access denied. Please enable location services."
              );
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError(
                "Location information unavailable. Please check your device settings."
              );
              break;
            case error.TIMEOUT:
              setLocationError("Location request timed out. Please try again.");
              break;
            default:
              setLocationError("Unable to retrieve location.");
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0, // Don't use cached position
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
    }

    // Cleanup: stop watching when component unmounts
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const handleEmergencyClick = async () => {
    setIsLoading(true);
    setStatusMessage("");

    try {
      // Check authentication
      if (!session) {
        setStatusMessage("❌ Please log in to use emergency feature.");
        setIsLoading(false);
        return;
      }

      // Get the most recent location or fetch a new one
      let currentLocation = location;

      // If we don't have a recent location (within last 5 seconds), get a fresh one
      if (!currentLocation || Date.now() - currentLocation.timestamp > 5000) {
        try {
          const position = await new Promise<GeolocationPosition>(
            (resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                timeout: 10000,
                enableHighAccuracy: true,
                maximumAge: 0,
              });
            }
          );

          currentLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          };
          setLocation(currentLocation);
        } catch (error) {
          console.error("Failed to get fresh location:", error);
          setStatusMessage(
            "⚠️ Could not get your current location. Emergency call sent with last known position."
          );
          // Continue with last known location if available
        }
      }

      if (!currentLocation) {
        setStatusMessage(
          "❌ No location available. Please enable location services and try again."
        );
        setIsLoading(false);
        return;
      }

      // Call the emergency API with authentication
      const response = await fetch("/api/emergency/call-and-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          userMessage:
            "Emergency assistance needed! User has pressed the emergency button.",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const emergencyData = data as EmergencyResponse;
        // Count successful operations
        const successfulSMS =
          emergencyData.sms?.filter((s: EmergencyResult) => s.success).length ||
          0;
        const successfulCalls =
          emergencyData.calls?.filter((c: EmergencyResult) => c.success)
            .length || 0;

        if (successfulSMS > 0 || successfulCalls > 0) {
          setStatusMessage(
            `✅ Emergency alerts sent! ${successfulCalls} call(s) and ${successfulSMS} SMS sent successfully.`
          );
        } else {
          setStatusMessage(
            "⚠️ Emergency request processed but alerts may have failed. Check your emergency contacts."
          );
        }
      } else {
        if (response.status === 429) {
          setStatusMessage(
            "⚠️ Too many emergency requests. Please wait a few minutes."
          );
        } else if (response.status === 401) {
          setStatusMessage("❌ Authentication error. Please log in again.");
        } else if (
          response.status === 400 &&
          data.error?.includes("emergency contacts")
        ) {
          setStatusMessage(
            "❌ No emergency contacts configured. Please add emergency contacts in your profile."
          );
        } else if (
          response.status === 400 &&
          data.error?.includes("E.164 format")
        ) {
          setStatusMessage(
            "❌ Emergency contacts must be in international format (e.g., +1234567890). Please update in your profile."
          );
        } else {
          setStatusMessage(
            `❌ ${
              data.error ||
              "Failed to send emergency alerts. Please call manually."
            }`
          );
        }
      }
    } catch (error) {
      console.error("Emergency request failed:", error);
      setStatusMessage(
        "❌ Network error. Please call emergency services directly."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Format timestamp for display
  const getLocationAge = () => {
    if (!location) return null;
    const ageSeconds = Math.floor((Date.now() - location.timestamp) / 1000);
    if (ageSeconds < 5) return "just now";
    if (ageSeconds < 60) return `${ageSeconds}s ago`;
    return `${Math.floor(ageSeconds / 60)}m ago`;
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleEmergencyClick}
        disabled={isLoading || !session}
        className="w-full bg-destructive hover:bg-destructive/90 disabled:bg-muted text-white font-bold py-6 px-8 text-lg rounded-xl clean-shadow-lg transition-all duration-200 hover:-translate-y-1 active:translate-y-0 disabled:translate-y-0"
      >
        {isLoading ? (
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-3 border-white/30 border-t-white"></div>
            <span>Sending Emergency Alert...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3">
            <AlertCircle className="h-6 w-6" />
            <Phone className="h-6 w-6" />
            <span>EMERGENCY - CALL & SMS</span>
          </div>
        )}
      </Button>

      {/* Real-time location status indicator */}
      {location && isTracking && (
        <div className="flex items-center gap-2 mt-3 p-3 bg-green-50 dark:bg-green-950/50 rounded-lg border border-green-200 dark:border-green-800">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center relative">
            <Navigation className="h-3 w-3 text-white" />
            {/* Pulse animation for live tracking */}
            <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></span>
          </div>
          <div className="flex-1">
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              Live location tracking
            </span>
            <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 mt-0.5">
              <span>Updated {getLocationAge()}</span>
              <span>•</span>
              <span>±{Math.round(location.accuracy)}m accuracy</span>
            </div>
          </div>
        </div>
      )}

      {/* Location warning if not tracking */}
      {!isTracking && !locationError && (
        <div className="flex items-center gap-2 mt-3 p-3 bg-amber-50 dark:bg-amber-950/50 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
            <MapPin className="h-3 w-3 text-white" />
          </div>
          <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
            Acquiring location...
          </span>
        </div>
      )}

      {locationError && (
        <div className="flex items-center gap-2 mt-3 p-3 bg-red-50 dark:bg-red-950/50 rounded-lg border border-red-200 dark:border-red-800">
          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <AlertCircle className="h-3 w-3 text-white" />
          </div>
          <span className="text-sm font-medium text-red-700 dark:text-red-300">
            {locationError}
          </span>
        </div>
      )}

      {/* Clean status message */}
      {statusMessage && (
        <div className="mt-4 p-4 rounded-lg bg-muted border border-border">
          <p className="text-sm font-medium text-foreground">{statusMessage}</p>
        </div>
      )}
    </div>
  );
}
