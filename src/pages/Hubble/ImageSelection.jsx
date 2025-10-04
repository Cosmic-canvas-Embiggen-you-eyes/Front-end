// src/components/ImageSelectionTool.jsx
import React from "react";
import "./ImageSelection.css"; // We'll add some styles for this

const ImageSelection = ({ images, onSelectImage, activeImageDzi }) => {
  return (
    <div className="tool-interface">
      <h3>Hubble's Gallery</h3>
      <p>Select an image to explore.</p>
      <div className="image-list">
        {images.map((image) => (
          <div
            key={image.id}
            // Add an 'active' class to the currently selected image
            className={`image-item ${
              activeImageDzi === image.dziPath ? "active" : ""
            }`}
            onClick={() => onSelectImage(image.dziPath)}
          >
            <img
              src={image.thumbnail}
              alt={image.name}
              className="item-thumbnail"
            />
            <span className="item-name">{image.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSelection;
