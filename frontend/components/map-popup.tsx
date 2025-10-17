"use client";

import { X, MapPin, Navigation } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
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
  const [userIcon, setUserIcon] = useState<L.Icon | null>(null);
  const [hospitalIcon, setHospitalIcon] = useState<L.Icon | null>(null);

  // Initialize Leaflet and custom icons
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("leaflet").then((leaflet) => {
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

  // Search for nearby hospitals using Overpass API (OpenStreetMap)
  const searchNearbyHospitals = useCallback(
    async (location: { lat: number; lng: number }) => {
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


        const response = await fetch(
          `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
            query
          )}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch hospitals: ${response.status}`);
        }

        const data = await response.json();

        if (!data.elements || data.elements.length === 0) {
          setError(
            `No medical facilities found within 15km. Try a different location or check if you're in a remote area.`
          );
          return;
        }

        const hospitalData: Hospital[] = data.elements
          .map(
            (
              element: {
                id?: number;
                lat?: number;
                lon?: number;
                center?: { lat: number; lon: number };
                tags?: Record<string, string>;
              },
              index: number
            ) => {
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
            }
          )
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


        setHospitals(hospitalData);

        if (hospitalData.length === 0) {
          setError(
            "No medical facilities found nearby. The area might have limited OpenStreetMap data."
          );
        }
      } catch {
        setError(
          "Could not search for hospitals. Please check your internet connection and try again."
        );
      }
    },
    []
  );

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
          () => {
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
  }, [isOpen, userLocation, searchNearbyHospitals]);

  // Alternative search using Nominatim API (currently unused but kept for future use)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const searchWithNominatim = useCallback(
    async (location: { lat: number; lng: number }) => {
      try {
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
                "User-Agent": "HealixApp/1.0",
              },
            }
          );

          if (response.ok) {
            const results = await response.json();

            results.forEach(
              (result: {
                lat: string;
                lon: string;
                display_name: string;
                type?: string;
                place_id?: string;
                name?: string;
              }) => {
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
                    name:
                      result.display_name.split(",")[0] || result.name || term,
                    lat,
                    lng,
                    address: result.display_name,
                    type,
                    distance,
                  });
                }
              }
            );
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


        if (sortedResults.length > 0) {
          setHospitals(sortedResults);
        } else {
          setError(
            "No medical facilities found within 15km. The area might have limited OpenStreetMap data."
          );
        }
      } catch {
        setError(
          "No medical facilities found within 15km. The area might have limited OpenStreetMap data."
        );
      }
    },
    []
  );

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 md:p-4">
      <div className="relative w-full max-w-6xl h-[95vh] md:h-[90vh] bg-background rounded-xl md:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-3 md:px-6 py-3 md:py-4 border-b border-border/40 bg-background/95 backdrop-blur-sm">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-chart-1 to-chart-2 flex items-center justify-center">
              <MapPin
                className="text-white w-4 h-4 md:w-5 md:h-5"
                strokeWidth={2}
              />
            </div>
            <div>
              <h2 className="text-base md:text-xl font-semibold text-foreground">
                Nearby Medical Facilities
              </h2>
              <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                Searching within 15km • Powered by OpenStreetMap
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-muted hover:bg-muted/80 transition-colors flex items-center justify-center active:scale-95 shadow-md"
            aria-label="Close map"
          >
            <X
              size={20}
              className="md:w-5 md:h-5 text-foreground"
              strokeWidth={2.5}
            />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Map */}
          <div className="flex-1 relative min-h-[50%] md:min-h-full">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/95 z-10">
                <div className="text-center space-y-3 md:space-y-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-chart-1 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-sm md:text-base text-muted-foreground px-4">
                    Getting your location...
                  </p>
                </div>
              </div>
            )}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/95 z-10">
                <div className="text-center space-y-3 md:space-y-4 p-4 md:p-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                    <MapPin
                      className="text-destructive w-6 h-6 md:w-8 md:h-8"
                      strokeWidth={2}
                    />
                  </div>
                  <p className="text-sm md:text-base text-destructive font-medium">
                    {error}
                  </p>
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
          <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-border/40 bg-muted/30 overflow-y-auto max-h-[45%] md:max-h-full">
            <div className="p-3 md:p-4 space-y-2 md:space-y-3">
              {hospitals.length === 0 && !loading && !error && (
                <p className="text-center text-sm md:text-base text-muted-foreground py-6 md:py-8">
                  No hospitals found nearby
                </p>
              )}
              {hospitals.map((hospital) => (
                <div
                  key={hospital.id}
                  className="bg-background rounded-lg p-3 md:p-4 shadow-sm border border-border/40 hover:border-chart-1/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-2 md:gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 md:gap-2 mb-1">
                        <h3 className="text-sm md:text-base font-semibold text-foreground truncate group-hover:text-chart-1 transition-colors">
                          {hospital.name}
                        </h3>
                        {hospital.type && (
                          <span
                            className={`text-xs px-1.5 md:px-2 py-0.5 rounded font-medium whitespace-nowrap ${
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
                      <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2">
                        {hospital.address}
                      </p>
                      {hospital.distance && (
                        <p className="text-xs text-chart-1 font-medium mt-1.5 md:mt-2">
                          {hospital.distance.toFixed(1)} km away
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => getDirections(hospital)}
                      className="flex-shrink-0 w-8 h-8 md:w-9 md:h-9 rounded-full bg-chart-1/10 hover:bg-chart-1 hover:text-white transition-all flex items-center justify-center group/btn"
                      aria-label="Get directions"
                    >
                      <Navigation size={14} className="md:w-4 md:h-4" />
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
