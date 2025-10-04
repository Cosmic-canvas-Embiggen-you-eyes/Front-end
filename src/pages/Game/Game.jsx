import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Game.css";
import AddPoints from "../../components/AddPoints";
import { MAP_TYPES } from "../../components/mapConfigs";

// Default NASA questions (from original file)
const GAME_QUESTIONS_NASA = [
  // ... your original NASA questions
  {
    id: 1,
    question:
      "This region shows intense thermal anomalies in August 2023. Which location experienced massive wildfires?",
    coordinates: { lat: 19.8968, lng: -155.5828, zoom: 9 },
    date: "2023-08-15",
    layer: "MODIS_Combined_Thermal_Anomalies_All",
    baseLayer: "MODIS_Terra_CorrectedReflectance_TrueColor",
    answers: [
      { text: "California, USA", correct: false },
      { text: "Maui, Hawaii, USA", correct: true },
      { text: "Amazon Rainforest, Brazil", correct: false },
      { text: "Australian Outback", correct: false },
    ],
    explanation:
      "Maui experienced devastating wildfires in August 2023, particularly in Lahaina, becoming one of the deadliest U.S. wildfires in over a century.",
  },
  {
    id: 2,
    question:
      "Looking at the snow cover data, which mountain range is prominently visible in white?",
    coordinates: { lat: 28.0, lng: 86.0, zoom: 7 },
    date: "2024-01-15",
    layer: "MODIS_Terra_Snow_Cover",
    baseLayer: "MODIS_Terra_CorrectedReflectance_TrueColor",
    answers: [
      { text: "Andes", correct: false },
      { text: "Alps", correct: false },
      { text: "Himalayas", correct: true },
      { text: "Rocky Mountains", correct: false },
    ],
    explanation:
      "The Himalayas, home to Mount Everest, are the highest mountain range on Earth and show extensive snow cover year-round.",
  },
  {
    id: 3,
    question:
      "This massive desert shows extremely high land surface temperatures. Which desert is it?",
    coordinates: { lat: 23.4162, lng: 25.6628, zoom: 6 },
    date: "2023-07-20",
    layer: "MODIS_Terra_Land_Surface_Temp_Day",
    baseLayer: "MODIS_Terra_CorrectedReflectance_TrueColor",
    answers: [
      { text: "Sahara Desert, Africa", correct: true },
      { text: "Gobi Desert, Asia", correct: false },
      { text: "Mojave Desert, USA", correct: false },
      { text: "Arabian Desert", correct: false },
    ],
    explanation:
      "The Sahara Desert is the world's largest hot desert, covering most of North Africa with extreme daytime temperatures.",
  },
  {
    id: 4,
    question:
      "High chlorophyll concentration is visible in this ocean area. What phenomenon is occurring here?",
    coordinates: { lat: -15.0, lng: -75.0, zoom: 6 },
    date: "2023-06-01",
    layer: "MODIS_Aqua_Chlorophyll_A",
    baseLayer: "MODIS_Terra_CorrectedReflectance_TrueColor",
    answers: [
      { text: "Gulf Stream warming", correct: false },
      { text: "Coral reef growth", correct: false },
      { text: "Ice shelf melting", correct: false },
      { text: "Humboldt Current upwelling off Peru", correct: true },
    ],
    explanation:
      "The Humboldt Current brings nutrient-rich cold water to the surface, creating one of the world's most productive marine ecosystems.",
  },
  {
    id: 5,
    question:
      "This delta appears bright green in false color. Which major river delta is shown?",
    coordinates: { lat: 29.5, lng: 31.0, zoom: 8 },
    date: "2023-05-10",
    layer: null,
    baseLayer: "MODIS_Terra_CorrectedReflectance_Bands721",
    answers: [
      { text: "Nile Delta, Egypt", correct: true },
      { text: "Mississippi Delta, USA", correct: false },
      { text: "Ganges Delta, Bangladesh", correct: false },
      { text: "Amazon Delta, Brazil", correct: false },
    ],
    explanation:
      "The Nile Delta is one of the world's most fertile agricultural regions, appearing bright green in vegetation indices.",
  },
  {
    id: 6,
    question:
      "Severe aerosol pollution is visible over this megacity. Which city is it?",
    coordinates: { lat: 28.6139, lng: 77.209, zoom: 8 },
    date: "2023-11-05",
    layer: "MODIS_Aqua_Aerosol_Optical_Depth",
    baseLayer: "MODIS_Terra_CorrectedReflectance_TrueColor",
    answers: [
      { text: "Los Angeles, USA", correct: false },
      { text: "Mexico City, Mexico", correct: false },
      { text: "Delhi, India", correct: true },
      { text: "Beijing, China", correct: false },
    ],
    explanation:
      "Delhi frequently experiences severe air pollution, especially during winter months when agricultural burning combines with urban emissions.",
  },
  {
    id: 7,
    question:
      "This massive ice sheet appears white in true color. Which region is this?",
    coordinates: { lat: -75.0, lng: 0.0, zoom: 4 },
    date: "2023-12-01",
    layer: null,
    baseLayer: "MODIS_Terra_CorrectedReflectance_TrueColor",
    answers: [
      { text: "Siberia", correct: false },
      { text: "Antarctica", correct: true },
      { text: "Greenland", correct: false },
      { text: "Arctic Ocean", correct: false },
    ],
    explanation:
      "Antarctica is Earth's southernmost continent, covered by the largest ice sheet on the planet, containing about 90% of the world's ice.",
  },
  {
    id: 8,
    question:
      "Active volcanic thermal anomalies are detected here. Which volcanic region is this?",
    coordinates: { lat: -2.5, lng: 28.0, zoom: 7 },
    date: "2023-09-01",
    layer: "MODIS_Combined_Thermal_Anomalies_All",
    baseLayer: "MODIS_Terra_CorrectedReflectance_TrueColor",
    answers: [
      { text: "Mount Etna, Italy", correct: false },
      { text: "Kilauea, Hawaii", correct: false },
      { text: "Mount Fuji, Japan", correct: false },
      { text: "Virunga Mountains, DRC", correct: true },
    ],
    explanation:
      "The Virunga Mountains host several active volcanoes including Nyiragongo, which contains the world's largest lava lake.",
  },
  {
    id: 9,
    question:
      "This urban area glows bright in the night lights imagery. Which metropolitan area is it?",
    coordinates: { lat: 40.7128, lng: -74.006, zoom: 8 },
    date: "2023-08-01",
    layer: null,
    baseLayer: "VIIRS_NOAA20_CorrectedReflectance_BandsM11-I2-I1",
    answers: [
      { text: "London, UK", correct: false },
      { text: "Tokyo, Japan", correct: false },
      { text: "New York City, USA", correct: true },
      { text: "Shanghai, China", correct: false },
    ],
    explanation:
      "New York City is one of the most densely populated urban areas in the world, creating an intense concentration of artificial light visible from space.",
  },
  {
    id: 10,
    question:
      "Massive deforestation is visible in false color imagery. Which rainforest is affected?",
    coordinates: { lat: -3.4653, lng: -62.2159, zoom: 7 },
    date: "2023-08-15",
    layer: null,
    baseLayer: "MODIS_Terra_CorrectedReflectance_Bands721",
    answers: [
      { text: "Daintree Rainforest, Australia", correct: false },
      { text: "Amazon Rainforest, Brazil", correct: true },
      { text: "Congo Rainforest, Africa", correct: false },
      { text: "Borneo Rainforest, Indonesia", correct: false },
    ],
    explanation:
      "The Amazon Rainforest is the world's largest tropical rainforest but faces significant deforestation threats from agricultural expansion.",
  },
  {
    id: 11,
    question:
      "This massive lake system shows interesting patterns. Which Great Lake is this?",
    coordinates: { lat: 43.0, lng: -82.0, zoom: 7 },
    date: "2023-07-15",
    layer: null,
    baseLayer: "MODIS_Terra_CorrectedReflectance_TrueColor",
    answers: [
      { text: "Lake Huron", correct: true },
      { text: "Lake Superior", correct: false },
      { text: "Lake Michigan", correct: false },
      { text: "Lake Erie", correct: false },
    ],
    explanation:
      "Lake Huron is the second-largest of the Great Lakes by surface area and features the distinctive Georgian Bay.",
  },
  {
    id: 12,
    question:
      "Extensive snow cover is visible at this northern latitude. Which region is this?",
    coordinates: { lat: 64.0, lng: -18.0, zoom: 7 },
    date: "2024-01-20",
    layer: "MODIS_Terra_Snow_Cover",
    baseLayer: "MODIS_Terra_CorrectedReflectance_TrueColor",
    answers: [
      { text: "Norway", correct: false },
      { text: "Alaska", correct: false },
      { text: "Finland", correct: false },
      { text: "Iceland", correct: true },
    ],
    explanation:
      "Iceland sits on the Mid-Atlantic Ridge between North America and Europe, featuring numerous glaciers and active volcanic systems.",
  },
  {
    id: 13,
    question:
      "This peninsula shows distinct land surface temperature patterns. Which peninsula is it?",
    coordinates: { lat: 29.0, lng: 34.0, zoom: 7 },
    date: "2023-07-10",
    layer: "MODIS_Terra_Land_Surface_Temp_Day",
    baseLayer: "MODIS_Terra_CorrectedReflectance_TrueColor",
    answers: [
      { text: "Korean Peninsula", correct: false },
      { text: "Sinai Peninsula, Egypt", correct: true },
      { text: "Arabian Peninsula", correct: false },
      { text: "Iberian Peninsula", correct: false },
    ],
    explanation:
      "The Sinai Peninsula connects Africa and Asia, featuring desert landscapes with extreme daytime temperatures.",
  },
  {
    id: 14,
    question:
      "High chlorophyll levels indicate productive waters. Which ocean current creates this?",
    coordinates: { lat: 36.0, lng: -5.0, zoom: 7 },
    date: "2023-05-15",
    layer: "MODIS_Aqua_Chlorophyll_A",
    baseLayer: "MODIS_Terra_CorrectedReflectance_TrueColor",
    answers: [
      { text: "Kuroshio Current", correct: false },
      { text: "Benguela Current", correct: false },
      { text: "Gibraltar upwelling zone", correct: true },
      { text: "Gulf Stream", correct: false },
    ],
    explanation:
      "The Strait of Gibraltar creates unique upwelling conditions where Atlantic and Mediterranean waters mix, promoting high productivity.",
  },
  {
    id: 15,
    question:
      "This island chain shows volcanic thermal signatures. Which archipelago is this?",
    coordinates: { lat: -21.1151, lng: 55.5364, zoom: 10 },
    date: "2023-10-01",
    layer: "MODIS_Combined_Thermal_Anomalies_All",
    baseLayer: "MODIS_Terra_CorrectedReflectance_TrueColor",
    answers: [
      { text: "Réunion Island (Indian Ocean)", correct: true },
      { text: "Hawaiian Islands", correct: false },
      { text: "Galapagos Islands", correct: false },
      { text: "Canary Islands", correct: false },
    ],
    explanation:
      "Réunion Island features Piton de la Fournaise, one of the world's most active volcanoes, with frequent eruptions creating thermal anomalies.",
  },
  // Add more NASA questions...
];

