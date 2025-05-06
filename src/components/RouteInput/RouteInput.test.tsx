import { render, screen, fireEvent } from '@testing-library/react';
import { RouteInput } from './RouteInput';

describe('RouteInput', () => {
  const mockProps = {
    origin: '',
    destination: '',
    stops: [],
    onOriginChange: jest.fn(),
    onDestinationChange: jest.fn(),
    onStopsChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all input fields', () => {
    render(<RouteInput {...mockProps} />);
    
    expect(screen.getByPlaceholderText('Enter origin address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter destination address')).toBeInTheDocument();
    expect(screen.getByText('+ Add Stop')).toBeInTheDocument();
  });

  it('handles origin input change', () => {
    render(<RouteInput {...mockProps} />);
    
    const originInput = screen.getByPlaceholderText('Enter origin address');
    fireEvent.change(originInput, { target: { value: 'New York' } });
    
    expect(mockProps.onOriginChange).toHaveBeenCalledWith('New York');
  });

  it('handles destination input change', () => {
    render(<RouteInput {...mockProps} />);
    
    const destinationInput = screen.getByPlaceholderText('Enter destination address');
    fireEvent.change(destinationInput, { target: { value: 'Los Angeles' } });
    
    expect(mockProps.onDestinationChange).toHaveBeenCalledWith('Los Angeles');
  });

  it('adds a new stop when Add Stop button is clicked', () => {
    render(<RouteInput {...mockProps} />);
    
    const addStopButton = screen.getByText('+ Add Stop');
    fireEvent.click(addStopButton);
    
    expect(mockProps.onStopsChange).toHaveBeenCalledWith(['']);
  });

  it('removes a stop when remove button is clicked', () => {
    const propsWithStops = {
      ...mockProps,
      stops: ['Stop 1', 'Stop 2'],
    };
    
    render(<RouteInput {...propsWithStops} />);
    
    const removeButtons = screen.getAllByText('×');
    fireEvent.click(removeButtons[0]);
    
    expect(mockProps.onStopsChange).toHaveBeenCalledWith(['Stop 2']);
  });

  it('updates stop value when input changes', () => {
    const propsWithStops = {
      ...mockProps,
      stops: [''],
    };
    
    render(<RouteInput {...propsWithStops} />);
    
    const stopInput = screen.getByPlaceholderText('Stop 1');
    fireEvent.change(stopInput, { target: { value: 'New Stop' } });
    
    expect(mockProps.onStopsChange).toHaveBeenCalledWith(['New Stop']);
  });

  it('renders multiple stops correctly', () => {
    const propsWithStops = {
      ...mockProps,
      stops: ['Stop 1', 'Stop 2', 'Stop 3'],
    };
    
    render(<RouteInput {...propsWithStops} />);
    
    expect(screen.getByPlaceholderText('Stop 1')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Stop 2')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Stop 3')).toBeInTheDocument();
  });
}); 