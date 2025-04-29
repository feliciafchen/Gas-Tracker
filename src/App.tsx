import React from 'react';
import './App.css';
import { APIProvider } from '@vis.gl/react-google-maps';
import { MapContainer } from './components/MapContainer';

function App() {
  const position = { lat: 43.6532, lng: -79.3832 };

  return (
    <div className="App" style={{height: "100vh", width: "100%"}}>
      <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string}>
        <MapContainer />
      </APIProvider>
    </div>
  );
}

export default App;
