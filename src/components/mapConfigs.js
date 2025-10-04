// mapConfigs.js - Central configuration for all map types

export const MAP_TYPES = {
  NASA_WORLD: "nasa_world",
  MESSIER: "messier",
  STARBIRTH: "starbirth",
};

export const mapConfigs = {
  [MAP_TYPES.NASA_WORLD]: {
    name: "NASA World View",
    component: "NasaWorldMap",
    features: {
      layers: true,
      label: true,
      story: true,
      compare: true,
      date: true,
      game: true,
      profile: true,
      chatbot: true,
    },
    defaultBaseLayer: "MODIS_Terra_CorrectedReflectance_TrueColor",
    defaultDate: new Date().toISOString().split("T")[0],
    game: {
      enabled: true,
      questionsFile: "GAME_QUESTIONS_NASA",
    },
  },
  [MAP_TYPES.MESSIER]: {
    name: "Messier Catalog",
    component: "MessierMap",
    features: {
      layers: false,
      label: true,
      story: true,
      compare: false,
      date: false,
      game: true,
      profile: true,
      chatbot: true,
    },
    defaultBaseLayer: null,
    defaultDate: null,
    game: {
      enabled: true,
      questionsFile: "GAME_QUESTIONS_MESSIER",
    },
  },
  [MAP_TYPES.STARBIRTH]: {
    name: "Star Birth Regions",
    component: "StarBirthMap",
    features: {
      layers: false,
      label: true,
      story: true,
      compare: false,
      date: false,
      game: true,
      profile: true,
      chatbot: true,
    },
    defaultBaseLayer: null,
    defaultDate: null,
    game: {
      enabled: true,
      questionsFile: "GAME_QUESTIONS_STARBIRTH",
    },
  },
};

export const getMapConfig = (mapType) => {
  return mapConfigs[mapType] || mapConfigs[MAP_TYPES.NASA_WORLD];
};
