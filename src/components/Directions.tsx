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
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [fuelEfficiency, setFuelEfficiency] = useState("");
  const selected = routes[routeIndex];
  const leg = selected?.legs[0];

  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({map}));
  }, [routesLibrary, map]);

  const calculateGasCost = (distanceInKm: number, fuelEfficiency: number) => {
    const litersNeeded = (distanceInKm * fuelEfficiency) / 100;
    return litersNeeded * GAS_PRICE_PER_LITER;
  };

  const getDirections = () => {
    if(!directionsService || !directionsRenderer || !origin || !destination) return;

    directionsService.route({
      origin,
      destination,
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
        onOriginChange={setOrigin}
        onDestinationChange={setDestination}
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
      {selected && leg && fuelEfficiency ? (
        <div className="cost-summary">
          <h3>Trip Summary</h3>
          <p><strong>Distance:</strong> {leg.distance?.text}</p>
          <p><strong>Estimated Gas Cost:</strong> ${calculateGasCost(
            leg.distance?.value ? leg.distance.value / 1000 : 0,
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