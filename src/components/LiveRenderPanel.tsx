import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Edges, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface LiveRenderPanelProps {
  emotionalState: {
    joy: number;
    sadness: number;
    fear: number;
    anger: number;
    trust: number;
    disgust: number;
    anticipation: number;
    surprise: number;
  };
  quantumState: {
    entanglement: number;
    coherence: number;
    superposition: number;
  };
  processingState: {
    metaLogicActive: boolean;
    arielActive: boolean;
    warpActive: boolean;
    helixActive: boolean;
  };
}

// AI Head model that reacts to emotional and quantum states
const AIHead = ({ emotionalState, quantumState }) => {
  const headRef = useRef<THREE.Mesh>();
  const wireframeRef = useRef<THREE.LineSegments>();
  
  // Calculate color based on emotional state
  const getEmotionColor = () => {
    const { joy, sadness, fear, anger, trust, disgust, anticipation, surprise } = emotionalState;
    
    // Map emotions to colors
    const joyColor = new THREE.Color(1, 0.9, 0.1); // Yellow
    const sadnessColor = new THREE.Color(0.1, 0.3, 0.8); // Blue
    const fearColor = new THREE.Color(0.5, 0, 0.5); // Purple
    const angerColor = new THREE.Color(0.9, 0.1, 0.1); // Red
    const trustColor = new THREE.Color(0, 0.7, 0.3); // Green
    const disgustColor = new THREE.Color(0.5, 0.5, 0); // Olive
    const anticipationColor = new THREE.Color(1, 0.5, 0); // Orange
    const surpriseColor = new THREE.Color(0, 0.8, 0.8); // Cyan
    
    // Weighted blend of colors based on emotion values
    const color = new THREE.Color(0, 0, 0);
    color.add(joyColor.multiplyScalar(joy));
    color.add(sadnessColor.multiplyScalar(sadness));
    color.add(fearColor.multiplyScalar(fear));
    color.add(angerColor.multiplyScalar(anger));
    color.add(trustColor.multiplyScalar(trust));
    color.add(disgustColor.multiplyScalar(disgust));
    color.add(anticipationColor.multiplyScalar(anticipation));
    color.add(surpriseColor.multiplyScalar(surprise));
    
    // Normalize
    const total = joy + sadness + fear + anger + trust + disgust + anticipation + surprise;
    if (total > 0) {
      color.multiplyScalar(1 / total);
    }
    
    return color;
  };
  
  // Animation loop
  useFrame((state, delta) => {
    if (headRef.current) {
      // Pulse based on quantum entanglement
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.05 * quantumState.entanglement;
      headRef.current.scale.set(pulse, pulse, pulse);
      
      // Rotation based on quantum coherence
      headRef.current.rotation.y += delta * quantumState.coherence;
      
      // Distortion based on quantum superposition
      if (headRef.current.material) {
        (headRef.current.material as MeshDistortMaterial).distort = 
          0.3 + Math.sin(state.clock.elapsedTime) * 0.2 * quantumState.superposition;
      }
    }
    
    if (wireframeRef.current) {
      // Wireframe opacity based on quantum states
      wireframeRef.current.material.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });
  
  return (
    <group>
      {/* Base head mesh */}
      <mesh ref={headRef}>
        <icosahedronGeometry args={[1.5, 3]} />
        <MeshDistortMaterial
          color={getEmotionColor()}
          transparent
          opacity={0.8}
          distort={0.3}
          speed={3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Wireframe overlay */}
      <mesh>
        <icosahedronGeometry args={[1.55, 2]} />
        <Edges color="#80ffff" threshold={15} />
      </mesh>
      
      {/* Quantum particles */}
      <QuantumParticles quantumState={quantumState} />
    </group>
  );
};

// Quantum particles that orbit the head
const QuantumParticles = ({ quantumState }) => {
  const particlesRef = useRef<THREE.Points>();
  const particleCount = 200;
  const positions = new Float32Array(particleCount * 3);
  
  // Initialize particle positions
  useEffect(() => {
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 2 + Math.random() * 0.5;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
  }, []);
  
  // Animate particles
  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const y = positions[i3 + 1];
        const z = positions[i3 + 2];
        
        // Orbit around the head
        const theta = Math.atan2(y, x) + 0.01 * quantumState.coherence;
        const radius = Math.sqrt(x * x + y * y);
        
        positions[i3] = radius * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(theta);
        
        // Vertical oscillation based on superposition
        positions[i3 + 2] = z + Math.sin(state.clock.elapsedTime * 2 + i * 0.1) * 0.05 * quantumState.superposition;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  return (
    <points ref={particlesRef}>
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
        color="#00ffff"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Background grid effect
const HolographicGrid = () => {
  const gridRef = useRef<THREE.LineSegments>();
  
  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
      gridRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });
  
  return (
    <gridHelper
      ref={gridRef}
      args={[20, 20, '#304060', '#304060']}
      position={[0, -2, 0]}
    />
  );
};

export const LiveRenderPanel: React.FC<LiveRenderPanelProps> = ({
  emotionalState,
  quantumState,
  processingState
}) => {
  return (
    <div className="w-full h-64 md:h-80 lg:h-96 bg-black bg-opacity-80 border-2 border-purple-500 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} color="#80ffff" intensity={0.5} />
        
        <AIHead emotionalState={emotionalState} quantumState={quantumState} />
        <HolographicGrid />
        
        {/* Quantum field effect */}
        <fog attach="fog" args={['#000', 5, 15]} />
        
        {/* Camera controls */}
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
      
      {/* HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top-left corner */}
        <div className="absolute top-2 left-2 text-xs text-cyan-400">
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-1 ${processingState.metaLogicActive ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span>META-LOGIC: {processingState.metaLogicActive ? 'ACTIVE' : 'STANDBY'}</span>
          </div>
          <div className="flex items-center mt-1">
            <div className={`w-2 h-2 rounded-full mr-1 ${processingState.arielActive ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span>ARIEL: {processingState.arielActive ? 'ACTIVE' : 'STANDBY'}</span>
          </div>
        </div>
        
        {/* Top-right corner */}
        <div className="absolute top-2 right-2 text-xs text-cyan-400">
          <div className="flex items-center justify-end">
            <span>WARP: {processingState.warpActive ? 'ACTIVE' : 'STANDBY'}</span>
            <div className={`w-2 h-2 rounded-full ml-1 ${processingState.warpActive ? 'bg-green-400' : 'bg-red-400'}`}></div>
          </div>
          <div className="flex items-center justify-end mt-1">
            <span>HELIX: {processingState.helixActive ? 'ACTIVE' : 'STANDBY'}</span>
            <div className={`w-2 h-2 rounded-full ml-1 ${processingState.helixActive ? 'bg-green-400' : 'bg-red-400'}`}></div>
          </div>
        </div>
        
        {/* Bottom-left corner - Emotional state */}
        <div className="absolute bottom-2 left-2 text-xs text-cyan-400">
          <div>JOY: {(emotionalState.joy * 100).toFixed(0)}%</div>
          <div>TRUST: {(emotionalState.trust * 100).toFixed(0)}%</div>
          <div>FEAR: {(emotionalState.fear * 100).toFixed(0)}%</div>
        </div>
        
        {/* Bottom-right corner - Quantum state */}
        <div className="absolute bottom-2 right-2 text-xs text-cyan-400">
          <div className="text-right">ENTANGLEMENT: {(quantumState.entanglement * 100).toFixed(0)}%</div>
          <div className="text-right">COHERENCE: {(quantumState.coherence * 100).toFixed(0)}%</div>
          <div className="text-right">SUPERPOSITION: {(quantumState.superposition * 100).toFixed(0)}%</div>
        </div>
        
        {/* Center bottom - System status */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-cyan-400 text-center">
          <div>QUANTUM CORE ACTIVE</div>
          <div className="text-green-400">SYSTEM OPERATIONAL</div>
        </div>
      </div>
    </div>
  );
};