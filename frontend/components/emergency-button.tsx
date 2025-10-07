"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, MapPin, Phone } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

interface LocationData {
  latitude: number;
  longitude: number;
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
        } catch (error) {
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
        // Count successful operations
        const successfulSMS =
          data.sms?.filter((s: any) => s.success).length || 0;
        const successfulCalls =
          data.calls?.filter((c: any) => c.success).length || 0;

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
        disabled={isLoading}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-6 px-8 rounded-lg shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
        size="lg"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Sending Emergency Alert...</span>
          </>
        ) : (
          <>
            <AlertCircle className="h-6 w-6" />
            <Phone className="h-6 w-6" />
            <span>EMERGENCY - CALL & SMS</span>
          </>
        )}
      </Button>

      {/* Location status indicator */}
      {location && (
        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
          <MapPin className="h-4 w-4" />
          <span>Location enabled</span>
        </div>
      )}

      {locationError && (
        <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
          <AlertCircle className="h-4 w-4" />
          <span>{locationError}</span>
        </div>
      )}

      {/* Status message */}
      {statusMessage && (
        <div className="mt-2 p-3 rounded-md bg-gray-100 dark:bg-gray-800 text-sm">
          {statusMessage}
        </div>
      )}

      {/* Important disclaimer */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        This will call and SMS your emergency contacts with your location. Use
        only in real emergencies.
      </p>
    </div>
  );
}
