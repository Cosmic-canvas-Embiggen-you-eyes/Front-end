// import React, { useState, useRef, useEffect } from "react";
// import "leaflet/dist/leaflet.css";
// import CustomZoom from "../../components/CustomZoom";
// import ViewMarkers from "../../components/ViewMarkers";

// export default function MessierMap({ onMapClick }) {
//   const [label, setLabel] = useState(null);
//   const [tempName, setTempName] = useState("");
//   const [showForm, setShowForm] = useState(false);
//   const [markers, setMarkers] = useState([]);
//   const iframeRef = useRef(null);

//   const userToken = localStorage.getItem("token");
//   const mapId = "messierMap";

//   // Handle clicks on the iframe overlay
//   const handleIframeClick = (e) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     // Convert click coordinates to a position relative to the container
//     const position = {
//       x: x,
//       y: y,
//       percentX: (x / rect.width) * 100,
//       percentY: (y / rect.height) * 100
//     };

//     if (onMapClick) {
//       onMapClick({ latlng: position });
//     }

//     setLabel({ position: position, name: "" });
//     setTempName("");
//     setShowForm(true);
//   };

//   const handleLabelSubmit = (e) => {
//     e.preventDefault();
//     if (!tempName.trim()) return;

//     const newLabel = { ...label, name: tempName };
//     const updatedMarkers = [...markers, newLabel];
//     setMarkers(updatedMarkers);
//     setLabel(null);
//     setShowForm(false);

//     // Save to backend
//     fetch("http://localhost:5000/api/labels", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         ...newLabel,
//         mapId: mapId
//       }),
//     }).catch((err) => console.error("Error saving label:", err));
//   };

//   const handleCancelLabel = () => {
//     setShowForm(false);
//     setLabel(null);
//   };

//   return (
//     <div style={{
//       position: "relative",
//       height: "100%",
//       width: "100%",
//       overflow: "hidden"
//     }}>
//       {/* iFrame containing the Messier HTML */}
//       <iframe
//         ref={iframeRef}
//         src="https://0a69e0e57dd7.ngrok-free.app/messeir1.html"
//         title="Messier Catalog Map"
//         style={{
//           width: "100%",
//           height: "100%",
//           border: "none",
//           display: "block"
//         }}
//         allow="fullscreen"
//       />

//       {/* Transparent overlay for capturing clicks */}
//       <div
//         onClick={handleIframeClick}
//         style={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           width: "100%",
//           height: "100%",
//           backgroundColor: "transparent",
//           cursor: "crosshair",
//           pointerEvents: showForm ? "none" : "auto"
//         }}
//       />

//       {/* Render markers */}
//       {markers.map((marker, index) => (
//         <div
//           key={index}
//           style={{
//             position: "absolute",
//             left: `${marker.position.percentX}%`,
//             top: `${marker.position.percentY}%`,
//             transform: "translate(-50%, -100%)",
//             pointerEvents: "auto",
//             zIndex: 1000
//           }}
//         >
//           <div style={{
//             backgroundColor: "white",
//             padding: "4px 8px",
//             borderRadius: "4px",
//             boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
//             fontSize: "12px",
//             whiteSpace: "nowrap"
//           }}>
//             <b>{marker.name}</b>
//           </div>
//           <div style={{
//             width: 0,
//             height: 0,
//             borderLeft: "6px solid transparent",
//             borderRight: "6px solid transparent",
//             borderTop: "6px solid white",
//             margin: "0 auto"
//           }} />
//         </div>
//       ))}

