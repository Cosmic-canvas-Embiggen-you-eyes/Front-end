import React, { useState, useEffect, useRef, useCallback } from "react";
import { useMap } from "react-leaflet";
import "./CustomZoom.css";

const CustomZoom = () => {
  const map = useMap();
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(map.getZoom());

  // Update our internal zoom level when the map's zoom changes
  useEffect(() => {
    const handleZoomEnd = () => setZoomLevel(map.getZoom());
    map.on("zoomend", handleZoomEnd);
    return () => {
      map.off("zoomend", handleZoomEnd);
    };
  }, [map]);

  // This function calculates and sets the zoom level based on a mouse event
  const setZoomFromEvent = useCallback(
    (e) => {
      if (!trackRef.current) return;

      const trackBounds = trackRef.current.getBoundingClientRect();
      const minZoom = map.getMinZoom();
      const maxZoom = map.getMaxZoom();

      // Calculate the click/drag position as a percentage from the bottom
      const percentage = 1 - (e.clientY - trackBounds.top) / trackBounds.height;

      // Clamp the percentage between 0 and 1
      const clampedPercentage = Math.max(0, Math.min(1, percentage));

      // Calculate the corresponding zoom level
      const newZoom = Math.round(
        minZoom + clampedPercentage * (maxZoom - minZoom)
      );

      map.setZoom(newZoom);
    },
    [map]
  );

  // Effect to handle dragging logic
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Prevent text selection while dragging
      e.preventDefault();
      setZoomFromEvent(e);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, setZoomFromEvent]);

  const handleMouseDownOnThumb = () => {
    setIsDragging(true);
  };

  const handleClickOnTrack = (e) => {
    setZoomFromEvent(e);
  };

  // Calculate the position of the thumb on the slider track
  const minZoom = map.getMinZoom();
  const maxZoom = map.getMaxZoom();
  const thumbPosition =
    maxZoom === minZoom
      ? 0
      : ((zoomLevel - minZoom) / (maxZoom - minZoom)) * 100;

  return (
    <div className="custom-zoom-control">
      <button
        className="zoom-btn"
        onClick={() => map.zoomIn()}
        aria-label="Zoom in"
      >
        +
      </button>

      <div
        ref={trackRef}
        className="zoom-slider-track"
        onClick={handleClickOnTrack}
      >
        <div
          className={`zoom-slider-thumb ${isDragging ? "dragging" : ""}`}
          style={{ bottom: `${thumbPosition}%` }}
          onMouseDown={handleMouseDownOnThumb}
        />
      </div>

      <button
        className="zoom-btn"
        onClick={() => map.zoomOut()}
        aria-label="Zoom out"
      >
        -
      </button>
    </div>
  );
};

export default CustomZoom;
