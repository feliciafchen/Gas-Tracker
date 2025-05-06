import React from 'react';
import { render, screen } from '@testing-library/react';
import { MapContainer } from './MapContainer';
import { useMap } from '@vis.gl/react-google-maps';

// Mock the Google Maps hook
jest.mock('@vis.gl/react-google-maps', () => ({
  useMap: jest.fn(),
}));

describe('MapContainer', () => {
  const mockMap = {};

  beforeEach(() => {
    jest.clearAllMocks();
    (useMap as jest.Mock).mockReturnValue(mockMap);
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
}); 