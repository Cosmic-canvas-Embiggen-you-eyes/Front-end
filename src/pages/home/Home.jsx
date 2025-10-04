import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="bbody">
    <div className="map-container">
      <h1 className="map-title">Choose Your Map</h1>
      <p className="map-subtitle">Select the map you want to explore</p>

      <div className="map-cards">
        <div className="map-card" onClick={() => navigate("/Explora/worldmap")}>
          <div className="map-icon">🌍</div>
          <h2>Earth</h2>
          <p>Explore the interactive map of our planet</p>
        </div>

        <div className="map-card" onClick={() => navigate("/map2")}>
          <div className="map-icon">🌑</div>
          <h2>Moon</h2>
          <p>Discover the interactive map of the Moon</p>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Home;
