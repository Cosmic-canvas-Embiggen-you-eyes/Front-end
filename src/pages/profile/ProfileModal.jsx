
// import React, { useEffect, useState } from "react";
// import { Award } from "lucide-react";
// import "./ProfileModal.css";
// import Starter from "./badges/Starter.png";
// import Learner from "./badges/Learner.png";
// import Riser from "./badges/Riser.png";
// import Ready from "./badges/Ready.png";
// import Builder from "./badges/Builder.png";
// import Achiever from "./badges/Achiever.png";
// import Confident from "./badges/Confident.png";
// import Shining from "./badges/Shining.png";
// import Refined from "./badges/Refined.png";
// import Expertise from "./badges/Expertise.png";
// import Strong from "./badges/Strong.png";
// import Dedicated from "./badges/Dedicated.png";
// import Master from "./badges/Master.png";
// import Beginner from './badges/Beginner.png';
// import Advanced from './badges/Advanced.png';
// import Expert from './badges/Expert.png';
// import Intermediate from './badges/Intermediate.png';


// const badges = {
//   1: { name: "Starter", desc: "You started your journey, every small step counts.", img: Starter },
//   2: { name: "Learner", desc: "Keep going, your skills are growing.", img: Learner },
//   3: { name: "Riser", desc: "Making progress, your confidence is rising.", img: Riser },
//   4: { name: "Ready", desc: "Almost ready for the next rank, your effort shows.", img: Ready },
//   5: { name: "Builder", desc: "You’ve moved beyond beginner, keep building your skills.", img: Builder },
//   6: { name: "Achiever", desc: "Your practice is paying off, progress is clear.", img: Achiever },
//   7: { name: "Confident", desc: "Confidence and ability are growing, keep pushing.", img: Confident },
//   8: { name: "Shining", desc: "Ready to step up to advanced, your effort shines.", img: Shining },
//   9: { name: "Refined", desc: "You’ve mastered the basics, time to refine your skills.", img: Refined },
//   10: { name: "Expertise", desc: "Your expertise is showing, keep challenging yourself.", img: Expertise },
//   11: { name: "Strong", desc: "Skill and confidence are at a high level, almost at the top.", img: Strong },
//   12: { name: "Dedicated", desc: "Ready to reach expert rank, your dedication stands out.", img: Dedicated },
//   13: { name: "Master", desc: "You’ve reached the peak, your mastery is complete.", img: Master },
// };

// const rankAvatars = {
//   Beginner:Beginner,
//   Intermediate: Intermediate,
//   Advanced: Advanced,
//   Expert: Expert,
// };

// const BadgeModal = ({ badge, onClose }) => {
//   if (!badge) return null;
//   return (
//     <div className="badge-modal">
//       <div className="badge-modal-content">
//         <div className="badge-icon">
//           <img src={badge.img} alt={badge.name} className="badge-modal-img" />
//         </div>
//         <h2 className="badge-title">New Badge Unlocked!</h2>
//         <h3 className="badge-name">{badge.name}</h3>
//         <p className="badge-desc">{badge.desc}</p>
//         <button className="close-badge-btn" onClick={onClose}>Close</button>
//       </div>
//     </div>
//   );
// };

// const ProfileModal = ({ open, setOpen, token }) => {
//   const [userData, setUserData] = useState({ username: "", points: 0, email: "" });
//   const [level, setLevel] = useState(0);
//   const [rank, setRank] = useState("Beginner");
//   const [rankAvatar, setRankAvatar] = useState(rankAvatars["Beginner"]);
//   const [lastLevel, setLastLevel] = useState(0);
//   const [newBadge, setNewBadge] = useState(null);

//   useEffect(() => {
//     if (!token) return;
//     fetch("http://localhost:5000/api/user/profile", {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         if (data) {
//           setUserData({ username: data.username || "", points: data.points || 0, email: data.email || "" });
//           setRank(data.rank || "Beginner");
//         }
//       })
//       .catch(() => setUserData({ username: "", points: 0, email: "" }));
//   }, [token]);

//   useEffect(() => {
//     const currentLevel = calculateLevel(userData.points);
//     let currentRank = rank;

//     if (currentLevel > levelThresholdForRank(rank)) {
//       currentRank = calculateRankByLevel(currentLevel);
//       setRank(currentRank);
//       setRankAvatar(rankAvatars[currentRank]);
  
