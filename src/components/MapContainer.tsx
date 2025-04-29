import { Map } from '@vis.gl/react-google-maps';
import { Directions } from './Directions';

export function MapContainer() {
  return (
    <Map 
      mapId={process.env.GOOGLE_MAP_ID as string}
    >
      <Directions />
    </Map>
  );
} 