import React, { Component } from "react";
import ReactMapGL, { Source, Layer } from "react-map-gl";
class mapCircle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        latitude: 38.63738602787579,
        longitude: -121.23576311149986,
        zoom: 6.8,
        bearing: 0,
        pitch: 0,
        dragPan: true,
        width: 600,
        height: 600
      }
    };
  }

  render() {
    const { viewport } = this.state;
    const MAPBOX_TOKEN =
      "pk.eyJ1Ijoic21peWFrYXdhIiwiYSI6ImNqcGM0d3U4bTB6dWwzcW04ZHRsbHl0ZWoifQ.X9cvdajtPbs9JDMG-CMDsA";


    const dataOne = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: [
          [-122.41510269913951, 37.77909036739809],
          [39.5423, -77.0564]
        ]
      }
    };
    return (
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        onViewportChange={(newViewport) => {
          this.setState({ viewport: newViewport });
        }}
      >
        <Source id="polylineLayer" type="geojson" data={dataOne}>
          <Layer
            id="lineLayer"
            type="line"
            source="my-data"
            layout={{
              "line-join": "round",
              "line-cap": "round"
            }}
            paint={{
              "line-color": "rgba(3, 170, 238, 0.5)",
              "line-width": 5
            }}
          />
        </Source>
      </ReactMapGL>
    );
  }
}
