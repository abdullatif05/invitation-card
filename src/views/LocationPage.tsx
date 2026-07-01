import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Car, Hotel, Info, Compass, ShieldAlert, Sparkles, RefreshCw, Navigation } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import MapWidget from '../components/MapWidget';

interface RouteStep {
  coords: [number, number];
  instruction: string;
}

// Coordinates definition for Bhiwandi, Maharashtra venues
const VENUES = {
  paan: {
    lat: 19.2970,
    lng: 73.0520,
    name: 'Paan Khana Ceremony Venue',
    address: 'Super Tower, Thana Road, Bhiwandi - 421302',
    date: 'Friday, 6 November 2026',
    time: '08:00 PM onwards'
  },
  walima: {
    lat: 19.3015,
    lng: 73.0560,
    name: 'Walima Reception Venue',
    address: 'Marriage Ground, Parshuram Tawre Stadium, Opp. Sportive Swimming Pool, New Gauri Pada, Kariwali, Bhiwandi - 421305',
    date: 'Sunday, 8 November 2026',
    time: '07:00 PM onwards'
  }
};

// Travel Route: Mumbai Chhatrapati Shivaji Maharaj Airport (BOM) to Parshuram Tawre Stadium
const WALIMA_ROUTE: RouteStep[] = [
  { coords: [19.0896, 72.8656], instruction: "Depart from Chhatrapati Shivaji Airport (BOM) Terminal 2 gates." },
  { coords: [19.0988, 72.8732], instruction: "Head north on Sahar Airport Road. Keep right to merge onto Western Express Highway." },
  { coords: [19.1025, 72.8615], instruction: "Merge onto Western Express Highway (WEH) heading north." },
  { coords: [19.1180, 72.8630], instruction: "Continue north on WEH. Keep right near JVLR exit." },
  { coords: [19.1294, 72.8643], instruction: "Take exit ramp right onto Jogeshwari-Vikhroli Link Road (JVLR)." },
  { coords: [19.1278, 72.9038], instruction: "Continue on JVLR. Pass Powai Lake and IIT Bombay on your left." },
  { coords: [19.1245, 72.9348], instruction: "Take flyover to merge onto Eastern Express Highway (EEH) heading north." },
  { coords: [19.1488, 72.9431], instruction: "Continue north on EEH, passing Bhandup." },
  { coords: [19.1725, 72.9542], instruction: "Pass through Mulund Check Naka (Toll gate). Enter Thane limits." },
  { coords: [19.1895, 72.9648], instruction: "Pass Teen Hath Naka. Keep straight on the main flyover lanes." },
  { coords: [19.2081, 72.9774], instruction: "At Majiwada flyover junction, take ramp right for Thane-Bhiwandi Road (NH 848)." },
  { coords: [19.2155, 72.9868], instruction: "Cross Saket Bridge over the Thane Creek estuary." },
  { coords: [19.2392, 73.0118], instruction: "Continue on Thane-Bhiwandi Road through Kalher town." },
  { coords: [19.2558, 73.0232], instruction: "Pass Kasheli Bridge. Proceed towards Anjur Phata." },
  { coords: [19.2785, 73.0425], instruction: "At Anjur Phata bypass, keep right onto Thana Road toward Bhiwandi." },
  { coords: [19.2970, 73.0520], instruction: "Continue north past Super Tower on Thana Road." },
  { coords: [19.3015, 73.0560], instruction: "Arrive at Parshuram Tawre Stadium. Walima venue is on your left!" }
];

