import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Create custom gold heart pin icon using Leaflet divIcon
const customHeartPin = L.divIcon({
  className: 'custom-heart-pin-icon',
  html: `
    <div style="
      background-color: var(--gold-primary);
      width: 36px;
      height: 36px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 15px rgba(197, 160, 89, 0.4);
      border: 2px solid white;
    ">
      <div style="
        transform: rotate(45deg);
        color: white;
        font-size: 16px;
        margin-top: -2px;
        margin-left: -1px;
      ">♥</div>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

// Dynamic GPS Vehicle Icon Generator (Car or Bike)
const getVehicleIcon = (type: 'car' | 'bike') => {
  const iconSvg = type === 'car'
    ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
        <circle cx="7" cy="17" r="2" fill="white" />
        <circle cx="15" cy="17" r="2" fill="white" />
      </svg>`
    : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="5" cy="18" r="3" fill="white" />
        <circle cx="19" cy="18" r="3" fill="white" />
        <path d="M12 18V12H9l3-4h3l-2 4h5l-2 6H12z" />
      </svg>`;

  return L.divIcon({
    className: 'custom-vehicle-gps-pin',
    html: `
      <div style="
        background-color: #2196F3;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 4px 12px rgba(33,150,243,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      ">
        <div style="
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          background-color: rgba(33, 150, 243, 0.25);
          animation: pulse 1.8s infinite ease-in-out;
          pointer-events: none;
        "></div>
        ${iconSvg}
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });
};

interface MapWidgetProps {
  userCoords: [number, number] | null;
  destCoords: [number, number];
  destName: string;
  destAddress: string;
  routePath?: [number, number][];
  traveledPath?: [number, number][];
  isNavigationActive?: boolean;
  vehicleType?: 'car' | 'bike';
}

// Sub-component to fit bounds when route updates or destination changes
function MapBoundsController({ bounds, destCoords }: { bounds: L.LatLngBoundsExpression | null; destCoords: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    } else {
      map.setView(destCoords, 12);
    }
  }, [bounds, destCoords, map]);
  
  return null;
}

export default function MapWidget({
  userCoords,
  destCoords,
  destName,
  destAddress,
  routePath,
  traveledPath,
  isNavigationActive = false,
  vehicleType = 'car'
}: MapWidgetProps) {
  // Calculate bounds if userCoords exist
  const bounds: L.LatLngBoundsExpression | null = userCoords
    ? [userCoords, destCoords]
    : null;

  return (
    <div style={styles.mapWrapper}>
      <MapContainer
        center={destCoords}
        zoom={12}
        scrollWheelZoom={false}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://maps.google.com">Google Maps</a>'
          url="https://{s}.google.com/vt/lyrs=m,traffic&x={x}&y={y}&z={z}"
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
        />

        {/* Dynamic Venue Marker */}
        <Marker position={destCoords} icon={customHeartPin}>
          <Popup>
            <div style={styles.popupContent}>
              <strong style={{ display: 'block', color: 'var(--gold-primary)', fontFamily: 'var(--font-serif)', fontSize: '1.1rem' }}>
                {destName}
              </strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {destAddress}
              </span>
            </div>
          </Popup>
        </Marker>

        {/* Dynamic Vehicle Marker Pin */}
        {userCoords && (
          <Marker position={userCoords} icon={getVehicleIcon(vehicleType)}>
            <Popup>
              <div style={styles.popupContent}>
                <strong>Your Current Position</strong>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Planned road path polyline (Gold when inactive, Google Blue double-line when active navigation) */}
        {routePath && (
          <>
            {isNavigationActive && (
              <Polyline
                positions={routePath}
                color="#0f52ba"
                weight={8}
                opacity={0.8}
              />
            )}
            <Polyline
              positions={routePath}
              color={isNavigationActive ? '#1a73e8' : 'var(--gold-primary)'}
              weight={isNavigationActive ? 5 : 6}
              opacity={isNavigationActive ? 0.95 : 0.4}
            />
          </>
        )}

        {/* Active traveled road path in thick blue (only shown if not drawing main route in blue) */}
        {traveledPath && traveledPath.length > 0 && !isNavigationActive && (
          <Polyline
            positions={traveledPath}
            color="#1a73e8"
            weight={6}
            opacity={0.85}
          />
        )}

        {/* Fallback straight dashed line if no route path is available */}
        {!routePath && userCoords && (
          <>
            {isNavigationActive && (
              <Polyline
                positions={[userCoords, destCoords]}
                color="#0f52ba"
                weight={8}
                opacity={0.8}
              />
            )}
            <Polyline
              positions={[userCoords, destCoords]}
              color={isNavigationActive ? '#1a73e8' : 'var(--gold-primary)'}
              weight={isNavigationActive ? 5 : 4}
              dashArray={isNavigationActive ? undefined : "10, 10"}
            />
          </>
        )}

        {/* Bounds and Center management component */}
        <MapBoundsController bounds={bounds} destCoords={destCoords} />
      </MapContainer>
    </div>
  );
}

const styles = {
  mapWrapper: {
    width: '100%',
    height: '450px',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid var(--border-gold)',
    boxShadow: 'var(--shadow-soft)',
  },
  popupContent: {
    fontFamily: 'var(--font-sans)',
    padding: '0.25rem',
    textAlign: 'center' as const,
  },
};

// Add CSS keyframe for user pulse ring animation
const styleSheet = document.createElement('style');
styleSheet.innerText = `
  @keyframes pulse {
    0% { transform: scale(0.6); opacity: 1; }
    100% { transform: scale(1.8); opacity: 0; }
  }
`;
document.head.appendChild(styleSheet);
