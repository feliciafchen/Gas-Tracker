import { useState, useEffect } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { RouteInput } from './RouteInput';
import { VehicleInput } from './VehicleInput';
import { GasPriceInput } from './GasPriceInput';
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
  const [gasPrice, setGasPrice] = useState("");
  const [calculatedGasPrice, setCalculatedGasPrice] = useState("4.50");
  const [gasPriceError, setGasPriceError] = useState("");
  const [hasCalculated, setHasCalculated] = useState(false);
  const [routeError, setRouteError] = useState("");
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
    return gallonsNeeded * parseFloat(calculatedGasPrice);
  };

  const getDirections = () => {
    if(!directionsService || !directionsRenderer || !origin || !destination) return;

    setRouteError(""); // Clear any previous errors

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
        setCalculatedGasPrice(gasPrice);
        setHasCalculated(true);
        onShowMap(true);
      }
    })
    .catch((error) => {
      console.error('Error getting directions:', error);
      setHasCalculated(false);
      setRoutes([]);
      if (error.status === 'ZERO_RESULTS') {
        setRouteError("No route found. Please check your addresses and try again.");
      } else if (error.status === 'NOT_FOUND') {
        setRouteError("One or more addresses could not be found. Please check your input.");
      } else if (error.status === 'MAX_ROUTE_LENGTH_EXCEEDED') {
        setRouteError("Route is too long. Please try a shorter route.");
      } else {
        setRouteError("Unable to calculate route. Please check your input and try again.");
      }
    });
  };

  const handleRestart = () => {
    setOrigin("");
    setDestination("");
    setStops([]);
    setMake("");
    setModel("");
    setYear("");
    setFuelEfficiency("");
    setGasPrice("4.50");
    setCalculatedGasPrice("4.50");
    setGasPriceError("");
    setHasCalculated(false);
    setRouteError("");
    setRoutes([]);
    onShowMap(false);
    if (directionsRenderer) {
      directionsRenderer.setDirections(null);
    }
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
      {routeError && (
        <div className="error-message">
          {routeError}
        </div>
      )}
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
      <GasPriceInput
        gasPrice={gasPrice}
        onGasPriceChange={setGasPrice}
        onError={setGasPriceError}
      />
      {hasCalculated && selected && fuelEfficiency ? (
        <div className="cost-summary">
          <h3>Trip Summary</h3>
          <p><strong>Total Distance:</strong> {calculateTotalDistance(selected).toFixed(1)} miles</p>
          <p><strong>Estimated Gas Cost:</strong> ${calculateGasCost(
            calculateTotalDistance(selected),
            parseFloat(fuelEfficiency)
          ).toFixed(2)}</p>
          <p className="gas-price-note">Based on gas price: ${calculatedGasPrice}/gal</p>
        </div>
      ) : (
        <></>
      )}
      <div className="button-group">
        <button 
          className="calculate-button"
          onClick={getDirections}
          disabled={!origin || !destination || !fuelEfficiency || !!gasPriceError}
        >
          Calculate Gas Price
        </button>
        <button 
          className="restart-button"
          onClick={handleRestart}
        >
          Start Over
        </button>
      </div>
    </div>
  );
} 