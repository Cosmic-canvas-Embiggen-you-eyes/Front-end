// src/components/HubbleExperience.jsx
import React, { useState } from "react";
import { FaImages, FaMapMarkerAlt, FaBookOpen, FaClone } from "react-icons/fa";
import Sidebar from "./Sidebar";
import HubbleViewer from "./HubbleViewer";
import ImageSelection from "./ImageSelection";
import { hubbleObjects } from "./hubbleObjects";

// Define the tools specifically for the Hubble view
const hubbleTools = [
  {
    id: "images",
    icon: <FaImages size={24} />,
    name: "Images", // The word "Layers" is changed to "Images"
    magicSentence: "Select a celestial object from Hubble's vast gallery.",
  },
  {
    id: "label",
    icon: <FaMapMarkerAlt size={24} />,
    name: "Create Label",
    magicSentence: "Mark special stars, galaxies, or points of interest.",
  },
  {
    id: "story",
    icon: <FaBookOpen size={24} />,
    name: "Create Story",
    magicSentence: "Tell amazing stories about cosmic wonders.",
  },
  {
    id: "compare",
    icon: <FaClone size={24} />,
    name: "Compare",
    magicSentence:
      "Compare the same object over time or in different light spectrums.",
  },
];

const HubbleExperience = () => {
  const [currentDzi, setCurrentDzi] = useState(hubbleObjects[0].dziPath);
  const [activeTool, setActiveTool] = useState(null); // State for the active tool

  const handleSelectImage = (dziPath) => {
    setCurrentDzi(dziPath);
  };

  // This function decides which tool's UI to show inside the drawer
  const renderToolContent = () => {
    switch (activeTool) {
      case "images":
        return (
          <ImageSelection
            images={hubbleObjects}
            onSelectImage={handleSelectImage}
            activeImageDzi={currentDzi}
          />
        );
      case "label":
        return <LabelTool />;
      case "story":
        return <StoryTool />;
      case "compare":
        return <CompareTool />;
      default:
        return null; // No tool selected
    }
  };

  return (
    <div className=".world-view-container">
      <HubbleViewer key={currentDzi} dziPath={currentDzi} />

      {/* The flexible Sidebar component is used here */}
      <Sidebar
        viewMode="hubble "
        tools={hubbleTools}
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        // Pass the data props directly to the Sidebar
        hubbleImages={hubbleObjects}
        onImageSelect={handleSelectImage}
        activeDzi={currentDzi}
      />
      {/* The content to be rendered inside the drawer is passed as a child
        {renderToolContent()}
      </Sidebar> */}
    </div>
  );
};

export default HubbleExperience;
