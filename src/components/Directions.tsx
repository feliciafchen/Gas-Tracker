import { useState, useEffect } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

export function Directions() {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
  const [routeIndex, setRouteIndex] = useState(0);
  const selected = routes[routeIndex];
  const leg = selected?.legs[0];

  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({map}));
  }, [routesLibrary, map]);

  useEffect(() => {
    if(!directionsService || !directionsRenderer) return;

    directionsService.route({
      origin: "100 Front St, Toronto ON",
      destination: "500 College St, Toronto ON",
      travelMode: google.maps.TravelMode.DRIVING,
      provideRouteAlternatives: true
    })
    .then((response) => {
      directionsRenderer.setDirections(response);
      setRoutes(response.routes);
    })
  }, [directionsService, directionsRenderer]);

  console.log(routes)

  if (!leg) return null;

  console.log(selected);

  return null;
} 