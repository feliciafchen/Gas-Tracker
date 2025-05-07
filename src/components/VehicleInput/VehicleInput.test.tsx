import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { VehicleInput } from './VehicleInput';
import * as fuelEconomyApi from '../../services/fuelEconomyApi';

jest.mock('../../services/fuelEconomyApi');

const yearData = [
  { value: '2023', text: '2023' },
  { value: '2022', text: '2022' },
];

const makeData = [
  { value: 'Toyota', text: 'Toyota' },
  { value: 'Honda', text: 'Honda' },
]

describe('VehicleInput', () => {
  const mockGetYears = fuelEconomyApi.getYears as jest.Mock;
  const mockGetMakes = fuelEconomyApi.getMakes as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetYears.mockResolvedValue(yearData);
    mockGetMakes.mockResolvedValue(makeData);
  });

  it('allows user to select a year', async () => {
    const props = {
      make: '',
      model: '',
      year: '',
      fuelEfficiency: '',
      onYearChange: jest.fn(),
      onModelChange: jest.fn(),
      onMakeChange: jest.fn(),
      onFuelEfficiencyChange: jest.fn(),
    };

    render(<VehicleInput {...props} />);
    
    expect(mockGetYears).toHaveBeenCalled();
    
    await screen.findByText('2023');
    
    const yearDropdown = screen.getByLabelText('Year');
    fireEvent.change(yearDropdown, { target: { value: '2023' } });
    
    await waitFor(() => {
      expect(props.onYearChange).toHaveBeenCalledWith('2023');
    });
  });

  it('allows user to select a make if year is selected', async () => {
    // Mock both APIs
    const props = {
      make: '',
      model: '',
      year: '2023',
      fuelEfficiency: '',
      onYearChange: jest.fn(),
      onModelChange: jest.fn(),
      onMakeChange: jest.fn(),
      onFuelEfficiencyChange: jest.fn(),
    };

    render(<VehicleInput {...props} />);
    
    // Wait for make options to load
    await screen.findByText('Toyota');
    
    // Now it's safe to interact with the dropdown
    const makeDropdown = screen.getByLabelText('Make');
    fireEvent.change(makeDropdown, { target: { value: 'Toyota' } });
    
    await waitFor(() => {
      expect(props.onMakeChange).toHaveBeenCalledWith('Toyota');
    });
  });

});