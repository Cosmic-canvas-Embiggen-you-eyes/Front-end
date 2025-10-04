// // SearchComponent.jsx
// import React, { useState } from "react";
// import "./SearchModal.css";

// const SearchComponent = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [result, setResult] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   const handleKeyDown = async (e) => {
//     if (e.key === "Enter") {
//       // هنا الفريق بتاع AI يحط الكود بتاعه
//       // المفروض يرجع object بالشكل ده
//       // { location: "اسم المكان", description: "الوصف الراجع من الـ AI" }

//       // مثال للتجربة
//       const responseFromAI = {
//         location: searchQuery || "Cairo",
//         description: "Cairo is the capital of Egypt with rich history and culture.",
//       };

//       setResult(responseFromAI);
//       setShowModal(true);
//     }
//   };

//   return (
//     <div className="search-container">
//       <div className="search-bar">
//         <span className="search-icon">🔍</span>
//         <input
//           type="text"
//           placeholder="Search locations..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           onKeyDown={handleKeyDown}
//         />
//       </div>

//       {showModal && result && (
//         <div className="modal-overlay">
//           <div className="modal">
//             <h2>{result.location}</h2>
//             <p>{result.description}</p>
//             <button onClick={() => setShowModal(false)}>Close</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SearchComponent;

// SearchComponent.jsx
import React, { useState } from "react";
import "./SearchModal.css";

const SearchComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      // هنا الفريق بتاع AI يحط الكود بتاعه
      // المفروض يرجع object بالشكل ده
      // { location: "اسم المكان", description: "الوصف الراجع من الـ AI" }

      // مثال للتجربة

      // fetch from backend
       const response = await fetch("http://localhost:5000/api/v1/ai", {
         method: "POST",
          headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ query: searchQuery }),
       });

       const responseFromAI = await response.json();
       console.log("Response from AI:", responseFromAI);
      setResult(responseFromAI);
      setShowModal(true);
    }
  };

  return (
    <div className="search-container">
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search locations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {showModal && result && (
  <div className="searchmod">
    <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
    <h3>{result.location}</h3>
    <p>{result.description}</p>
  </div>
)}

    </div>
  );
};

export default SearchComponent;
