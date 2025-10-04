import React, { useState } from "react";
import {
  FaLayerGroup,
  FaMapMarkerAlt,
  FaBookOpen,
  FaClone,
  FaCalendarAlt,
  FaTimes,
  FaGamepad,
  FaRobot,
} from "react-icons/fa";
import { UserCircle } from "lucide-react";
import { layerCategories, getLayersByCategory } from "./layers";
import "./Sidebar.css";
import AddPoints from "./AddPoints";
import ProfileModal from "../pages/profile/ProfileModal";
import Chatbot from "./Chatbot";

const DynamicSidebar = ({
  mapConfig, // NEW: Map configuration
  activeTool,
  setActiveTool,
  newLabelLocation,
  date,
  setDate,
  setShowProfile,
  activeBaseLayer,
  setActiveBaseLayer,
  activeOverlays,
  setActiveOverlays,
  onGameClick,
  leftBaseLayer,
  setLeftBaseLayer,
  leftOverlays,
  setLeftOverlays,
  rightBaseLayer,
  setRightBaseLayer,
  rightOverlays,
  setRightOverlays,
}) => {
  const [hoveredIcon, setHoveredIcon] = useState(null);

  // Build tools array based on map config
  const allTools = [
    {
      id: "layers",
      icon: <FaLayerGroup size={24} />,
      name: "Layers",
      magicSentence:
        "From here you can change the world's appearance and see it in new colors!",
      enabled: mapConfig.features.layers,
    },
    {
      id: "label",
      icon: <FaMapMarkerAlt size={24} />,
      name: "Create Label",
      magicSentence: "Mark special places and create your own personal map!",
      enabled: mapConfig.features.label,
    },
    {
      id: "story",
      icon: <FaBookOpen size={24} />,
      name: "Create Story",
      magicSentence:
        "Tell amazing stories about Earth's wonders and mysteries!",
      enabled: mapConfig.features.story,
    },
    {
      id: "compare",
      icon: <FaClone size={24} />,
      name: "Compare",
      magicSentence:
        "See how our planet transforms over time with just a swipe!",
      enabled: mapConfig.features.compare,
    },
    {
      id: "date",
      icon: <FaCalendarAlt size={24} />,
      name: "Select Date",
      magicSentence: "Pick a date to view the map for that day!",
      enabled: mapConfig.features.date,
    },
    {
      id: "game",
      icon: <FaGamepad size={24} />,
      name: "Geography Game",
      magicSentence:
        "Test your knowledge! Can you identify locations from space?",
      enabled: mapConfig.features.game,
    },
    {
      id: "profile",
      icon: <UserCircle size={24} />,
      name: "Profile",
      magicSentence:
        "View your profile info and check your points, levels, and badges!",
      enabled: mapConfig.features.profile,
    },
    {
      id: "chatbot",
      icon: <FaRobot size={24} />,
      name: "AI Assistant",
      magicSentence: "Ask me anything about space, astronomy, or the maps!",
      enabled: mapConfig.features.chatbot || true, // enable by default
    },
  ];

  // Filter only enabled tools
  const tools = allTools.filter((tool) => tool.enabled);

  const handleIconClick = (toolId) => {
    // if (toolId === "profile") {
    //   setShowProfile(true);
    //   return;
    // }

    if (toolId === "game") {
      onGameClick();
      return;
    }

    if (activeTool === toolId) {
      setActiveTool(null);
    } else {
      setActiveTool(toolId);
    }
  };

  return (
    <div className="sidebar-container">
      <nav className="sidebar-dock">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="icon-container"
            onMouseEnter={() => setHoveredIcon(tool.id)}
            onMouseLeave={() => setHoveredIcon(null)}
            onClick={() => handleIconClick(tool.id)}
          >
            <div
              className={`sidebar-icon ${
                activeTool === tool.id ? "active" : ""
              } ${tool.id === "game" ? "game-icon" : ""}`}
            >
              {tool.icon}
            </div>

            {hoveredIcon === tool.id && activeTool !== tool.id && (
              <div className="magic-card">
                <p className="magic-sentence">{tool.magicSentence}</p>
                <span className="tool-name">{tool.name}</span>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Smart Drawer */}
      {activeTool && activeTool !== "game" && (
        <div className="smart-drawer">
          <div className="drawer-content">
            {activeTool === "layers" && mapConfig.features.layers && (
              <LayersTool
                activeBaseLayer={activeBaseLayer}
                setActiveBaseLayer={setActiveBaseLayer}
                activeOverlays={activeOverlays}
                setActiveOverlays={setActiveOverlays}
              />
            )}
            {activeTool === "label" && (
              <LabelTool newLabelLocation={newLabelLocation} />
            )}
            {activeTool === "story" && (
              <StoryTool
                newLabelLocation={newLabelLocation}
                onStoryLoad={() => setActiveTool(null)}
              />
            )}
            {activeTool === "compare" && mapConfig.features.compare && (
              <CompareTool
                leftBaseLayer={leftBaseLayer}
                setLeftBaseLayer={setLeftBaseLayer}
                leftOverlays={leftOverlays}
                setLeftOverlays={setLeftOverlays}
                rightBaseLayer={rightBaseLayer}
                setRightBaseLayer={setRightBaseLayer}
                rightOverlays={rightOverlays}
                setRightOverlays={setRightOverlays}
              />
            )}
            {activeTool === "date" && mapConfig.features.date && (
              <DateTool date={date} setDate={setDate} />
            )}
            {activeTool === "profile" && (
              <ProfileModal open={true} setOpen={() => setActiveTool(null)} />
            )}
            {activeTool === "chatbot" && <Chatbot />}
          </div>
          <button className="close-drawer" onClick={() => setActiveTool(null)}>
            <FaTimes />
          </button>
        </div>
      )}
    </div>
  );
};

// Tool Components remain the same...
const LayersTool = ({
  activeBaseLayer,
  setActiveBaseLayer,
  activeOverlays,
  setActiveOverlays,
}) => {
  const layersByCategory = getLayersByCategory();
  const baseLayers = layerCategories.filter((l) => l.type === "base");

  const toggleOverlay = (layerId) => {
    if (activeOverlays.includes(layerId)) {
      setActiveOverlays(activeOverlays.filter((id) => id !== layerId));
    } else {
      setActiveOverlays([...activeOverlays, layerId]);
    }
  };

  return (
    <div
      className="tool-interface"
      style={{ maxHeight: "70vh", overflowY: "auto" }}
    >
      <h3 style={{ marginBottom: "15px", color: "#00a9ff" }}>Map Layers</h3>

      <div style={{ marginBottom: "20px" }}>
        <h4
          style={{
            fontSize: "14px",
            color: "#888",
            marginBottom: "10px",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Base Map
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {baseLayers.map((layer) => (
            <div
              key={layer.id}
              onClick={() => setActiveBaseLayer(layer.id)}
              style={{
                padding: "12px",
                borderRadius: "8px",
                background:
                  activeBaseLayer === layer.id
                    ? "linear-gradient(135deg, rgba(0,169,255,0.3), rgba(88,28,135,0.3))"
                    : "rgba(0,0,0,0.2)",
                border:
                  activeBaseLayer === layer.id
                    ? "2px solid #00a9ff"
                    : "2px solid rgba(255,255,255,0.1)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span style={{ fontSize: "24px" }}>{layer.icon}</span>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    color: "white",
                  }}
                >
                  {layer.title}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#aaa",
                    marginTop: "2px",
                  }}
                >
                  {layer.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {Object.entries(layersByCategory).map(([category, layers]) => {
        const categoryLayers = layers.filter((l) => l.type === "overlay");
        if (categoryLayers.length === 0) return null;

        return (
          <div key={category} style={{ marginBottom: "20px" }}>
            <h4
              style={{
                fontSize: "14px",
                color: "#888",
                marginBottom: "10px",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              {category}
            </h4>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {categoryLayers.map((layer) => {
                const isActive = activeOverlays.includes(layer.id);
                return (
                  <div
                    key={layer.id}
                    onClick={() => toggleOverlay(layer.id)}
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      background: isActive
                        ? "linear-gradient(135deg, rgba(0,169,255,0.3), rgba(88,28,135,0.3))"
                        : "rgba(0,0,0,0.2)",
                      border: isActive
                        ? "2px solid #00a9ff"
                        : "2px solid rgba(255,255,255,0.1)",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      opacity: isActive ? 1 : 0.7,
                    }}
                  >
                    <span style={{ fontSize: "24px" }}>{layer.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: "14px",
                          color: "white",
                        }}
                      >
                        {layer.title}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#aaa",
                          marginTop: "2px",
                        }}
                      >
                        {layer.description}
                      </div>
                    </div>
                    {isActive && (
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          background: "#00a9ff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        ✓
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <div
        style={{
          marginTop: "20px",
          padding: "12px",
          background: "rgba(0,169,255,0.1)",
          borderRadius: "8px",
          border: "1px solid rgba(0,169,255,0.3)",
          fontSize: "12px",
          color: "#aaa",
        }}
      >
        💡 <strong>Tip:</strong> You can activate multiple overlay layers at
        once to combine different data views!
      </div>
    </div>
  );
};

const CompareTool = ({
  leftBaseLayer,
  setLeftBaseLayer,
  leftOverlays,
  setLeftOverlays,
  rightBaseLayer,
  setRightBaseLayer,
  rightOverlays,
  setRightOverlays,
}) => {
  const [activeTab, setActiveTab] = useState("left");
  const layersByCategory = getLayersByCategory();
  const baseLayers = layerCategories.filter((l) => l.type === "base");

  const currentBaseLayer =
    activeTab === "left" ? leftBaseLayer : rightBaseLayer;
  const setCurrentBaseLayer =
    activeTab === "left" ? setLeftBaseLayer : setRightBaseLayer;
  const currentOverlays = activeTab === "left" ? leftOverlays : rightOverlays;
  const setCurrentOverlays =
    activeTab === "left" ? setLeftOverlays : setRightOverlays;

  const toggleOverlay = (layerId) => {
    if (currentOverlays.includes(layerId)) {
      setCurrentOverlays(currentOverlays.filter((id) => id !== layerId));
    } else {
      setCurrentOverlays([...currentOverlays, layerId]);
    }
  };

  return (
    <div
      className="tool-interface"
      style={{ maxHeight: "70vh", overflowY: "auto" }}
    >
      <h3 style={{ marginBottom: "15px", color: "#00a9ff" }}>Compare Mode</h3>
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          borderBottom: "2px solid rgba(0,169,255,0.3)",
          paddingBottom: "10px",
        }}
      >
        <button
          onClick={() => setActiveTab("left")}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "6px",
            border: "none",
            background:
              activeTab === "left"
                ? "linear-gradient(135deg, rgba(0,169,255,0.5), rgba(88,28,135,0.5))"
                : "rgba(0,0,0,0.2)",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.3s ease",
            fontSize: "14px",
          }}
        >
          ← Left Map
        </button>
        <button
          onClick={() => setActiveTab("right")}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "6px",
            border: "none",
            background:
              activeTab === "right"
                ? "linear-gradient(135deg, rgba(0,169,255,0.5), rgba(88,28,135,0.5))"
                : "rgba(0,0,0,0.2)",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.3s ease",
            fontSize: "14px",
          }}
        >
          Right Map →
        </button>
      </div>
      {/* Base Layers Section */}
      <div style={{ marginBottom: "20px" }}>
        <h4
          style={{
            fontSize: "14px",
            color: "#888",
            marginBottom: "10px",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Base Map {activeTab === "left" ? "(Left)" : "(Right)"}
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {baseLayers.map((layer) => (
            <div
              key={layer.id}
              onClick={() => setCurrentBaseLayer(layer.id)}
              style={{
                padding: "12px",
                borderRadius: "8px",
                background:
                  currentBaseLayer === layer.id
                    ? "linear-gradient(135deg, rgba(0,169,255,0.3), rgba(88,28,135,0.3))"
                    : "rgba(0,0,0,0.2)",
                border:
                  currentBaseLayer === layer.id
                    ? "2px solid #00a9ff"
                    : "2px solid rgba(255,255,255,0.1)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span style={{ fontSize: "24px" }}>{layer.icon}</span>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    color: "white",
                  }}
                >
                  {layer.title}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#aaa",
                    marginTop: "2px",
                  }}
                >
                  {layer.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Overlay Layers by Category */}
      {Object.entries(layersByCategory).map(([category, layers]) => {
        const categoryLayers = layers.filter((l) => l.type === "overlay");
        if (categoryLayers.length === 0) return null;

        return (
          <div key={category} style={{ marginBottom: "20px" }}>
            <h4
              style={{
                fontSize: "14px",
                color: "#888",
                marginBottom: "10px",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              {category} {activeTab === "left" ? "(Left)" : "(Right)"}
            </h4>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {categoryLayers.map((layer) => {
                const isActive = currentOverlays.includes(layer.id);
                return (
                  <div
                    key={layer.id}
                    onClick={() => toggleOverlay(layer.id)}
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      background: isActive
                        ? "linear-gradient(135deg, rgba(0,169,255,0.3), rgba(88,28,135,0.3))"
                        : "rgba(0,0,0,0.2)",
                      border: isActive
                        ? "2px solid #00a9ff"
                        : "2px solid rgba(255,255,255,0.1)",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      opacity: isActive ? 1 : 0.7,
                    }}
                  >
                    <span style={{ fontSize: "24px" }}>{layer.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: "14px",
                          color: "white",
                        }}
                      >
                        {layer.title}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#aaa",
                          marginTop: "2px",
                        }}
                      >
                        {layer.description}
                      </div>
                    </div>
                    {isActive && (
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          background: "#00a9ff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        ✓
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Info box */}
      <div
        style={{
          marginTop: "20px",
          padding: "12px",
          background: "rgba(0,169,255,0.1)",
          borderRadius: "8px",
          border: "1px solid rgba(0,169,255,0.3)",
          fontSize: "12px",
          color: "#aaa",
        }}
      >
        💡 <strong>Tip:</strong> Switch between left and right maps to customize
        each side independently!
      </div>
    </div>
  );
};

const LabelTool = ({ newLabelLocation, imageName }) => {
  const [labelName, setLabelName] = useState("");
  const [visibility, setVisibility] = useState("private");
  const [pointsToAdd, setPointsToAdd] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!newLabelLocation) {
      alert("Please click on the map to set a label location!");
      return;
    }

    const labelData = {
      name: labelName,
      x_axis: newLabelLocation.lat,
      y_axis: newLabelLocation.lng,
      imageName: imageName,
      visibility: visibility,
    };

    fetch("http://localhost:5000/api/v1/labels/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(labelData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Response from backend:", data);
        setPointsToAdd(30);
      })
      .catch((err) => console.error("Error:", err));
  };

  return (
    <div className="tool-interface">
      <h3>Create a Label</h3>
      <div
        className="label-preview"
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <input
          type="text"
          placeholder="Enter label name"
          value={labelName}
          onChange={(e) => setLabelName(e.target.value)}
        />
        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
          style={{
            padding: "6px 10px",
            borderRadius: "6px",
            border: "1px solid rgba(0,169,255,0.3)",
            background: "rgba(11, 61, 145, 0.8)",
            color: "white",
          }}
        >
          <option value="private">Only me</option>
          <option value="public">Everyone</option>
        </select>
        <button className="save-btn" onClick={handleSubmit}>
          Save Label
        </button>

        {newLabelLocation && (
          <p>
            Selected Location: {newLabelLocation.lat.toFixed(3)},{" "}
            {newLabelLocation.lng.toFixed(3)}
          </p>
        )}
      </div>
      {pointsToAdd && <AddPoints newPoints={pointsToAdd} />}
    </div>
  );
};

const StoryTool = ({ newLabelLocation, onStoryLoad }) => {
  const [loading, setLoading] = useState(false);
  const [storyInfo, setStoryInfo] = useState(null);
  const [error, setError] = useState(null);

  const fetchLocationInfo = async () => {
    if (!newLabelLocation) {
      setError("Please click on the map to select a location first.");
      setStoryInfo(null);
      return;
    }

    setLoading(true);
    setError(null);
    setStoryInfo(null);

    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/ai/location-info",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lat: newLabelLocation.lat,
            lng: newLabelLocation.lng,
          }),
        }
      );
      // Inside StoryTool, add after fetching
      if (storyInfo) {
        // Optionally, close drawer after success
        onStoryLoad(); // You can pass this from parent
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setStoryInfo(data); // Expect { title, description, facts, image, source }
    } catch (err) {
      console.error("Failed to fetch AI story:", err);
      setError("Failed to fetch location information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch when location changes
  React.useEffect(() => {
    if (newLabelLocation) {
      fetchLocationInfo();
    }
  }, [newLabelLocation]);

  return (
    <div
      className="tool-interface"
      style={{ maxHeight: "70vh", overflowY: "auto" }}
    >
      <h3>Create a Story</h3>

      {!newLabelLocation ? (
        <div style={{ textAlign: "center", padding: "30px", color: "#aaa" }}>
          <p>🌍 Click on the map to select a location.</p>
          <p>Then, we’ll generate a story about it using AI.</p>
        </div>
      ) : loading ? (
        <div style={{ textAlign: "center", padding: "30px" }}>
          <p>✨ Generating story from AI...</p>
        </div>
      ) : error ? (
        <div
          style={{
            color: "#ff6b6b",
            padding: "15px",
            backgroundColor: "rgba(255, 107, 107, 0.1)",
            borderRadius: "8px",
          }}
        >
          {error}
        </div>
      ) : storyInfo ? (
        <div style={{ marginBottom: "20px", lineHeight: "1.6" }}>
          {storyInfo.image && (
            <div style={{ textAlign: "center", marginBottom: "15px" }}>
              <img
                src={storyInfo.image}
                alt={storyInfo.title}
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                }}
              />
            </div>
          )}
          <h4 style={{ color: "#00a9ff", marginTop: "0" }}>
            {storyInfo.title}
          </h4>
          <p style={{ marginBottom: "15px", fontSize: "15px" }}>
            {storyInfo.description}
          </p>

          {storyInfo.facts && (
            <div
              style={{
                borderLeft: "4px solid #00a9ff",
                paddingLeft: "15px",
                margin: "20px 0",
              }}
            >
              <strong>Extra Facts:</strong>
              <ul style={{ marginTop: "10px" }}>
                {storyInfo.facts.map((fact, index) => (
                  <li
                    key={index}
                    style={{ marginBottom: "5px", color: "#ddd" }}
                  >
                    {fact}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {storyInfo.source && (
            <p
              style={{
                fontSize: "12px",
                color: "#888",
                fontStyle: "italic",
                marginTop: "20px",
              }}
            >
              Source: {storyInfo.source}
            </p>
          )}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "30px", color: "#aaa" }}>
          <p>AI content will appear here once you select a location.</p>
          <button
            onClick={fetchLocationInfo}
            style={{
              padding: "8px 16px",
              backgroundColor: "#00a9ff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "bold",
              marginTop: "10px",
            }}
          >
            Generate Story
          </button>

          {newLabelLocation && (
            <p>
              Selected Location: {newLabelLocation.lat.toFixed(3)},{" "}
              {newLabelLocation.lng.toFixed(3)}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const DateTool = ({ date, setDate }) => (
  <div className="tool-interface">
    <h3>Select Date</h3>
    <input
      type="date"
      value={date}
      onChange={(e) => setDate(e.target.value)}
      style={{
        padding: "6px 10px",
        borderRadius: "6px",
        border: "1px solid rgba(0,169,255,0.3)",
        background: "rgba(0,0,0,0.1)",
        color: "white",
      }}
    />
  </div>
);

export default DynamicSidebar;
