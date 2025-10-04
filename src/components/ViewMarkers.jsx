import React, { useEffect, useState } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

function ViewMarkers({ token, mapId }) {
  const [markers, setMarkers] = useState([]);

 
  const privacyIcons = {
    everyone: new L.Icon({
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      shadowSize: [41, 41],
    }),
    onlyme: new L.Icon({
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      shadowSize: [41, 41],
    }),
  };

  useEffect(() => {
    async function loadMarkers() {
      try {
        const res = await fetch(
          `http://localhost:5000/api/v1/markers?mapId=${mapId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch markers");
        const data = await res.json();
        setMarkers(data);
      } catch (err) {
        console.error(err);
      }
    }
    loadMarkers();
  }, [token, mapId]);

  return (
    <>
      {markers.map((m) => (
        <Marker
          key={m.id}
          position={[m.x, m.y]}
          icon={privacyIcons[m.visibility] || privacyIcons.everyone} 
        >
          <Popup>
    <strong>{m.name}</strong> <br />
    ID: {m.id} <br />
    Image: {m.imageName} <br />
    Visibility: {m.visibility}
  </Popup>
        </Marker>
      ))}
      {/* Legend */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",          
          background: "rgba(0,0,0,0.5)",
          padding: "10px 15px",
          borderRadius: "8px",
          color: "white",
          fontSize: "14px",
          zIndex: 9999,           
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
          <span
            style={{
              width: "15px",
              height: "15px",
              borderRadius: "50%",
              background: "blue",
              display: "inline-block",
            }}
          ></span>
          Public
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
          <span
            style={{
              width: "15px",
              height: "15px",
              borderRadius: "50%",
              background: "green",
              display: "inline-block",
            }}
          ></span>
          Only Me
        </div>
      </div>
    </>
  );
}

export default ViewMarkers;
