"use client";

import { X, AlertCircle, MapPin, Phone, Navigation } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface EmergencyPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

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

// Import your actual auth hook - UPDATE THIS PATH
import { useAuth } from "@/components/auth-provider";

function EmergencyButton() {
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

  const isGeolocationAvailable = "geolocation" in navigator;
  const isSecureContext =
    typeof window !== "undefined" ? window.isSecureContext : false;

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
          setPermissionStatus("unknown");
        });
    }
  }, []);

  useEffect(() => {
    if (!isGeolocationAvailable || !isSecureContext) {
      if (!isGeolocationAvailable) {
        setLocationError("Geolocation is not supported by your browser.");
      } else if (!isSecureContext) {
        setLocationError(
          "Location requires HTTPS. Please use a secure connection."
        );
      }
      return;
    }

    let timeoutId: NodeJS.Timeout;

    const startTracking = () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }

      locationAttempts.current = 0;

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
        () => {},
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 60000,
        }
      );

      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          locationAttempts.current++;

          const newLocation: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          };

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

          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationError(
                "📍 Location access denied. Enable location in browser settings and reload."
              );
              break;
            case error.POSITION_UNAVAILABLE:
              if (locationAttempts.current < 3) {
                setLocationError("🔍 Searching for GPS signal...");
              } else {
                setLocationError(
                  "📡 GPS signal weak. Move outdoors for better signal."
                );
              }
              break;
            case error.TIMEOUT:
              setLocationError("⏱️ GPS timeout. Retrying...");
              timeoutId = setTimeout(startTracking, 2000);
              break;
            default:
              setLocationError("⚠️ Unable to get location.");
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 0,
        }
      );
    };

    startTracking();

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
            "Location denied. Enable in device settings:\niPhone: Settings > Safari > Location\nAndroid: Settings > Apps > Browser > Permissions"
          );
          setPermissionStatus("denied");
        } else {
          setLocationError("Failed to get location.");
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
      // Check if session exists and has access_token
      if (!session?.access_token) {
        setStatusMessage("❌ Please log in to use emergency feature.");
        setIsLoading(false);
        return;
      }

      console.log("Session exists:", !!session);
      console.log("Has access token:", !!session.access_token);

      let currentLocation = bestLocationRef.current || location;

      if (!currentLocation) {
        setStatusMessage("📍 Getting your location...");

        try {
          const position = await new Promise<GeolocationPosition>(
            (resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000,
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
        } catch {
          try {
            const position = await new Promise<GeolocationPosition>(
              (resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                  enableHighAccuracy: false,
                  timeout: 5000,
                  maximumAge: 30000,
                });
              }
            );

            currentLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: position.timestamp,
            };

            setStatusMessage(
              `⚠️ Using approximate location (±${Math.round(
                position.coords.accuracy
              )}m)`
            );
          } catch {
            setStatusMessage(
              "❌ Cannot get location. Enable GPS and try again."
            );
            setIsLoading(false);
            return;
          }
        }
      }

      if (!currentLocation) {
        setStatusMessage("❌ No location available.");
        setIsLoading(false);
        return;
      }

      // Call the emergency API
      console.log("Calling API with token...");
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
          userMessage: "Emergency assistance needed!",
        }),
      });

      console.log("API Response status:", response.status);
      const data = await response.json();
      console.log("API Response data:", data);

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
            `✅ Emergency alert sent! ${successfulCalls} call(s) and ${successfulSMS} SMS sent.\nAccuracy: ±${Math.round(
              currentLocation.accuracy
            )}m`
          );
        } else {
          setStatusMessage(
            "⚠️ Emergency request processed but alerts may have failed."
          );
        }
      } else {
        if (response.status === 429) {
          setStatusMessage("⚠️ Too many requests. Wait a few minutes.");
        } else if (response.status === 401) {
          setStatusMessage("❌ Authentication error. Log in again.");
        } else if (
          response.status === 400 &&
          data.error?.includes("emergency contacts")
        ) {
          setStatusMessage("❌ No emergency contacts configured.");
        } else {
          setStatusMessage(`❌ ${data.error || "Failed to send alerts."}`);
        }
      }
    } catch {
      setStatusMessage("❌ Network error. Call emergency services directly.");
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
        label: "Excellent",
        bg: "bg-green-50 dark:bg-green-950/50",
        border: "border-green-200",
        text: "text-green-700 dark:text-green-300",
        icon: "bg-green-500",
      };
    if (location.accuracy <= 30)
      return {
        label: "Good",
        bg: "bg-blue-50 dark:bg-blue-950/50",
        border: "border-blue-200",
        text: "text-blue-700 dark:text-blue-300",
        icon: "bg-blue-500",
      };
    if (location.accuracy <= 100)
      return {
        label: "Fair",
        bg: "bg-amber-50 dark:bg-amber-950/50",
        border: "border-amber-200",
        text: "text-amber-700 dark:text-amber-300",
        icon: "bg-amber-500",
      };
    return {
      label: "Poor",
      bg: "bg-red-50 dark:bg-red-950/50",
      border: "border-red-200",
      text: "text-red-700 dark:text-red-300",
      icon: "bg-red-500",
    };
  };

  const accuracyStatus = getAccuracyStatus();

  if (
    permissionStatus === "denied" ||
    !isGeolocationAvailable ||
    !isSecureContext
  ) {
    return (
      <div className="flex flex-col gap-3 p-4 bg-red-50 dark:bg-red-950/50 rounded-lg border border-red-200">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-red-800 dark:text-red-200 text-sm mb-1">
              Location Access Required
            </h4>
            <p className="text-xs text-red-700 dark:text-red-300">
              Enable location in device settings and reload page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (permissionStatus === "prompt") {
    return (
      <div className="flex flex-col gap-3">
        <button
          onClick={requestLocationPermission}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <MapPin className="h-5 w-5" />
          Enable Location Access
        </button>
        <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
          Required for emergency features
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleEmergencyClick}
        disabled={isLoading || !session}
        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-6 px-6 text-lg rounded-xl shadow-lg transition-all duration-200 hover:-translate-y-1 active:translate-y-0 disabled:translate-y-0"
      >
        {isLoading ? (
          <div className="flex items-center gap-3 justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
            <span>Sending Alert...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <AlertCircle className="h-6 w-6" />
            <Phone className="h-6 w-6" />
            <span>EMERGENCY CALL & SMS</span>
          </div>
        )}
      </button>

      {location && isTracking && accuracyStatus && (
        <div
          className={`flex items-center gap-2 p-3 ${accuracyStatus.bg} rounded-lg border ${accuracyStatus.border}`}
        >
          <div
            className={`w-5 h-5 ${accuracyStatus.icon} rounded-full flex items-center justify-center relative`}
          >
            <Navigation className="h-3 w-3 text-white" />
            <span
              className={`absolute inset-0 rounded-full ${accuracyStatus.icon} animate-ping opacity-75`}
            ></span>
          </div>
          <div className="flex-1 min-w-0">
            <span
              className={`text-xs font-medium ${accuracyStatus.text} block`}
            >
              GPS: {accuracyStatus.label} • {getLocationAge()}
            </span>
            <span className={`text-xs ${accuracyStatus.text}`}>
              ±{Math.round(location.accuracy)}m accuracy
            </span>
          </div>
        </div>
      )}

      {locationError && (
        <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/50 rounded-lg border border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
          <span className="text-xs text-red-700 dark:text-red-300 whitespace-pre-line">
            {locationError}
          </span>
        </div>
      )}

      {statusMessage && (
        <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-900 dark:text-gray-100 whitespace-pre-line">
            {statusMessage}
          </p>
        </div>
      )}
    </div>
  );
}

// NAMED EXPORT for EmergencyPopup
export function EmergencyPopup({ isOpen, onClose }: EmergencyPopupProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 max-w-lg w-full rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-950 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🚨</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Emergency Alert
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Immediate emergency response
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              This will immediately call emergency contacts and send them your
              current location via SMS.
            </p>

            {/* Emergency Button */}
            <EmergencyButton />

            {/* Info Cards */}
            <div className="space-y-3">
              {/* Important notice */}
              <div className="bg-amber-50 dark:bg-amber-950/50 border-l-4 border-amber-400 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-800 dark:text-amber-200 text-sm mb-1">
                      Important
                    </h4>
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      For real emergencies only. Misuse may cause unnecessary
                      panic.
                    </p>
                  </div>
                </div>
              </div>

              {/* Process info */}
              <div className="bg-blue-50 dark:bg-blue-950/50 border-l-4 border-blue-400 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">?</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 text-sm mb-2">
                      What happens:
                    </h4>
                    <ol className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                      <li>1. Your location will be captured automatically</li>
                      <li>
                        2. Emergency contacts will be called simultaneously
                      </li>
                      <li>3. SMS with location link will be sent</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
