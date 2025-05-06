import { useEffect, useState } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

interface DirectionsMapProps {
  origin: string;
  destination: string;
  stops: string[];
  onRoutesChange: (routes: google.maps.DirectionsRoute[]) => void;
  onError: (error: string) => void;
}

export function DirectionsMap({ origin, destination, stops, onRoutesChange, onError }: DirectionsMapProps) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();

  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({map}));
  }, [routesLibrary, map]);

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
        onRoutesChange(response.routes);
      }
    })
    .catch((error) => {
      console.error('Error getting directions:', error);
      onRoutesChange([]);
      handleRouteError(error);
    });
  };

  const handleRouteError = (error: any) => {
    switch (error.status) {
      case 'ZERO_RESULTS':
        onError("No route found. Please check your addresses and try again.");
        break;
      case 'NOT_FOUND':
        onError("One or more addresses could not be found. Please check your input.");
        break;
      case 'MAX_ROUTE_LENGTH_EXCEEDED':
        onError("Route is too long. Please try a shorter route.");
        break;
      default:
        onError("Unable to calculate route. Please check your input and try again.");
    }
  };

  useEffect(() => {
    if (origin && destination) {
      getDirections();
    }
  }, [origin, destination, stops]);

  return null;
} 