//       fetch("http://localhost:5000/api/user/update-rank", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ level: currentLevel, rank: currentRank }),
//       });
//     } else {
//       setRankAvatar(rankAvatars[rank]);
//     }
  
//     setLevel(currentLevel);
  
//     if (currentLevel > lastLevel) {
//       setNewBadge(badges[currentLevel]);
//       setLastLevel(currentLevel);
//     }
//   }, [userData.points]);
  
//   const calculateLevel = (points) => Math.floor(points / 100);

//   const calculateRankByLevel = (lvl) => {
//     if (lvl >= 13) return "Expert";
//     if (lvl >= 9) return "Advanced";
//     if (lvl >= 5) return "Intermediate";
//     return "Beginner";
//   };

//   const levelThresholdForRank = (r) => {
//     switch(r){
//       case "Beginner": return 4;
//       case "Intermediate": return 8;
//       case "Advanced": return 12;
//       case "Expert": return 13;
//       default: return 0;
//     }
//   };

//   useEffect(() => {
//     const currentLevel = calculateLevel(userData.points);
//     let currentRank = rank;

//     // Upgrade rank if level exceeds threshold
//     if (currentLevel > levelThresholdForRank(rank)) {
//       currentRank = calculateRankByLevel(currentLevel);
//       setRank(currentRank);
//       setRankAvatar(rankAvatars[currentRank]);
//     } else {
//       setRankAvatar(rankAvatars[rank]);
//     }

//     setLevel(currentLevel);

//     if (currentLevel > lastLevel) {
//       setNewBadge(badges[currentLevel]);
//       setLastLevel(currentLevel);
//     }
//   }, [userData.points]);

//   if (!open) return null;

//   return (
//     <>
//       <div className={`profile-sidebar ${open ? "open" : ""}`}>
//         <div className="sidebar-header">
//           <h3>{userData.username || "Guest Profile"}</h3>
//           <button className="close-btn" onClick={() => setOpen(false)}>×</button>
//         </div>

//         <div className="user-info">
//         <img src={rankAvatar} alt={rank} className="rank-avatar" />
//           <p><strong>Total Points:</strong> {userData.points}</p>
//           <p><strong>Level:</strong> {level}</p>
//           <p><strong>Rank:</strong> {rank}</p>
          
//         </div>

//         <div className="badges">
//           {Array.from({ length: level }, (_, i) => {
//             const lvl = i + 1;
//             return (
//               <div
//                 key={lvl}
//                 className="badge"
//                 onClick={() => setNewBadge(badges[lvl])}
//                 style={{ cursor: "pointer" }}
//               >
//                 <Award size={26} />
//               </div>
//             );
//           })}
//         </div>

//         <button className="logout-btn" onClick={() => alert("Logout clicked")}>Logout</button>
        
//       </div>

//       <BadgeModal badge={newBadge} onClose={() => setNewBadge(null)} />
//     </>
//   );
// };

// export default ProfileModal;

import React, { useEffect, useState } from "react";
import { Award } from "lucide-react";
import "./ProfileModal.css";
import Starter from "./badges/Starter.png";
import Learner from "./badges/Learner.png";
import Riser from "./badges/Riser.png";
import Ready from "./badges/Ready.png";
import Builder from "./badges/Builder.png";
import Achiever from "./badges/Achiever.png";
import Confident from "./badges/Confident.png";
import Shining from "./badges/Shining.png";
import Refined from "./badges/Refined.png";
import Expertise from "./badges/Expertise.png";
import Strong from "./badges/Strong.png";
import Dedicated from "./badges/Dedicated.png";
import Master from "./badges/Master.png";
import Beginner from "./badges/Beginner.png";
import Intermediate from "./badges/Intermediate.png";
import Advanced from "./badges/Advanced.png";
import Expert from "./badges/Expert.png";

const badges = {
  1: { name: "Starter", desc: "You started your journey, every small step counts.", img: Starter },
  2: { name: "Learner", desc: "Keep going, your skills are growing.", img: Learner },
  3: { name: "Riser", desc: "Making progress, your confidence is rising.", img: Riser },
  4: { name: "Ready", desc: "Almost ready for the next rank, your effort shows.", img: Ready },
  5: { name: "Builder", desc: "You’ve moved beyond beginner, keep building your skills.", img: Builder },
  6: { name: "Achiever", desc: "Your practice is paying off, progress is clear.", img: Achiever },
  7: { name: "Confident", desc: "Confidence and ability are growing, keep pushing.", img: Confident },
  8: { name: "Shining", desc: "Ready to step up to advanced, your effort shines.", img: Shining },
  9: { name: "Refined", desc: "You’ve mastered the basics, time to refine your skills.", img: Refined },
  10: { name: "Expertise", desc: "Your expertise is showing, keep challenging yourself.", img: Expertise },
  11: { name: "Strong", desc: "Skill and confidence are at a high level, almost at the top.", img: Strong },
  12: { name: "Dedicated", desc: "Ready to reach expert rank, your dedication stands out.", img: Dedicated },
  13: { name: "Master", desc: "You’ve reached the peak, your mastery is complete.", img: Master },
};

