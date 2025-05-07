import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Directions } from './Directions';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

jest.mock('@vis.gl/react-google-maps', () => ({
  useMap: jest.fn(),
  useMapsLibrary: jest.fn(),
}));

jest.mock('./RouteInput/RouteInput', () => ({
  RouteInput: ({ onOriginChange, onDestinationChange }: any) => (
    <div>
      <input
        placeholder="Enter origin address"
        onChange={(e) => onOriginChange(e.target.value)}
      />
      <input
        placeholder="Enter destination address"
        onChange={(e) => onDestinationChange(e.target.value)}
      />
    </div>
  ),
}));

jest.mock('./VehicleInput/VehicleInput', () => ({
  VehicleInput: ({ onFuelEfficiencyChange }: any) => (
    <div>
      <input
        type="number"
        placeholder="Fuel Efficiency"
        onChange={(e) => onFuelEfficiencyChange(e.target.value)}
      />
    </div>
  ),
}));

jest.mock('./GasPriceInput/GasPriceInput', () => ({
  GasPriceInput: ({ gasPrice, onGasPriceChange }: any) => (
    <div>
      <label htmlFor="gasPrice">Gas Price (USD/gal)</label>
      <input
        type="number"
        id="gasPrice"
        value={gasPrice}
        onChange={(e) => onGasPriceChange(e.target.value)}
      />
    </div>
  ),
}));

const mockDirectionsService = {
  route: jest.fn(),
};

const mockDirectionsRenderer = {
  setDirections: jest.fn(),
};

const mockMap = null;

describe('Directions', () => {
  const mockProps = {
      onShowMap: jest.fn(),
      showMap: false
  }

  beforeEach(() => {
    jest.clearAllMocks();
  })

  it('renders', () => {
    render(<Directions {...mockProps}/>);
  })
})