// Travel Route: Mumbai Airport (BOM) to Super Tower
const PAAN_ROUTE: RouteStep[] = [
  { coords: [19.0896, 72.8656], instruction: "Depart from Chhatrapati Shivaji Airport (BOM) Terminal 2 gates." },
  { coords: [19.0988, 72.8732], instruction: "Head north on Sahar Airport Road. Keep right to merge onto Western Express Highway." },
  { coords: [19.1025, 72.8615], instruction: "Merge onto Western Express Highway (WEH) heading north." },
  { coords: [19.1180, 72.8630], instruction: "Continue north on WEH. Keep right near JVLR exit." },
  { coords: [19.1294, 72.8643], instruction: "Take exit ramp right onto Jogeshwari-Vikhroli Link Road (JVLR)." },
  { coords: [19.1278, 72.9038], instruction: "Continue on JVLR. Pass Powai Lake and IIT Bombay on your left." },
  { coords: [19.1245, 72.9348], instruction: "Take flyover to merge onto Eastern Express Highway (EEH) heading north." },
  { coords: [19.1488, 72.9431], instruction: "Continue north on EEH, passing Bhandup." },
  { coords: [19.1725, 72.9542], instruction: "Pass through Mulund Check Naka (Toll gate). Enter Thane limits." },
  { coords: [19.1895, 72.9648], instruction: "Pass Teen Hath Naka. Keep straight on the main flyover lanes." },
  { coords: [19.2081, 72.9774], instruction: "At Majiwada flyover junction, take ramp right for Thane-Bhiwandi Road (NH 848)." },
  { coords: [19.2155, 72.9868], instruction: "Cross Saket Bridge over the Thane Creek estuary." },
  { coords: [19.2392, 73.0118], instruction: "Continue on Thane-Bhiwandi Road through Kalher town." },
  { coords: [19.2558, 73.0232], instruction: "Pass Kasheli Bridge. Proceed towards Anjur Phata." },
  { coords: [19.2785, 73.0425], instruction: "At Anjur Phata bypass, keep right onto Thana Road toward Bhiwandi." },
  { coords: [19.2970, 73.0520], instruction: "Arrive at Super Tower on Thana Road. Paan Khana Ceremony venue is on your left!" }
];

