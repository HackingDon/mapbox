import React from 'react'
import './App.css'
import Map from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
function App() {
  return (
    <>
    <Map
     style={{width: '100%', height: '100vh'}}
     mapStyle="mapbox://styles/mapbox/streets-v9"
     mapboxAccessToken="pk.eyJ1IjoiYWRoaXRoeWFhMzEiLCJhIjoiY2x4eW83ZzBlMDJrMjJrcXZ2ZHZ4cGFhNSJ9.oKfx4UDtPP-AQPz_UCi8zg"
    ></Map>
    </>
  )
}

export default App
