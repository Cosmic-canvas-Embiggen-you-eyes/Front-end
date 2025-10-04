import "./App.css";
import UniversalWorldMap from "./components/UniversalWorldMap";
import WelcomePage from "./pages/welcome/WelcomePage";
import HomePage from "./pages/HomePage/HomePage";
import RegistrationLogin from "./pages/auth/RegistrationLogin";
import Home from "./pages/home/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MAP_TYPES } from "./components/mapConfigs";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        {/* <Route path="/HomePage" element={<HomePage />} /> */}
        <Route path="/Explora" element={<WelcomePage />} />
        <Route path="/Explora/login" element={<RegistrationLogin />} />
        <Route path="/Explora/home" element={<HomePage />} />

        {/* NASA World Map Route */}
        <Route
          path="/Explora/worldmap"
          element={<UniversalWorldMap mapType={MAP_TYPES.NASA_WORLD} />}
        />

        {/* Messier Map Route - NEW! */}
        <Route
          path="/Explora/messier"
          element={<UniversalWorldMap mapType={MAP_TYPES.MESSIER} />}
        />

        <Route
          path="/Explora/starbirth"
          element={<UniversalWorldMap mapType={MAP_TYPES.STARBIRTH} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