export default function LocationPage() {
  const [selectedVenue, setSelectedVenue] = useState<'paan' | 'walima'>('walima');
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [traveledPath, setTraveledPath] = useState<[number, number][]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [trackingError, setTrackingError] = useState<string | null>(null);
  const [simStep, setSimStep] = useState(0);

  // Dynamic Car/Bike Toggle Mode
  const [vehicleType, setVehicleType] = useState<'car' | 'bike'>('car');
  const [liveRoutePath, setLiveRoutePath] = useState<[number, number][] | null>(null);
  const [liveInstructions, setLiveInstructions] = useState<RouteStep[]>([]);

  const watchId = useRef<number | null>(null);
  const simInterval = useRef<number | null>(null);

  const activeVenue = VENUES[selectedVenue];
  const activeRoute = selectedVenue === 'walima' ? WALIMA_ROUTE : PAAN_ROUTE;

  // Haversine formula to calculate distance in kilometers
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371.0; // Radius of Earth in kilometers
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

  // Fetch actual road coordinates from User GPS to Destination via free OSRM Routing API
  const fetchLiveRoute = async (startLat: number, startLng: number, endLat: number, endLng: number) => {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson&steps=true`;
      const response = await fetch(url);
      if (!response.ok) return;
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const coords = data.routes[0].geometry.coordinates.map((coord: any) => [coord[1], coord[0]] as [number, number]);
        setLiveRoutePath(coords);

        const steps = data.routes[0].legs[0].steps || [];
        const parsedSteps = steps.map((step: any, idx: number) => {
          const name = step.name || "";
          const maneuver = step.maneuver || {};
          const type = maneuver.type || "drive";
          const modifier = maneuver.modifier || "";
          let direction = `${type.charAt(0).toUpperCase() + type.slice(1)} ${modifier} ${name ? 'onto ' + name : ''}`.trim();
          if (idx === 0) direction = "Start journey towards Bhiwandi.";
          if (idx === steps.length - 1) direction = "Arrived at wedding destination!";
          return {
            coords: [maneuver.location[1], maneuver.location[0]] as [number, number],
            instruction: direction
          };
        });
        setLiveInstructions(parsedSteps);
      }
    } catch (e) {
      console.error("OSRM Route Fetch Error:", e);
    }
  };

  const handleStartTracking = () => {
    handleStopSimulation();
    setTrackingError(null);

    if (!navigator.geolocation) {
      setTrackingError('Geolocation is not supported by your browser.');
      return;
    }

    setIsTracking(true);

    // Initial positioning
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords([latitude, longitude]);
        setTraveledPath([[latitude, longitude]]);
        const dist = calculateDistance(latitude, longitude, activeVenue.lat, activeVenue.lng);
        setDistanceKm(dist);
        // Fetch actual road coordinates path
        fetchLiveRoute(latitude, longitude, activeVenue.lat, activeVenue.lng);
      },
      (error) => {
        console.error(error);
        setTrackingError('Unable to retrieve location. Please check GPS permissions.');
        setIsTracking(false);
      }
    );

    // Track active movements
    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords([latitude, longitude]);
        setTraveledPath((prev) => [...prev, [latitude, longitude]]);
        const dist = calculateDistance(latitude, longitude, activeVenue.lat, activeVenue.lng);
        setDistanceKm(dist);
      },
      (error) => {
        console.error(error);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleStopTracking = () => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    setIsTracking(false);
    setUserCoords(null);
    setTraveledPath([]);
    setLiveRoutePath(null);
    setLiveInstructions([]);
    setDistanceKm(null);
  };

  const handleStartSimulation = () => {
    handleStopTracking();
    setIsSimulating(true);
    setSimStep(0);
    
    // Set initial coordinates
    const startCoords = activeRoute[0].coords;
    setUserCoords(startCoords);
    setTraveledPath([startCoords]);
    setDistanceKm(calculateDistance(startCoords[0], startCoords[1], activeVenue.lat, activeVenue.lng));
    
    const totalSteps = activeRoute.length;

    simInterval.current = window.setInterval(() => {
      setSimStep((prevStep) => {
        const nextStep = prevStep + 1;
        if (nextStep >= totalSteps) {
          handleStopSimulation();
          setUserCoords([activeVenue.lat, activeVenue.lng]);
          setTraveledPath(activeRoute.map(step => step.coords));
          setDistanceKm(0);
          return totalSteps - 1;
        }

        const currentStepData = activeRoute[nextStep];
        setUserCoords(currentStepData.coords);
        setTraveledPath(activeRoute.slice(0, nextStep + 1).map(step => step.coords));
        
        const dist = calculateDistance(currentStepData.coords[0], currentStepData.coords[1], activeVenue.lat, activeVenue.lng);
        setDistanceKm(dist);

        return nextStep;
      });
    }, 1800); // 1.8 seconds per step to allow comfortable reading
  };

  const handleStopSimulation = () => {
    if (simInterval.current !== null) {
      clearInterval(simInterval.current);
      simInterval.current = null;
    }
    setIsSimulating(false);
    setUserCoords(null);
    setTraveledPath([]);
    setLiveRoutePath(null);
    setLiveInstructions([]);
    setDistanceKm(null);
    setSimStep(0);
  };

  // Reset tracking/simulation when user switches target venues
  useEffect(() => {
    handleStopSimulation();
    handleStopTracking();
  }, [selectedVenue]);

  useEffect(() => {
    return () => {
      if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
      if (simInterval.current !== null) clearInterval(simInterval.current);
    };
  }, []);

  // Determine active route path to draw on map (live GPS path vs static simulated path)
  const mapRoutePath = isTracking && liveRoutePath ? liveRoutePath : activeRoute.map(step => step.coords);
  const activeDirections = isTracking && liveInstructions.length > 0 ? liveInstructions : activeRoute;
  const activeStepIdx = isTracking ? 0 : simStep;

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div className="container" style={styles.headerContent}>
          <Link to="/" style={{ ...styles.backLink, flex: 1 }}>
            <ArrowLeft size={18} /> <span className="header-back-text">BACK TO INVITATION</span>
          </Link>
          <div style={{ ...styles.headerLogo, flex: 1, textAlign: 'center' }} className="font-serif">
            A & A
          </div>
          <div style={{ flex: 1 }}></div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <span style={styles.subtitle}>LOCATION & LOGISTICS</span>
          <h1 className="font-serif" style={styles.title}>Venues & GPS Directions</h1>
          <p style={styles.introText}>
            Below are the location details for the Paan Khana Ceremony and the Walima Reception. Toggle the active venue inside our navigator dashboard to map dynamic routes starting from BOM Airport.
          </p>
        </div>
      </section>

      {/* Map & Live Navigation Section */}
      <section style={styles.mapSection}>
        <div className="container">
          <div className="grid-map">
            {/* Left Navigation Details Panel */}
            <div style={styles.detailsCol}>
              
              {/* Venue Selector Tabs */}
              <div style={styles.tabsContainer} className="card-premium">
                <div style={styles.tabsHeader}>SELECT TARGET VENUE:</div>
                <div style={styles.tabsButtons}>
                  <button
                    onClick={() => setSelectedVenue('walima')}
                    className={`btn-gold ${selectedVenue === 'walima' ? '' : 'btn-outline'}`}
                    style={{ flex: 1, padding: '0.6rem 1rem', fontSize: '0.75rem', border: selectedVenue === 'walima' ? 'none' : '1px solid var(--border-gold)' }}
                  >
                    Walima Reception
                  </button>
                  <button
                    onClick={() => setSelectedVenue('paan')}
                    className={`btn-gold ${selectedVenue === 'paan' ? '' : 'btn-outline'}`}
                    style={{ flex: 1, padding: '0.6rem 1rem', fontSize: '0.75rem', border: selectedVenue === 'paan' ? 'none' : '1px solid var(--border-gold)' }}
                  >
                    Paan Khana Ceremony
                  </button>
                </div>
              </div>

              {/* Dynamic Vehicle Mode Switcher */}
              <div style={styles.tabsContainer} className="card-premium">
                <div style={styles.tabsHeader}>SELECT VEHICLE MODE:</div>
                <div style={styles.tabsButtons}>
                  <button
                    onClick={() => setVehicleType('car')}
                    className={`btn-gold ${vehicleType === 'car' ? '' : 'btn-outline'}`}
                    style={{ flex: 1, padding: '0.6rem 1rem', fontSize: '0.75rem', border: vehicleType === 'car' ? 'none' : '1px solid var(--border-gold)' }}
                  >
                    🚗 Car / Sedan
                  </button>
                  <button
                    onClick={() => setVehicleType('bike')}
                    className={`btn-gold ${vehicleType === 'bike' ? '' : 'btn-outline'}`}
                    style={{ flex: 1, padding: '0.6rem 1rem', fontSize: '0.75rem', border: vehicleType === 'bike' ? 'none' : '1px solid var(--border-gold)' }}
                  >
                    🏍️ Motorcycle / Bike
                  </button>
                </div>
              </div>

              {/* Active Venue Details Card */}
              <div className="card-premium" style={styles.detailsCard}>
                <div style={styles.iconHeading}>
                  <MapPin size={22} color="var(--gold-primary)" />
                  <h3 className="font-serif" style={{ margin: 0, color: 'var(--emerald-primary)' }}>
                    {activeVenue.name}
                  </h3>
                </div>
                <div style={styles.venueMeta}>
                  <div style={{ color: 'var(--gold-dark)', fontWeight: '600', fontSize: '0.85rem' }}>{activeVenue.date}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{activeVenue.time}</div>
                </div>
                <p style={{ margin: '0.75rem 0 1.25rem 0', fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-dark)' }}>
                  {activeVenue.address}
                </p>

                {/* Navigation Dashboard Control */}
                <div style={styles.trackingDashboard}>
                  {!isTracking && !isSimulating ? (
                    <div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                        Track a route from your location to the venue, or simulate travel from CSM Airport (BOM) in Mumbai to Bhiwandi!
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <button onClick={handleStartTracking} className="btn-emerald nav-btn-mobile" style={{ justifyContent: 'center' }}>
                          <Compass size={16} /> Enable GPS Live Tracking
                        </button>
                        <button onClick={handleStartSimulation} className="btn-outline nav-btn-mobile" style={{ justifyContent: 'center' }}>
                          <Sparkles size={16} /> Simulate Route from BOM
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={styles.dashboardStatus}>
                        <span style={styles.statusPulse}></span>
                        <strong style={{ color: 'var(--emerald-primary)', fontSize: '0.9rem' }}>
                          {isSimulating ? 'Simulating BOM Route' : 'GPS Tracking Active'}
                        </strong>
                      </div>

                      <div style={styles.milesPanel}>
                        <div style={styles.milesTitle}>DISTANCE TO BHIWANDI</div>
                        <div style={styles.milesVal} className="font-serif">
                          {distanceKm !== null ? `${distanceKm.toFixed(1)} KM` : 'Calculating...'}
                        </div>
                      </div>

                      {isSimulating && (
                        <div style={styles.progressBarWrapper}>
                          <div style={{ ...styles.progressBar, width: `${(simStep / (activeRoute.length - 1)) * 100}%` }}></div>
                        </div>
                      )}

                      {/* Active Instruction Callout */}
                      {(isSimulating || (isTracking && activeDirections.length > 0)) && (
                        <div style={styles.activeInstructionCard}>
                          <Navigation size={18} color="var(--gold-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <div style={{ fontSize: '0.88rem', color: 'var(--emerald-primary)', fontWeight: '500' }}>
                            {activeDirections[activeStepIdx]?.instruction || "Proceed along mapped highway."}
                          </div>
                        </div>
                      )}

                      <p style={styles.directionsStep}>
                        {distanceKm !== null && distanceKm === 0 ? (
                          <span style={{ color: 'var(--gold-dark)', fontWeight: '600' }}>
                            ✓ Welcome! You have arrived in Bhiwandi.
                          </span>
                        ) : isSimulating ? (
                          'Driving via Eastern Express Highway towards Thane & Bhiwandi...'
                        ) : (
                          'Proceed along path. Dynamic GPS tracking active.'
                        )}
                      </p>

                      <button onClick={isSimulating ? handleStopSimulation : handleStopTracking} className="btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', color: '#D32F2F', borderColor: '#D32F2F' }}>
                        <RefreshCw size={14} /> Stop & Reset Map
                      </button>
                    </div>
                  )}

                  {trackingError && (
                    <div style={styles.errorBanner}>
                      <ShieldAlert size={16} color="#D32F2F" />
                      <span>{trackingError}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Turn-by-Turn Road Instructions List */}
              <div className="card-premium" style={styles.instructionsContainer}>
                <h3 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--emerald-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Navigation size={18} color="var(--gold-primary)" />
                  Road Instructions (BOM to Bhiwandi)
                </h3>
                <div style={styles.instructionsScroll} className="instructions-scroll">
                  {activeDirections.map((step, idx) => {
                    const isActive = isSimulating && idx === simStep;
                    return (
                      <div
                        key={idx}
                        style={{
                          ...styles.instructionRow,
                          backgroundColor: isActive ? 'rgba(212, 175, 55, 0.08)' : 'transparent',
                          borderLeft: isActive ? '3px solid var(--gold-primary)' : '3px solid transparent',
                        }}
                      >
                        <span style={{ ...styles.stepNum, color: isActive ? 'var(--gold-dark)' : 'var(--text-muted)' }}>
                          {idx + 1}
                        </span>
                        <span style={{ ...styles.stepText, color: isActive ? 'var(--emerald-primary)' : 'var(--text-muted)', fontWeight: isActive ? '500' : '300' }}>
                          {step.instruction}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* QR Code Sharing */}
              <div className="card-premium" style={styles.qrCard}>
                <h3 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '0.5rem', textAlign: 'center', color: 'var(--emerald-primary)' }}>
                  Invite Link QR Code
                </h3>
                <p style={{ fontSize: '0.8rem', textAlign: 'center', marginBottom: '1.25rem', color: 'var(--text-muted)' }}>
                  Scan code to share this invitation with other guests.
                </p>
                <div style={styles.qrWrapper}>
                  <QRCodeSVG
                    value={window.location.href}
                    size={128}
                    bgColor="#FFFFFF"
                    fgColor="#0B3C2A"
                    level="L"
                    includeMargin={true}
                  />
                </div>
              </div>
            </div>

            {/* Right Map Widget */}
            <div style={styles.mapCol}>
              <MapWidget
                userCoords={userCoords}
                destCoords={[activeVenue.lat, activeVenue.lng]}
                destName={activeVenue.name}
                destAddress={activeVenue.address}
                routePath={mapRoutePath}
                traveledPath={traveledPath}
                isNavigationActive={isSimulating || isTracking}
                vehicleType={vehicleType}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Accommodations & Parking Details */}
      <section className="section-dark" style={styles.travelInfoSection}>
        <div className="container">
          <h2 className="font-serif" style={{ marginBottom: '3.5rem', color: 'var(--emerald-primary)' }}>
            Accommodations & Event Parking
          </h2>
          <div className="grid-info">
            {/* Parking Card */}
            <div className="card-premium" style={styles.infoCard}>
              <Car size={32} color="var(--gold-primary)" style={{ marginBottom: '1rem' }} />
              <h3 className="font-serif" style={{ fontSize: '1.4rem', color: 'var(--emerald-primary)' }}>Parking Details</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Complimentary valet parking will be available at the main gates of **Super Tower** on Friday (Paan Khana Ceremony) and at **Parshuram Tawre Stadium** on Sunday (Walima Reception).
              </p>
            </div>

            {/* Hotel Accommodations */}
            <div className="card-premium" style={styles.infoCard}>
              <Hotel size={32} color="var(--gold-primary)" style={{ marginBottom: '1rem' }} />
              <h3 className="font-serif" style={{ fontSize: '1.4rem', color: 'var(--emerald-primary)' }}>Suggested Lodging</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                We have blocked guest rooms with preferred rates in local hotels near Thane and Bhiwandi. Contact the families or use booking discount code <em>"Khot-Kuwari Wedding"</em>.
              </p>
            </div>

            {/* Shuttles */}
            <div className="card-premium" style={styles.infoCard}>
              <Info size={32} color="var(--gold-primary)" style={{ marginBottom: '1rem' }} />
              <h3 className="font-serif" style={{ fontSize: '1.4rem', color: 'var(--emerald-primary)' }}>Guest Transport</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Complimentary guest shuttle buses will run continuously from Thane railway station and local lodging hotels directly to Gauri Pada Walima venue starting at 6:15 PM on Sunday.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          &copy; 2026 Abdullatif & Ayesha. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    backgroundColor: 'var(--bg-cream)',
  },
  header: {
    borderBottom: '1px solid var(--border-gold)',
    padding: '1rem 2rem',
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'var(--gold-dark)',
    textDecoration: 'none',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.8rem',
    fontWeight: '600',
    letterSpacing: '0.1em',
    width: '180px',
  },
  headerLogo: {
    fontSize: '1.6rem',
    color: 'var(--emerald-primary)',
    fontWeight: '400',
  },
  heroSection: {
    padding: '5rem 2rem 2rem 2rem',
  },
  subtitle: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--gold-primary)',
    letterSpacing: '0.15em',
  },
  title: {
    fontSize: '3rem',
    marginTop: '0.5rem',
    marginBottom: '1rem',
    color: 'var(--emerald-primary)',
  },
  introText: {
    maxWidth: '600px',
    margin: '0 auto',
    color: 'var(--text-muted)',
  },
  mapSection: {
    padding: '2rem 2rem 5rem 2rem',
  },
  detailsCol: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2rem',
  },
  tabsContainer: {
    padding: '1.25rem',
    backgroundColor: '#fff',
  },
  tabsHeader: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'var(--emerald-primary)',
    letterSpacing: '0.08em',
    marginBottom: '0.75rem',
  },
  tabsButtons: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },
  detailsCard: {
    padding: '2.5rem',
  },
  iconHeading: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  venueMeta: {
    margin: '0.5rem 0',
    padding: '0.5rem 0',
    borderTop: '1px dashed var(--border-gold)',
    borderBottom: '1px dashed var(--border-gold)',
  },
  trackingDashboard: {
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px dashed var(--border-gold)',
  },
  dashboardStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  statusPulse: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#4CAF50',
    display: 'inline-block',
  },
  milesPanel: {
    backgroundColor: 'var(--emerald-tint)',
    border: '1px solid var(--border-gold)',
    borderRadius: '8px',
    padding: '1rem',
    textAlign: 'center' as const,
    marginBottom: '1rem',
  },
  milesTitle: {
    fontSize: '0.65rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
    letterSpacing: '0.1em',
  },
  milesVal: {
    fontSize: '1.8rem',
    fontWeight: '500',
    color: 'var(--emerald-primary)',
    marginTop: '0.25rem',
  },
  progressBarWrapper: {
    width: '100%',
    height: '4px',
    backgroundColor: 'var(--border-gold)',
    borderRadius: '2px',
    overflow: 'hidden',
    marginBottom: '1rem',
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'var(--gold-primary)',
    transition: 'width 0.2s linear',
  },
  activeInstructionCard: {
    display: 'flex',
    gap: '0.75rem',
    backgroundColor: 'var(--gold-tint)',
    border: '1px solid var(--border-gold)',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1rem',
    boxShadow: 'var(--shadow-soft)',
  },
  directionsStep: {
    fontSize: '0.82rem',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
    textAlign: 'center' as const,
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#FFEBEE',
    border: '1px solid #FFCDD2',
    padding: '0.75rem',
    borderRadius: '8px',
    marginTop: '1rem',
    color: '#C62828',
    fontSize: '0.8rem',
  },
  instructionsContainer: {
    padding: '2rem 1.5rem',
    display: 'flex',
    flexDirection: 'column' as const,
    maxHeight: '350px',
  },
  instructionsScroll: {
    overflowY: 'auto' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
    paddingRight: '0.5rem',
  },
  instructionRow: {
    display: 'flex',
    gap: '0.75rem',
    padding: '0.5rem',
    borderRadius: '6px',
    alignItems: 'flex-start',
    transition: 'background-color 0.3s ease',
  },
  stepNum: {
    fontSize: '0.75rem',
    fontWeight: '700',
    backgroundColor: 'var(--bg-cream)',
    border: '1px solid var(--border-gold)',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepText: {
    fontSize: '0.82rem',
    lineHeight: '1.4',
  },
  qrCard: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '2rem',
  },
  qrWrapper: {
    background: '#fff',
    padding: '1rem',
    borderRadius: '12px',
    border: '1px solid var(--border-gold)',
    boxShadow: 'var(--shadow-soft)',
  },
  mapCol: {
    position: 'sticky' as const,
    top: '100px',
  },
  travelInfoSection: {
    padding: '6rem 2rem',
  },
  infoCard: {
    flex: '1',
  },
  footer: {
    padding: '3rem 2rem',
    textAlign: 'center' as const,
    borderTop: '1px solid var(--border-gold)',
    background: '#fff',
    marginTop: 'auto',
  },
};
