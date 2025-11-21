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
import { useTheme } from "next-themes";

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
  const { theme } = useTheme();

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

      const tileLayer = new TileLayer({ 
        source: new OSM(),
        className: 'ol-layer-osm'
      });

      const initialMap = new Map({
        target: mapRef.current,
        layers: [
          tileLayer,
          vectorLayer,
        ],
        view: new View({
          center:fromLonLat([75.1, 26.1]),
          zoom: 7.75,
        }),
      });

      // Overlay for info popup
      const overlayContainer = document.createElement("div");
      overlayContainer.className = "bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl min-w-[240px] border border-slate-200 dark:border-slate-700";
      const overlay = new Overlay({
        element: overlayContainer,
        positioning: "bottom-center",
        stopEvent: false,
        offset: [0, -10],
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
            <div class="mb-3">
              <div class="flex justify-between items-center mb-2">
                <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Renewable Usage</span>
                <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400">${campus.renewable_usage}%</span>
              </div>
              <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div class="bg-emerald-500 h-full rounded-full" style="width:${campus.renewable_usage}%"></div>
              </div>
            </div>
            <h4 class="text-lg font-bold text-slate-900 dark:text-white mb-2">${campus.name}</h4>
            <a href="${campus.details_url}" class="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
              View Stats
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          `;
          overlay.setPosition(evt.coordinate);
        } else {
          overlay.setPosition(undefined);
        }
      });

      setMap(initialMap);
    }
  }, [map]);

  // Apply dark mode filter to map tiles
  useEffect(() => {
    if (mapRef.current) {
      const canvas = mapRef.current.querySelector('.ol-layer-osm canvas');
      if (canvas) {
        canvas.style.filter = theme === 'dark' ? 'invert(1) hue-rotate(180deg) brightness(0.8) contrast(1.2)' : 'none';
      }
    }
  }, [theme]);

  return (
    <div className="relative w-full h-[600px] bg-slate-100 dark:bg-slate-900 overflow-hidden rounded-xl">
      <div ref={mapRef} className="w-full h-full" />
      {/* CSS hack to ensure the filter applies when tiles load/change */}
      <style jsx global>{`
        .dark .ol-layer-osm canvas {
          filter: invert(1) hue-rotate(180deg) brightness(0.8) contrast(1.2) !important;
          transition: filter 0.3s ease;
        }
      `}</style>
    </div>
  );
}
