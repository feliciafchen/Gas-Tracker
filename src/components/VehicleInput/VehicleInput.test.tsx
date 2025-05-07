import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VehicleInput } from './VehicleInput';
import * as fuelEconomyApi from '../../services/fuelEconomyApi';

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

}); 