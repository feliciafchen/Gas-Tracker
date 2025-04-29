import { useState, useEffect } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { RouteInput } from './RouteInput';
import { VehicleInput } from './VehicleInput';
import './Directions.css';

interface DirectionsProps {
  onShowMap: (show: boolean) => void;
  showMap: boolean;
}

export function Directions({ onShowMap, showMap }: DirectionsProps) {
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
  const [gasPrice, setGasPrice] = useState("1.50");
  const selected = routes[routeIndex];

  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({map}));
  }, [routesLibrary, map]);

  const calculateTotalDistance = (route: google.maps.DirectionsRoute) => {
    // Convert meters to miles (1 meter = 0.000621371 miles)
    return route.legs.reduce((total, leg) => total + (leg.distance?.value || 0) * 0.000621371, 0);
  };

  const calculateGasCost = (distanceInMiles: number, mpg: number) => {
    // Calculate gallons needed
    const gallonsNeeded = distanceInMiles / mpg;
    return gallonsNeeded * parseFloat(gasPrice);
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
      if (directionsRenderer && map) {
        directionsRenderer.setDirections(response);
        setRoutes(response.routes);
        onShowMap(true);
      }
    })
    .catch((error) => {
      console.error('Error getting directions:', error);
    });
  };

  return (
    <div className={`directions-modal ${showMap ? 'directions-modal-map-visible' : ''}`}>
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
      <div className="gas-price-input">
        <label htmlFor="gasPrice">Gas Price (USD/gal)</label>
        <input
          type="number"
          id="gasPrice"
          value={gasPrice}
          onChange={(e) => setGasPrice(e.target.value)}
          step="0.01"
          min="0"
          placeholder="e.g., 3.50"
        />
      </div>
      {selected && fuelEfficiency ? (
        <div className="cost-summary">
          <h3>Trip Summary</h3>
          <p><strong>Total Distance:</strong> {calculateTotalDistance(selected).toFixed(1)} miles</p>
          <p><strong>Estimated Gas Cost:</strong> ${calculateGasCost(
            calculateTotalDistance(selected),
            parseFloat(fuelEfficiency)
          ).toFixed(2)}</p>
          <p className="gas-price-note">Based on gas price: ${gasPrice}/gal</p>
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