"use client";

import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Sphere,
  MeshDistortMaterial,
  Float,
  Environment,
  Stars,
  MeshWobbleMaterial,
} from "@react-three/drei";
import * as THREE from "three";

function AnimatedSphere({
  mousePosition,
}: {
  mousePosition: { x: number; y: number };
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.3) * 0.2 + mousePosition.y * 0.3;
      meshRef.current.rotation.y += 0.002 + mousePosition.x * 0.01;
      meshRef.current.position.x = mousePosition.x * 0.5;
      meshRef.current.position.y = mousePosition.y * 0.5;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[1, 128, 128]} scale={1.2}>
        <MeshDistortMaterial
          color="#86a88e"
          attach="material"
          distort={0.6}
          speed={2.5}
          roughness={0.05}
          metalness={0.5}
          emissive="#86a88e"
          emissiveIntensity={0.3}
        />
      </Sphere>
    </Float>
  );
}

function FloatingTorus() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.z += 0.003;
      meshRef.current.position.y =
        -1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={0.8}>
      <mesh ref={meshRef} position={[3, -1, -2]} rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[0.5, 0.2, 32, 100]} />
        <MeshWobbleMaterial
          color="#b8a88e"
          attach="material"
          factor={0.4}
          speed={2}
          roughness={0.1}
          metalness={0.6}
          emissive="#b8a88e"
          emissiveIntensity={0.25}
        />
      </mesh>
    </Float>
  );
}

function Particles() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 100;

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const color1 = new THREE.Color("#86a88e");
  const color2 = new THREE.Color("#b8a88e");

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 12;

    const color = Math.random() < 0.5 ? color1 : color2;
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

export function Background3DScene({
  mousePosition,
}: {
  mousePosition: { x: number; y: number };
}) {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Check if WebGL is supported
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setHasWebGL(false);
      }
    } catch (e) {
      setHasWebGL(false);
    }
  }, []);

  const handleError = (error: Error) => {
    console.error("WebGL Error:", error);
    setError(error);
    setHasWebGL(false);
  };

  // Fallback gradient background if WebGL is not available
  if (!hasWebGL || error) {
    return (
      <div className="absolute inset-0 opacity-35">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 animate-gradient" />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"
          style={{
            transform: `translate(${mousePosition.x * 20}px, ${
              mousePosition.y * 20
            }px)`,
            transition: "transform 0.6s ease-out",
          }}
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 opacity-35">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        onCreated={(state) => {
          // Ensure WebGL context is valid
          if (!state.gl.getContext()) {
            handleError(new Error("Failed to get WebGL context"));
          }
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: false,
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1.8}
            color="#ffffff"
          />
          <pointLight
            position={[-10, -10, -5]}
            intensity={1.2}
            color="#86a88e"
          />
          <pointLight position={[10, 5, 5]} intensity={0.8} color="#b8a88e" />

          <AnimatedSphere mousePosition={mousePosition} />
          <FloatingTorus />
          <Particles />

          <Stars
            radius={100}
            depth={50}
            count={1500}
            factor={4}
            saturation={0}
            fade
            speed={0.5}
          />
          <Environment preset="sunset" />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
