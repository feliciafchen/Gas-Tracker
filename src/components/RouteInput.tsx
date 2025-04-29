import React from 'react';
import './Directions.css';

interface RouteInputProps {
  origin: string;
  destination: string;
  onOriginChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
}

export function RouteInput({ 
  origin, 
  destination, 
  onOriginChange, 
  onDestinationChange,
}: RouteInputProps) {
  return (
    <div className="directions-form">
      <input
        type="text"
        placeholder="Enter origin address"
        value={origin}
        onChange={(e) => onOriginChange(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter destination address"
        value={destination}
        onChange={(e) => onDestinationChange(e.target.value)}
      />
    </div>
  );
} 