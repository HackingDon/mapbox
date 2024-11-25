import React, { useRef, useState, useEffect } from "react";
import Map, { Marker, NavigationControl, Source, Layer } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxCircle from "mapbox-gl-circle";
import { Geocoder } from "@mapbox/search-js-react";
import bbox from "@turf/bbox";
import * as turf from "@turf/turf";

const MapCircle = () => {
  const mapRef = useRef();
  const [polygon, setPolygon] = useState({
    type: "FeatureCollection",
    features: [],
  });
  const [country, setCountry] = useState([]);
  const [geojson, setGeojson] = useState();
  const [inputValue, setInputValue] = useState("");
  const [view, setView] = useState({
    longitude: 10,
    latitude: 30,
    zoom: 1.9,
  });
  const [lanlat, setLanlat] = useState(null);
  let myCircle, radius, center, features;
  const map = mapRef.current?.getMap();
  useEffect(() => {
    if (mapRef.current && lanlat) {
      myCircle = new MapboxCircle([lanlat.lng, lanlat.lat], 100000, {
        editable: true,
        minRadius: 1500,
        fillColor: "#29AB87",
      });
      myCircle.addTo(map);
      radius = myCircle.getRadius() / 1000;
      center = myCircle.getCenter();
      const updatedGeoJSON = turf.circle([center.lng, center.lat], radius, {
        steps: 30,
        units: "kilometers",
      });
      updatedGeoJSON.geometry.coordinates[0].map((data) => {
        fetchCountry(data[1], data[0]);
      });
    }
    return () => {
      if (myCircle) {
        myCircle.remove();
      }
    };
  }, [lanlat]);
  function handleClick(evt) {
    const lngLat = evt.lngLat;
    features = evt.features;
    const bounds = bbox({
      type: "FeatureCollection",
      features: [features[0]],
    });
    mapRef.current.fitBounds(bounds, { padding: 20 });
    setCountry([]);
    setPolygon({
      type: "FeatureCollection",
      features: [features[0]],
    });
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
  setInterval(() => {
    if (myCircle) {
      let updateRad = myCircle.getRadius() / 1000;
      let updateCen = myCircle.getCenter();
      if (radius != updateRad) {
        if (radius > updateRad) {
          setCountry([]);
          setPolygon({
            type: "FeatureCollection",
            features: [],
          });
        }
        const updatedGeoJSON = turf.circle(
          [updateCen.lng, updateCen.lat],
          updateRad,
          {
            steps: 30,
            units: "kilometers",
          }
        );
        radius = updateRad;
        center = updateCen;
        updatedGeoJSON.geometry.coordinates[0].map((data) => {
          fetchCountry(data[1], data[0]);
        });
      }
    }
  }, 500);
  const fetchData = async () => {
    //fetch data
    const url = `https://raw.githubusercontent.com/datasets/geo-boundaries-world-110m/master/countries.geojson`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        setGeojson(data);
      }
    } catch (error) {
      console.error("Error fetching country info:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    features
      ? setPolygon({
          type: "FeatureCollection",
          features: [features[0]],
        })
      : "";
    country.forEach((con) => {
      if (con == "United States") {
        getCountryGeoJSON("United States of America");
      } else {
        getCountryGeoJSON(con);
      }
    });
  }, [country]);
  const fetchCountry = async (lat, lng) => {
    //fetch country
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${"pk.eyJ1IjoiYWRoaXRoeWFhMzEiLCJhIjoiY2x4eW83ZzBlMDJrMjJrcXZ2ZHZ4cGFhNSJ9.oKfx4UDtPP-AQPz_UCi8zg"}&types=country`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const countryName = data.features[0].place_name;
        setCountry((prev) => {
          const normalizedCountryName = countryName.trim().toLowerCase();
          if (
            !prev.some((name) => name.toLowerCase() === normalizedCountryName)
          ) {
            return [...prev, countryName];
          }
          return prev;
        });
      }
    } catch (error) {
      console.error("Error fetching country info:", error);
    }
  };
  const getCountryGeoJSON = (countryName) => {
    //geojson data
    if (!geojson) return null;
    const countryFeature = geojson.features.filter(
      (feature) =>
        feature.properties.admin.toLowerCase() === countryName.toLowerCase()
    );
    setPolygon({
      ...polygon,
      features: [...polygon.features, countryFeature[0]],
    });
  };
  return (
    <>
      <Map
        style={{ width: "100%", height: "100vh" }}
        ref={mapRef}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken="pk.eyJ1IjoiYWRoaXRoeWFhMzEiLCJhIjoiY2x4eW83ZzBlMDJrMjJrcXZ2ZHZ4cGFhNSJ9.oKfx4UDtPP-AQPz_UCi8zg"
        {...view}
        onMove={(e) => setView(e.viewState)}
        interactiveLayerIds={["countries-layer"]}
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

        <Source id="countries" type="geojson" data={geojson}>
          <Layer
            id="countries-layer"
            type="fill"
            paint={{
              "fill-color": "#000",
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
        {polygon && (
          <Source type="geojson" data={polygon}>
            <Layer
              type="fill"
              paint={{
                "fill-color": "#ff7700",
                "fill-opacity": 0.1,
              }}
            />
          </Source>
        )}
      </Map>
    </>
  );
};

export default MapCircle;
