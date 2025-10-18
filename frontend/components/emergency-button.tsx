"use client";

import { useState, useEffect, useRef } from "react";
import { AlertCircle, MapPin, Phone, Navigation } from "lucide-react";

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

// Mock auth hook for demo - replace with your actual auth
const useAuth = () => ({ session: { access_token: "demo-token" } });

export default function EmergencyButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [locationError, setLocationError] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isTracking, setIsTracking] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<string>("prompt");
  const { session } = useAuth();

  const watchIdRef = useRef<number | null>(null);
  const bestLocationRef = useRef<LocationData | null>(null);
  const locationAttempts = useRef<number>(0);

  // Check if geolocation is available
  const isGeolocationAvailable = "geolocation" in navigator;
  const isSecureContext = window.isSecureContext;

  // Check permission status on mount
  useEffect(() => {
    if ("permissions" in navigator) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((result) => {
          setPermissionStatus(result.state);
          result.addEventListener("change", () => {
            setPermissionStatus(result.state);
          });
        })
        .catch(() => {
          // Permission API not supported (Safari)
          setPermissionStatus("unknown");
        });
    }
  }, []);

  // Start location tracking with mobile-optimized settings
  useEffect(() => {
    if (!isGeolocationAvailable) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    if (!isSecureContext) {
      setLocationError(
        "Location requires HTTPS. Please use a secure connection."
      );
      return;
    }

    let timeoutId: NodeJS.Timeout;

    const startTracking = () => {
      // Clear any existing watch
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }

      locationAttempts.current = 0;

      // First, try to get an immediate position (uses cached if available)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          };

          bestLocationRef.current = newLocation;
          setLocation(newLocation);
          setLocationError("");
          setIsTracking(true);
        },
        (error) => {
          console.warn("Initial location fetch failed:", error.message);
        },
        {
          enableHighAccuracy: false, // Start with low-accuracy for speed
          timeout: 5000,
          maximumAge: 60000, // Accept 1-minute old position
        }
      );

      // Then start continuous high-accuracy tracking
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          locationAttempts.current++;

          const newLocation: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          };

          // Keep the best (most accurate) location
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
          locationAttempts.current++;

          console.error("Location error:", error.code, error.message);

          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationError(
                "📍 Location access denied. Please enable location in your browser/device settings and reload the page."
              );
              break;
            case error.POSITION_UNAVAILABLE:
              if (locationAttempts.current < 3) {
                setLocationError("🔍 Searching for GPS signal... Please wait.");
              } else {
                setLocationError(
                  "📡 GPS signal weak. Move outdoors or near a window for better signal."
                );
              }
              break;
            case error.TIMEOUT:
              setLocationError("⏱️ GPS timeout. Retrying...");
              // Retry after timeout
              timeoutId = setTimeout(startTracking, 2000);
              break;
            default:
              setLocationError("⚠️ Unable to get location. Please try again.");
          }
        },
        {
          enableHighAccuracy: true, // High accuracy for mobile GPS
          timeout: 30000, // 30 seconds timeout for mobile
          maximumAge: 0, // Always get fresh position
        }
      );
    };

    startTracking();

    // Cleanup
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isGeolocationAvailable, isSecureContext]);

  const requestLocationPermission = () => {
    setLocationError("Requesting location permission...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };

        bestLocationRef.current = newLocation;
        setLocation(newLocation);
        setLocationError("");
        setIsTracking(true);
        setPermissionStatus("granted");
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError(
            "Location permission denied. Please enable location in your device settings:\n\n" +
              "iPhone: Settings > Safari > Location > Allow\n" +
              "Android: Settings > Apps > Browser > Permissions > Location"
          );
          setPermissionStatus("denied");
        } else {
          setLocationError("Failed to get location. Please try again.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

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

      // Use the best location we have
      let currentLocation = bestLocationRef.current || location;

      // If no location, try to get one NOW with aggressive settings
      if (!currentLocation) {
        setStatusMessage("📍 Getting your location...");

        try {
          const position = await new Promise<GeolocationPosition>(
            (resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000, // Shorter timeout for emergency
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
          bestLocationRef.current = currentLocation;
        } catch (error) {
          // Last resort: try with low accuracy (faster on mobile)
          try {
            const position = await new Promise<GeolocationPosition>(
              (resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                  enableHighAccuracy: false, // Use network location
                  timeout: 5000,
                  maximumAge: 30000, // Accept 30s old location
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
            bestLocationRef.current = currentLocation;

            setStatusMessage(
              `⚠️ Using approximate location (±${Math.round(
                position.coords.accuracy
              )}m). Sending alert...`
            );
          } catch {
            setStatusMessage(
              "❌ Cannot get location. Please:\n" +
                "1. Enable location services on your device\n" +
                "2. Allow location access in browser settings\n" +
                "3. Ensure you have GPS/network signal"
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

      // Call the emergency API
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
        const successfulSMS =
          emergencyData.sms?.filter((s: EmergencyResult) => s.success).length ||
          0;
        const successfulCalls =
          emergencyData.calls?.filter((c: EmergencyResult) => c.success)
            .length || 0;

        if (successfulSMS > 0 || successfulCalls > 0) {
          setStatusMessage(
            `✅ Emergency alert sent! ${successfulCalls} call(s) and ${successfulSMS} SMS sent.\n` +
              `Location accuracy: ±${Math.round(currentLocation.accuracy)}m`
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
        } else {
          setStatusMessage(
            `❌ ${
              data.error ||
              "Failed to send emergency alerts. Please call manually."
            }`
          );
        }
      }
    } catch {
      setStatusMessage(
        "❌ Network error. Please call emergency services directly."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getLocationAge = () => {
    if (!location) return null;
    const ageSeconds = Math.floor((Date.now() - location.timestamp) / 1000);
    if (ageSeconds < 3) return "just now";
    if (ageSeconds < 60) return `${ageSeconds}s ago`;
    return `${Math.floor(ageSeconds / 60)}m ago`;
  };

  const getAccuracyStatus = () => {
    if (!location) return null;
    if (location.accuracy <= 10)
      return {
        color: "green",
        label: "Excellent",
        bg: "bg-green-50 dark:bg-green-950/50",
        border: "border-green-200 dark:border-green-800",
        text: "text-green-700 dark:text-green-300",
        icon: "bg-green-500",
      };
    if (location.accuracy <= 30)
      return {
        color: "blue",
        label: "Good",
        bg: "bg-blue-50 dark:bg-blue-950/50",
        border: "border-blue-200 dark:border-blue-800",
        text: "text-blue-700 dark:text-blue-300",
        icon: "bg-blue-500",
      };
    if (location.accuracy <= 100)
      return {
        color: "amber",
        label: "Fair",
        bg: "bg-amber-50 dark:bg-amber-950/50",
        border: "border-amber-200 dark:border-amber-800",
        text: "text-amber-700 dark:text-amber-300",
        icon: "bg-amber-500",
      };
    return {
      color: "red",
      label: "Poor",
      bg: "bg-red-50 dark:bg-red-950/50",
      border: "border-red-200 dark:border-red-800",
      text: "text-red-700 dark:text-red-300",
      icon: "bg-red-500",
    };
  };

  const accuracyStatus = getAccuracyStatus();

  // Show permission request button if needed
  if (
    permissionStatus === "denied" ||
    !isGeolocationAvailable ||
    !isSecureContext
  ) {
    return (
      <div className="flex flex-col gap-4 p-6 bg-red-50 dark:bg-red-950/50 rounded-xl border border-red-200 dark:border-red-800">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertCircle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-red-800 dark:text-red-200 mb-2">
              Location Access Required
            </h3>
            <p className="text-sm text-red-700 dark:text-red-300 mb-3">
              {!isGeolocationAvailable &&
                "Your browser doesn't support location services."}
              {!isSecureContext && "Location requires HTTPS connection."}
              {permissionStatus === "denied" &&
                "Location permission was denied. To use emergency features:"}
            </p>
            {permissionStatus === "denied" && (
              <ol className="text-sm text-red-700 dark:text-red-300 space-y-1 mb-3">
                <li>• Open your device Settings</li>
                <li>• Find your browser app</li>
                <li>• Enable Location permissions</li>
                <li>• Reload this page</li>
              </ol>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (permissionStatus === "prompt") {
    return (
      <div className="flex flex-col gap-4 p-6 bg-blue-50 dark:bg-blue-950/50 rounded-xl border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <MapPin className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-blue-800 dark:text-blue-200 mb-2">
              Enable Location Access
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
              Emergency features require your location to send accurate alerts
              to your emergency contacts.
            </p>
            <button
              onClick={requestLocationPermission}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Enable Location
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleEmergencyClick}
        disabled={isLoading || !session}
        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-6 px-8 text-lg rounded-xl shadow-lg transition-all duration-200 hover:-translate-y-1 active:translate-y-0 disabled:translate-y-0 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center gap-3 justify-center">
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
      </button>

      {location && isTracking && accuracyStatus && (
        <div
          className={`flex items-center gap-2 mt-3 p-3 ${accuracyStatus.bg} rounded-lg border ${accuracyStatus.border}`}
        >
          <div
            className={`w-5 h-5 ${accuracyStatus.icon} rounded-full flex items-center justify-center relative`}
          >
            <Navigation className="h-3 w-3 text-white" />
            <span
              className={`absolute inset-0 rounded-full ${accuracyStatus.icon} animate-ping opacity-75`}
            ></span>
          </div>
          <div className="flex-1">
            <span className={`text-sm font-medium ${accuracyStatus.text}`}>
              Live GPS tracking - {accuracyStatus.label} signal
            </span>
            <div
              className={`flex items-center gap-2 text-xs ${accuracyStatus.text} mt-0.5`}
            >
              <span>Updated {getLocationAge()}</span>
              <span>•</span>
              <span>±{Math.round(location.accuracy)}m accuracy</span>
            </div>
          </div>
        </div>
      )}

      {location && location.accuracy > 30 && (
        <div className="flex items-start gap-2 mt-2 p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs">💡</span>
          </div>
          <div className="text-xs text-blue-700 dark:text-blue-300">
            <strong>Tip:</strong> For better accuracy, move outdoors or near a
            window and wait for GPS to stabilize.
          </div>
        </div>
      )}

      {!isTracking && !locationError && (
        <div className="flex items-center gap-2 mt-3 p-3 bg-amber-50 dark:bg-amber-950/50 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
            <MapPin className="h-3 w-3 text-white" />
          </div>
          <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
            Acquiring GPS signal... Please wait.
          </span>
        </div>
      )}

      {locationError && (
        <div className="flex items-start gap-2 mt-3 p-3 bg-red-50 dark:bg-red-950/50 rounded-lg border border-red-200 dark:border-red-800">
          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertCircle className="h-3 w-3 text-white" />
          </div>
          <span className="text-sm font-medium text-red-700 dark:text-red-300 whitespace-pre-line">
            {locationError}
          </span>
        </div>
      )}

      {statusMessage && (
        <div className="mt-4 p-4 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-pre-line">
            {statusMessage}
          </p>
        </div>
      )}
    </div>
  );
}
