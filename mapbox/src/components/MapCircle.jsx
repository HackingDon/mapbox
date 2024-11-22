import React, { useRef, useState, useEffect } from "react";
import Map, { Marker, NavigationControl, Source, Layer } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxCircle from "mapbox-gl-circle";
import { Geocoder } from "@mapbox/search-js-react";
import bbox from '@turf/bbox'
import * as turf from "@turf/turf";

const MapCircle = () => {
  const mapRef = useRef();
  const [polygon,setPolygon] = useState();
  // const [country,setCountry] = useState([])
  const [inputValue, setInputValue] = useState("");
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
    const features =evt.features;
    const bounds = bbox({
      type: "FeatureCollection",
      features: [features[0]],
    });
    mapRef.current.fitBounds(bounds, { padding: 20 });
    setPolygon({
      type: "FeatureCollection",
      features: [features[0]],
    })
    setLanlat({
      lng: lngLat.lng,
      lat: lngLat.lat,
    });
  }
  function Reset() {
    setView({
      longitude: 10,
      latitude: 30,
      zoom: 1.9,
    });
  }
  setInterval(()=>{
    if (myCircle) {
      const radius = myCircle.getRadius() / 1000; 
      const center = myCircle.getCenter();

      const updatedGeoJSON = turf.circle([center.lng, center.lat], radius, {
        steps: 3,
        units: "kilometers",
      })
      // updatedGeoJSON.geometry.coordinates[0].map((data)=>{
      //   fetchCountry(data[1],data[0])
      // })
    }
  },5000)
  // const fetchCountry = async (lat, lng) => {
  //   const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${"pk.eyJ1IjoiYWRoaXRoeWFhMzEiLCJhIjoiY2x4eW83ZzBlMDJrMjJrcXZ2ZHZ4cGFhNSJ9.oKfx4UDtPP-AQPz_UCi8zg"}&types=country`;

  //   try {
  //     const response = await fetch(url);
  //     const data = await response.json();
  //     if (data.features && data.features.length > 0) {
  //       const countryName = data.features[0].place_name;
  //       !country.includes(countryName)?setCountry(prev=>[...prev,countryName]):'';
  //     }
  //   } catch (error) {
  //     console.error('Error fetching country info:', error);
  //   }
  // };
  // const fetchBoundingBox = async (countryName) => {
  //   try {
  //     const response = await fetch(
  //       `https://nominatim.openstreetmap.org/search?q=${countryName}&format=json&polygon_geojson=1`
  //     );
  //     const data = await response.json();
  //     if (data[0]?.geojson) {
  //       setPolygon((prev)=>({
  //         ...prev,
  //         feature:[...prev.feature,{
  //           type:"Feature",
  //           geometry:data[0].geojson
  //         }]
  //       }))
  //     }
  //   } catch (error) {
  //     console.error("Error fetching bounding box:", error);
  //   }
  // };
  // useEffect(()=>{
  //   setCombineddata({
  //     type:'FeatureCollection',
  //     features:polygon,
  //   })
  // },[polygon])
  // console.log(polygon)
  //   useEffect(()=>{
  //     country.forEach((con)=>{
  //       fetchBoundingBox(con)
  //     })
  //   },[country])


  return (
    <>
      <Map
        style={{ width: "100%", height: "100vh" }}
        ref={mapRef}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken="pk.eyJ1IjoiYWRoaXRoeWFhMzEiLCJhIjoiY2x4eW83ZzBlMDJrMjJrcXZ2ZHZ4cGFhNSJ9.oKfx4UDtPP-AQPz_UCi8zg"
        {...view}
        onMove={(e) => setView(e.viewState)}
        interactiveLayerIds={['countries-layer']} 
        onClick={handleClick}
      >
        <div style={{ width: "300px" }}>
          <Geocoder
            accessToken="pk.eyJ1IjoiYWRoaXRoeWFhMzEiLCJhIjoiY2x4eW83ZzBlMDJrMjJrcXZ2ZHZ4cGFhNSJ9.oKfx4UDtPP-AQPz_UCi8zg"
            map={mapRef.current}
            options={{
              language: "en",
            }}
            value={inputValue}
            onChange={(d) => {
              setInputValue(d);
            }}
          />
        </div>

        <Source
          id="countries"
          type="geojson"
          data="https://raw.githubusercontent.com/datasets/geo-boundaries-world-110m/master/countries.geojson"
        >
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
          <NavigationControl showCompass={true} showZoom={true} />
        </div>
        {lanlat && <Marker longitude={lanlat.lng} latitude={lanlat.lat} />}
        {polygon && <Source type="geojson" data={polygon}>
          <Layer
            type="fill"
            paint={{
              "fill-color": "#000",
              "fill-opacity": 0.5,
            }}
          />
        </Source>}
      </Map>
    </>
  );
};

export default MapCircle;