//       {/* Label form popup */}
//       {showForm && label && (
//         <div
//           style={{
//             position: "absolute",
//             left: `${label.position.percentX}%`,
//             top: `${label.position.percentY}%`,
//             transform: "translate(-50%, -120%)",
//             backgroundColor: "white",
//             padding: "12px",
//             borderRadius: "8px",
//             boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
//             zIndex: 2000,
//             minWidth: "200px"
//           }}
//         >
//           <form onSubmit={handleLabelSubmit}>
//             <input
//               type="text"
//               placeholder="Enter label name"
//               value={tempName}
//               onChange={(e) => setTempName(e.target.value)}
//               autoFocus
//               style={{
//                 width: "100%",
//                 padding: "8px",
//                 marginBottom: "8px",
//                 border: "1px solid #ccc",
//                 borderRadius: "4px",
//                 fontSize: "14px"
//               }}
//             />
//             <div style={{ display: "flex", gap: "8px" }}>
//               <button
//                 type="submit"
//                 style={{
//                   flex: 1,
//                   padding: "8px 12px",
//                   backgroundColor: "#4CAF50",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "4px",
//                   cursor: "pointer",
//                   fontSize: "14px"
//                 }}
//               >
//                 Save
//               </button>
//               <button
//                 type="button"
//                 onClick={handleCancelLabel}
//                 style={{
//                   flex: 1,
//                   padding: "8px 12px",
//                   backgroundColor: "#f44336",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "4px",
//                   cursor: "pointer",
//                   fontSize: "14px"
//                 }}
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* ViewMarkers component (if it needs adaptation) */}
//       <div style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
//         <ViewMarkers token={userToken} mapId={mapId} />
//       </div>

//       {/* Custom Zoom controls */}
//       <div style={{ position: "absolute", bottom: "20px", right: "20px", zIndex: 1000 }}>
//         <CustomZoom />
//       </div>
//     </div>
//   );
// }
import React, { useState, useRef, useEffect } from "react";
import "leaflet/dist/leaflet.css";
// We removed CustomZoom and ViewMarkers from the imports if they are not used elsewhere.

export default function MessierMap({ onMapClick }) {
  const [label, setLabel] = useState(null);
  const [tempName, setTempName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [markers, setMarkers] = useState([]);
  const iframeRef = useRef(null);

  const userToken = localStorage.getItem("token");
  const mapId = "messierMap";

  // ... (All your functions like handleIframeClick, handleLabelSubmit, etc. are perfect and stay the same)
  const handleIframeClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const position = {
      x: x,
      y: y,
      percentX: (x / rect.width) * 100,
      percentY: (y / rect.height) * 100,
    };

    if (onMapClick) {
      onMapClick({ latlng: position });
    }

    setLabel({ position: position, name: "" });
    setTempName("");
    setShowForm(true);
  };

  const handleLabelSubmit = (e) => {
    e.preventDefault();
    if (!tempName.trim()) return;

    const newLabel = { ...label, name: tempName };
    const updatedMarkers = [...markers, newLabel];
    setMarkers(updatedMarkers);
    setLabel(null);
    setShowForm(false);

    fetch("http://localhost:5000/api/labels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newLabel,
        mapId: mapId,
      }),
    }).catch((err) => console.error("Error saving label:", err));
  };

  const handleCancelLabel = () => {
    setShowForm(false);
    setLabel(null);
  };

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <iframe
        ref={iframeRef}
        src="http://localhost:5000/messeir1.html"
        title="Messier Catalog Map"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
        }}
        allow="fullscreen"
      />

      <div
        onClick={handleIframeClick}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "transparent",
          cursor: "crosshair",
          pointerEvents: showForm ? "none" : "auto",
        }}
      />

      {/* Your new marker system is great! */}
      {markers.map((marker, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: `${marker.position.percentX}%`,
            top: `${marker.position.percentY}%`,
            transform: "translate(-50%, -100%)",
            pointerEvents: "auto",
            zIndex: 1000,
          }}
        >
          {/* ... marker content ... */}
          <div
            style={{
              backgroundColor: "white",
              padding: "4px 8px",
              borderRadius: "4px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              fontSize: "12px",
              whiteSpace: "nowrap",
            }}
          >
            <b>{marker.name}</b>
          </div>
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "6px solid white",
              margin: "0 auto",
            }}
          />
        </div>
      ))}

      {/* Your form popup is also great! */}
      {showForm && label && (
        <div
          style={{
            position: "absolute",
            left: `${label.position.percentX}%`,
            top: `${label.position.percentY}%`,
            transform: "translate(-50%, -120%)",
            backgroundColor: "white",
            padding: "12px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            zIndex: 2000,
            minWidth: "200px",
          }}
        >
          <form onSubmit={handleLabelSubmit}>
            <input
              type="text"
              placeholder="Enter label name"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              autoFocus
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            />
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleCancelLabel}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* <ViewMarkers token={userToken} mapId={mapId} />  <-- REMOVED THIS LINE
        <CustomZoom />                                    <-- REMOVED THIS LINE
      */}
    </div>
  );
}
