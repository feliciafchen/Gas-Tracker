import { useState, useEffect } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { RouteInput } from './RouteInput';
import { VehicleInput } from './VehicleInput';
import './Directions.css';

// Current gas price in CAD per liter (you might want to make this dynamic or user-input)
const GAS_PRICE_PER_LITER = 1.50;

export function Directions() {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
  const [routeIndex, setRouteIndex] = useState(0);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [stops, setStops] = useState<string[]>([]);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [fuelEfficiency, setFuelEfficiency] = useState("");
  const selected = routes[routeIndex];

  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({map}));
  }, [routesLibrary, map]);

  const calculateTotalDistance = (route: google.maps.DirectionsRoute) => {
    return route.legs.reduce((total, leg) => total + (leg.distance?.value || 0), 0);
  };

  const calculateGasCost = (distanceInKm: number, fuelEfficiency: number) => {
    const litersNeeded = (distanceInKm * fuelEfficiency) / 100;
    return litersNeeded * GAS_PRICE_PER_LITER;
  };

  const getDirections = () => {
    if(!directionsService || !directionsRenderer || !origin || !destination) return;

    const waypoints = stops
      .filter(stop => stop.trim() !== '')
      .map(stop => ({
        location: stop,
        stopover: true
      }));

    directionsService.route({
      origin,
      destination,
      waypoints,
      travelMode: google.maps.TravelMode.DRIVING,
      provideRouteAlternatives: true
    })
    .then((response) => {
      directionsRenderer.setDirections(response);
      setRoutes(response.routes);
    })
    .catch((error) => {
      console.error('Error getting directions:', error);
    });
  };

  return (
    <div className="directions-modal">
      <h2>Gas Cost Calculator</h2>
      <RouteInput
        origin={origin}
        destination={destination}
        stops={stops}
        onOriginChange={setOrigin}
        onDestinationChange={setDestination}
        onStopsChange={setStops}
      />
      <VehicleInput
        make={make}
        model={model}
        year={year}
        fuelEfficiency={fuelEfficiency}
        onMakeChange={setMake}
        onModelChange={setModel}
        onYearChange={setYear}
        onFuelEfficiencyChange={setFuelEfficiency}
      />
      {selected && fuelEfficiency ? (
        <div className="cost-summary">
          <h3>Trip Summary</h3>
          <p><strong>Total Distance:</strong> {(calculateTotalDistance(selected) / 1000).toFixed(1)} km</p>
          <p><strong>Estimated Gas Cost:</strong> ${calculateGasCost(
            calculateTotalDistance(selected) / 1000,
            parseFloat(fuelEfficiency)
          ).toFixed(2)}</p>
          <p className="gas-price-note">Based on current gas price: ${GAS_PRICE_PER_LITER}/L</p>
        </div>
      ) : (
        <></>
      )}
      <button 
        className="calculate-button"
        onClick={getDirections}
        disabled={!origin || !destination || !fuelEfficiency}
      >
        Calculate Gas Price
      </button>
    </div>
  );
} 