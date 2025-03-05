"use client";

import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { scaleSequential } from "d3-scale";
import { interpolateReds } from "d3-scale-chromatic";
import {
  MapContainer as LeafletMap,
  TileLayer,
  GeoJSON,
  GeoJSONProps,
} from "react-leaflet";
import { FeatureCollection, Geometry, Feature } from "geojson";
import { Layer } from "leaflet";

const center: [number, number] = [37.8, -96];

interface CostOfLivingEntry {
  state: string;
  index: number;
}

interface USMapProps {
  costOfLivingData: CostOfLivingEntry[];
}

export default function USMap({ costOfLivingData }: USMapProps) {
  const [geoData, setGeoData] = useState<FeatureCollection<Geometry> | null>(
    null
  );
  const [mapKey, setMapKey] = useState<number>(Date.now());

  useEffect(() => {
    async function fetchGeoJSON() {
      const response = await fetch(
        "https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json"
      );
      const data: FeatureCollection<Geometry> = await response.json();
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

  const getColor = (stateName: string): string => {
    const stateData = costOfLivingData.find((d) => d.state === stateName);
    return stateData ? colorScale(stateData.index).toString() : "#ccc";
  };

  const onEachFeature: GeoJSONProps["onEachFeature"] = (
    feature: Feature<Geometry, { name: string }>,
    layer: Layer
  ) => {
    const stateName = feature.properties?.name;
    if (!stateName) return;

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
    <LeafletMap
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
    </LeafletMap>
  );
}
