import { useState, useEffect } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { RouteInput } from './RouteInput';
import './Directions.css';

export function Directions() {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
  const [routeIndex, setRouteIndex] = useState(0);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const selected = routes[routeIndex];
  const leg = selected?.legs[0];

  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({map}));
  }, [routesLibrary, map]);

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
      <h2>Route Information</h2>
      <RouteInput
        origin={origin}
        destination={destination}
        onOriginChange={setOrigin}
        onDestinationChange={setDestination}
        onSubmit={getDirections}
      />
      {selected ? (
        <div>
          <p><strong>Route:</strong> {selected.summary}</p>
          {leg && (
            <>
              <p><strong>Distance:</strong> {leg.distance?.text}</p>
              <p><strong>Duration:</strong> {leg.duration?.text}</p>
            </>
          )}
        </div>
      ) : (
        <p>Enter addresses to get directions</p>
      )}
    </div>
  );
} 