

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Telescope, User } from "lucide-react";
// import "./WelcomePage.css";
// import Background from './Background.png'; 

// const WelcomePage = () => {
//   const navigate = useNavigate();
//   const [experience, setExperience] = useState('');
//   const [askExperience, setAskExperience] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleGuestClick = () => {
//     setAskExperience(true);
//   };

//   const handleExperienceSubmit = async () => {
//     if (!experience) {
//       alert("Please select your experience");
//       return;
//     }
  
//     setIsSubmitting(true);
//     try {
//       const response = await fetch("http://localhost:5000/api/v1/guest/register", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({ experience })
// });

// const text = await response.text();
// console.log("Response status:", response.status);
// console.log("Response body:", text);

// if (!response.ok) {
//   throw new Error("Failed to create guest");
// }

  
//       const data = await response.json();
//       // السيرفر يرجع مثلاً { guestId: "Guest22", experience: "Beginner" }
//       console.log("Guest created:", data);
      
//       localStorage.setItem("guestId", data.guestId);
//       localStorage.setItem("guestExperience", data.experience);
  
//       navigate("/Explora/home");

//     } catch (error) {
//       console.error(error);
//       alert("Could not create guest. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
  

//   return (
//     <div className="welcome-page">
//       <div className="welcome-box">
//         <div className="welcome-header">
//           <Telescope className="welcome-icon" />
//           <h1 className="welcome-title">Cosmic Canvas</h1>
//           <p className="welcome-subtitle">
//             Explore the universe through your eyes. Contribute, learn, and be part of discovery.
//           </p>
//         </div>

//         {askExperience ? (
//           <div className="guest-experience-form">
//             <label>Select your experience:</label>
//             <select
//               value={experience}
//               onChange={(e) => setExperience(e.target.value)}
//             >
//               <option value="">-- Choose an option --</option>
//               <option value="Beginner">Beginner</option>
//               <option value="Intermediate">Intermediate</option>
//               <option value="Advanced">Advanced</option>
//             </select>
//             <button
//               onClick={handleExperienceSubmit}
//               className="btn btn-continue"
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? "Submitting..." : "Continue"}
//             </button>
//             <button
//               onClick={() => { setAskExperience(false); setExperience(''); }}
//               className="btn btn-cancel"
//               disabled={isSubmitting}
//             >
//               Cancel
//             </button>
//           </div>
//         ) : (
//           <div className="welcome-buttons">
//             <button onClick={() => navigate("/Explora/login")} className="btn btn-primary">
//               Log in / Register
//             </button>
//             <button onClick={handleGuestClick} className="btn btn-secondary">
//               <User className="btn-icon" />
//               Continue as Guest
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default WelcomePage;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Telescope, User } from "lucide-react";
import "./WelcomePage.css";
import welcomeVideo from "./welcomeved.mp4"; 

const WelcomePage = () => {
  const navigate = useNavigate();
  const [experience, setExperience] = useState('');
  const [askExperience, setAskExperience] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGuestClick = () => {
    setAskExperience(true);
  };

  const handleExperienceSubmit = async () => {
    if (!experience) {
      alert("Please select your experience");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:5000/api/v1/guest/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experience })
      });

      if (!response.ok) {
        throw new Error("Failed to create guest");
      }

      const data = await response.json();
      console.log("Guest created:", data);

      localStorage.setItem("guestId", data.guestId);
      localStorage.setItem("guestExperience", data.experience);

      navigate("/Explora/home");
    } catch (error) {
      console.error(error);
      alert("Could not create guest. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="welcome-page">
      {/* Video background */}
      <video autoPlay muted loop playsInline className="bg-video">
        <source src={welcomeVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlayed content */}
      <div className="welcome-box">
        <div className="welcome-header">
          <Telescope className="welcome-icon" />
          <h1 className="welcome-title">Cosmic Canvas</h1>
          <p className="welcome-subtitle">
            Explore the universe through your eyes. Contribute, learn, and be part of discovery.
          </p>
        </div>

        {askExperience ? (
          <div className="guest-experience-form">
            <label>Select your experience:</label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            >
              <option value="">-- Choose an option --</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <button
              onClick={handleExperienceSubmit}
              className="btn btn-continue"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Continue"}
            </button>
            <button
              onClick={() => { setAskExperience(false); setExperience(''); }}
              className="btn btn-cancel"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="welcome-buttons">
            <button onClick={() => navigate("/Explora/login")} className="btn btn-primary">
              Log in / Register
            </button>
            <button onClick={handleGuestClick} className="btn btn-secondary">
              <User className="btn-icon" />
              Continue as Guest
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomePage;
