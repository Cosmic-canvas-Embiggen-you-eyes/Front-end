// src/components/HubbleViewer.jsx
import React, { useEffect, useRef } from 'react';
import OpenSeadragon from 'openseadragon';

/**
 * HubbleViewer Component
 * This component is a wrapper around the OpenSeadragon library.
 * It takes a single prop, `dziPath`, which is the URL to the
 * Deep Zoom Image (.dzi) file that should be displayed.
 */
const HubbleViewer = ({ dziPath }) => {
  // useRef is used to get a direct reference to the div element in the DOM.
  // This allows OpenSeadragon to know where to attach itself.
  const viewerRef = useRef(null);

  // useEffect handles the lifecycle of the OpenSeadragon viewer.
  // It runs after the component has mounted to the screen.
  useEffect(() => {
    let viewer;

    // We only initialize the viewer if we have a valid path and the div element exists.
    if (dziPath && viewerRef.current) {
      viewer = OpenSeadragon({
        element: viewerRef.current,
        prefixUrl: 'https://openseadragon.github.io/openseadragon/images/', // Standard OSD icons
        tileSources: dziPath, // The most important part: the path to the tiled image data

        // Some optional settings for a better user experience
        animationTime: 0.8,
        blendTime: 0.1,
        constrainDuringPan: true,
        maxZoomPixelRatio: 2,
        minZoomLevel: 0.7,
        visibilityRatio: 1,
        zoomPerScroll: 1.8,
      });
    }

    // This is a cleanup function.
    // It runs when the component is about to unmount (be removed from the screen).
    // It's crucial for destroying the viewer instance to prevent memory leaks.
    return () => {
      if (viewer) {
        viewer.destroy();
      }
    };
  }, [dziPath]); // The effect depends on dziPath; it will re-run if the path changes.

  // The component renders a simple div. OpenSeadragon will take over this div.
  return (
    <div
      ref={viewerRef}
      style={{
        height: '100vh',
        width: '100%',
        background: '#000', // Black background for space images
      }}
    ></div>
  );
};

export default HubbleViewer;