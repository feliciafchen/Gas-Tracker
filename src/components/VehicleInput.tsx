import React from 'react';
import './Directions.css';

interface VehicleInputProps {
  make: string;
  model: string;
  year: string;
  fuelEfficiency: string;
  onMakeChange: (value: string) => void;
  onModelChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onFuelEfficiencyChange: (value: string) => void;
}

export function VehicleInput({
  make,
  model,
  year,
  fuelEfficiency,
  onMakeChange,
  onModelChange,
  onYearChange,
  onFuelEfficiencyChange
}: VehicleInputProps) {
  return (
    <div className="vehicle-form">
      <h3>Vehicle Information</h3>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="make">Make</label>
          <input
            type="text"
            id="make"
            value={make}
            onChange={(e) => onMakeChange(e.target.value)}
            placeholder="e.g., Toyota"
          />
        </div>
        <div className="form-group">
          <label htmlFor="model">Model</label>
          <input
            type="text"
            id="model"
            value={model}
            onChange={(e) => onModelChange(e.target.value)}
            placeholder="e.g., Corolla"
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="year">Year</label>
          <input
            type="text"
            id="year"
            value={year}
            onChange={(e) => onYearChange(e.target.value)}
            placeholder="e.g., 2020"
          />
        </div>
        <div className="form-group">
          <label htmlFor="fuelEfficiency">Fuel Efficiency (L/100km)</label>
          <input
            type="number"
            id="fuelEfficiency"
            value={fuelEfficiency}
            onChange={(e) => onFuelEfficiencyChange(e.target.value)}
            placeholder="e.g., 7.5"
            step="0.1"
          />
        </div>
      </div>
    </div>
  );
} 