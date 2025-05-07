import React from 'react';
import { Map } from '@vis.gl/react-google-maps';
import { Directions } from '../Directions';

export function MapContainer() {
  const [showMap, setShowMap] = React.useState(false);

  return (
    <div 
      data-testid="map-container"
      style={{ width: '100%', height: '100%' }}
    >
      <div style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        visibility: showMap ? 'visible' : 'hidden',
        opacity: showMap ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out'
      }}>
        <Map 
          mapId={process.env.GOOGLE_MAP_ID as string}
        />
      </div>
      <Directions onShowMap={setShowMap} showMap={showMap} />
    </div>
  );
} 