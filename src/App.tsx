"use client"

import React from 'react';
import logo from './logo.svg';
import './App.css';
import { APIProvider, Map, useMapsLibrary, useMap } from '@vis.gl/react-google-maps';

function App() {
  const position = { lat: 43.6532, lng: -79.3832 }

  return (
    <div className="App" style={{height: "100vh", width: "100vw"}}>
      <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string}>
        <Map center={position} zoom={9}></Map>
      </APIProvider>
    </div>
  );
}

export default App;
