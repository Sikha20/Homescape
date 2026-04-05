"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

/* ─── City centre lookup ─────────────────────────────────────────────── */
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

/* ─── Custom red-pin icon (matches HamroBazar style) ─────────────────── */
function buildRedPin() {
  return L.divIcon({
    className: "",
    iconSize: [36, 52],
    iconAnchor: [18, 52],
    popupAnchor: [0, -54],
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 52" width="36" height="52">
      <defs>
        <filter id="ps" x="-30%" y="-20%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#00000040"/>
        </filter>
      </defs>
      <path filter="url(#ps)"
        d="M18 0C8.059 0 0 8.059 0 18c0 12.5 18 34 18 34S36 30.5 36 18C36 8.059 27.941 0 18 0z"
        fill="#E8303A"/>
      <circle cx="18" cy="18" r="7" fill="white"/>
    </svg>`,
  });
}

/* ─── Nominatim helpers ───────────────────────────────────────────────── */
const nominatimSearch = async (q: string) => {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q + " Nepal")}&format=json&limit=6&addressdetails=1`,
    { headers: { "Accept-Language": "en" } }
  );
  return res.json();
};

const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
    { headers: { "Accept-Language": "en" } }
  );
  const d = await res.json();
  return d?.display_name ?? "";
};

/* ─── Inner: fly to city when prop changes ───────────────────────────── */
function CitySync({ city }: { city?: string }) {
  const map = useMap();
  const prevCity = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (city && city !== prevCity.current && CITY_COORDS[city]) {
      prevCity.current = city;
      map.flyTo(CITY_COORDS[city], 15, { duration: 1.0, easeLinearity: 0.4 });
    }
  }, [city, map]);
  return null;
}

/* ─── Inner: fly to selected search result ───────────────────────────── */
function PanTo({ pos }: { pos: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (pos) map.flyTo(pos, 17, { duration: 0.8 });
  }, [pos, map]);
  return null;
}

/* ─── Inner: map click handler ───────────────────────────────────────── */
function ClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

/* ─── Main MapPicker ──────────────────────────────────────────────────── */
export interface MapPickerProps {
  onLocationChange: (lat: number, lng: number) => void;
  city?: string;
}

