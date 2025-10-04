
import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Text3D,
  Float,
  Environment,
  PerspectiveCamera,
  Stars,
  Sparkles,
} from "@react-three/drei";
import * as THREE from "three";

// Enhanced Map Card Component with unique designs
function MapCard({
  position,
  rotation,
  title,
  description,
  cardType,
  onClick,
  index,
}) {
  const meshRef = useRef();
  const glowRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Card type configurations
  const cardConfigs = {
    earth: {
      color: "#1a4d2e",
      emissive: "#2d6a4f",
      accentColor: "#40916c",
      glowColor: "#52b788",
      particleColor: "#74c69d",
    },
    starbirth: {
      color: "#4d194d",
      emissive: "#7b2cbf",
      accentColor: "#9d4edd",
      glowColor: "#c77dff",
      particleColor: "#e0aaff",
    },
    messier: {
      color: "#03045e",
      emissive: "#0077b6",
      accentColor: "#00b4d8",
      glowColor: "#48cae4",
      particleColor: "#90e0ef",
    },
  };

  const config = cardConfigs[cardType] || cardConfigs.earth;

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime + index * 2) * 0.15;
      
      if (hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.15, 1.15, 1.15), 0.1);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }

    if (glowRef.current) {
      glowRef.current.intensity = hovered ? 3 : 1.5;
      glowRef.current.distance = hovered ? 8 : 5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.8}>
      <group position={position} rotation={rotation}>
        {/* Main Card */}
        <mesh
          ref={meshRef}
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[3, 4, 0.4]} />
          <meshStandardMaterial
            color={hovered ? config.accentColor : config.color}
            metalness={0.9}
            roughness={0.1}
            emissive={config.emissive}
            emissiveIntensity={hovered ? 0.8 : 0.4}
          />
        </mesh>

        {/* Card Border Glow */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[3.1, 4.1, 0.3]} />
          <meshStandardMaterial
            color={config.glowColor}
            emissive={config.glowColor}
            emissiveIntensity={hovered ? 1.2 : 0.6}
            transparent
            opacity={0.3}
          />
        </mesh>

        {/* Title */}
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          size={0.3}
          height={0.08}
          position={[-1.2, 1.4, 0.25]}
          castShadow
        >
          {title}
          <meshStandardMaterial
            color={config.glowColor}
            emissive={config.accentColor}
            emissiveIntensity={1}
            metalness={0.8}
          />
        </Text3D>

        {/* Central Icon based on card type */}
        {cardType === "earth" && (
          <group position={[0, 0.3, 0.25]}>
            <mesh>
              <sphereGeometry args={[0.6, 32, 32]} />
              <meshStandardMaterial
                color="#1a759f"
                emissive="#168aad"
                emissiveIntensity={0.8}
                metalness={0.7}
                roughness={0.2}
              />
            </mesh>
            {/* Orbiting ring */}
            <mesh rotation={[Math.PI / 4, 0, Math.PI / 6]}>
              <torusGeometry args={[0.85, 0.05, 16, 100]} />
              <meshStandardMaterial
                color={config.glowColor}
                emissive={config.glowColor}
                emissiveIntensity={1}
              />
            </mesh>
          </group>
        )}

        {cardType === "starbirth" && (
          <group position={[0, 0.3, 0.25]}>
            {/* Central star */}
            <mesh>
              <sphereGeometry args={[0.4, 32, 32]} />
              <meshStandardMaterial
                color="#ffd60a"
                emissive="#ffd60a"
                emissiveIntensity={2}
              />
            </mesh>
            {/* Star rays */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <mesh
                key={i}
                position={[
                  Math.cos((angle * Math.PI) / 180) * 0.7,
                  Math.sin((angle * Math.PI) / 180) * 0.7,
                  0,
                ]}
                rotation={[0, 0, (angle * Math.PI) / 180]}
              >
                <coneGeometry args={[0.08, 0.4, 4]} />
                <meshStandardMaterial
                  color={config.particleColor}
                  emissive={config.glowColor}
                  emissiveIntensity={1.5}
                />
              </mesh>
            ))}
          </group>
        )}

        {cardType === "messier" && (
          <group position={[0, 0.3, 0.25]}>
            {/* Spiral galaxy representation */}
            <mesh>
              <torusGeometry args={[0.5, 0.15, 16, 100]} />
              <meshStandardMaterial
                color={config.accentColor}
                emissive={config.glowColor}
                emissiveIntensity={1.2}
              />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 3]}>
              <torusGeometry args={[0.35, 0.1, 16, 100]} />
              <meshStandardMaterial
                color={config.particleColor}
                emissive={config.glowColor}
                emissiveIntensity={1.5}
              />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.2, 32, 32]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#ffffff"
                emissiveIntensity={2}
              />
            </mesh>
          </group>
        )}

        {/* Description Text */}
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={0.14}
          height={0.03}
          position={[-1.1, -0.8, 0.25]}
          maxWidth={2}
        >
          {description}
          <meshStandardMaterial color="#e0e0e0" />
        </Text3D>

        {/* Decorative elements */}
        <mesh position={[-1.3, -1.5, 0.25]}>
          <boxGeometry args={[0.3, 0.05, 0.05]} />
          <meshStandardMaterial
            color={config.glowColor}
            emissive={config.glowColor}
            emissiveIntensity={1}
          />
        </mesh>

        {/* Point light for glow effect */}
        <pointLight
          ref={glowRef}
          position={[0, 0, 1]}
          intensity={hovered ? 3 : 1.5}
          distance={hovered ? 8 : 5}
          color={config.glowColor}
        />

        {/* Sparkles around card when hovered */}
        {hovered && (
          <Sparkles
            count={30}
            scale={3.5}
            size={2}
            speed={0.4}
            color={config.particleColor}
          />
        )}
      </group>
    </Float>
  );
}

