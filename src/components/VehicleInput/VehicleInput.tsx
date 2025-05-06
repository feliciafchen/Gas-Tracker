import React, { useEffect, useState } from 'react';
import './Directions.css';
import { getYears, getMakes, getModels, getVehicleDetails, MenuItem } from '../../services/fuelEconomyApi';

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
  const [years, setYears] = useState<MenuItem[]>([]);
  const [makes, setMakes] = useState<MenuItem[]>([]);
  const [models, setModels] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const yearsData = await getYears();
        setYears(yearsData);
      } catch (error) {
        console.error('Error fetching years:', error);
      }
    };
    fetchYears();
  }, []);

  useEffect(() => {
    const fetchMakes = async () => {
      if (!year) return;
      setLoading(true);
      try {
        const makesData = await getMakes(year);
        setMakes(makesData);
        setModels([]);
        onMakeChange('');
        onModelChange('');
      } catch (error) {
        console.error('Error fetching makes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMakes();
  }, [year, onMakeChange, onModelChange]);

  useEffect(() => {
    const fetchModels = async () => {
      if (!year || !make) return;
      setLoading(true);
      try {
        const modelsData = await getModels(year, make);
        setModels(modelsData);
        onModelChange('');
      } catch (error) {
        console.error('Error fetching models:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchModels();
  }, [year, make, onModelChange]);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      if (!year || !make || !model) return;
      setLoading(true);
      try {
        const details = await getVehicleDetails(year, make, model);
        onFuelEfficiencyChange(details.fuelEfficiency.toFixed(1));
      } catch (error) {
        console.error('Error fetching vehicle details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicleDetails();
  }, [year, make, model, onFuelEfficiencyChange]);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onYearChange(e.target.value);
  };

  const handleMakeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onMakeChange(e.target.value);
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onModelChange(e.target.value);
  };

  return (
    <div className="vehicle-form">
      <h3>Vehicle Information</h3>
      <div className="form-row">
        <div className="form-group vehicle-selection">
          <div className="select-group">
            <label htmlFor="year">Year</label>
            <select
              id="year"
              value={year}
              onChange={handleYearChange}
              disabled={loading}
            >
              <option value="">Select Year</option>
              {years.map((yearItem) => (
                <option key={yearItem.value} value={yearItem.value}>
                  {yearItem.text}
                </option>
              ))}
            </select>
          </div>
          <div className="select-group">
            <label htmlFor="make">Make</label>
            <select
              id="make"
              value={make}
              onChange={handleMakeChange}
              disabled={!year || loading}
            >
              <option value="">Select Make</option>
              {makes.map((makeItem) => (
                <option key={makeItem.value} value={makeItem.value}>
                  {makeItem.text}
                </option>
              ))}
            </select>
          </div>
          <div className="select-group">
            <label htmlFor="model">Model</label>
            <select
              id="model"
              value={model}
              onChange={handleModelChange}
              disabled={!make || loading}
            >
              <option value="">Select Model</option>
              {models.map((modelItem) => (
                <option key={modelItem.value} value={modelItem.value}>
                  {modelItem.text}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-group fuel-efficiency">
          <label htmlFor="fuelEfficiency">Fuel Efficiency</label>
          <div className="fuel-efficiency-display">
            {fuelEfficiency ? `${fuelEfficiency} MPG` : 'Select vehicle'}
          </div>
        </div>
      </div>
    </div>
  );
} 