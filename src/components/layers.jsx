export const layerCategories = [
  // BASE LAYERS
  {
    id: "MODIS_Terra_CorrectedReflectance_TrueColor",
    title: "MODIS True Color (Terra)",
    matrixSet: "GoogleMapsCompatible_Level9",
    format: "jpg",
    type: "base",
    description: "Natural color satellite imagery",
    opacity: 1.0,
    category: "Base Maps",
    icon: "🌍",
  },
  {
    id: "VIIRS_CityLights_2012",
    title: "Earth at Night ",
    matrixSet: "GoogleMapsCompatible_Level8",
    format: "jpeg", // jpeg is often used in GIBS, but jpg works too
    type: "base",
    description:
      "A composite map of city lights from 2012, also known as 'The Black Marble'.",
    opacity: 1.0,
    category: "Base Maps",
    icon: "🌙",
  },
  {
    id: "VIIRS_NOAA20_CorrectedReflectance_TrueColor",
    title: "VIIRS True Color (NOAA-20)",
    matrixSet: "GoogleMapsCompatible_Level9",
    format: "jpg",
    type: "base",
    description: "High resolution true color",
    opacity: 1.0,
    category: "Base Maps",
    icon: "🌎",
  },

  // OVERLAY LAYERS - Organized by category
  {
    id: "MODIS_Terra_CorrectedReflectance_Bands721",
    title: "False Color (Urban)",
    matrixSet: "GoogleMapsCompatible_Level9",
    format: "jpg",
    type: "overlay",
    description: "Cities appear purple/brown",
    opacity: 0.8,
    category: "Visualization",
    icon: "🏙️",
  },
  {
    id: "VIIRS_NOAA20_CorrectedReflectance_BandsM11-I2-I1",
    title: "Night Infrared",
    matrixSet: "GoogleMapsCompatible_Level9",
    format: "jpg",
    type: "overlay",
    description: "Infrared view for night observation",
    opacity: 0.8,
    category: "Visualization",
    icon: "🌙",
  },
  {
    id: "VIIRS_NOAA20_CorrectedReflectance_BandsM3-I3-M11",
    title: "Shortwave Infrared",
    matrixSet: "GoogleMapsCompatible_Level9",
    format: "jpg",
    type: "overlay",
    description: "Useful for detecting fires and hot spots",
    opacity: 0.8,
    category: "Fire & Heat",
    icon: "🔥",
  },
  {
    id: "MODIS_Terra_Land_Surface_Temp_Day",
    title: "Land Surface Temperature",
    matrixSet: "GoogleMapsCompatible_Level7",
    format: "png",
    type: "overlay",
    description: "Surface temperature during daytime",
    opacity: 0.7,
    category: "Temperature",
    icon: "🌡️",
  },
  {
    id: "MODIS_Terra_Snow_Cover",
    title: "Snow Cover",
    matrixSet: "GoogleMapsCompatible_Level8",
    format: "png",
    type: "overlay",
    description: "Shows snow and ice coverage",
    opacity: 0.7,
    category: "Weather & Climate",
    icon: "❄️",
  },
  {
    id: "MODIS_Terra_Aerosol",
    title: "Aerosol Optical Depth",
    matrixSet: "GoogleMapsCompatible_Level6",
    format: "png",
    type: "overlay",
    description: "Air quality and atmospheric particles",
    opacity: 0.7,
    category: "Air Quality",
    icon: "💨",
  },
  {
    id: "MODIS_Terra_Water_Vapor_5km_Day",
    title: "Water Vapor",
    matrixSet: "GoogleMapsCompatible_Level6",
    format: "png",
    type: "overlay",
    description: "Atmospheric moisture content",
    opacity: 0.6,
    category: "Weather & Climate",
    icon: "💧",
  },
  {
    id: "MODIS_Terra_Cloud_Top_Temp_Day",
    title: "Cloud Top Temperature",
    matrixSet: "GoogleMapsCompatible_Level6",
    format: "png",
    type: "overlay",
    description: "Temperature at cloud tops",
    opacity: 0.7,
    category: "Weather & Climate",
    icon: "☁️",
  },
];

// Helper function to get layers by category
export const getLayersByCategory = () => {
  const categories = {};
  layerCategories.forEach((layer) => {
    if (!categories[layer.category]) {
      categories[layer.category] = [];
    }
    categories[layer.category].push(layer);
  });
  return categories;
};

// Helper function to get base layers
export const getBaseLayers = () => {
  return layerCategories.filter((l) => l.type === "base");
};

// Helper function to get overlay layers
export const getOverlayLayers = () => {
  return layerCategories.filter((l) => l.type === "overlay");
};