// Enhanced Particle Background
function Particles() {
  const pointsRef = useRef();
  const particleCount = 2000;

  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 100;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    
    const color = new THREE.Color();
    color.setHSL(Math.random() * 0.3 + 0.5, 0.7, 0.5);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Rotating Planet in Background
function BackgroundPlanet() {
  const planetRef = useRef();

  useFrame((state) => {
    if (planetRef.current) {
      planetRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      planetRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.5;
    }
  });

  return (
    <mesh ref={planetRef} position={[0, 0, -15]}>
      <sphereGeometry args={[3, 64, 64]} />
      <meshStandardMaterial
        color="#1a1a2e"
        emissive="#16213e"
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.2}
      />
      {/* Atmosphere glow */}
      <mesh scale={1.1}>
        <sphereGeometry args={[3, 64, 64]} />
        <meshStandardMaterial
          color="#0f3460"
          transparent
          opacity={0.2}
          emissive="#0f3460"
          emissiveIntensity={0.5}
        />
      </mesh>
    </mesh>
  );
}

// Main Homepage Component
export default function HomePage() {
  const maps = [
    {
      id: "earth",
      title: "Earth View",
      description: "Explore our planet",
      cardType: "earth",
      path: "/Explora/worldmap",
    },
    {
      id: "starbirth",
      title: "Star Birth",
      description: "Witness stellar formation",
      cardType: "starbirth",
      path: "/Explora/starbirth",
    },
    {
      id: "messier",
      title: "Messier",
      description: "Deep space objects",
      cardType: "messier",
      path: "/Explora/messier",
    },
  ];

  // Position cards in an arc facing the camera
  const cardPositions = [
    { pos: [-5, 0, 0], rot: [0, Math.PI * 0.15, 0] },
    { pos: [0, 0, 2], rot: [0, 0, 0] },
    { pos: [5, 0, 0], rot: [0, -Math.PI * 0.15, 0] },
  ];

  const handleCardClick = (path) => {
    console.log(`Navigating to: ${path}`);
    // navigate(path); // Uncomment when using with router
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(180deg, #000428 0%, #004e92 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={60} />

        {/* Enhanced Lighting */}
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4a90e2" />
        <spotLight
          position={[0, 15, 10]}
          angle={0.4}
          penumbra={1}
          intensity={1.5}
          castShadow
          color="#7dd3fc"
        />
        <pointLight position={[0, 0, 5]} intensity={0.5} color="#a78bfa" />

        {/* Environment */}
        <Environment preset="night" />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        {/* Background Elements */}
        <Particles />
        <BackgroundPlanet />

        {/* Map Cards - Now facing the camera */}
        {maps.map((map, index) => (
          <MapCard
            key={map.id}
            position={cardPositions[index].pos}
            rotation={cardPositions[index].rot}
            title={map.title}
            description={map.description}
            cardType={map.cardType}
            index={index}
            onClick={() => handleCardClick(map.path)}
          />
        ))}

        {/* Controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          minDistance={8}
          maxDistance={20}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>

      {/* UI Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '40px',
        zIndex: 10,
      }}>
        <div style={{
          textAlign: 'center',
          animation: 'fadeInDown 1s ease-out',
        }}>
          <h1 style={{
            fontSize: '4rem',
            fontWeight: 900,
            margin: 0,
            fontFamily: '"Orbitron", sans-serif',
            background: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 30px rgba(0, 212, 255, 0.6))',
          }}>
            Cosmic Canvas
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: '#00d4ff',
            marginTop: '10px',
            textShadow: '0 0 10px rgba(0, 212, 255, 0.8)',
          }}>
            Navigate the Universe of Earth Data
          </p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontSize: '0.9rem',
            color: 'rgba(255, 255, 255, 0.7)',
            fontFamily: '"Orbitron", sans-serif',
          }}>
            🖱️ Drag to rotate • Scroll to zoom • Click cards to explore
          </p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontSize: '0.8rem',
            color: 'rgba(255, 255, 255, 0.5)',
            fontFamily: '"Orbitron", sans-serif',
          }}>
            Powered by NASA EOSDIS GIBS
          </p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
} 


