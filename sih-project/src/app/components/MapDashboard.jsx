"use client";
import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM } from "ol/source";
import { Vector as VectorSource } from "ol/source";
import { Point } from "ol/geom";
import Feature from "ol/Feature";
import { Icon, Style } from "ol/style";
import Overlay from "ol/Overlay";
import { fromLonLat } from "ol/proj";

const campuses = [
  {
    id: 1,
    name: "Jaipur University",
    latitude: 26.9124,
    longitude: 75.7873,
    renewable_usage: 65,
    details_url: "/campus/1/details",
  },
  {
    id: 2,
    name: "Udaipur Tech Campus",
    latitude: 24.5854,
    longitude: 73.7125,
    renewable_usage: 80,
    details_url: "/campus/2/details",
  },
];

export default function MapDashboard() {
  const mapRef = useRef();
  const overlayRef = useRef();
  const [map, setMap] = useState();

  useEffect(() => {
    if (!map) {
      // Create vector features for campuses
      const features = campuses.map((campus) => {
        const feature = new Feature({
          geometry: new Point([campus.longitude, campus.latitude]).transform("EPSG:4326", "EPSG:3857"),
          campus,
        });
        feature.setStyle(
          new Style({
            image: new Icon({
              src: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // simple marker icon
              scale: 0.05,
            }),
          })
        );
        return feature;
      });

      const vectorSource = new VectorSource({ features });
      const vectorLayer = new VectorLayer({ source: vectorSource });

      const initialMap = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({ source: new OSM() }),
          vectorLayer,
        ],
        view: new View({
          center:fromLonLat([75.1, 26.1]),
          zoom: 7.75,
        }),
      });

      // Overlay for info popup
      const overlayContainer = document.createElement("div");
      overlayContainer.style.background = "white";
      overlayContainer.style.padding = "10px";
      overlayContainer.style.borderRadius = "6px";
      overlayContainer.style.minWidth = "200px";
      overlayContainer.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
      const overlay = new Overlay({
        element: overlayContainer,
        positioning: "bottom-center",
        stopEvent: false,
      });
      overlayRef.current = overlay;
      initialMap.addOverlay(overlay);

      // Click handler
      initialMap.on("singleclick", function (evt) {
        const feature = initialMap.forEachFeatureAtPixel(evt.pixel, function (f) {
          return f;
        });
        if (feature) {
          const campus = feature.get("campus");
          overlayContainer.innerHTML = `
            <div style="margin-bottom:8px;">
              <div style="font-size:14px; margin-bottom:4px;">Renewable Usage</div>
              <div style="width:100%; background:#ddd; border-radius:4px; height:10px;">
                <div style="width:${campus.renewable_usage}%; background:#4caf50; height:100%; border-radius:4px;"></div>
              </div>
              <div style="font-size:12px; text-align:right;">${campus.renewable_usage}%</div>
            </div>
            <h4>${campus.name}</h4>
            <a href="${campus.details_url}" style="color:#2196f3; text-decoration:underline;">View More Stats</a>
          `;
          overlay.setPosition(evt.coordinate);
        } else {
          overlay.setPosition(undefined);
        }
      });

      setMap(initialMap);
    }
  }, [map]);

  return <div ref={mapRef} style={{ width: "100%", height: "600px" }} />;
}
