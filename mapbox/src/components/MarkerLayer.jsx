import React, { useState, useRef, useEffect } from "react";
import Map, { Marker, Source, Layer,Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

let features;
const MarkerLayer = () => {
  const mapRef = useRef();
  const [polygon, setPolygon] = useState();
  const [pop,setPop] = useState({
    id:'',
    con:false,
  })
  const [marks, setMarks] = useState([
    {
      lat: 48.8566,
      lng: 2.3522,
      color: "red",
      city:'Paris'
    },
    {
      lat: 43.2965,
      lng: 5.3698,
      color: "red",
      city:'Marseille'
    },
    {
      lat: 45.7640,
      lng: 4.8357,
      color: "red",
      city:'Lyon'
    },
    {
      lat: 43.6047,
      lng: 1.4442,
      color: "red",
      city:'Toulouse'
    },
    {
      lat: 43.7102,
      lng: 7.2620,
      color: "red",
      city:'Nice'
    },
    {
      lat: 50.6292,
      lng:3.0573,
      color: "red",
      city:'Lille'
    },
    {
      lat: 48.5734,
      lng: 7.7521,
      color: "red",
      city:'Strasbourg'
    },
    {
      lat: 43.6108,
      lng: 3.8767,
      color: "red",
      city:'Montpellier'
    },
    {
      lat: 47.2184,
      lng: -1.5536,
      color: "red",
      city:'Nantes'
    },
  ]);
  const [view, setView] = useState({
    longitude: 10,
    latitude: 40,
    zoom: 4,
  });
  function closePop(){
    setPop({
      id:null,
      con:false,
    })
  }
  useEffect(() => {
    const hasGreenMark = marks.some((mark) => mark.color === "green");
    features?hasGreenMark?setPolygon({
      type: "FeatureCollection",
          features: [features[0]],
    }):setPolygon():''
  }, [marks]);
  useEffect(()=>{
    console.log(pop)
  },[pop])
  function handleClick(mark, index,e) {
    e.stopPropagation();
    let map = mapRef.current.getMap();
    features = map.queryRenderedFeatures(map.project([mark.lng, mark.lat]), {
      layers: ["countries-layer"],
    });
    setPop({
        id:index,
        con:true,
      })
  }
  function select(index,val){
    setMarks((prevMarks) =>
      prevMarks.map((mar, idx) =>
        idx === index
          ? { ...mar, color: val == 'select' ? "green" : "red" }
          : mar
      )
    );
    
  }
  return (
    <Map
      style={{ width: "100%", height: "100vh" }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      ref={mapRef}
      mapboxAccessToken="pk.eyJ1IjoiYWRoaXRoeWFhMzEiLCJhIjoiY2x4eW83ZzBlMDJrMjJrcXZ2ZHZ4cGFhNSJ9.oKfx4UDtPP-AQPz_UCi8zg"
      {...view}
      onMove={(e) => setView(e.viewState)}
    >
      <Source
        id="countries"
        type="geojson"
        data="https://raw.githubusercontent.com/datasets/geo-boundaries-world-110m/master/countries.geojson"
      >
        <Layer
          id="countries-layer"
          type="fill"
          paint={{
            "fill-color": "#000",
            "fill-opacity": 0,
          }}
        />
      </Source>
      {marks.map((mark, index) => (
        <Marker longitude={mark.lng} latitude={mark.lat} key={index}>
          <div
            style={{
              backgroundColor: mark.color,
              height: "10px",
              width: "10px",
              borderRadius: "50%",
              cursor: "pointer",
            }}
            onClick={(e) => handleClick(mark, index,e)}
          ></div>
        </Marker>
      ))}
      {polygon && (
        <Source type="geojson" data={polygon}>
          <Layer
            type="fill"
            paint={{
              "fill-color": "#ff7700",
              "fill-opacity": 0.3,
            }}
          />
        </Source>
      )}
      {pop.con && marks.map((mark,index)=>pop.id==index?(
      <Popup
        key={mark.city} 
        longitude={mark.lng}
        latitude={mark.lat}
        onClose={closePop}
        anchor="bottom"
      >
        <div>
          <h4>{mark.city}</h4>
          <div style={{display:'flex',gap:'10px'}}>
            <button onClick={()=>select(index,'select')}>Select</button>
            <button onClick={()=>select(index,'deselect')}>Deselect</button>
          </div>
        </div>
      </Popup>
    ):'')}
    </Map>
  );
};

export default MarkerLayer;
