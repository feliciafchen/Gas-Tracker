import React from 'react';
import { render, screen } from '@testing-library/react';
import { MapContainer } from './MapContainer';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

// Mock the Google Maps hooks and components
jest.mock('@vis.gl/react-google-maps', () => ({
  useMap: jest.fn(),
  useMapsLibrary: jest.fn(),
  Map: () => <div data-testid="mock-map" />
}));

// Mock the Directions component
jest.mock('../Directions', () => ({
  Directions: ({ onShowMap, showMap }: { onShowMap: (show: boolean) => void, showMap: boolean }) => (
    <div data-testid="mock-directions">
      <button onClick={() => onShowMap(!showMap)}>Toggle Map</button>
    </div>
  )
}));

describe('MapContainer', () => {
  const mockMap = {};

  beforeEach(() => {
    jest.clearAllMocks();
    (useMap as jest.Mock).mockReturnValue(mockMap);
    (useMapsLibrary as jest.Mock).mockReturnValue({
      DirectionsService: jest.fn(),
      DirectionsRenderer: jest.fn(),
    });
  });

  it('renders the map container', () => {
    render(<MapContainer />);
    
    const mapContainer = screen.getByTestId('map-container');
    expect(mapContainer).toBeInTheDocument();
  });

  it('initializes with the correct map options', () => {
    render(<MapContainer />);
    
    const mapContainer = screen.getByTestId('map-container');
    expect(mapContainer).toHaveStyle({
      width: '100%',
      height: '100%',
    });
  });

  it('renders the Directions component', () => {
    render(<MapContainer />);
    
    const directionsComponent = screen.getByTestId('mock-directions');
    expect(directionsComponent).toBeInTheDocument();
  });
}); 