const MapController = ({ center, zoom, isTransitioning }) => {
  const map = useMap();
  useEffect(() => {
    if (center && zoom) {
      map.flyTo([center.lat, center.lng], zoom, {
        animate: true,
        duration: 2.5,
        easeLinearity: 0.25,
      });
    }
  }, [center, zoom, map]);
  return null;
};

const GIBS_URL = (layerId, matrixSet, date, format) =>
  `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/${layerId}/default/${date}/${matrixSet}/{z}/{y}/{x}.${format}`;

const Game = ({
  onClose,
  questions = null,
  mapType = MAP_TYPES.NASA_WORLD,
}) => {
  // Use provided questions or default NASA questions
  const GAME_QUESTIONS = questions || GAME_QUESTIONS_NASA;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [pointsToAdd, setPointsToAdd] = useState(null);

  const question = GAME_QUESTIONS[currentQuestion];
  const isMessierMap = mapType === MAP_TYPES.MESSIER;

  // Show question after map transition
  useEffect(() => {
    setShowQuestion(false);
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setShowQuestion(true);
      setIsTransitioning(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, [currentQuestion]);

  const handleAnswerClick = (answerIndex) => {
    if (showResult) return;

    setSelectedAnswer(answerIndex);
    const isCorrect = question.answers[answerIndex].correct;
    setAnsweredCorrectly(isCorrect);
    setShowResult(true);

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < GAME_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setAnsweredCorrectly(false);
    } else {
      setGameComplete(true);
    }
  };

  const handleRestartGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameComplete(false);
    setAnsweredCorrectly(false);
    setPointsToAdd(null);
  };

  useEffect(() => {
    if (gameComplete) {
      const totalPoints = score * 10;
      setPointsToAdd(totalPoints);
    }
  }, [gameComplete, score]);

  const getLayerConfig = (layerId) => {
    const layerConfigs = {
      MODIS_Terra_CorrectedReflectance_TrueColor: {
        matrixSet: "GoogleMapsCompatible_Level9",
        format: "jpg",
      },
      MODIS_Terra_CorrectedReflectance_Bands721: {
        matrixSet: "GoogleMapsCompatible_Level9",
        format: "jpg",
      },
      MODIS_Combined_Thermal_Anomalies_All: {
        matrixSet: "GoogleMapsCompatible_Level9",
        format: "png",
      },
      MODIS_Terra_Snow_Cover: {
        matrixSet: "GoogleMapsCompatible_Level8",
        format: "png",
      },
      MODIS_Terra_Land_Surface_Temp_Day: {
        matrixSet: "GoogleMapsCompatible_Level7",
        format: "png",
      },
      MODIS_Aqua_Chlorophyll_A: {
        matrixSet: "GoogleMapsCompatible_Level7",
        format: "png",
      },
      MODIS_Aqua_Aerosol_Optical_Depth: {
        matrixSet: "GoogleMapsCompatible_Level6",
        format: "png",
      },
    };
    return (
      layerConfigs[layerId] ||
      layerConfigs.MODIS_Terra_CorrectedReflectance_TrueColor
    );
  };

  // Render appropriate map based on type
  const renderMap = () => {
    if (isMessierMap) {
      return (
        <TileLayer
          key={`messier-${currentQuestion}`}
          url="https://664cefeaf104.ngrok-free.app/tiles/{z}/{x}/{y}.png"
          attribution="&copy; Messier Catalog"
          tileSize={256}
          maxNativeZoom={5}
        />
      );
    } else {
      const baseConfig = getLayerConfig(question.baseLayer);
      const overlayConfig = question.layer
        ? getLayerConfig(question.layer)
        : null;

      return (
        <>
          <TileLayer
            key={`base-${question.baseLayer}-${question.date}`}
            url={GIBS_URL(
              question.baseLayer,
              baseConfig.matrixSet,
              question.date,
              baseConfig.format
            )}
            attribution="&copy; NASA EOSDIS GIBS"
            noWrap={true}
            tileSize={256}
            maxNativeZoom={9}
          />
          {question.layer && (
            <TileLayer
              key={`overlay-${question.layer}-${question.date}`}
              url={GIBS_URL(
                question.layer,
                overlayConfig.matrixSet,
                question.date,
                overlayConfig.format
              )}
              attribution="&copy; NASA EOSDIS GIBS"
              noWrap={true}
              tileSize={256}
              opacity={0.7}
              maxNativeZoom={parseInt(overlayConfig.matrixSet.match(/\d+/)[0])}
            />
          )}
        </>
      );
    }
  };

  return (
    <div className="game-container">
      {pointsToAdd && <AddPoints newPoints={pointsToAdd} />}

      {/* Compact Progress Bar */}
      <div className="progress-container-compact">
        <div className="progress-wrapper">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${
                  ((currentQuestion + 1) / GAME_QUESTIONS.length) * 100
                }%`,
              }}
            />
          </div>
          <div className="progress-info">
            <span className="progress-count">
              {currentQuestion + 1} / {GAME_QUESTIONS.length}
            </span>
            <span className="score-badge">
              <span className="score-icon">⭐</span>
              {score}
            </span>
          </div>
        </div>
      </div>

      {/* Full Screen Map */}
      <div className="game-map-fullscreen">
        <MapContainer
          center={[question.coordinates.lat, question.coordinates.lng]}
          zoom={question.coordinates.zoom}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <MapController
            center={question.coordinates}
            zoom={question.coordinates.zoom}
            isTransitioning={isTransitioning}
          />

          {renderMap()}

          <Circle
            center={[question.coordinates.lat, question.coordinates.lng]}
            radius={50000}
            pathOptions={{
              color: "#00a9ff",
              fillColor: "#00a9ff",
              fillOpacity: 0.3,
              weight: 3,
              className: "pulse-circle",
            }}
          >
            <Popup>
              <div style={{ textAlign: "center", fontWeight: "bold" }}>
                📍 Question Location
              </div>
            </Popup>
          </Circle>
          <Circle
            center={[question.coordinates.lat, question.coordinates.lng]}
            radius={30000}
            pathOptions={{
              color: "#fff",
              fillColor: "#00a9ff",
              fillOpacity: 0.6,
              weight: 2,
              className: "pulse-circle-inner",
            }}
          />
        </MapContainer>

        {/* Floating Info Badge - only show date for NASA maps */}
        {!isMessierMap && question.date && (
          <div className="map-info-floating">
            <span className="info-icon">📅</span>
            <span>{question.date}</span>
          </div>
        )}
      </div>

      {/* Floating Question Card */}
      {showQuestion && (
        <div className={`question-card-overlay ${showQuestion ? "show" : ""}`}>
          <div className="question-card">
            <div className="question-header">
              <div className="question-number">
                Question {currentQuestion + 1}
              </div>
              <h2 className="question-text">{question.question}</h2>
            </div>

            <div className="answers-compact-grid">
              {question.answers.map((answer, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = answer.correct;
                let buttonClass = "answer-compact-button";
                if (showResult && isSelected) {
                  buttonClass += isCorrect ? " correct" : " incorrect";
                } else if (showResult && isCorrect) {
                  buttonClass += " correct";
                }
                return (
                  <button
                    key={index}
                    className={buttonClass}
                    onClick={() => handleAnswerClick(index)}
                    disabled={showResult}
                  >
                    <span className="answer-letter">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="answer-text">{answer.text}</span>
                    {showResult && isCorrect && (
                      <span className="answer-icon">✓</span>
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <span className="answer-icon">✗</span>
                    )}
                  </button>
                );
              })}
            </div>

            {showResult && (
              <div
                className={`result-inline ${
                  answeredCorrectly ? "correct-result" : "incorrect-result"
                }`}
              >
                <div className="result-header">
                  <span className="result-icon">
                    {answeredCorrectly ? "🎉" : "💡"}
                  </span>
                  <span className="result-title">
                    {answeredCorrectly ? "Correct!" : "Not quite!"}
                  </span>
                </div>
                <p className="result-explanation">{question.explanation}</p>
                <button
                  className="next-compact-button"
                  onClick={handleNextQuestion}
                >
                  {currentQuestion < GAME_QUESTIONS.length - 1 ? (
                    <>Next →</>
                  ) : (
                    <>Results 🏆</>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <button className="game-close-btn" onClick={onClose}>
        ✕
      </button>
    </div>
  );
};

export default Game;