const rankAvatars = {
  Beginner: Beginner,
  Intermediate: Intermediate,
  Advanced: Advanced,
  Expert: Expert,
};

const BadgeModal = ({ badge, onClose }) => {
  if (!badge) return null;
  return (
    <div className="badge-modal">
      <div className="badge-modal-content">
        <div className="badge-icon">
          <img src={badge.img} alt={badge.name} className="badge-modal-img" />
        </div>
        <h2 className="badge-title">New Badge Unlocked!</h2>
        <h3 className="badge-name">{badge.name}</h3>
        <p className="badge-desc">{badge.desc}</p>
        <button className="close-badge-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

const ProfileModal = ({ open, setOpen }) => {
  const [userData, setUserData] = useState({ username: "", points: 0, email: "" });
  const [level, setLevel] = useState(0);
  const [rank, setRank] = useState("Beginner");
  const [rankAvatar, setRankAvatar] = useState(rankAvatars["Beginner"]);
  const [lastLevel, setLastLevel] = useState(0);
  const [newBadge, setNewBadge] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:5000/api/user/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setUserData({
            username: data.username || "",
            points: data.points || 0,
            email: data.email || "",
          });
          setRank(data.rank || "Beginner");
        }
      })
      .catch(() => setUserData({ username: "", points: 0, email: "" }));
  }, [token]);

  const calculateLevel = (points) => Math.floor(points / 100);

  const calculateRankByLevel = (lvl) => {
    if (lvl >= 13) return "Expert";
    if (lvl >= 9) return "Advanced";
    if (lvl >= 5) return "Intermediate";
    return "Beginner";
  };

  const levelThresholdForRank = (r) => {
    switch (r) {
      case "Beginner":
        return 4;
      case "Intermediate":
        return 8;
      case "Advanced":
        return 12;
      case "Expert":
        return 13;
      default:
        return 0;
    }
  };

  useEffect(() => {
    const currentLevel = calculateLevel(userData.points);
    let currentRank = rank;

    if (currentLevel > levelThresholdForRank(rank)) {
      currentRank = calculateRankByLevel(currentLevel);
      setRank(currentRank);
      setRankAvatar(rankAvatars[currentRank]);

      fetch("http://localhost:5000/api/user/update-rank", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ level: currentLevel, rank: currentRank }),
      });
    } else {
      setRankAvatar(rankAvatars[rank]);
    }

    setLevel(currentLevel);

    if (currentLevel > lastLevel) {
      setNewBadge(badges[currentLevel]);
      setLastLevel(currentLevel);
    }
  }, [userData.points]);

  if (!open) return null;

  return (
    <>
      <div className="profile-window" style={{ maxHeight: "60vh", overflowY: "auto" }}>
        <div className="profile-header">
          <h3>{userData.username || " Profile"}</h3>
          {/* <button className="close-btn" onClick={() => setOpen(false)}>×</button> */}
        </div>

        <div className="profile-body">
          <div className="user-info">
            <img src={rankAvatar} alt={rank} className="rank-avatar" />
            <p><strong>Total Points:</strong> {userData.points}</p>
            <p><strong>Level:</strong> {level}</p>
            <p><strong>Rank:</strong> {rank}</p>
            
            
          </div>

          <div className="badges">
            {Array.from({ length: level }, (_, i) => {
              const lvl = i + 1;
              return (
                <div
                  key={lvl}
                  className="badge"
                  onClick={() => setNewBadge(badges[lvl])}
                  style={{ cursor: "pointer" }}
                >
                  <Award size={26} />
                </div>
              );
            })}
          </div>

          {/* <button className="logout-btn" onClick={() => alert("Logout clicked")}>
            Logout
          </button> */}
        </div>
      </div>

      <BadgeModal badge={newBadge} onClose={() => setNewBadge(null)} />
    </>
  );
};

export default ProfileModal;
