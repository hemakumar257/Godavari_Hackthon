import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Coordinates } from '../../types/phase2';
import { NavigateButton } from '../common/NavigateButton';
import { DemoBadge } from '../common/DemoBadge';

// Fix standard Leaflet icon paths
// @ts-expect-error Leaflet default icon hack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom colored icons for categories
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
      ">
        <div style="
          width: 10px;
          height: 10px;
          background: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [30, 42],
    iconAnchor: [15, 30],
    popupAnchor: [0, -32],
  });
};

export const ICONS = {
  ghat: createCustomIcon('#0284c7'), // godavari-blue
  temple: createCustomIcon('#f59e0b'), // gold / saffron
  parking: createCustomIcon('#6366f1'), // indigo
  facility: createCustomIcon('#10b981'), // emerald
  user: createCustomIcon('#ef4444'), // red
};

export interface MapPoint {
  id: string;
  type: 'ghat' | 'temple' | 'parking' | 'facility';
  title: string;
  subtitle?: string;
  coordinates: Coordinates;
  isDemo?: boolean;
}

interface InteractiveMapProps {
  points: MapPoint[];
  center?: Coordinates;
  zoom?: number;
  userCoords?: Coordinates | null;
  className?: string;
  height?: string;
}

// Helper component to recenter map dynamically
const ChangeView: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  points,
  center = { lat: 16.9862, lng: 81.7845 }, // Rajahmundry center
  zoom = 14,
  userCoords,
  className = '',
  height = '500px',
}) => {
  return (
    <div
      style={{ height, minHeight: '350px' }}
      className={`w-full rounded-2xl overflow-hidden shadow-md border border-slate-200 relative z-0 ${className}`}
    >
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <ChangeView center={[center.lat, center.lng]} zoom={zoom} />

        {/* OpenStreetMap Tile Layer with mandatory attribution */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Location Marker */}
        {userCoords && (
          <Marker position={[userCoords.lat, userCoords.lng]} icon={ICONS.user}>
            <Popup>
              <div className="p-2 text-center">
                <span className="font-bold text-slate-800 text-sm block">📍 You Are Here</span>
                <span className="text-xs text-slate-500">మీ ప్రస్తుత స్థానం</span>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Map Points Markers */}
        {points.map((pt) => (
          <Marker
            key={`${pt.type}-${pt.id}`}
            position={[pt.coordinates.lat, pt.coordinates.lng]}
            icon={ICONS[pt.type] || ICONS.ghat}
          >
            <Popup>
              <div className="p-1 space-y-2 min-w-[200px]">
                <div className="flex items-start justify-between gap-1">
                  <h4 className="font-bold text-slate-900 text-sm">{pt.title}</h4>
                  {pt.isDemo && <DemoBadge />}
                </div>
                {pt.subtitle && (
                  <p className="text-xs text-slate-500 line-clamp-2">{pt.subtitle}</p>
                )}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] uppercase font-semibold text-slate-400">
                    {pt.type}
                  </span>
                  <NavigateButton
                    coordinates={pt.coordinates}
                    size="sm"
                    userCoords={userCoords}
                  />
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
