import React, { useState, useEffect, useRef } from "react";
import './WorldMap.css'
import { FaRobot } from "react-icons/fa";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Chat mode selector: none | earth | cosmic | beginner | advanced
  const [mode, setMode] = useState(() => localStorage.getItem("chatMode") || "none");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getModePrefix = (m) => {
    switch (m) {
      case "earth":
        return "use earth methods";
      case "cosmic":
        return "search cosmic";
      case "beginner":
        return "beginner mode";
      case "advanced":
        return "advanced mode";
      default:
        return "";
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toISOString(),
      mode,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Prefix the prompt with the selected mode keyword for backend routing
      const prefix = getModePrefix(mode);
      const composedPrompt = prefix ? `${prefix} ${inputMessage}` : inputMessage;
      // Include the message being sent in the history context
      const history = [...messages.slice(-5), userMessage];

      const response = await fetch("http://localhost:5000/api/v1/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: composedPrompt,
          conversationHistory: history,
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      console.log("Response from AI:", data);

      // Helpers to detect and normalize cosmic/earth payloads
      const isCosmicPayload = (obj) => {
        if (!obj || typeof obj !== "object") return false;
        const required = [
          "title",
          "description",
          "imageUrl",
          "thumbnailUrl",
          "category",
          "releaseDate",
          "credits",
          "relevanceScore",
        ];
        return required.every((k) => k in obj);
      };
      const coerceNum = (v) => (typeof v === 'string' ? (v.trim() === '' ? NaN : Number(v)) : v);
      const isFiniteNum = (n) => typeof n === 'number' && isFinite(n);
      const isEarthPayload = (obj) => {
        if (!obj || typeof obj !== "object") return false;
        const baseKeysOk = ["date", "activeBaseLayer", "activeOverlays", "view", "context"].every((k) => k in obj);
        if (!baseKeysOk) return false;
        const overlaysOk = Array.isArray(obj.activeOverlays);
        const view = obj.view || {};
        const center = view.center || {};
        // Accept lng or lon, and numeric strings
        const lat = coerceNum(center.lat);
        const lng = coerceNum(center.lng ?? center.lon);
        const zoom = coerceNum(view.zoom);
        const numbersOk = isFiniteNum(lat) && isFiniteNum(lng) && isFiniteNum(zoom);
        return overlaysOk && numbersOk;
      };
      const normalizeEarthPayload = (obj) => {
        if (!obj || typeof obj !== 'object') return null;
        const v = obj.view || {};
        const c = v.center || {};
        const lat = coerceNum(c.lat);
        const lng = coerceNum(c.lng ?? c.lon);
        const zoom = coerceNum(v.zoom);
        const normalized = {
          date: obj.date,
          activeBaseLayer: obj.activeBaseLayer,
          activeOverlays: Array.isArray(obj.activeOverlays) ? obj.activeOverlays : [],
          view: {
            center: { lat: isFiniteNum(lat) ? lat : 0, lng: isFiniteNum(lng) ? lng : 0 },
            zoom: isFiniteNum(zoom) ? zoom : 3,
          },
          context: obj.context ?? "",
        };
        return normalized;
      };
      const tryParse = (val) => {
        if (typeof val === "string") {
          try { return JSON.parse(val); } catch { return null; }
        }
        if (typeof val === "object" && val !== null) return val;
        return null;
      };

      // Possible shapes we might receive
      const directObj = typeof data === "object" ? data : null;
      const candidate1 = tryParse(data?.response);
      const candidate2 = tryParse(data?.message);
      const candidate3 = directObj && isCosmicPayload(directObj) ? directObj : null;
      const parsedCosmic = [candidate1, candidate2, candidate3].find((c) => c && isCosmicPayload(c)) || null;
  const candidate4 = directObj && isEarthPayload(directObj) ? directObj : null;
  const parsedEarthRaw = [candidate1, candidate2, candidate4].find((c) => c && isEarthPayload(c)) || null;
  const parsedEarth = parsedEarthRaw ? normalizeEarthPayload(parsedEarthRaw) : null;

      let aiMessage;
      if (parsedCosmic) {
        aiMessage = {
          id: Date.now() + 1,
          text: parsedCosmic.title || "Hubble image result",
          sender: "ai",
          timestamp: new Date().toISOString(),
          mode,
          payloadType: "cosmic",
          payload: parsedCosmic,
        };
      } else if (parsedEarth) {
        aiMessage = {
          id: Date.now() + 1,
          text: parsedEarth.context || "Earth visualization configuration",
          sender: "ai",
          timestamp: new Date().toISOString(),
          mode,
          payloadType: "earth",
          payload: parsedEarth,
        };
      } else {
        aiMessage = {
          id: Date.now() + 1,
          text: data.response || data.message || "Sorry, I couldn't generate a response.",
          sender: "ai",
          timestamp: new Date().toISOString(),
          mode,
        };
      }

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I encountered an error. Please try again.",
        sender: "ai",
        timestamp: new Date().toISOString(),
        isError: true,
        mode,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      className="tool-interface chatbot-interface"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "70vh",
        maxHeight: "70vh",
        overflowX: "hidden", 
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "15px",
          borderBottom: "2px solid rgba(0,169,255,0.3)",
          background: "linear-gradient(135deg, rgba(0,169,255,0.2), rgba(88,28,135,0.2))",
        }}
      >
        <h3 style={{ margin: 0, color: "#00a9ff", display: "flex", alignItems: "center", gap: "10px" }}>
          <FaRobot size={24} />
          AI Assistant
        </h3>
        <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#aaa" }}>
          Ask me anything about space, maps, or astronomy!
        </p>
        {/* Mode selector */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
          <label htmlFor="chat-mode" style={{ fontSize: 12, color: "#c9e6ff" }}>Mode:</label>
          <select
            id="chat-mode"
            value={mode}
            onChange={(e) => {
              const val = e.target.value;
              setMode(val);
              try { localStorage.setItem("chatMode", val); } catch {}
            }}
            style={{
              background: "rgba(0, 0, 0, 0.3)",
              color: "#fff",
              border: "1px solid rgba(0,169,255,0.4)",
              borderRadius: 8,
              padding: "6px 10px",
              fontSize: 12,
              outline: "none",
            }}
          >
            <option value="none">No mode</option>
            <option value="earth">Earth JSON</option>
            <option value="cosmic">Search Cosmic</option>
            <option value="beginner">Beginner</option>
            <option value="advanced">Advanced</option>
          </select>
          {mode !== "none" && (
            <span style={{ fontSize: 11, color: "#8fd3ff" }}>
              Prefixed with: "{getModePrefix(mode)}"
            </span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="chatbot-messages"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          minWidth: 0, 
        }}
      >
        {messages.length === 0 ? (
          <div style={{ textAlign: "center", color: "#888", marginTop: "50px" }}>
            <FaRobot size={48} style={{ opacity: 0.3, marginBottom: "15px" }} />
            <p>Start a conversation with your AI assistant!</p>
            <div style={{ marginTop: "20px", fontSize: "13px" }}>
              <p style={{ marginBottom: "8px" }}>Try asking:</p>
              <ul style={{ listStyle: "none", padding: 0, color: "#00a9ff" }}>
                <li>• "What are Messier objects?"</li>
                <li>• "Explain star formation"</li>
                <li>• "Tell me about nebulae"</li>
              </ul>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isCosmic = msg.payloadType === "cosmic" && msg.payload;
            const isEarth = msg.payloadType === "earth" && msg.payload;
            return (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                  animation: "fadeIn 0.3s ease-in",
                }}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    background:
                      msg.sender === "user"
                        ? "linear-gradient(135deg, #00a9ff, #581c87)"
                        : msg.isError
                        ? "rgba(255, 107, 107, 0.2)"
                        : "rgba(0,0,0,0.3)",
                    border:
                      msg.sender === "user"
                        ? "1px solid rgba(0,169,255,0.5)"
                        : "1px solid rgba(255,255,255,0.1)",
                    color: "white",
                    fontSize: "14px",
                    lineHeight: "1.5",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                  }}
                >
                  {!isCosmic && !isEarth ? (
                    <div>{msg.text}</div>
                  ) : (
                    <div>
                      {isCosmic && (
                        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
                          <img
                            src={msg.payload.thumbnailUrl || msg.payload.imageUrl}
                            alt={msg.payload.title}
                            style={{
                              width: 160,
                              height: 120,
                              objectFit: "cover",
                              borderRadius: 8,
                              border: "1px solid rgba(255,255,255,0.15)",
                              background: "rgba(0,0,0,0.2)",
                            }}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          <div style={{ flex: 1, minWidth: 220 }}>
                            <div style={{ fontWeight: 700, marginBottom: 6 }}>{msg.payload.title}</div>
                            <div style={{ opacity: 0.9 }}>{msg.payload.description}</div>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8, fontSize: 12, opacity: 0.8 }}>
                              <span style={{ padding: "2px 8px", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999 }}>
                                {msg.payload.category}
                              </span>
                              <span>Release: {msg.payload.releaseDate}</span>
                              <span>Score: {(Number(msg.payload.relevanceScore) || 0).toFixed(2)}</span>
                            </div>
                            <div style={{ marginTop: 6, fontSize: 11, color: "#c9e6ff" }}>Credits: {msg.payload.credits}</div>
                            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                              <a
                                href={msg.payload.imageUrl}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  padding: "6px 10px",
                                  borderRadius: 8,
                                  border: "1px solid rgba(0,169,255,0.5)",
                                  color: "#fff",
                                  textDecoration: "none",
                                  background: "rgba(0,169,255,0.15)",
                                }}
                              >
                                View Image
                              </a>
                              <a
                                href={msg.payload.thumbnailUrl}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  padding: "6px 10px",
                                  borderRadius: 8,
                                  border: "1px solid rgba(0,169,255,0.5)",
                                  color: "#fff",
                                  textDecoration: "none",
                                  background: "rgba(0,169,255,0.15)",
                                }}
                              >
                                Zoomable
                              </a>
                              <button
                                onClick={async () => {
                                  try {
                                    await navigator.clipboard.writeText(JSON.stringify(msg.payload));
                                  } catch {}
                                }}
                                style={{
                                  padding: "6px 10px",
                                  borderRadius: 8,
                                  border: "1px solid rgba(255,255,255,0.2)",
                                  background: "rgba(255,255,255,0.08)",
                                  color: "#fff",
                                  cursor: "pointer",
                                }}
                              >
                                Copy JSON
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      {isEarth && (
                        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
                          <div style={{ flex: 1, minWidth: 260 }}>
                            <div style={{ fontWeight: 700, marginBottom: 6 }}>Earth visualization</div>
                            <div style={{ opacity: 0.9 }}>{msg.payload.context}</div>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8, fontSize: 12, opacity: 0.9 }}>
                              <span style={{ padding: "2px 8px", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999 }}>
                                Date: {msg.payload.date}
                              </span>
                              <span style={{ padding: "2px 8px", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999 }}>
                                Base: {msg.payload.activeBaseLayer}
                              </span>
                              <span style={{ padding: "2px 8px", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999 }}>
                                Zoom: {Number(msg.payload.view?.zoom).toFixed(2)}
                              </span>
                              <span style={{ padding: "2px 8px", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999 }}>
                                Center: {(Number(msg.payload.view?.center?.lat) || 0).toFixed(3)}, {(Number(msg.payload.view?.center?.lng) || 0).toFixed(3)}
                              </span>
                            </div>
                            {Array.isArray(msg.payload.activeOverlays) && msg.payload.activeOverlays.length > 0 && (
                              <div style={{ marginTop: 8, fontSize: 12 }}>
                                <div style={{ opacity: 0.85, marginBottom: 4 }}>Overlays:</div>
                                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                  {msg.payload.activeOverlays.map((o, idx) => (
                                    <span key={idx} style={{ padding: "2px 8px", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999 }}>
                                      {o}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                              <button
                                onClick={async () => {
                                  try {
                                    await navigator.clipboard.writeText(JSON.stringify(msg.payload));
                                  } catch {}
                                }}
                                style={{
                                  padding: "6px 10px",
                                  borderRadius: 8,
                                  border: "1px solid rgba(255,255,255,0.2)",
                                  background: "rgba(255,255,255,0.08)",
                                  color: "#fff",
                                  cursor: "pointer",
                                }}
                              >
                                Copy JSON
                              </button>
                              <button
                                onClick={() => {
                                  try {
                                    const evt = new CustomEvent('apply-earth-visualization', { detail: msg.payload });
                                    window.dispatchEvent(evt);
                                  } catch {}
                                }}
                                style={{
                                  padding: "6px 10px",
                                  borderRadius: 8,
                                  border: "1px solid rgba(0,169,255,0.5)",
                                  background: "rgba(0,169,255,0.15)",
                                  color: "#fff",
                                  cursor: "pointer",
                                }}
                              >
                                Apply to Map
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <div
                    style={{
                      fontSize: "10px",
                      color: "rgba(255,255,255,0.5)",
                      marginTop: "5px",
                      textAlign: msg.sender === "user" ? "right" : "left",
                    }}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {isLoading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "12px",
                background: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        style={{
          padding: "15px",
          borderTop: "2px solid rgba(0,169,255,0.3)",
          background: "rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ display: "flex", gap: "10px", alignItems: "center", minWidth: 0 }}>
          <input
            type="text"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: "25px",
              border: "1px solid rgba(0,169,255,0.3)",
              background: "rgba(11, 61, 145, 0.3)",
              color: "white",
              fontSize: "14px",
              outline: "none",
              minWidth: 0, // يمنع التمدد
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            style={{
              padding: "12px 24px",
              borderRadius: "25px",
              border: "none",
              background:
                !inputMessage.trim() || isLoading
                  ? "rgba(100,100,100,0.3)"
                  : "linear-gradient(135deg, #00a9ff, #581c87)",
              color: "white",
              fontSize: "14px",
              fontWeight: "bold",
              cursor: !inputMessage.trim() || isLoading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            {isLoading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;


// import React, { useState, useEffect, useRef } from "react";
// import { FaRobot } from "react-icons/fa";

// const Chatbot = () => {
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSendMessage = async () => {
//     if (!inputMessage.trim() || isLoading) return;

//     const userMessage = {
//       id: Date.now(),
//       text: inputMessage,
//       sender: "user",
//       timestamp: new Date().toISOString(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setInputMessage("");
//     setIsLoading(true);

//     try {
//       const response = await fetch("http://localhost:5000/api/v1/ai/chat", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           message: inputMessage,
//           conversationHistory: messages.slice(-5), // Send last 5 messages for context
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();

//       const aiMessage = {
//         id: Date.now() + 1,
//         text: data.response || data.message || "Sorry, I couldn't generate a response.",
//         sender: "ai",
//         timestamp: new Date().toISOString(),
//       };

//       setMessages((prev) => [...prev, aiMessage]);
//     } catch (error) {
//       console.error("Failed to send message:", error);
//       const errorMessage = {
//         id: Date.now() + 1,
//         text: "Sorry, I encountered an error. Please try again.",
//         sender: "ai",
//         timestamp: new Date().toISOString(),
//         isError: true,
//       };
//       setMessages((prev) => [...prev, errorMessage]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   return (
//     <div
//       className="tool-interface chatbot-interface"
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         height: "70vh",
//         maxHeight: "70vh",
//       }}
//     >
//       <div
//         style={{
//           padding: "15px",
//           borderBottom: "2px solid rgba(0,169,255,0.3)",
//           background: "linear-gradient(135deg, rgba(0,169,255,0.2), rgba(88,28,135,0.2))",
//         }}
//       >
//         <h3 style={{ margin: "0", color: "#00a9ff", display: "flex", alignItems: "center", gap: "10px" }}>
//           <FaRobot size={24} />
//           AI Assistant
//         </h3>
//         <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#aaa" }}>
//           Ask me anything about space, maps, or astronomy!
//         </p>
//       </div>

//       {/* Messages Container */}
//       <div
//         style={{
//           flex: 1,
//           overflowY: "auto",
//           padding: "20px",
//           display: "flex",
//           flexDirection: "column",
//           gap: "15px",
//         }}
//       >
//         {messages.length === 0 ? (
//           <div style={{ textAlign: "center", color: "#888", marginTop: "50px" }}>
//             <FaRobot size={48} style={{ opacity: 0.3, marginBottom: "15px" }} />
//             <p>Start a conversation with your AI assistant!</p>
//             <div style={{ marginTop: "20px", fontSize: "13px" }}>
//               <p style={{ marginBottom: "8px" }}>Try asking:</p>
//               <ul style={{ listStyle: "none", padding: 0, color: "#00a9ff" }}>
//                 <li>• "What are Messier objects?"</li>
//                 <li>• "Explain star formation"</li>
//                 <li>• "Tell me about nebulae"</li>
//               </ul>
//             </div>
//           </div>
//         ) : (
//           messages.map((msg) => (
//             <div
//               key={msg.id}
//               style={{
//                 display: "flex",
//                 justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
//                 animation: "fadeIn 0.3s ease-in",
//               }}
//             >
//               <div
//                 style={{
//                   maxWidth: "80%",
//                   padding: "12px 16px",
//                   borderRadius: "12px",
//                   background:
//                     msg.sender === "user"
//                       ? "linear-gradient(135deg, #00a9ff, #581c87)"
//                       : msg.isError
//                       ? "rgba(255, 107, 107, 0.2)"
//                       : "rgba(0,0,0,0.3)",
//                   border:
//                     msg.sender === "user"
//                       ? "1px solid rgba(0,169,255,0.5)"
//                       : "1px solid rgba(255,255,255,0.1)",
//                   color: "white",
//                   fontSize: "14px",
//                   lineHeight: "1.5",
//                   wordWrap: "break-word",
//                 }}
//               >
//                 <div>{msg.text}</div>
//                 <div
//                   style={{
//                     fontSize: "10px",
//                     color: "rgba(255,255,255,0.5)",
//                     marginTop: "5px",
//                     textAlign: msg.sender === "user" ? "right" : "left",
//                   }}
//                 >
//                   {new Date(msg.timestamp).toLocaleTimeString([], {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   })}
//                 </div>
//               </div>
//             </div>
//           ))
//         )}

//         {isLoading && (
//           <div style={{ display: "flex", justifyContent: "flex-start" }}>
//             <div
//               style={{
//                 padding: "12px 16px",
//                 borderRadius: "12px",
//                 background: "rgba(0,0,0,0.3)",
//                 border: "1px solid rgba(255,255,255,0.1)",
//               }}
//             >
//               <div className="typing-indicator">
//                 <span></span>
//                 <span></span>
//                 <span></span>
//               </div>
//             </div>
//           </div>
//         )}

//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input Container */}
//       <div
//         style={{
//           padding: "15px",
//           borderTop: "2px solid rgba(0,169,255,0.3)",
//           background: "rgba(0,0,0,0.2)",
//         }}
//       >
//         <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
//           <input
//             type="text"
//             placeholder="Type your message..."
//             value={inputMessage}
//             onChange={(e) => setInputMessage(e.target.value)}
//             onKeyPress={handleKeyPress}
//             disabled={isLoading}
//             style={{
//               flex: 1,
//               padding: "12px 16px",
//               borderRadius: "25px",
//               border: "1px solid rgba(0,169,255,0.3)",
//               background: "rgba(11, 61, 145, 0.3)",
//               color: "white",
//               fontSize: "14px",
//               outline: "none",
//               transition: "all 0.3s ease",
//             }}
//             onFocus={(e) => {
//               e.target.style.border = "1px solid rgba(0,169,255,0.6)";
//               e.target.style.background = "rgba(11, 61, 145, 0.5)";
//             }}
//             onBlur={(e) => {
//               e.target.style.border = "1px solid rgba(0,169,255,0.3)";
//               e.target.style.background = "rgba(11, 61, 145, 0.3)";
//             }}
//           />
//           <button
//             onClick={handleSendMessage}
//             disabled={!inputMessage.trim() || isLoading}
//             style={{
//               padding: "12px 24px",
//               borderRadius: "25px",
//               border: "none",
//               background:
//                 !inputMessage.trim() || isLoading
//                   ? "rgba(100,100,100,0.3)"
//                   : "linear-gradient(135deg, #00a9ff, #581c87)",
//               color: "white",
//               fontSize: "14px",
//               fontWeight: "bold",
//               cursor: !inputMessage.trim() || isLoading ? "not-allowed" : "pointer",
//               transition: "all 0.3s ease",
//               display: "flex",
//               alignItems: "center",
//               gap: "5px",
//             }}
//           >
//             {isLoading ? "..." : "Send"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chatbot;