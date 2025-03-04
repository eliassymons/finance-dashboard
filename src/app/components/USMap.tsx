"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { scaleSequential } from "d3-scale";
import { interpolateReds } from "d3-scale-chromatic";

// Next gets mad if we don't dynamically import
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const GeoJSON = dynamic(
  () => import("react-leaflet").then((mod) => mod.GeoJSON),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import("react-leaflet").then((mod) => mod.Tooltip),
  { ssr: false }
);

const center: [number, number] = [37.8, -96];

interface USMapProps {
  costOfLivingData: { state: string; index: number }[];
}

export default function USMap({ costOfLivingData }: USMapProps) {
  const [geoData, setGeoData] = useState<any>(null);
  const [mapKey, setMapKey] = useState(Date.now());

  useEffect(() => {
    async function fetchGeoJSON() {
      const response = await fetch(
        "https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json"
      );
      const data = await response.json();
      setGeoData(data);
    }
    fetchGeoJSON();
  }, []);

  useEffect(() => {
    return () => {
      setMapKey(Date.now());
    };
  }, []);

  if (!geoData) return <p>Loading Map...</p>;

  const minIndex = Math.min(...costOfLivingData.map((d) => d.index));
  const maxIndex = Math.max(...costOfLivingData.map((d) => d.index));
  const colorScale = scaleSequential(interpolateReds).domain([
    minIndex,
    maxIndex,
  ]);

  const getColor = (stateName: string) => {
    const stateData = costOfLivingData.find((d) => d.state === stateName);
    return stateData ? colorScale(stateData.index).toString() : "#ccc";
  };

  const onEachFeature = (feature: any, layer: any) => {
    const stateName = feature.properties.name;
    const stateData = costOfLivingData.find((d) => d.state === stateName);

    if (stateData) {
      const nationalAvg =
        costOfLivingData.reduce((sum, d) => sum + d.index, 0) /
        costOfLivingData.length;
      const relativePercentage =
        ((stateData.index - nationalAvg) / nationalAvg) * 100;
      const percentageText = `${Math.abs(relativePercentage).toFixed(1)}% ${
        relativePercentage >= 0 ? "above" : "below"
      } national avg`;

      layer.bindTooltip(
        `<strong>${stateName}</strong><br/>Cost of Living Index: <strong>${
          stateData.index
        }</strong><br/><span style="color: ${
          relativePercentage >= 0 ? "red" : "green"
        }">${percentageText}</span>`,
        {
          permanent: false,
          direction: "top",
          opacity: 0.9,
          className: "custom-tooltip",
        }
      );
    }
  };

  return (
    <MapContainer
      key={mapKey}
      center={center}
      zoom={3}
      style={{ height: "400px", width: "100%", maxWidth: "600px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <GeoJSON
        data={geoData}
        style={(feature) => ({
          fillColor: getColor(feature?.properties?.name),
          weight: 1,
          opacity: 1,
          color: "white",
          fillOpacity: 0.7,
        })}
        onEachFeature={onEachFeature}
      />
    </MapContainer>
  );
}
