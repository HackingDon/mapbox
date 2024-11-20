import React, { useRef, useState } from 'react';
import Map, {Source,Layer} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import bbox from '@turf/bbox'
 
function Mappro(){
  const [polygon,setPolygon] = useState(null);
  const map = useRef()
  const [view,setView] = useState({
    longitude: 10,
    latitude: 30,
    zoom: 1.9,
  })
  function findCountry(event){
    const features =event.features;
    console.log(event.features[0])
    const bounds = bbox({
      type: "FeatureCollection",
      features: [features[0]],
    });
    map.current.fitBounds(bounds, { padding: 20 });
    setPolygon({
      type: "FeatureCollection",
      features: [features[0]],
    })
  }
  return (
    <Map
    style={{width: '100%', height: '100vh'}}
    ref={map}
    mapStyle="mapbox://styles/mapbox/streets-v9"
    mapboxAccessToken="pk.eyJ1IjoiYWRoaXRoeWFhMzEiLCJhIjoiY2x4eW83ZzBlMDJrMjJrcXZ2ZHZ4cGFhNSJ9.oKfx4UDtPP-AQPz_UCi8zg"
    onClick={findCountry}
    interactiveLayerIds={['countries-layer']} 
    {...view}
    onMove={(e)=>setView(e.viewState)} 
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
  )
}

export default Mappro;
