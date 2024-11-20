import React, { useRef, useState, useEffect } from 'react';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxCircle from 'mapbox-gl-circle';

const MapCircle = () => {
  const mapRef = useRef();
  const [view, setView] = useState({
    longitude: 10,
    latitude: 30,
    zoom: 1.9,
  });
  const [lanlat, setLanlat] = useState(null);
  
  useEffect(() => {
    let myCircle;

    if (mapRef.current && lanlat) {
      const map = mapRef.current.getMap();
      myCircle = new MapboxCircle([lanlat.lng, lanlat.lat], 100000, {
        editable: true,
        minRadius: 1500,
        fillColor: '#29AB87',
      });
      myCircle.addTo(map);
    }
    return () => {
      if (myCircle) {
        myCircle.remove();
      }
    };
  }, [lanlat]);

  function handleClick(evt) {
    const lngLat = evt.lngLat;
    setLanlat({
      lng: lngLat.lng,
      lat: lngLat.lat,
    });
    setView({
        longitude:lngLat.lng,
        latitude:lngLat.lat,
        zoom:4.5,
    })
}

  return (
    <>
      <Map
        style={{ width: '100%', height: '100vh' }}
        ref={mapRef}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken="pk.eyJ1IjoiYWRoaXRoeWFhMzEiLCJhIjoiY2x4eW83ZzBlMDJrMjJrcXZ2ZHZ4cGFhNSJ9.oKfx4UDtPP-AQPz_UCi8zg"
        {...view}
        onMove={(e) => setView(e.viewState)}
        onClick={handleClick}
      >
        {lanlat && <Marker longitude={lanlat.lng} latitude={lanlat.lat} />}
      </Map>
    </>
  );
};

export default MapCircle;
