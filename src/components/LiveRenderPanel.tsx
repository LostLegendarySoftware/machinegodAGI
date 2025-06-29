import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  useGLTF, 
  Edges, 
  MeshDistortMaterial, 
  MeshWobbleMaterial,
  MeshReflectorMaterial,
  Trail,
  Float,
  Text,
  useTexture,
  Sphere,
  Box,
  Torus
} from '@react-three/drei';
import { 
  EffectComposer, 
  Bloom, 
  ChromaticAberration, 
  Noise, 
  Vignette,
  GodRays
} from '@react-three/postprocessing';
import { LayerMaterial, Depth, Fresnel, Noise as LaminaNoise } from 'lamina';
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

// Phoenix model that reacts to emotional and quantum states
const PhoenixModel = ({ emotionalState, quantumState }) => {
  const phoenixRef = useRef<THREE.Group>();
  const bodyRef = useRef<THREE.Mesh>();
  const wingsRef = useRef<THREE.Group>();
  const tailRef = useRef<THREE.Group>();
  const headRef = useRef<THREE.Mesh>();
  const flameRef = useRef<THREE.PointLight>();
  
  // Create phoenix body parts
  const phoenixParts = useMemo(() => {
    // Create wing geometry
    const createWing = (side: number) => {
      const wingGroup = new THREE.Group();
      
      // Main wing
      const wingGeometry = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        0, 0, 0,
        side * 2, 0.5, -0.5,
        side * 2.5, 1.2, 0,
        side * 2, 1.8, 0.5,
        side * 1.5, 2.2, 0,
        side * 1, 1.5, -0.5,
        side * 0.5, 0.8, 0
      ]);
      
      const indices = [
        0, 1, 6,
        1, 2, 6,
        2, 3, 6,
        3, 4, 6,
        4, 5, 6,
        5, 0, 6
      ];
      
      wingGeometry.setIndex(indices);
      wingGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      wingGeometry.computeVertexNormals();
      
      const wingMesh = new THREE.Mesh(
        wingGeometry,
        new THREE.MeshStandardMaterial({ 
          color: new THREE.Color('#ff3d00'),
          emissive: new THREE.Color('#ff7d00'),
          emissiveIntensity: 0.5,
          roughness: 0.3,
          metalness: 0.7
        })
      );
      
      wingGroup.add(wingMesh);
      
      // Wing feathers
      for (let i = 0; i < 5; i++) {
        const feather = new THREE.Mesh(
          new THREE.PlaneGeometry(0.7, 0.2),
          new THREE.MeshStandardMaterial({ 
            color: new THREE.Color('#ff9d00'),
            emissive: new THREE.Color('#ffbd00'),
            emissiveIntensity: 0.5,
            roughness: 0.3,
            metalness: 0.7,
            side: THREE.DoubleSide
          })
        );
        
        feather.position.set(side * (1 + i * 0.3), 0.5 + i * 0.3, 0);
        feather.rotation.z = side * Math.PI / 4;
        feather.rotation.y = side * Math.PI / 8;
        
        wingGroup.add(feather);
      }
      
      return wingGroup;
    };
    
    // Create tail
    const createTail = () => {
      const tailGroup = new THREE.Group();
      
      // Main tail feathers
      for (let i = -2; i <= 2; i++) {
        const feather = new THREE.Mesh(
          new THREE.PlaneGeometry(0.2, 1.5),
          new THREE.MeshStandardMaterial({ 
            color: new THREE.Color('#ff5d00'),
            emissive: new THREE.Color('#ff9d00'),
            emissiveIntensity: 0.5,
            roughness: 0.3,
            metalness: 0.7,
            side: THREE.DoubleSide
          })
        );
        
        feather.position.set(i * 0.2, -1.5, 0);
        feather.rotation.z = Math.PI / 2 + i * Math.PI / 16;
        
        tailGroup.add(feather);
      }
      
      return tailGroup;
    };
    
    return {
      leftWing: createWing(-1),
      rightWing: createWing(1),
      tail: createTail()
    };
  }, []);
  
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
    color.add(joyColor.clone().multiplyScalar(joy));
    color.add(sadnessColor.clone().multiplyScalar(sadness));
    color.add(fearColor.clone().multiplyScalar(fear));
    color.add(angerColor.clone().multiplyScalar(anger));
    color.add(trustColor.clone().multiplyScalar(trust));
    color.add(disgustColor.clone().multiplyScalar(disgust));
    color.add(anticipationColor.clone().multiplyScalar(anticipation));
    color.add(surpriseColor.clone().multiplyScalar(surprise));
    
    // Normalize
    const total = joy + sadness + fear + anger + trust + disgust + anticipation + surprise;
    if (total > 0) {
      color.multiplyScalar(1 / total);
    }
    
    return color;
  };
  
  // Setup phoenix on mount
  useEffect(() => {
    if (phoenixRef.current) {
      // Add wings
      phoenixRef.current.add(phoenixParts.leftWing);
      phoenixRef.current.add(phoenixParts.rightWing);
      
      // Add tail
      phoenixRef.current.add(phoenixParts.tail);
      phoenixParts.tail.position.set(0, -1, 0);
      
      // Store refs
      wingsRef.current = new THREE.Group();
      wingsRef.current.add(phoenixParts.leftWing, phoenixParts.rightWing);
      
      tailRef.current = phoenixParts.tail;
    }
  }, [phoenixParts]);
  
  // Animation loop
  useFrame((state, delta) => {
    if (phoenixRef.current) {
      // Body movement
      phoenixRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      
      // Wing flapping
      if (phoenixParts.leftWing && phoenixParts.rightWing) {
        const wingFlap = Math.sin(state.clock.elapsedTime * 5) * 0.2;
        phoenixParts.leftWing.rotation.z = Math.PI / 4 + wingFlap;
        phoenixParts.rightWing.rotation.z = -Math.PI / 4 - wingFlap;
      }
      
      // Tail movement
      if (phoenixParts.tail) {
        phoenixParts.tail.rotation.y = Math.sin(state.clock.elapsedTime * 3) * 0.2;
      }
    }
    
    if (bodyRef.current) {
      // Pulse based on quantum entanglement
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.05 * quantumState.entanglement;
      bodyRef.current.scale.set(pulse, pulse, pulse);
      
      // Update material color based on emotional state
      if (bodyRef.current.material) {
        (bodyRef.current.material as THREE.MeshStandardMaterial).color = getEmotionColor();
        (bodyRef.current.material as THREE.MeshStandardMaterial).emissive = getEmotionColor();
        (bodyRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 
          0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.2 * quantumState.coherence;
      }
    }
    
    if (flameRef.current) {
      // Flame intensity based on emotional state
      const intensity = 1 + 
        emotionalState.joy * 0.5 + 
        emotionalState.anger * 0.8 + 
        emotionalState.anticipation * 0.3;
      
      flameRef.current.intensity = intensity;
      
      // Flame color based on emotional state
      const color = getEmotionColor();
      flameRef.current.color = color;
    }
  });
  
  return (
    <group ref={phoenixRef} position={[0, 0, 0]}>
      {/* Phoenix body */}
      <mesh ref={bodyRef}>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshStandardMaterial 
          color="#ff5d00"
          emissive="#ff9d00"
          emissiveIntensity={0.5}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      
      {/* Phoenix head */}
      <mesh ref={headRef} position={[0, 0.8, 0.3]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial 
          color="#ff3d00"
          emissive="#ff7d00"
          emissiveIntensity={0.5}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      
      {/* Phoenix beak */}
      <mesh position={[0, 0.8, 0.6]}>
        <coneGeometry args={[0.1, 0.3, 16]} />
        <meshStandardMaterial 
          color="#ffdd00"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      
      {/* Phoenix eyes */}
      <mesh position={[0.15, 0.9, 0.5]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.15, 0.9, 0.5]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      
      {/* Flame effect */}
      <pointLight 
        ref={flameRef}
        position={[0, 0, 0]} 
        color="#ff7700" 
        intensity={1.5} 
        distance={5}
        decay={2}
      />
      
      {/* Flame particles */}
      <FireParticles quantumState={quantumState} />
    </group>
  );
};

// Fire particles that orbit the phoenix
const FireParticles = ({ quantumState }) => {
  const particlesRef = useRef<THREE.Group>();
  const particleCount = 50;
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }).map((_, i) => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3
      ),
      scale: 0.05 + Math.random() * 0.15,
      speed: 0.2 + Math.random() * 0.5,
      offset: Math.random() * Math.PI * 2,
      color: new THREE.Color(
        0.8 + Math.random() * 0.2,
        0.3 + Math.random() * 0.4,
        0
      )
    }));
  }, [particleCount]);
  
  // Animate particles
  useFrame((state) => {
    particles.forEach((particle, i) => {
      if (particlesRef.current) {
        const mesh = particlesRef.current.children[i] as THREE.Mesh;
        
        // Orbit around the phoenix
        const time = state.clock.elapsedTime * particle.speed + particle.offset;
        const radius = 1 + Math.sin(time * 0.5) * 0.3;
        
        const x = Math.sin(time) * radius;
        const y = Math.cos(time * 0.7) * radius * 0.6;
        const z = Math.cos(time) * Math.sin(time * 0.3) * radius;
        
        mesh.position.set(x, y, z);
        
        // Pulse size based on quantum state
        const pulse = 1 + Math.sin(time * 3) * 0.3 * quantumState.superposition;
        mesh.scale.set(
          particle.scale * pulse,
          particle.scale * pulse,
          particle.scale * pulse
        );
        
        // Update material
        if (mesh.material) {
          (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 
            0.5 + Math.sin(time * 2) * 0.5 * quantumState.coherence;
        }
      }
    });
  });
  
  return (
    <group ref={particlesRef}>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <sphereGeometry args={[particle.scale, 8, 8]} />
          <meshStandardMaterial
            color={particle.color}
            emissive={particle.color}
            emissiveIntensity={1}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
};

// Quantum field effect
const QuantumField = ({ quantumState }) => {
  const fieldRef = useRef<THREE.Group>();
  const particleCount = 100;
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }).map((_, i) => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      ),
      scale: 0.02 + Math.random() * 0.05,
      speed: 0.1 + Math.random() * 0.3,
      offset: Math.random() * Math.PI * 2,
      color: new THREE.Color(
        0.2 + Math.random() * 0.3,
        0.5 + Math.random() * 0.5,
        0.8 + Math.random() * 0.2
      )
    }));
  }, [particleCount]);
  
  // Animate quantum field
  useFrame((state) => {
    particles.forEach((particle, i) => {
      if (fieldRef.current) {
        const mesh = fieldRef.current.children[i] as THREE.Mesh;
        
        // Quantum field movement
        const time = state.clock.elapsedTime * particle.speed + particle.offset;
        
        // Complex movement pattern based on quantum state
        const x = particle.position.x + Math.sin(time) * 0.02 * quantumState.coherence;
        const y = particle.position.y + Math.cos(time * 0.7) * 0.02 * quantumState.entanglement;
        const z = particle.position.z + Math.sin(time * 0.5) * 0.02 * quantumState.superposition;
        
        mesh.position.set(x, y, z);
        
        // Pulse opacity based on quantum state
        if (mesh.material) {
          (mesh.material as THREE.MeshBasicMaterial).opacity = 
            0.3 + Math.sin(time * 2) * 0.2 * quantumState.entanglement;
        }
      }
    });
  });
  
  return (
    <group ref={fieldRef}>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <sphereGeometry args={[particle.scale, 8, 8]} />
          <meshBasicMaterial
            color={particle.color}
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
};

