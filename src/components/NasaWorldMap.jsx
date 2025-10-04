import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import CustomZoom from "./CustomZoom";
import { layerCategories } from "./layers";

import ViewMarkers from "./ViewMarkers";

const GIBS_URL = (layerId, matrixSet, date, format) =>
  `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/${layerId}/default/${date}/${matrixSet}/{z}/{y}/{x}.${format}`;

// Default marker icon
const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -35],
});

export default function NasaWorldMap({
  date,
  onMapClick,
  activeBaseLayer,
  activeOverlays,
  viewCenter,
  viewZoom,
}) {
  const [label, setLabel] = useState(null);
  const [tempName, setTempName] = useState("");
  const [showForm, setShowForm] = useState(false);

  const userToken = localStorage.getItem("token"); 
const mapId = "nasaWorldMap";

  const worldBounds = [
    [-90, -180],
    [90, 180],
  ];

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        if (onMapClick) {
          onMapClick(e);
        }
        setLabel({ position: e.latlng, name: "" });
        setTempName("");
        setShowForm(true);
      },
    });
    return null;
  };

  const handleLabelSubmit = (e) => {
    e.preventDefault();
    if (!tempName.trim()) return;
    const newLabel = { ...label, name: tempName };
    setLabel(newLabel);
    setShowForm(false);
    fetch("http://localhost:5000/api/labels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLabel),
    }).catch((err) => console.error("Error saving label:", err));
  };

  // Get the active base layer config
  const baseLayerConfig =
    layerCategories.find(
      (l) => l.id === activeBaseLayer && l.type === "base"
    ) || layerCategories.find((l) => l.type === "base");

  // Get active overlay configs
  const overlayConfigs = layerCategories.filter(
    (l) => l.type === "overlay" && activeOverlays.includes(l.id)
  );

  const ViewSetter = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
      if (center && typeof center.lat === 'number' && typeof center.lng === 'number' && typeof zoom === 'number') {
        map.setView([center.lat, center.lng], zoom, { animate: true });
      } else if (center && typeof center.lat === 'number' && typeof center.lng === 'number') {
        map.panTo([center.lat, center.lng], { animate: true });
      } else if (typeof zoom === 'number') {
        map.setZoom(zoom, { animate: true });
      }
    }, [map, center?.lat, center?.lng, zoom]);
    return null;
  };

  return (
    <MapContainer
      center={[20, 0]}
      zoom={3}
      style={{ height: "100%", width: "100%" }}
      maxBounds={worldBounds}
      maxBoundsViscosity={1.0}
      zoomControl={false}
    >
      {/* Base Layer */}
      <TileLayer
        key={`base-${baseLayerConfig.id}-${date}`}
        url={GIBS_URL(
          baseLayerConfig.id,
          baseLayerConfig.matrixSet,
          date,
          baseLayerConfig.format
        )}
        attribution="&copy; NASA EOSDIS GIBS"
        noWrap={true}
        tileSize={256}
        maxNativeZoom={9}
      />

      {/* Overlay Layers */}
      {overlayConfigs.map((layer) => (
        <TileLayer
          key={`overlay-${layer.id}-${date}`}
          url={GIBS_URL(layer.id, layer.matrixSet, date, layer.format)}
          attribution="&copy; NASA EOSDIS GIBS"
          noWrap={true}
          tileSize={256}
          opacity={layer.opacity || 0.7}
          maxNativeZoom={parseInt(layer.matrixSet.match(/\d+/)[0])}
        />
      ))}

      <MapClickHandler />

  {/* Programmatic view control */}
  <ViewSetter center={viewCenter} zoom={viewZoom} />

      {/* {label && (
        <Marker position={label.position} icon={defaultIcon}>
          <Popup>
            {showForm ? (
              <form onSubmit={handleLabelSubmit}>
                <input
                  type="text"
                  placeholder="Enter label name"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  autoFocus
                  style={{
                    width: "100%",
                    padding: "5px",
                    marginBottom: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "3px",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "3px",
                    cursor: "pointer",
                  }}
                >
                  Save
                </button>
              </form>
            ) : (
              <b>{label.name}</b>
            )}
          </Popup>
        </Marker>
      )} */}

      <ViewMarkers token={userToken} mapId={mapId} />

      <CustomZoom />
    </MapContainer>
  );
}


