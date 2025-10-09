"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, MapPin, Phone } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

interface LocationData {
  latitude: number;
  longitude: number;
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
  const { session } = useAuth();

  // Request location permission on component mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationError("");
        },
        (error) => {
          console.error("Location error:", error);
          setLocationError(
            "Location access denied. Please enable location services."
          );
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
    }
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

      // Get current location
      let currentLocation = location;

      // If we don't have location yet, try to get it now
      if (!currentLocation) {
        try {
          const position = await new Promise<GeolocationPosition>(
            (resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                timeout: 10000,
                enableHighAccuracy: true,
              });
            }
          );

          currentLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation(currentLocation);
        } catch (_error) {
          setStatusMessage(
            "⚠️ Could not get your location. Emergency call sent without location."
          );
          // Continue anyway - the API will handle missing location
        }
      }

      // Call the emergency API with authentication
      const response = await fetch("/api/emergency/call-and-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          latitude: currentLocation?.latitude || 0,
          longitude: currentLocation?.longitude || 0,
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

      {/* Clean location status indicator */}
      {location && (
        <div className="flex items-center gap-2 mt-3 p-3 bg-green-50 dark:bg-green-950/50 rounded-lg border border-green-200 dark:border-green-800">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <MapPin className="h-3 w-3 text-white" />
          </div>
          <span className="text-sm font-medium text-green-700 dark:text-green-300">
            Location enabled
          </span>
        </div>
      )}

      {locationError && (
        <div className="flex items-center gap-2 mt-3 p-3 bg-amber-50 dark:bg-amber-950/50 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
            <AlertCircle className="h-3 w-3 text-white" />
          </div>
          <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
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
