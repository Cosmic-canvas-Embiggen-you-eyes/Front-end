import React, { useState, useRef, useEffect } from "react";
import Sidebar from "./Sidebar";
import NasaWorldMap from "./NasaWorldMap";
import ProfileModal from "../pages/profile/ProfileModal";
import Game from "../pages/Game/Game";
import "./WorldMap.css";

const WorldMap = () => {
  const [activeTool, setActiveTool] = useState(null);
  const [isZooming, setIsZooming] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const mapRef = useRef(null);
  const [newLabelLocation, setNewLabelLocation] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  // Layer state management for single map
  const [activeBaseLayer, setActiveBaseLayer] = useState(
    "MODIS_Terra_CorrectedReflectance_TrueColor"
  );
  const [activeOverlays, setActiveOverlays] = useState([]);
  const [viewCenter, setViewCenter] = useState({ lat: 20, lng: 0 });
  const [viewZoom, setViewZoom] = useState(3);

  // Compare mode dates
  const [dateLeft, setDateLeft] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dateRight, setDateRight] = useState("2020-09-22");

  // Compare mode layer states - NEW!
  const [leftBaseLayer, setLeftBaseLayer] = useState(
    "MODIS_Terra_CorrectedReflectance_TrueColor"
  );
  const [leftOverlays, setLeftOverlays] = useState([]);
  const [rightBaseLayer, setRightBaseLayer] = useState(
    "MODIS_Terra_CorrectedReflectance_TrueColor"
  );
  const [rightOverlays, setRightOverlays] = useState([]);

  const [showProfile, setShowProfile] = useState(false);
  const [showGame, setShowGame] = useState(false);

  useEffect(() => {
    let zoomTimeout;
    if (isZooming) {
      zoomTimeout = setTimeout(() => setIsZooming(false), 1500);
    }
    return () => clearTimeout(zoomTimeout);
  }, [isZooming]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (activeTool === "label") {
        setCursorPosition({ x: e.clientX, y: e.clientY });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [activeTool]);

  // Listen for apply-earth-visualization events from Chatbot
  useEffect(() => {
    const handler = (evt) => {
      const cfg = evt?.detail;
      if (!cfg) return;
      try {
        if (cfg.date) setDate(cfg.date);
        if (cfg.activeBaseLayer) setActiveBaseLayer(cfg.activeBaseLayer);
        if (Array.isArray(cfg.activeOverlays)) setActiveOverlays(cfg.activeOverlays);
        const center = cfg.view?.center;
        const zoom = cfg.view?.zoom;
        if (center && typeof center.lat === 'number' && typeof center.lng === 'number') setViewCenter(center);
        if (typeof zoom === 'number') setViewZoom(zoom);
      } catch (e) {
        // no-op
      }
    };
    window.addEventListener('apply-earth-visualization', handler);
    return () => window.removeEventListener('apply-earth-visualization', handler);
  }, []);

  const handleZoom = () => {
    setIsZooming(true);
  };

  const handleMapClick = (e, side = "single") => {
    if (activeTool === "label") {
      setNewLabelLocation(e.latlng);
    } else if (activeTool === "story") {
      console.log("Creating story at:", e.latlng, "on", side);
    }
  };

  const handleGameClick = () => {
    setShowGame(true);
    setActiveTool(null);
  };

  const handleGameClose = () => {
    setShowGame(false);
  };

  // If game is active, show only the game
  if (showGame) {
    return <Game onClose={handleGameClose} />;
  }

  return (
    <div className="world-view-container">
      {/* MAP AREA */}
      <div className="map-area">
        {activeTool === "compare" ? (
          <div className="compare-mode-container">
            <div className="compare-map-wrapper left-map">
              <NasaWorldMap
                key="left"
                date={dateLeft}
                onMapClick={(e) => handleMapClick(e, "left")}
                activeBaseLayer={leftBaseLayer}
                activeOverlays={leftOverlays}
              />
              <div className="compare-date-picker">
                <label>Left Map Date:</label>
                <input
                  type="date"
                  value={dateLeft}
                  onChange={(e) => setDateLeft(e.target.value)}
                />
              </div>
            </div>

            <div className="compare-divider" />

            <div className="compare-map-wrapper right-map">
              <NasaWorldMap
                key="right"
                date={dateRight}
                onMapClick={(e) => handleMapClick(e, "right")}
                activeBaseLayer={rightBaseLayer}
                activeOverlays={rightOverlays}
              />
              <div className="compare-date-picker">
                <label>Right Map Date:</label>
                <input
                  type="date"
                  value={dateRight}
                  onChange={(e) => setDateRight(e.target.value)}
                />
              </div>
            </div>

            <button
              className="exit-compare"
              aria-label="Exit compare mode"
              onClick={() => setActiveTool(null)}
            >
              ×
            </button>
          </div>
        ) : (
          <NasaWorldMap
            key="single"
            date={date}
            onMapClick={(e) => handleMapClick(e, "single")}
            activeBaseLayer={activeBaseLayer}
            activeOverlays={activeOverlays}
            viewCenter={viewCenter}
            viewZoom={viewZoom}
          />
        )}
      </div>

      {/* NASA Logo */}
      <div className="nasa-logo">Cosmic Canvas</div>

      {/* Grid Overlay */}
      <div className="map-grid" />

      {/* Search Bar */}
      <div className="search-container">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Zoom Control */}
      {isZooming && (
        <div className="zoom-control">
          <div className="zoom-slider">
            <button onClick={() => handleZoom("in")}>+</button>
            <div className="slider-track">
              <div className="slider-thumb" />
            </div>
            <button onClick={() => handleZoom("out")}>-</button>
          </div>
        </div>
      )}

      {/* Floating cursor (+) */}
      {activeTool === "label" && (
        <div
          className="label-cursor"
          style={{
            top: cursorPosition.y,
            left: cursorPosition.x,
          }}
        >
          +
        </div>
      )}

      {/* Sidebar */}
      <Sidebar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        newLabelLocation={newLabelLocation}
        date={date}
        setDate={setDate}
        setShowProfile={setShowProfile}
        activeBaseLayer={activeBaseLayer}
        setActiveBaseLayer={setActiveBaseLayer}
        activeOverlays={activeOverlays}
        setActiveOverlays={setActiveOverlays}
        onGameClick={handleGameClick}
        leftBaseLayer={leftBaseLayer}
        setLeftBaseLayer={setLeftBaseLayer}
        leftOverlays={leftOverlays}
        setLeftOverlays={setLeftOverlays}
        rightBaseLayer={rightBaseLayer}
        setRightBaseLayer={setRightBaseLayer}
        rightOverlays={rightOverlays}
        setRightOverlays={setRightOverlays}
      />
      <ProfileModal open={showProfile} setOpen={setShowProfile} />
    </div>
  );
};

export default WorldMap;
