"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

/* ─── City centre fallbacks ──────────────────────────────────────────── */
const CITY_COORDS: Record<string, [number, number]> = {
  Kathmandu:  [27.7172, 85.3240],
  Pokhara:    [28.2096, 83.9856],
  Lalitpur:   [27.6644, 85.3188],
  Bhaktapur:  [27.6710, 85.4298],
  Biratnagar: [26.4525, 87.2718],
  Birgunj:    [27.0104, 84.8774],
  Dharan:     [26.8118, 87.2840],
  Nepalgunj:  [28.0503, 81.6156],
  Butwal:     [27.7006, 83.4484],
  Dhangadhi:  [28.6983, 80.5939],
  Itahari:    [26.6650, 87.2772],
  Hetauda:    [27.4288, 85.0329],
  Janakpur:   [26.7288, 85.9266],
  Bharatpur:  [27.6833, 84.4333],
  Chitwan:    [27.5291, 84.3542],
  Lumbini:    [27.4833, 83.2833],
  Gorkha:     [28.0000, 84.6333],
  Ilam:       [26.9100, 87.9258],
  Tansen:     [27.8635, 83.5453],
  Dhulikhel:  [27.6194, 85.5447],
};

/* ─── Custom red-pin icon ─────────────────────────────────────────────── */
function buildRedPin() {
  return L.divIcon({
    className: "",
    iconSize: [36, 52],
    iconAnchor: [18, 52],
    popupAnchor: [0, -54],
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 52" width="36" height="52">
      <defs>
        <filter id="pv" x="-30%" y="-20%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#00000040"/>
        </filter>
      </defs>
      <path filter="url(#pv)"
        d="M18 0C8.059 0 0 8.059 0 18c0 12.5 18 34 18 34S36 30.5 36 18C36 8.059 27.941 0 18 0z"
        fill="#E8303A"/>
      <circle cx="18" cy="18" r="7" fill="white"/>
    </svg>`,
  });
}

/* ─── Auto-open popup once map is ready ───────────────────────────────── */
function AutoOpenPopup({ markerRef }: { markerRef: React.RefObject<L.Marker | null> }) {
  const map = useMap();
  useEffect(() => {
    const id = setTimeout(() => {
      markerRef.current?.openPopup();
    }, 600);
    return () => clearTimeout(id);
  }, [map, markerRef]);
  return null;
}

/* ─── Props ───────────────────────────────────────────────────────────── */
interface PropertyMapProps {
  latitude?: number | null;
  longitude?: number | null;
  locationName: string;
  propertyTitle?: string;
  price?: number | null;
}

/* ─── Main component ──────────────────────────────────────────────────── */
const PropertyMap = ({
  latitude,
  longitude,
  locationName,
  propertyTitle,
  price,
}: PropertyMapProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [resolvedAddress, setResolvedAddress] = useState("");
  const markerRef = useRef<L.Marker | null>(null);
  const pinIcon = useRef<L.DivIcon | null>(null);

  useEffect(() => {
    setIsMounted(true);
    pinIcon.current = buildRedPin();
  }, []);

  /* Reverse-geocode when exact coords exist */
  useEffect(() => {
    if (!latitude || !longitude) return;
    fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      { headers: { "Accept-Language": "en" } }
    )
      .then((r) => r.json())
      .then((d) => { if (d?.display_name) setResolvedAddress(d.display_name); })
      .catch(() => {});
  }, [latitude, longitude]);

  /* Loading skeleton */
  if (!isMounted) {
    return (
      <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
        <svg className="w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 24 36">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24S24 21 24 12C24 5.373 18.627 0 12 0z"/>
        </svg>
      </div>
    );
  }

  /* ── Case 1: Exact pinned coordinates ─────────────────────────────── */
  if (latitude && longitude && pinIcon.current) {
    const position: [number, number] = [latitude, longitude];
    const osmLink = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=17/${latitude}/${longitude}`;

    return (
      <MapContainer
        center={position}
        zoom={17}
        scrollWheelZoom={false}
        zoomControl={false}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
          maxZoom={19}
        />
        <ZoomControl position="bottomright" />
        <Marker
          position={position}
          icon={pinIcon.current}
          ref={markerRef}
        >
          <Popup maxWidth={280} closeButton={false}>
            <div className="py-1 space-y-1.5 min-w-[200px]">
              {propertyTitle && (
                <p className="font-bold text-gray-900 text-sm leading-snug pr-1">
                  {propertyTitle}
                </p>
              )}
              {price && (
                <p className="text-[#789274] font-semibold text-sm">
                  NRs. {price.toLocaleString()}
                  <span className="text-gray-400 font-normal text-xs"> / month</span>
                </p>
              )}
              {(resolvedAddress || locationName) && (
                <div className="flex items-start gap-1.5 text-gray-500 text-xs leading-snug pt-0.5 border-t border-gray-100">
                  <svg className="w-3 h-3 text-[#E8303A] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 36">
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24S24 21 24 12C24 5.373 18.627 0 12 0z"/>
                  </svg>
                  <span>{resolvedAddress || locationName}</span>
                </div>
              )}
              <a
                href={osmLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[11px] text-blue-500 hover:underline pt-0.5"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M9 12h6M12 9l3 3-3 3"/><circle cx="12" cy="12" r="9"/>
                </svg>
                Open in maps
              </a>
            </div>
          </Popup>
        </Marker>
        <AutoOpenPopup markerRef={markerRef} />
      </MapContainer>
    );
  }

  /* ── Case 2: No exact coords — city-centre fallback ──────────────── */
  const cityCoords = CITY_COORDS[locationName];

  if (cityCoords && pinIcon.current) {
    return (
      <div className="relative w-full h-full">
        <MapContainer
          center={cityCoords}
          zoom={14}
          scrollWheelZoom={false}
          zoomControl={false}
          style={{ height: "100%", width: "100%", zIndex: 0 }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
            maxZoom={19}
          />
          <ZoomControl position="bottomright" />
          <Marker position={cityCoords} icon={pinIcon.current} ref={markerRef}>
            <Popup maxWidth={220} closeButton={false}>
              <div className="py-1 space-y-1">
                <p className="font-semibold text-gray-800 text-sm">{locationName}</p>
                <p className="text-xs text-amber-600">
                  Approximate location — landlord hasn&apos;t pinned an exact spot.
                </p>
              </div>
            </Popup>
          </Marker>
          <AutoOpenPopup markerRef={markerRef} />
        </MapContainer>

        {/* Approximate badge */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none">
          <span className="flex items-center gap-1.5 bg-amber-50 border border-amber-300 text-amber-800 text-[11px] font-medium px-3 py-1.5 rounded-full shadow-sm">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 36">
              <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24S24 21 24 12C24 5.373 18.627 0 12 0z"/>
            </svg>
            Showing approximate city area
          </span>
        </div>
      </div>
    );
  }

  /* ── Case 3: No data at all ────────────────────────────────────────── */
  return (
    <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center gap-2 text-gray-400">
      <svg className="w-10 h-10 opacity-30" fill="currentColor" viewBox="0 0 24 36">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24S24 21 24 12C24 5.373 18.627 0 12 0z"/>
      </svg>
      <p className="text-sm">Location not available</p>
    </div>
  );
};

export default PropertyMap;