// import React, { useState } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   LayersControl,
//   Marker,
//   Popup,
//   useMapEvents,
// } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import CustomZoom from "./CustomZoom";
// import { layerCategories } from "./layers"; // Import your layer definitions

// const GIBS_URL = (layerId, matrixSet, date, format) =>
//   `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/${layerId}/default/${date}/${matrixSet}/{z}/{y}/{x}.${format}`;

// const baseLayers = layerCategories.filter((l) => l.type === "base");
// const overlayLayers = layerCategories.filter((l) => l.type === "overlay");

// // Default marker icon
// const defaultIcon = new L.Icon({
//   iconUrl: "https://unpkg.com/leaflet@1.7/dist/images/marker-icon.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [0, -35],
// });

// export default function NasaWorldMap({ date, onMapClick }) {
//   const [label, setLabel] = useState(null);
//   const [tempName, setTempName] = useState("");
//   const [showForm, setShowForm] = useState(false);

//   const worldBounds = [
//     [-90, -180], // Southwest
//     [90, 180], // Northeast
//   ];

//   const MapClickHandler = () => {
//     useMapEvents({
//       click(e) {
//         if (onMapClick) {
//           onMapClick(e);
//         }
//         setLabel({ position: e.latlng, name: "" });
//         setTempName("");
//         setShowForm(true);
//       },
//     });
//     return null;
//   };

//   const handleLabelSubmit = (e) => {
//     e.preventDefault();
//     if (!tempName.trim()) return;
//     const newLabel = { ...label, name: tempName };
//     setLabel(newLabel);
//     setShowForm(false);
//     fetch("http://localhost:5000/api/labels", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(newLabel),
//     });
//   };

//   return (
//     <MapContainer
//       center={[20, 0]}
//       zoom={3}
//       style={{ height: "100%", width: "100%" }}
//       maxBounds={worldBounds}
//       maxBoundsViscosity={1.0}
//       zoomControl={false}
//     >
//       <LayersControl position="topright">
//         {/* Render Base Layers Dynamically */}
//         {baseLayers.map((layer, idx) => (
//           <LayersControl.BaseLayer
//             key={layer.id}
//             name={layer.title}
//             checked={idx === 0} // Set the first base layer as default
//           >
//             <TileLayer
//               // key={`${layer.id}-${date}`}
//               // url={GIBS_URL(layer.id, layer.matrixSet, date, layer.format)}
//               // attribution="NASA Worldview / GIBS"
//               // noWrap={true}
//               url={GIBS_URL(layer.id, layer.matrixSet, date, layer.format)}
//               attribution="&copy; NASA EOSDIS GIBS"
//               noWrap={true}
//               tileSize={256}
//               maxNativeZoom={9}
//             />
//           </LayersControl.BaseLayer>
//         ))}

//         {/* Render Overlay Layers Dynamically */}
//         {overlayLayers.map((layer) => (
//           <LayersControl.Overlay key={layer.id} name={layer.title}>
//             <TileLayer
//               // key={`${layer.id}-${date}`}
//               // url={GIBS_URL(layer.id, layer.matrixSet, date, layer.format)}
//               // attribution="NASA Worldview / GIBS"
//               // noWrap={true}
//               url={GIBS_URL(layer.id, layer.matrixSet, date, layer.format)}
//               attribution="&copy; NASA EOSDIS GIBS"
//               noWrap={true}
//               tileSize={256}
//               opacity={0.7}
//               maxNativeZoom={parseInt(layer.matrixSet.match(/\d+/)[0])}
//             />
//           </LayersControl.Overlay>
//         ))}
//       </LayersControl>

//       <MapClickHandler />

//       {label && (
//         <Marker position={label.position} icon={defaultIcon}>
//           <Popup>
//             {showForm ? (
//               <form onSubmit={handleLabelSubmit}>
//                 <input
//                   type="text"
//                   placeholder="Enter label name"
//                   value={tempName}
//                   onChange={(e) => setTempName(e.target.value)}
//                   autoFocus
//                 />
//                 <button type="submit">Save</button>
//               </form>
//             ) : (
//               <b>{label.name}</b>
//             )}
//           </Popup>
//         </Marker>
//       )}

//       <CustomZoom />
//     </MapContainer>
//   );
// }