const MapPicker = ({ onLocationChange, city }: MapPickerProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isReverting, setIsReverting] = useState(false);
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(null);
  const [panTarget, setPanTarget] = useState<[number, number] | null>(null);
  const [address, setAddress] = useState("");
  const [gpsLoading, setGpsLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pinIcon = useRef<L.DivIcon | null>(null);

  // Build icon once (client-side only)
  useEffect(() => {
    pinIcon.current = buildRedPin();
  }, []);

  const defaultCenter: [number, number] =
    city && CITY_COORDS[city] ? CITY_COORDS[city] : [27.7172, 85.324];
  const defaultZoom = city && CITY_COORDS[city] ? 15 : 12;

  /* Search input → Nominatim */
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!val.trim()) { setResults([]); return; }
    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try { setResults(await nominatimSearch(val)); }
      catch { setResults([]); }
      finally { setIsSearching(false); }
    }, 450);
  };

  /* Pick from dropdown */
  const pickResult = (r: any) => {
    const lat = parseFloat(r.lat);
    const lng = parseFloat(r.lon);
    const pos: [number, number] = [lat, lng];
    setMarkerPos(pos);
    setPanTarget(pos);
    setAddress(r.display_name);
    setQuery(r.display_name.split(",").slice(0, 2).join(","));
    setResults([]);
    onLocationChange(lat, lng);
  };

  /* Click on map */
  const handleMapClick = useCallback(async (lat: number, lng: number) => {
    const pos: [number, number] = [lat, lng];
    setMarkerPos(pos);
    onLocationChange(lat, lng);
    setAddress(""); // clear while fetching
    setIsReverting(true);
    try {
      const addr = await reverseGeocode(lat, lng);
      setAddress(addr);
    } catch {
      setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    } finally {
      setIsReverting(false);
    }
  }, [onLocationChange]);

  /* Drag end on marker */
  const handleDragEnd = useCallback(async (e: any) => {
    const { lat, lng } = e.target.getLatLng();
    setMarkerPos([lat, lng]);
    onLocationChange(lat, lng);
    setIsReverting(true);
    try {
      setAddress(await reverseGeocode(lat, lng));
    } catch {
      setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    } finally {
      setIsReverting(false);
    }
  }, [onLocationChange]);

  /* Use device GPS */
  const useCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude: lat, longitude: lng } = coords;
        const pos: [number, number] = [lat, lng];
        setMarkerPos(pos);
        setPanTarget(pos);
        onLocationChange(lat, lng);
        setIsReverting(true);
        try { setAddress(await reverseGeocode(lat, lng)); }
        catch { setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`); }
        finally { setIsReverting(false); setGpsLoading(false); }
      },
      () => setGpsLoading(false),
      { timeout: 8000 }
    );
  };

  return (
    <div className="flex flex-col gap-2">

      {/* ── Search bar ── */}
      <div className="relative">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-[#789274]/40 focus-within:border-[#789274]/60 transition-all">
          {/* search icon */}
          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            placeholder="Search address, landmark, area…"
            className="flex-1 text-sm text-gray-700 bg-transparent outline-none placeholder:text-gray-400"
          />
          {isSearching && (
            <span className="w-3.5 h-3.5 border-2 border-gray-300 border-t-[#789274] rounded-full animate-spin shrink-0"/>
          )}
          {/* GPS button */}
          <button
            type="button"
            onClick={useCurrentLocation}
            title="Use my current location"
            className="shrink-0 p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            {gpsLoading ? (
              <span className="w-4 h-4 border-2 border-gray-300 border-t-[#E8303A] rounded-full animate-spin block"/>
            ) : (
              <svg className="w-4 h-4 text-[#789274]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
                <circle cx="12" cy="12" r="8" strokeDasharray="2 4"/>
              </svg>
            )}
          </button>
        </div>

        {/* Dropdown results */}
        {results.length > 0 && (
          <ul className="absolute z-[9999] left-0 right-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden text-sm">
            {results.map((r, i) => (
              <li
                key={r.place_id ?? i}
                onMouseDown={() => pickResult(r)}
                className="flex items-start gap-2.5 px-3 py-2.5 cursor-pointer hover:bg-[#789274]/8 transition-colors border-b border-gray-50 last:border-0"
              >
                <svg className="w-3.5 h-3.5 text-[#E8303A] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 36">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24S24 21 24 12C24 5.373 18.627 0 12 0z"/>
                </svg>
                <div className="min-w-0">
                  <p className="font-medium text-gray-800 truncate">{r.display_name.split(",")[0]}</p>
                  <p className="text-[11px] text-gray-400 truncate">{r.display_name.split(",").slice(1, 4).join(",")}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ── Address badge ── */}
      {(address || isReverting) && (
        <div className="flex items-start gap-2 bg-[#789274]/10 border border-[#789274]/25 rounded-xl px-3 py-2.5">
          <svg className="w-3.5 h-3.5 text-[#789274] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 36">
            <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24S24 21 24 12C24 5.373 18.627 0 12 0z"/>
          </svg>
          {isReverting ? (
            <span className="text-xs text-[#789274] animate-pulse">Fetching address…</span>
          ) : (
            <span className="text-xs text-[#5a6e54] leading-snug font-medium">{address}</span>
          )}
        </div>
      )}

      {/* ── Map container ── */}
      <div
        className="rounded-2xl overflow-hidden border border-gray-200 shadow-md"
        style={{ height: 400, zIndex: 0 }}
      >
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          scrollWheelZoom
          zoomControl={false}
          style={{ height: "100%", width: "100%", zIndex: 0 }}
          className="z-0"
        >
          {/* Carto light tiles — crisp, clean, like HamroBazar */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
            maxZoom={19}
          />
          <ZoomControl position="bottomright" />
          <CitySync city={city} />
          <PanTo pos={panTarget} />
          <ClickHandler onClick={handleMapClick} />
          {markerPos && pinIcon.current && (
            <Marker
              position={markerPos}
              icon={pinIcon.current}
              draggable
              eventHandlers={{ dragend: handleDragEnd }}
            />
          )}
        </MapContainer>
      </div>

      {/* Hint */}
      {!markerPos && (
        <p className="text-[11px] text-gray-400 text-center">
          {city
            ? "Click anywhere on the map or drag the pin to set the exact location"
            : "Select a city above, then click the map to pin the exact property spot"}
        </p>
      )}
    </div>
  );
};

export default MapPicker;
