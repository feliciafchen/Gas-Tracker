import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VehicleInput } from './VehicleInput';
import * as fuelEconomyApi from '../../services/fuelEconomyApi';

// Mock the API functions
jest.mock('../../services/fuelEconomyApi', () => ({
  getYears: jest.fn(),
  getMakes: jest.fn(),
  getModels: jest.fn(),
  getVehicleDetails: jest.fn(),
}));

describe('VehicleInput', () => {
  const mockProps = {
    make: '',
    model: '',
    year: '',
    fuelEfficiency: '',
    onMakeChange: jest.fn(),
    onModelChange: jest.fn(),
    onYearChange: jest.fn(),
    onFuelEfficiencyChange: jest.fn(),
  };

  const mockYears = [
    { value: '2023', text: '2023' },
    { value: '2022', text: '2022' },
  ];

  const mockMakes = [
    { value: 'Toyota', text: 'Toyota' },
    { value: 'Honda', text: 'Honda' },
  ];

  const mockModels = [
    { value: 'Camry', text: 'Camry' },
    { value: 'Corolla', text: 'Corolla' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (fuelEconomyApi.getYears as jest.Mock).mockResolvedValue(mockYears);
    (fuelEconomyApi.getMakes as jest.Mock).mockResolvedValue(mockMakes);
    (fuelEconomyApi.getModels as jest.Mock).mockResolvedValue(mockModels);
    (fuelEconomyApi.getVehicleDetails as jest.Mock).mockResolvedValue({
      fuelEfficiency: 30.5,
    });
  });

  it('renders all form elements', async () => {
    render(<VehicleInput {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Vehicle Information')).toBeInTheDocument();
      expect(screen.getByLabelText('Year')).toBeInTheDocument();
      expect(screen.getByLabelText('Make')).toBeInTheDocument();
      expect(screen.getByLabelText('Model')).toBeInTheDocument();
      expect(screen.getByText('Select vehicle')).toBeInTheDocument();
    });
  });

  it('loads years on mount', async () => {
    render(<VehicleInput {...mockProps} />);
    
    await waitFor(() => {
      expect(fuelEconomyApi.getYears).toHaveBeenCalled();
    });
    
    const yearSelect = screen.getByLabelText('Year');
    expect(yearSelect).toHaveTextContent('2023');
    expect(yearSelect).toHaveTextContent('2022');
  });

  it('loads makes when year is selected', async () => {
    render(<VehicleInput {...mockProps} />);
    
    await waitFor(() => {
      expect(fuelEconomyApi.getYears).toHaveBeenCalled();
    });
    
    const yearSelect = screen.getByLabelText('Year');
    await userEvent.selectOptions(yearSelect, '2023');
    
    await waitFor(() => {
      expect(fuelEconomyApi.getMakes).toHaveBeenCalledWith('2023');
    });
    
    const makeSelect = screen.getByLabelText('Make');
    expect(makeSelect).toHaveTextContent('Toyota');
    expect(makeSelect).toHaveTextContent('Honda');
  });

  it('loads models when make is selected', async () => {
    render(<VehicleInput {...mockProps} />);
    
    await waitFor(() => {
      expect(fuelEconomyApi.getYears).toHaveBeenCalled();
    });
    
    const yearSelect = screen.getByLabelText('Year');
    await userEvent.selectOptions(yearSelect, '2023');
    
    await waitFor(() => {
      expect(fuelEconomyApi.getMakes).toHaveBeenCalledWith('2023');
    });
    
    const makeSelect = screen.getByLabelText('Make');
    await userEvent.selectOptions(makeSelect, 'Toyota');
    
    await waitFor(() => {
      expect(fuelEconomyApi.getModels).toHaveBeenCalledWith('2023', 'Toyota');
    });
    
    const modelSelect = screen.getByLabelText('Model');
    expect(modelSelect).toHaveTextContent('Camry');
    expect(modelSelect).toHaveTextContent('Corolla');
  });

  it('fetches vehicle details when model is selected', async () => {
    render(<VehicleInput {...mockProps} />);
    
    await waitFor(() => {
      expect(fuelEconomyApi.getYears).toHaveBeenCalled();
    });
    
    const yearSelect = screen.getByLabelText('Year');
    await userEvent.selectOptions(yearSelect, '2023');
    
    await waitFor(() => {
      expect(fuelEconomyApi.getMakes).toHaveBeenCalledWith('2023');
    });
    
    const makeSelect = screen.getByLabelText('Make');
    await userEvent.selectOptions(makeSelect, 'Toyota');
    
    await waitFor(() => {
      expect(fuelEconomyApi.getModels).toHaveBeenCalledWith('2023', 'Toyota');
    });
    
    const modelSelect = screen.getByLabelText('Model');
    await userEvent.selectOptions(modelSelect, 'Camry');
    
    await waitFor(() => {
      expect(fuelEconomyApi.getVehicleDetails).toHaveBeenCalledWith('2023', 'Toyota', 'Camry');
    });
    
    expect(screen.getByText('30.5 MPG')).toBeInTheDocument();
  });

  it('disables make select when no year is selected', async () => {
    render(<VehicleInput {...mockProps} />);
    
    await waitFor(() => {
      expect(fuelEconomyApi.getYears).toHaveBeenCalled();
    });
    
    const makeSelect = screen.getByLabelText('Make');
    expect(makeSelect).toBeDisabled();
  });

  it('disables model select when no make is selected', async () => {
    render(<VehicleInput {...mockProps} />);
    
    await waitFor(() => {
      expect(fuelEconomyApi.getYears).toHaveBeenCalled();
    });
    
    const modelSelect = screen.getByLabelText('Model');
    expect(modelSelect).toBeDisabled();
  });

  it('handles API errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (fuelEconomyApi.getYears as jest.Mock).mockRejectedValue(new Error('API Error'));
    
    render(<VehicleInput {...mockProps} />);
    
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching years:', expect.any(Error));
    });
    
    consoleErrorSpy.mockRestore();
  });
}); 