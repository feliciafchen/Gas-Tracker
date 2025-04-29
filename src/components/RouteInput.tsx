import React from 'react';
import './Directions.css';

interface RouteInputProps {
  origin: string;
  destination: string;
  onOriginChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
  onSubmit: () => void;
}

export function RouteInput({ 
  origin, 
  destination, 
  onOriginChange, 
  onDestinationChange,
  onSubmit 
}: RouteInputProps) {
  return (
    <form className="directions-form" onSubmit={(e) => {
      e.preventDefault();
      onSubmit();
    }}>
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
      <button type="submit">Get Directions</button>
    </form>
  );
} 