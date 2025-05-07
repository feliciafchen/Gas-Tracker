import React, { useEffect, useRef } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import '../Directions.css';

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
  const placesLibrary = useMapsLibrary('places');
  const originInputRef = useRef<HTMLInputElement>(null);
  const destinationInputRef = useRef<HTMLInputElement>(null);
  const stopsInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!placesLibrary) return;

    // initializing da autocomplete for origin
    if (originInputRef.current) {
      const originAutocomplete = new placesLibrary.Autocomplete(originInputRef.current, {
        fields: ['formatted_address', 'geometry', 'name']
      });

      originAutocomplete.addListener('place_changed', () => {
        const place = originAutocomplete.getPlace();
        if (place.formatted_address) {
          onOriginChange(place.formatted_address);
        } else if (place.name) {
          onOriginChange(place.name);
        }
      });
    }

    // destination
    if (destinationInputRef.current) {
      const destinationAutocomplete = new placesLibrary.Autocomplete(destinationInputRef.current, {
        fields: ['formatted_address', 'geometry', 'name']
      });

      destinationAutocomplete.addListener('place_changed', () => {
        const place = destinationAutocomplete.getPlace();
        if (place.formatted_address) {
          onDestinationChange(place.formatted_address);
        } else if (place.name) {
          onDestinationChange(place.name);
        }
      });
    }

    // stops
    stopsInputRefs.current.forEach((inputRef, index) => {
      if (inputRef) {
        const stopAutocomplete = new placesLibrary.Autocomplete(inputRef, {
          fields: ['formatted_address', 'geometry', 'name']
        });

        stopAutocomplete.addListener('place_changed', () => {
          const place = stopAutocomplete.getPlace();
          if (place.formatted_address) {
            const newStops = [...stops];
            newStops[index] = place.formatted_address;
            onStopsChange(newStops);
          } else if (place.name) {
            const newStops = [...stops];
            newStops[index] = place.name;
            onStopsChange(newStops);
          }
        });
      }
    });
  }, [placesLibrary, stops, onOriginChange, onDestinationChange, onStopsChange]);

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
        ref={originInputRef}
        type="text"
        placeholder="Enter origin (address, restaurant, etc.)"
        value={origin}
        onChange={(e) => onOriginChange(e.target.value)}
      />
      
      {stops.map((stop, index) => (
        <div key={index} className="stop-input">
          <input
            ref={(el) => {
              stopsInputRefs.current[index] = el;
            }}
            type="text"
            placeholder={`Stop ${index + 1} (address, restaurant, etc.)`}
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
        ref={destinationInputRef}
        type="text"
        placeholder="Enter destination (address, restaurant, etc.)"
        value={destination}
        onChange={(e) => onDestinationChange(e.target.value)}
      />
    </div>
  );
} 