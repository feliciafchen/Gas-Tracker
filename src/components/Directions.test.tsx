import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Directions } from './Directions';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

jest.mock('@vis.gl/react-google-maps', () => ({
  useMap: jest.fn(),
  useMapsLibrary: jest.fn(),
}));

const mockDirectionsService = {
  route: jest.fn(),
};

const mockDirectionsRenderer = {
  setDirections: jest.fn(),
};

const mockMap = {};

describe('Directions', () => {
  const mockProps = {
    onShowMap: jest.fn(),
    showMap: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useMap as jest.Mock).mockReturnValue(mockMap);
    (useMapsLibrary as jest.Mock).mockReturnValue({
      DirectionsService: jest.fn(() => mockDirectionsService),
      DirectionsRenderer: jest.fn(() => mockDirectionsRenderer),
    });
  });

  it('renders all form elements', () => {
    render(<Directions {...mockProps} />);
    
    expect(screen.getByText('Gas Cost Calculator')).toBeInTheDocument();
    expect(screen.getByLabelText('Gas Price (USD/gal)')).toBeInTheDocument();
    expect(screen.getByText('Calculate Gas Price')).toBeInTheDocument();
  });

  it('initializes with default gas price', () => {
    render(<Directions {...mockProps} />);
    
    const gasPriceInput = screen.getByLabelText('Gas Price (USD/gal)');
    expect(gasPriceInput).toHaveValue(1.5);
  });

  it('updates gas price when input changes', async () => {
    render(<Directions {...mockProps} />);
    
    const gasPriceInput = screen.getByLabelText('Gas Price (USD/gal)');
    await userEvent.clear(gasPriceInput);
    await userEvent.type(gasPriceInput, '3.50');
    
    expect(gasPriceInput).toHaveValue(3.5);
  });

  it('disables calculate button when required fields are empty', () => {
    render(<Directions {...mockProps} />);
    
    const calculateButton = screen.getByText('Calculate Gas Price');
    expect(calculateButton).toBeDisabled();
  });

  it('enables calculate button when all required fields are filled', async () => {
    render(<Directions {...mockProps} />);
    
    const originInput = screen.getByPlaceholderText('Enter origin address');
    const destinationInput = screen.getByPlaceholderText('Enter destination address');
    const gasPriceInput = screen.getByLabelText('Gas Price (USD/gal)');
    
    await userEvent.type(originInput, 'New York');
    await userEvent.type(destinationInput, 'Los Angeles');
    await userEvent.clear(gasPriceInput);
    await userEvent.type(gasPriceInput, '3.50');
    
    const mockRoute = {
      legs: [
        { distance: { value: 100000 } }, // 100km in meters
      ],
    };
    
    mockDirectionsService.route.mockResolvedValue({
      routes: [mockRoute],
    });
    
    const mockFuelEfficiency = '30';
    const mockVehicleDetails = {
      fuelEfficiency: parseFloat(mockFuelEfficiency),
    };
    
    const mockVehicleInput = {
      make: 'Toyota',
      model: 'Camry',
      year: '2023',
      fuelEfficiency: mockFuelEfficiency,
    };
    
    const calculateButton = screen.getByText('Calculate Gas Price');
    await userEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(mockDirectionsService.route).toHaveBeenCalledWith({
        origin: 'New York',
        destination: 'Los Angeles',
        waypoints: [],
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      });
    });
  });

  it('shows trip summary when route is calculated', async () => {
    render(<Directions {...mockProps} />);
    
    const originInput = screen.getByPlaceholderText('Enter origin address');
    const destinationInput = screen.getByPlaceholderText('Enter destination address');
    
    await userEvent.type(originInput, 'New York');
    await userEvent.type(destinationInput, 'Los Angeles');
    
    const mockRoute = {
      legs: [
        { distance: { value: 100000 } }, // 100km in meters
      ],
    };
    
    mockDirectionsService.route.mockResolvedValue({
      routes: [mockRoute],
    });
    
    const mockFuelEfficiency = '30';
    const mockVehicleDetails = {
      fuelEfficiency: parseFloat(mockFuelEfficiency),
    };
    
    const mockVehicleInput = {
      make: 'Toyota',
      model: 'Camry',
      year: '2023',
      fuelEfficiency: mockFuelEfficiency,
    };
    
    const calculateButton = screen.getByText('Calculate Gas Price');
    await userEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText('Trip Summary')).toBeInTheDocument();
      expect(screen.getByText(/Total Distance:/)).toBeInTheDocument();
      expect(screen.getByText(/Estimated Gas Cost:/)).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<Directions {...mockProps} />);
    
    const originInput = screen.getByPlaceholderText('Enter origin address');
    const destinationInput = screen.getByPlaceholderText('Enter destination address');
    
    await userEvent.type(originInput, 'New York');
    await userEvent.type(destinationInput, 'Los Angeles');
    
    mockDirectionsService.route.mockRejectedValue(new Error('API Error'));
    
    const calculateButton = screen.getByText('Calculate Gas Price');
    await userEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error getting directions:', expect.any(Error));
    });
    
    consoleErrorSpy.mockRestore();
  });
}); 