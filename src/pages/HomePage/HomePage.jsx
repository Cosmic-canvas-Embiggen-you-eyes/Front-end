import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Text3D,
  Float,
  Environment,
  PerspectiveCamera,
} from "@react-three/drei";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import "./HomePage.css";

// Particle Background
function Particles() {
  const pointsRef = useRef();
  const particleCount = 1000;

  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
  }

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
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
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#00a9ff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Earth Card - Spherical Design
function EarthCard({ position, onClick, index }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();
  const groupRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      if (hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.15, 1.15, 1.15), 0.1);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
    if (groupRef.current) {
      groupRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime + index) * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={groupRef} position={position}>
        <mesh
          ref={meshRef}
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <sphereGeometry args={[1.5, 64, 64]} />
          <meshStandardMaterial
            color={hovered ? "#1e88e5" : "#0d47a1"}
            metalness={0.9}
            roughness={0.1}
            emissive={hovered ? "#1976d2" : "#0d47a1"}
            emissiveIntensity={hovered ? 0.6 : 0.3}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2, 0.02, 16, 100]} />
          <meshStandardMaterial
            color="#00d4ff"
            emissive="#00d4ff"
            emissiveIntensity={0.8}
          />
        </mesh>
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          size={0.2}
          height={0.05}
          position={[-0.6, 2.2, 0]}
        >
          World View
          <meshStandardMaterial
            color="#00d4ff"
            emissive="#00a9ff"
            emissiveIntensity={0.7}
          />
        </Text3D>
        {hovered && (
          <>
            <pointLight
              position={[0, 0, 3]}
              intensity={3}
              distance={8}
              color="#00d4ff"
            />
            <mesh position={[0, 0, 0]} scale={1.05}>
              <sphereGeometry args={[1.5, 32, 32]} />
              <meshBasicMaterial color="#00d4ff" transparent opacity={0.1} />
            </mesh>
          </>
        )}
      </group>
    </Float>
  );
}

// Messier Card - Hexagonal Design
function MessierCard({ position, onClick, index }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();
  const groupRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.1;
      if (hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.15, 1.15, 1.15), 0.1);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
    if (groupRef.current) {
      groupRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime + index) * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={groupRef} position={position}>
        <mesh
          ref={meshRef}
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <cylinderGeometry args={[1.5, 1.5, 0.3, 6]} />
          <meshStandardMaterial
            color={hovered ? "#7c3aed" : "#4c1d95"}
            metalness={0.8}
            roughness={0.2}
            emissive={hovered ? "#6d28d9" : "#4c1d95"}
            emissiveIntensity={hovered ? 0.6 : 0.3}
          />
        </mesh>
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          size={0.2}
          height={0.05}
          position={[-0.7, 2.2, 0]}
        >
          Messier Map
          <meshStandardMaterial
            color="#a855f7"
            emissive="#7c3aed"
            emissiveIntensity={0.7}
          />
        </Text3D>
        {hovered && (
          <>
            <pointLight
              position={[0, 0, 3]}
              intensity={3}
              distance={8}
              color="#a855f7"
            />
            <mesh position={[0, 0, 0]} scale={1.1}>
              <cylinderGeometry args={[1.5, 1.5, 0.3, 6]} />
              <meshBasicMaterial color="#a855f7" transparent opacity={0.1} />
            </mesh>
          </>
        )}
      </group>
    </Float>
  );
}

// Starbirth Card - Star/Pyramid Design
function StarbirthCard({ position, onClick, index }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();
  const groupRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      if (hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.15, 1.15, 1.15), 0.1);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
    if (groupRef.current) {
      groupRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime + index) * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={groupRef} position={position}>
        <mesh
          ref={meshRef}
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <coneGeometry args={[1.5, 1.8, 4]} />
          <meshStandardMaterial
            color={hovered ? "#f59e0b" : "#d97706"}
            metalness={0.9}
            roughness={0.1}
            emissive={hovered ? "#f59e0b" : "#d97706"}
            emissiveIntensity={hovered ? 0.7 : 0.4}
          />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[1.5, 1.8, 4]} />
          <meshStandardMaterial
            color={hovered ? "#f59e0b" : "#d97706"}
            metalness={0.9}
            roughness={0.1}
            emissive={hovered ? "#f59e0b" : "#d97706"}
            emissiveIntensity={hovered ? 0.7 : 0.4}
          />
        </mesh>
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          size={0.2}
          height={0.05}
          position={[-0.6, 2.5, 0]}
        >
          Star Birth
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#f59e0b"
            emissiveIntensity={0.7}
          />
        </Text3D>
        {hovered && (
          <>
            <pointLight
              position={[0, 0, 3]}
              intensity={4}
              distance={8}
              color="#fbbf24"
            />
            <mesh position={[0, 0, 0]}>
              <octahedronGeometry args={[2.2, 0]} />
              <meshBasicMaterial
                color="#fbbf24"
                transparent
                opacity={0.1}
                wireframe
              />
            </mesh>
          </>
        )}
      </group>
    </Float>
  );
}

// Main Homepage Component
export default function HomePage() {
  const navigate = useNavigate();

  const maps = [
    {
      id: "worldview",
      title: "World View",
      path: "/Explora/worldmap",
    },
    {
      id: "messeir",
      title: "Messeir Map",
      path: "/Explora/messier",
    },
    {
      id: "future",
      title: "Future Map",
      path: "/Explora/starbirth",
    },
  ];

  const radius = 4; // خليت الدايرة أضيق شوية
  const angleStep = (Math.PI * 2) / maps.length;
  const cardSpacing = 4.5;
  return (
    <div className="homepage-container">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={75} />
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Environment preset="night" />
        <Particles />
        {/* <CenterEarth /> */}

        {/* Map Cards in Circle - The Main Fix is Here! */}
        {maps.map((map, index) => {
          // const angle = angleStep * index;
          // const x = Math.cos(angle) * radius;
          // const z = Math.sin(angle) * radius;
          // const position = [x, 0, z];
          const x = (index - (maps.length - 1) / 2) * cardSpacing;
          const position = [x, 0, 0]; //  بنثبت الـ z على صفر عشان يكونوا في صف واحد

          // This logic chooses which card component to render
          if (map.id === "worldview") {
            return (
              <EarthCard
                key={map.id}
                position={position}
                index={index}
                onClick={() => navigate(map.path)}
              />
            );
          }
          if (map.id === "messeir") {
            return (
              <MessierCard
                key={map.id}
                position={position}
                index={index}
                onClick={() => navigate(map.path)}
              />
            );
          }
          if (map.id === "future") {
            return (
              <StarbirthCard
                key={map.id}
                position={position}
                index={index}
                onClick={() => navigate(map.path)}
              />
            );
          }
          return null; // Should not happen
        })}

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={5}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
      <div className="homepage-overlay">
        <div className="homepage-header">
          <h1 className="homepage-title">
            <span className="title-cosmic">Cosmic</span>
            <span className="title-canvas">Canvas</span>
          </h1>
          <p className="homepage-subtitle">
            Navigate the Universe of Earth Data
          </p>
        </div>

        <div className="homepage-instructions">
          <p>🖱️ Drag to rotate • Scroll to zoom • Click cards to explore</p>
        </div>

        <div className="homepage-footer">
          <p>Powered by NASA EOSDIS GIBS</p>
        </div>
      </div>
    </div>
  );
}
