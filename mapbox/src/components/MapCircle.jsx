import React, { useRef, useState, useEffect } from "react";
import Map, { Marker, NavigationControl,Source,Layer } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxCircle from "mapbox-gl-circle";
import * as turf from "@turf/turf";

const MapCircle = () => {
  const mapRef = useRef();
  const [view, setView] = useState({
    longitude: 10,
    latitude: 30,
    zoom: 1.9,
  });
  const [lanlat, setLanlat] = useState(null);
  let myCircle;
  const map = mapRef.current?.getMap();
  useEffect(() => {
    if (mapRef.current && lanlat) {
      myCircle = new MapboxCircle([lanlat.lng, lanlat.lat], 100000, {
        editable: true,
        minRadius: 1500,
        fillColor: "#29AB87",
      });
      // radius = myCircle.getRadius() /1000;
      // center = myCircle.getCenter()
      myCircle.addTo(map);
    } 
    return () => {
      if (myCircle) {
        myCircle.remove();
      }
    };
  }, [lanlat]);
  // setInterval(()=>{
  //   if(myCircle){
  //     const updatedRadius = myCircle.getRadius() / 1000; // Convert to kilometers
  //   const updatedCenter = myCircle.getCenter();
  //   if( radius != updatedRadius){
  //     const updatedGeoJSON = turf.circle([updatedCenter.lng, updatedCenter.lat], updatedRadius, {
  //       steps: 3,
  //       units: "kilometers",
  //     });
  //     radius = updatedRadius
  //     // console.log("Circle GeoJSON:", updatedGeoJSON.geometry.coordinates[0][22][0]);
  //     fetchCountry(updatedGeoJSON.geometry.coordinates[0][2][1],updatedGeoJSON.geometry.coordinates[0][2][0])
  //   }
  //   }
  // },500)

  function handleClick(evt) {
    const lngLat = evt.lngLat;
    setLanlat({
      lng: lngLat.lng,
      lat: lngLat.lat,
    });
    setView({
      longitude: lngLat.lng,
      latitude: lngLat.lat,
      zoom: 4.5,
    });
  }
  function Reset() {
    setView({
      longitude: 10,
      latitude: 30,
      zoom: 1.9,
    });
  }
  return (
    <>
      <Map
        style={{ width: "100%", height: "100vh" }}
        ref={mapRef}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken="pk.eyJ1IjoiYWRoaXRoeWFhMzEiLCJhIjoiY2x4eW83ZzBlMDJrMjJrcXZ2ZHZ4cGFhNSJ9.oKfx4UDtPP-AQPz_UCi8zg"
        {...view}
        onMove={(e) => setView(e.viewState)}
        onClick={handleClick}
      >
        <Source id="countries" type="geojson" data="https://raw.githubusercontent.com/datasets/geo-boundaries-world-110m/master/countries.geojson" >
    <Layer
              id="countries-layer"
              type="fill"
              paint={{
                "fill-color": "#fff",
                "fill-opacity": 0,
              }}
            />
    </Source>
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <button
            style={{
              position: "relative",
              top: 90,
              padding: 5,
              backgroundColor: "#fff",
              border: "none",
              borderRadius: 5,
              boxShadow: "inset 1px 1px 2px gray,1px 1px 2px gray",
              cursor: "pointer",
            }}
            onClick={Reset}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-arrow-clockwise"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"
              />
              <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
            </svg>
          </button>
          <NavigationControl />
        </div>
        {lanlat && <Marker longitude={lanlat.lng} latitude={lanlat.lat} />}
      </Map>
    </>
  );
};

export default MapCircle;
