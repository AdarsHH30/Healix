"use client";

import { X, MapPin, Navigation } from "lucide-react";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Import Leaflet dynamically to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

interface MapPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Hospital {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  distance?: number;
  type?: string;
}

export function MapPopup({ isOpen, onClose }: MapPopupProps) {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userIcon, setUserIcon] = useState<any>(null);
  const [hospitalIcon, setHospitalIcon] = useState<any>(null);
  const [L, setL] = useState<any>(null);

  // Initialize Leaflet and custom icons
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("leaflet").then((leaflet) => {
        setL(leaflet.default);

        // User location icon
        const userMarker = leaflet.default.icon({
          iconUrl:
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='%234285F4' stroke='white' stroke-width='2'%3E%3Ccircle cx='12' cy='12' r='8'/%3E%3C/svg%3E",
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });
        setUserIcon(userMarker);

        // Hospital icon
        const hospitalMarker = leaflet.default.icon({
          iconUrl:
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='48' viewBox='0 0 24 36'%3E%3Cpath d='M12 0C7.58 0 4 3.58 4 8c0 5.25 8 16 8 16s8-10.75 8-16c0-4.42-3.58-8-8-8z' fill='%23DC2626'/%3E%3Cpath d='M12 4a4 4 0 0 1 4 4c0 2.5-4 8-4 8s-4-5.5-4-8a4 4 0 0 1 4-4z' fill='white'/%3E%3Crect x='11' y='6' width='2' height='6' fill='%23DC2626'/%3E%3Crect x='9' y='8' width='6' height='2' fill='%23DC2626'/%3E%3C/svg%3E",
          iconSize: [32, 48],
          iconAnchor: [16, 48],
          popupAnchor: [0, -48],
        });
        setHospitalIcon(hospitalMarker);
      });
    }
  }, []);

  // Get user location
  useEffect(() => {
    if (isOpen && !userLocation) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setUserLocation(location);
            searchNearbyHospitals(location);
            setLoading(false);
          },
          (err) => {
            setError(
              "Unable to get your location. Please enable location services."
            );
            setLoading(false);
          }
        );
      } else {
        setError("Geolocation is not supported by your browser");
        setLoading(false);
      }
    }
  }, [isOpen, userLocation]);

  // Search for nearby hospitals using Overpass API (OpenStreetMap)
  const searchNearbyHospitals = async (location: {
    lat: number;
    lng: number;
  }) => {
    try {
      const radius = 15000; // 15km in meters - FIXED!
      const query = `
        [out:json][timeout:30];
        (
          nwr["amenity"="hospital"](around:${radius},${location.lat},${location.lng});
          nwr["amenity"="clinic"](around:${radius},${location.lat},${location.lng});
          nwr["amenity"="doctors"](around:${radius},${location.lat},${location.lng});
          nwr["amenity"="dentist"](around:${radius},${location.lat},${location.lng});
          nwr["healthcare"="hospital"](around:${radius},${location.lat},${location.lng});
          nwr["healthcare"="clinic"](around:${radius},${location.lat},${location.lng});
          nwr["healthcare"="doctor"](around:${radius},${location.lat},${location.lng});
          nwr["healthcare"="centre"](around:${radius},${location.lat},${location.lng});
          nwr["building"="hospital"](around:${radius},${location.lat},${location.lng});
        );
        out center tags;
      `;

      console.log(
        "🔍 Searching for medical facilities (hospitals & clinics) near:",
        location
      );
      console.log("📍 Search radius: 15km (15,000 meters)");

      const response = await fetch(
        `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
          query
        )}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch hospitals: ${response.status}`);
      }

      const data = await response.json();
      console.log("📊 Overpass API response:", data);
      console.log("📝 Total elements received:", data.elements?.length || 0);

      if (!data.elements || data.elements.length === 0) {
        console.warn("⚠️ No elements found in response");
        setError(
          `No medical facilities found within 15km. Try a different location or check if you're in a remote area.`
        );
        return;
      }

      const hospitalData: Hospital[] = data.elements
        .map((element: any, index: number) => {
          // Get coordinates - handle different element types
          let lat = 0;
          let lng = 0;

          if (element.lat && element.lon) {
            // For nodes
            lat = element.lat;
            lng = element.lon;
          } else if (element.center) {
            // For ways and relations with center
            lat = element.center.lat;
            lng = element.center.lon;
          }

          // Skip if no valid coordinates
          if (lat === 0 || lng === 0) {
            return null;
          }

          const tags = element.tags || {};

          // Determine facility type with priority
          let type = "medical";
          if (
            tags.amenity === "hospital" ||
            tags.healthcare === "hospital" ||
            tags.building === "hospital"
          ) {
            type = "hospital";
          } else if (
            tags.amenity === "clinic" ||
            tags.healthcare === "clinic"
          ) {
            type = "clinic";
          } else if (
            tags.amenity === "doctors" ||
            tags.healthcare === "doctor"
          ) {
            type = "doctors";
          } else if (tags.amenity === "dentist") {
            type = "dentist";
          } else if (tags.healthcare === "centre") {
            type = "medical center";
          }

          // Get name - be more flexible but filter out unnamed
          const name =
            tags.name ||
            tags["name:en"] ||
            tags.official_name ||
            tags.alt_name ||
            tags.operator ||
            null;

          // Skip facilities without proper names
          if (
            !name ||
            name.toLowerCase().includes("unnamed") ||
            name.toLowerCase().includes("untitled")
          ) {
            return null;
          }

          // Build comprehensive address
          let address = "";
          const addressParts = [];

          if (tags["addr:housenumber"] && tags["addr:street"]) {
            addressParts.push(
              `${tags["addr:housenumber"]} ${tags["addr:street"]}`
            );
          } else if (tags["addr:street"]) {
            addressParts.push(tags["addr:street"]);
          }

          if (tags["addr:city"]) {
            addressParts.push(tags["addr:city"]);
          }

          if (tags["addr:state"]) {
            addressParts.push(tags["addr:state"]);
          }

          if (tags["addr:postcode"]) {
            addressParts.push(tags["addr:postcode"]);
          }

          address =
            addressParts.length > 0
              ? addressParts.join(", ")
              : "Address not available";

          const distance = calculateDistance(
            location.lat,
            location.lng,
            lat,
            lng
          );

          const hospital: Hospital = {
            id: element.id?.toString() || `facility-${index}`,
            name,
            lat,
            lng,
            address,
            type,
            distance,
          };

          return hospital;
        })
        .filter(
          (h: Hospital | null): h is Hospital =>
            h !== null && h.distance !== undefined
        )
        .sort(
          (a: Hospital, b: Hospital) => (a.distance || 0) - (b.distance || 0)
        )
        .slice(0, 25); // Increased to show top 25

      // Count facility types for debugging
      const typeCounts: Record<string, number> = {};
      hospitalData.forEach((h) => {
        const type = h.type || "unknown";
        typeCounts[type] = (typeCounts[type] || 0) + 1;
      });

      console.log(`✅ Found ${hospitalData.length} medical facilities`);
      console.log("📋 Breakdown by type:", typeCounts);
      console.log(
        "🏥 Top 10 nearest facilities:",
        hospitalData
          .slice(0, 10)
          .map((h) => `${h.name} (${h.type}) - ${h.distance?.toFixed(2)}km`)
      );

      setHospitals(hospitalData);

      if (hospitalData.length === 0) {
        // Try alternative search using Nominatim
        console.log("⚠️ Trying alternative Nominatim search...");
        await searchWithNominatim(location);
      }
    } catch (err) {
      console.error("Error fetching hospitals:", err);
      setError(
        "Could not search for hospitals. Please check your internet connection and try again."
      );
    }
  };

  // Alternative search using Nominatim API
  const searchWithNominatim = async (location: {
    lat: number;
    lng: number;
  }) => {
    try {
      console.log("🔄 Starting Nominatim fallback search...");
      const searchTerms = [
        "hospital",
        "clinic",
        "medical center",
        "health center",
        "urgent care",
        "emergency room",
      ];
      const allResults: Hospital[] = [];

      for (const term of searchTerms) {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?` +
            `q=${encodeURIComponent(term)}` +
            `&format=json` +
            `&limit=15` +
            `&bounded=1` +
            `&viewbox=${location.lng - 0.2},${location.lat - 0.2},${
              location.lng + 0.2
            },${location.lat + 0.2}` +
            `&addressdetails=1`,
          {
            headers: {
              "User-Agent": "FirstAidApp/1.0",
            },
          }
        );

        if (response.ok) {
          const results = await response.json();
          console.log(`📍 Nominatim "${term}" found:`, results.length);

          results.forEach((result: any) => {
            const lat = parseFloat(result.lat);
            const lng = parseFloat(result.lon);
            const distance = calculateDistance(
              location.lat,
              location.lng,
              lat,
              lng
            );

            // Only include results within 15km
            if (distance <= 15) {
              // Determine type from search term
              let type = "medical";
              if (term.includes("hospital") || result.type === "hospital") {
                type = "hospital";
              } else if (term.includes("clinic")) {
                type = "clinic";
              } else if (term.includes("urgent")) {
                type = "urgent care";
              }

              allResults.push({
                id: `nominatim-${result.place_id}`,
                name: result.display_name.split(",")[0] || result.name || term,
                lat,
                lng,
                address: result.display_name,
                type,
                distance,
              });
            }
          });
        }

        // Small delay to respect rate limits
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      // Remove duplicates based on proximity (within 100m considered duplicate)
      const uniqueResults: Hospital[] = [];
      allResults.forEach((facility) => {
        const isDuplicate = uniqueResults.some((existing) => {
          const dist = calculateDistance(
            existing.lat,
            existing.lng,
            facility.lat,
            facility.lng
          );
          return (
            dist < 0.1 ||
            existing.name.toLowerCase() === facility.name.toLowerCase()
          );
        });

        if (!isDuplicate) {
          uniqueResults.push(facility);
        }
      });

      const sortedResults = uniqueResults
        .sort((a, b) => (a.distance || 0) - (b.distance || 0))
        .slice(0, 25);

      console.log(
        `✅ Nominatim found ${sortedResults.length} unique facilities`
      );

      if (sortedResults.length > 0) {
        setHospitals(sortedResults);
      } else {
        setError(
          "No medical facilities found within 15km. The area might have limited OpenStreetMap data."
        );
      }
    } catch (err) {
      console.error("❌ Nominatim search error:", err);
      setError(
        "No medical facilities found within 15km. The area might have limited OpenStreetMap data."
      );
    }
  };

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getDirections = (hospital: Hospital) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${hospital.lat},${hospital.lng}`;
      window.open(url, "_blank");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-6xl h-[90vh] bg-background rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-background/95 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-chart-1 to-chart-2 flex items-center justify-center">
              <MapPin className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Nearby Medical Facilities
              </h2>
              <p className="text-sm text-muted-foreground">
                Searching within 15km • Powered by OpenStreetMap
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-muted/50 hover:bg-muted transition-colors flex items-center justify-center"
            aria-label="Close map"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Map */}
          <div className="flex-1 relative">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/95 z-10">
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 border-4 border-chart-1 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-muted-foreground">
                    Getting your location...
                  </p>
                </div>
              </div>
            )}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/95 z-10">
                <div className="text-center space-y-4 p-6">
                  <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                    <MapPin className="text-destructive" size={32} />
                  </div>
                  <p className="text-destructive font-medium">{error}</p>
                </div>
              </div>
            )}
            {userLocation && userIcon && hospitalIcon && (
              <MapContainer
                center={[userLocation.lat, userLocation.lng]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                className="z-0"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* User location marker */}
                <Marker
                  position={[userLocation.lat, userLocation.lng]}
                  icon={userIcon}
                >
                  <Popup>
                    <div className="text-sm font-medium">Your Location</div>
                  </Popup>
                </Marker>

                {/* Hospital markers */}
                {hospitals.map((hospital) => (
                  <Marker
                    key={hospital.id}
                    position={[hospital.lat, hospital.lng]}
                    icon={hospitalIcon}
                  >
                    <Popup>
                      <div className="p-2">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-sm">{hospital.name}</h3>
                          {hospital.type && (
                            <span
                              className={`text-xs px-1.5 py-0.5 rounded ${
                                hospital.type === "clinic" ||
                                hospital.type === "doctors"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {hospital.type}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-1">
                          {hospital.address}
                        </p>
                        {hospital.distance && (
                          <p className="text-xs text-blue-600 font-medium">
                            {hospital.distance.toFixed(1)} km away
                          </p>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
          </div>

          {/* Hospital List */}
          <div className="w-80 border-l border-border/40 bg-muted/30 overflow-y-auto">
            <div className="p-4 space-y-3">
              {hospitals.length === 0 && !loading && !error && (
                <p className="text-center text-muted-foreground py-8">
                  No hospitals found nearby
                </p>
              )}
              {hospitals.map((hospital) => (
                <div
                  key={hospital.id}
                  className="bg-background rounded-lg p-4 shadow-sm border border-border/40 hover:border-chart-1/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground truncate group-hover:text-chart-1 transition-colors">
                          {hospital.name}
                        </h3>
                        {hospital.type && (
                          <span
                            className={`text-xs px-2 py-0.5 rounded font-medium whitespace-nowrap ${
                              hospital.type === "clinic" ||
                              hospital.type === "doctors"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                : hospital.type === "hospital"
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                            }`}
                          >
                            {hospital.type}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {hospital.address}
                      </p>
                      {hospital.distance && (
                        <p className="text-xs text-chart-1 font-medium mt-2">
                          {hospital.distance.toFixed(1)} km away
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => getDirections(hospital)}
                      className="flex-shrink-0 w-9 h-9 rounded-full bg-chart-1/10 hover:bg-chart-1 hover:text-white transition-all flex items-center justify-center group/btn"
                      aria-label="Get directions"
                    >
                      <Navigation size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
