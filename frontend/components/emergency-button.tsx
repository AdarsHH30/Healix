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
  const bestLocationRef = useRef<LocationData | null>(null);

  // Start continuous high-accuracy location tracking
  useEffect(() => {
    if ("geolocation" in navigator) {

      // Request high-accuracy continuous tracking with optimal settings
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          };


          // Keep track of the best (most accurate) location
          if (
            !bestLocationRef.current ||
            newLocation.accuracy < bestLocationRef.current.accuracy
          ) {
            bestLocationRef.current = newLocation;
          }

          setLocation(newLocation);
          setLocationError("");
          setIsTracking(true);
        },
        (error) => {
          setIsTracking(false);

          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationError(
                "Location access denied. Please enable location permissions in your browser settings."
              );
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError(
                "GPS signal unavailable. Please ensure you're outdoors or near a window."
              );
              break;
            case error.TIMEOUT:
              setLocationError("GPS timeout. Retrying...");
              break;
            default:
              setLocationError("Unable to retrieve accurate location.");
          }
        },
        {
          enableHighAccuracy: true, // Use GPS, not Wi-Fi/cell tower approximation
          timeout: 27000, // 27 seconds timeout (longer for GPS lock)
          maximumAge: 0, // Never use cached position
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


      // Use the best (most accurate) location we've collected
      let currentLocation = bestLocationRef.current || location;

      // If we don't have a recent accurate location, get a fresh high-accuracy reading
      if (!currentLocation || Date.now() - currentLocation.timestamp > 3000) {

        try {
          const position = await new Promise<GeolocationPosition>(
            (resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true, // Force GPS usage
                timeout: 15000, // Wait up to 15 seconds for accurate fix
                maximumAge: 0, // Must be fresh reading
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

          // Update best location if this is more accurate
          if (
            !bestLocationRef.current ||
            currentLocation.accuracy < bestLocationRef.current.accuracy
          ) {
            bestLocationRef.current = currentLocation;
          }
        } catch (error) {

          // If fresh reading fails but we have a previous good location, use it
          if (currentLocation) {
            setStatusMessage(
              `⚠️ Using last known location (${Math.round(
                (Date.now() - currentLocation.timestamp) / 1000
              )}s old). Sending emergency alert...`
            );
          } else {
            setStatusMessage(
              "❌ Cannot get accurate location. Please enable GPS and try again."
            );
            setIsLoading(false);
            return;
          }
        }
      }

      if (!currentLocation) {
        setStatusMessage(
          "❌ No location available. Please enable location services and try again."
        );
        setIsLoading(false);
        return;
      }

      // Log the exact coordinates being sent

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
          accuracy: currentLocation.accuracy,
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
            `✅ Emergency alerts sent! ${successfulCalls} call(s) and ${successfulSMS} SMS sent with location accuracy: ±${Math.round(
              currentLocation.accuracy
            )}m`
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
    if (ageSeconds < 3) return "just now";
    if (ageSeconds < 60) return `${ageSeconds}s ago`;
    return `${Math.floor(ageSeconds / 60)}m ago`;
  };

  // Determine GPS quality based on accuracy
  const getAccuracyStatus = () => {
    if (!location) return null;
    if (location.accuracy <= 10) return { color: "green", label: "Excellent" };
    if (location.accuracy <= 30) return { color: "blue", label: "Good" };
    if (location.accuracy <= 100) return { color: "amber", label: "Fair" };
    return { color: "red", label: "Poor" };
  };

  const accuracyStatus = getAccuracyStatus();

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

      {/* Real-time location status indicator with accuracy info */}
      {location && isTracking && accuracyStatus && (
        <div
          className={`flex items-center gap-2 mt-3 p-3 bg-${accuracyStatus.color}-50 dark:bg-${accuracyStatus.color}-950/50 rounded-lg border border-${accuracyStatus.color}-200 dark:border-${accuracyStatus.color}-800`}
        >
          <div
            className={`w-5 h-5 bg-${accuracyStatus.color}-500 rounded-full flex items-center justify-center relative`}
          >
            <Navigation className="h-3 w-3 text-white" />
            {/* Pulse animation for live tracking */}
            <span
              className={`absolute inset-0 rounded-full bg-${accuracyStatus.color}-500 animate-ping opacity-75`}
            ></span>
          </div>
          <div className="flex-1">
            <span
              className={`text-sm font-medium text-${accuracyStatus.color}-700 dark:text-${accuracyStatus.color}-300`}
            >
              Live GPS tracking - {accuracyStatus.label} signal
            </span>
            <div
              className={`flex items-center gap-2 text-xs text-${accuracyStatus.color}-600 dark:text-${accuracyStatus.color}-400 mt-0.5`}
            >
              <span>Updated {getLocationAge()}</span>
              <span>•</span>
              <span>±{Math.round(location.accuracy)}m accuracy</span>
            </div>
          </div>
        </div>
      )}

      {/* GPS tip for better accuracy */}
      {location && location.accuracy > 30 && (
        <div className="flex items-start gap-2 mt-2 p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs">💡</span>
          </div>
          <div className="text-xs text-blue-700 dark:text-blue-300">
            <strong>Tip:</strong> For better accuracy, move outdoors or near a
            window and wait a few seconds for GPS to stabilize.
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
            Acquiring GPS signal...
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
