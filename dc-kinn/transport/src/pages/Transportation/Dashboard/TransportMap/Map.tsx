// @ts-nocheck
import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

export default function Map({ selectedLocation }: any) {
  const mapDivRef = useRef(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    loadMapHandler();
  }, []);

  async function loadMapHandler() {
    try {
      const loader = new Loader({
        apiKey: import.meta.env.VITE_MAP_KEY,
        version: "weekly",
        libraries: ["places"],
      });

      await loader.importLibrary("maps");
      const centerLat = selectedLocation?.latitude || "17.4065";
      const centerLong = selectedLocation?.longitude || "78.4772";
      const mapCenter = {
        lat: parseFloat(centerLat),
        lng: parseFloat(centerLong),
      };

      mapRef.current = new window.google.maps.Map(mapDivRef.current, {
        center: mapCenter,
        zoom: 14,
      });

      const position = new window.google.maps.LatLng(
        parseFloat(centerLat),
        parseFloat(centerLong)
      );
      markerRef.current = new window.google.maps.Marker({
        position: position,
        map: mapRef.current,
      });
    } catch (e) {
      console.error("Error loading the map:", e);
    }
  }

  return (
    <div
      className="transport-map"
      ref={mapDivRef}
      id="mapDiv"
      style={{
        width: "100%",
      }}
    ></div>
  );
}
