import React, { useState, useEffect } from "react";

function AddPoints({ newPoints }) {
  const [recentPoints, setRecentPoints] = useState(null);
  const [totalPoints, setTotalPoints] = useState(0);

  const addPointsToServer = async (points) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/v1/points/add`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ points }),
      });
      if (!res.ok) throw new Error("Failed to add points");
      const data = await res.json();
      return data.totalPoints || 0;
    } catch (err) {
      console.error(err);
      return totalPoints;
    }
  };

  useEffect(() => {
    if (!newPoints) return;

    (async () => {
      const updatedTotal = await addPointsToServer(newPoints);
      setTotalPoints(updatedTotal);
      setRecentPoints(newPoints);

      setTimeout(() => setRecentPoints(null), 1500);
    })();
  }, [newPoints]);

  if (!recentPoints) return null;

  return (
    <>
      <style>{`
        .points-badge {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(255, 215, 0, 0.9);
          padding: 8px 14px;
          border-radius: 14px;
          font-weight: 600;
          color: black;
          font-size: 18px;
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }
        .points-recent {
          color: white;
          background: rgba(255, 152, 0, 0.9);
          padding: 2px 6px;
          border-radius: 6px;
          font-size: 14px;
          animation: pop 0.8s ease forwards;
        }
        @keyframes pop {
          0% { transform: translateY(-8px) scale(0.6); opacity: 0; }
          50% { transform: translateY(-16px) scale(1.1); opacity: 1; }
          100% { transform: translateY(-24px) scale(1); opacity: 0; }
        }
      `}</style>

      <div className="points-badge">
        <span className="points-recent">+{recentPoints}</span>
      </div>
    </>
  );
}

export default AddPoints;