// Holographic grid effect
const HolographicGrid = () => {
  const gridRef = useRef<THREE.Group>();
  
  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
      gridRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });
  
  return (
    <group ref={gridRef}>
      <gridHelper
        args={[20, 20, '#304060', '#304060']}
        position={[0, -2, 0]}
      />
      <gridHelper
        args={[20, 10, '#203050', '#203050']}
        position={[0, 2, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <gridHelper
        args={[20, 10, '#203050', '#203050']}
        position={[0, 0, -2]}
        rotation={[0, 0, Math.PI / 2]}
      />
    </group>
  );
};

// Post-processing effects
const Effects = () => {
  return (
    <EffectComposer>
      <Bloom
        intensity={1.5}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
      />
      <ChromaticAberration offset={[0.002, 0.002]} />
      <Noise opacity={0.05} />
      <Vignette eskil={false} offset={0.1} darkness={0.5} />
    </EffectComposer>
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
        <color attach="background" args={['#000']} />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <pointLight position={[-10, -10, -10]} color="#80ffff" intensity={0.2} />
        
        {/* Phoenix model */}
        <Float
          speed={2}
          rotationIntensity={0.5}
          floatIntensity={0.5}
        >
          <PhoenixModel emotionalState={emotionalState} quantumState={quantumState} />
        </Float>
        
        {/* Quantum field */}
        <QuantumField quantumState={quantumState} />
        
        {/* Holographic grid */}
        <HolographicGrid />
        
        {/* Quantum field effect */}
        <fog attach="fog" args={['#000', 5, 15]} />
        
        {/* Post-processing effects */}
        <Effects />
        
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
        
        {/* Decorative corner elements */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-cyan-500 opacity-50"></div>
        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyan-500 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-cyan-500 opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-cyan-500 opacity-50"></div>
      </div>
    </div>
  );
};