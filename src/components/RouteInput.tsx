import React from 'react';
import './Directions.css';

interface RouteInputProps {
  origin: string;
  destination: string;
  stops: string[];
  onOriginChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
  onStopsChange: (stops: string[]) => void;
}

export function RouteInput({ 
  origin, 
  destination,
  stops,
  onOriginChange, 
  onDestinationChange,
  onStopsChange,
}: RouteInputProps) {
  const addStop = () => {
    onStopsChange([...stops, '']);
  };

  const removeStop = (index: number) => {
    const newStops = stops.filter((_, i) => i !== index);
    onStopsChange(newStops);
  };

  const updateStop = (index: number, value: string) => {
    const newStops = [...stops];
    newStops[index] = value;
    onStopsChange(newStops);
  };

  return (
    <div className="directions-form">
      <input
        type="text"
        placeholder="Enter origin address"
        value={origin}
        onChange={(e) => onOriginChange(e.target.value)}
      />
      
      {stops.map((stop, index) => (
        <div key={index} className="stop-input">
          <input
            type="text"
            placeholder={`Stop ${index + 1}`}
            value={stop}
            onChange={(e) => updateStop(index, e.target.value)}
          />
          <button 
            type="button" 
            className="remove-stop"
            onClick={() => removeStop(index)}
          >
            ×
          </button>
        </div>
      ))}

      <button 
        type="button" 
        className="add-stop"
        onClick={addStop}
      >
        + Add Stop
      </button>

      <input
        type="text"
        placeholder="Enter destination address"
        value={destination}
        onChange={(e) => onDestinationChange(e.target.value)}
      />
    </div>
  );
} 