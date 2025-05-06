import React from 'react';

interface TripSummaryProps {
  selectedRoute: google.maps.DirectionsRoute;
  fuelEfficiency: string;
  calculatedGasPrice: string;
}

export function TripSummary({ selectedRoute, fuelEfficiency, calculatedGasPrice }: TripSummaryProps) {
  const calculateTotalDistance = (route: google.maps.DirectionsRoute) => {
    return route.legs.reduce((total, leg) => total + (leg.distance?.value || 0) * 0.000621371, 0);
  };

  const calculateGasCost = (distanceInMiles: number, mpg: number) => {
    const gallonsNeeded = distanceInMiles / mpg;
    return gallonsNeeded * parseFloat(calculatedGasPrice);
  };

  const totalDistance = calculateTotalDistance(selectedRoute);
  const gasCost = calculateGasCost(totalDistance, parseFloat(fuelEfficiency));

  return (
    <div className="cost-summary">
      <h3>Trip Summary</h3>
      <p><strong>Total Distance:</strong> {totalDistance.toFixed(1)} miles</p>
      <p><strong>Estimated Gas Cost:</strong> ${gasCost.toFixed(2)}</p>
      <p className="gas-price-note">Based on gas price: ${calculatedGasPrice}/gal</p>
    </div>
  );
} 