import React, { useState, useRef, useEffect } from "react";
import DynamicSidebar from "./DynamicSidebar";
import NasaWorldMap from "./NasaWorldMap";
import MessierMap from "../pages/Messier/MessierMap";
import ProfileModal from "../pages/profile/ProfileModal";
import Game from "../pages/Game/Game";
import { getMapConfig, MAP_TYPES } from "./mapConfigs";
import { GAME_QUESTIONS_MESSIER } from "../pages/Messier/MessierGame";
import { GAME_QUESTIONS_STARBIRTH } from "../pages/StarBirth/starBirthGameQuestions";
import StarBirthMap from "../pages/StarBirth/StarBirthMap";
import "./WorldMap.css";
import SearchComponent from "./SearchComponent";

const UniversalWorldMap = ({ mapType = MAP_TYPES.NASA_WORLD }) => {
  const mapConfig = getMapConfig(mapType);

  const [activeTool, setActiveTool] = useState(null);
  const [isZooming, setIsZooming] = useState(false);
  const [date, setDate] = useState(
    mapConfig.defaultDate || new Date().toISOString().split("T")[0]
  );
  const [searchQuery, setSearchQuery] = useState("");
  const mapRef = useRef(null);
  const [newLabelLocation, setNewLabelLocation] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  // Layer state management for single map
  const [activeBaseLayer, setActiveBaseLayer] = useState(
    mapConfig.defaultBaseLayer
  );
  const [activeOverlays, setActiveOverlays] = useState([]);

  // Compare mode dates
  const [dateLeft, setDateLeft] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dateRight, setDateRight] = useState("2020-09-22");

  // Compare mode layer states
  const [leftBaseLayer, setLeftBaseLayer] = useState(
    mapConfig.defaultBaseLayer
  );
  const [leftOverlays, setLeftOverlays] = useState([]);
  const [rightBaseLayer, setRightBaseLayer] = useState(
    mapConfig.defaultBaseLayer
  );
  const [rightOverlays, setRightOverlays] = useState([]);

  const [showProfile, setShowProfile] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [gameQuestions, setGameQuestions] = useState(null);

  useEffect(() => {
    let zoomTimeout;
    if (isZooming) {
      zoomTimeout = setTimeout(() => setIsZooming(false), 1500);
    }
    return () => clearTimeout(zoomTimeout);
  }, [isZooming]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (activeTool === "label" || activeTool === "story") {
        setCursorPosition({ x: e.clientX, y: e.clientY });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [activeTool]);

  const handleZoom = () => {
    setIsZooming(true);
  };

  const handleMapClick = (e, side = "single") => {
    if (activeTool === "label") {
      setNewLabelLocation(e.latlng);
      setNewLabelLocation(e.latlng);
    } else if (activeTool === "story") {
      console.log("Creating story at:", e.latlng, "on", side);
      setNewLabelLocation(e.latlng);
    }
  };

  const handleGameClick = () => {
    // Load appropriate game questions based on map type
    if (mapType === MAP_TYPES.MESSIER) {
      setGameQuestions(GAME_QUESTIONS_MESSIER);
    } else if (mapType === MAP_TYPES.STARBIRTH) {
      setGameQuestions(GAME_QUESTIONS_STARBIRTH);
    }
    // For NASA map, the Game component will use its default questions
    setShowGame(true);
    setActiveTool(null);
  };

  const handleGameClose = () => {
    setShowGame(false);
    setGameQuestions(null);
  };

  // Select the appropriate map component
  const getMapComponent = () => {
    switch (mapType) {
      case MAP_TYPES.MESSIER:
        return MessierMap;
      case MAP_TYPES.STARBIRTH:
        return StarBirthMap;
      default:
        return NasaWorldMap;
    }
  };
  const MapComponent = getMapComponent();

  // If game is active, show only the game
  if (showGame) {
    return (
      <Game
        onClose={handleGameClose}
        questions={gameQuestions}
        mapType={mapType}
      />
    );
  }

  return (
    <div className="world-view-container">
      {/* MAP AREA */}
      <div className="map-area">
        {activeTool === "compare" && mapConfig.features.compare ? (
          <div className="compare-mode-container">
            <div className="compare-map-wrapper left-map">
              <MapComponent
                key="left"
                date={dateLeft}
                onMapClick={(e) => handleMapClick(e, "left")}
                activeBaseLayer={leftBaseLayer}
                activeOverlays={leftOverlays}
              />
              {mapConfig.features.date && (
                <div className="compare-date-picker">
                  <label>Left Map Date:</label>
                  <input
                    type="date"
                    value={dateLeft}
                    onChange={(e) => setDateLeft(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="compare-divider" />

            <div className="compare-map-wrapper right-map">
              <MapComponent
                key="right"
                date={dateRight}
                onMapClick={(e) => handleMapClick(e, "right")}
                activeBaseLayer={rightBaseLayer}
                activeOverlays={rightOverlays}
              />
              {mapConfig.features.date && (
                <div className="compare-date-picker">
                  <label>Right Map Date:</label>
                  <input
                    type="date"
                    value={dateRight}
                    onChange={(e) => setDateRight(e.target.value)}
                  />
                </div>
              )}
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
          <MapComponent
            key="single"
            date={date}
            onMapClick={(e) => handleMapClick(e, "single")}
            activeBaseLayer={activeBaseLayer}
            activeOverlays={activeOverlays}
          />
        )}
      </div>

      {/* Logo */}
      <div className="nasa-logo">{mapConfig.name}</div>

      {/* Grid Overlay */}
      <div className="map-grid" />

      {/* Search Bar */}
      <SearchComponent />
      {/* <div className="search-container">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div> */}


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
      {activeTool === "label" || activeTool === "story" ? (
        <div
          className="label-cursor"
          style={{
            top: cursorPosition.y,
            left: cursorPosition.x,
          }}
        >
          +
        </div>
      ) : null}

      {/* Dynamic Sidebar */}
      <DynamicSidebar
        mapConfig={mapConfig}
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

export default UniversalWorldMap;
