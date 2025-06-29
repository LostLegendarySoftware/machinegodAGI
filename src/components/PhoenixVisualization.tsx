import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Float, 
  Trail,
  useTexture,
  Sphere,
  Text
} from '@react-three/drei';
import { 
  EffectComposer, 
  Bloom, 
  ChromaticAberration, 
  Noise, 
  Vignette
} from '@react-three/postprocessing';
import { LayerMaterial, Depth, Fresnel, Noise as LaminaNoise } from 'lamina';
import * as THREE from 'three';

interface PhoenixVisualizationProps {
  emotionalState: {
    joy: number;
    sadness: number;
    fear: number;
    anger: number;
    trust: number;
    anticipation: number;
  };
  quantumState: {
    entanglement: number;
    coherence: number;
    superposition: number;
  };
  visualizationMode?: 'default' | 'explanation' | 'analysis';
  explanationContent?: string;
}

// Hooded Figure model with glowing eyes and animation
const HoodedFigure = ({ emotionalState, quantumState }) => {
  const figureRef = useRef<THREE.Group>();
  const eyesRef = useRef<THREE.PointLight>();
  
  // Calculate color based on emotional state
  const getEmotionColor = () => {
    const { joy, sadness, fear, anger, trust, anticipation } = emotionalState;
    
    // Map emotions to colors
    const joyColor = new THREE.Color(1, 0.9, 0.1); // Yellow
    const sadnessColor = new THREE.Color(0.1, 0.3, 0.8); // Blue
    const fearColor = new THREE.Color(0.5, 0, 0.5); // Purple
    const angerColor = new THREE.Color(0.9, 0.1, 0.1); // Red
    const trustColor = new THREE.Color(0, 0.7, 0.3); // Green
    const anticipationColor = new THREE.Color(1, 0.5, 0); // Orange
    
    // Weighted blend of colors based on emotion values
    const color = new THREE.Color(0, 0, 0);
    color.add(joyColor.clone().multiplyScalar(joy));
    color.add(sadnessColor.clone().multiplyScalar(sadness));
    color.add(fearColor.clone().multiplyScalar(fear));
    color.add(angerColor.clone().multiplyScalar(anger));
    color.add(trustColor.clone().multiplyScalar(trust));
    color.add(anticipationColor.clone().multiplyScalar(anticipation));
    
    // Normalize
    const total = joy + sadness + fear + anger + trust + anticipation;
    if (total > 0) {
      color.multiplyScalar(1 / total);
    }
    
    return color;
  };
  
  // Animation loop
  useFrame((state, delta) => {
    if (figureRef.current) {
      // Subtle floating movement
      figureRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      
      // Subtle rotation
      figureRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      
      // Cloak movement
      const cloakParts = figureRef.current.children.filter(child => 
        child.name.includes('cloak') || child.name.includes('hood')
      );
      
      cloakParts.forEach(part => {
        if (part.rotation) {
          part.rotation.z = Math.sin(state.clock.elapsedTime * 0.7) * 0.02;
        }
      });
    }
    
    if (eyesRef.current) {
      // Glowing eyes effect
      const intensity = 1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.5;
      eyesRef.current.intensity = intensity;
      
      // Eye movement
      const eyeMovementX = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      const eyeMovementY = Math.cos(state.clock.elapsedTime * 0.7) * 0.05;
      eyesRef.current.position.x = 0 + eyeMovementX;
      eyesRef.current.position.y = 0.8 + eyeMovementY;
    }
  });
  
  return (
    <group ref={figureRef} position={[0, 0, 0]}>
      {/* Hooded figure body */}
      <mesh>
        <cylinderGeometry args={[0.7, 1, 2, 16]} />
        <meshStandardMaterial 
          color="#1a1a2e"
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>
      
      {/* Hood */}
      <mesh position={[0, 1.2, 0]}>
        <coneGeometry args={[0.8, 1, 16]} />
        <meshStandardMaterial 
          color="#0f0f1a"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* Glowing red eyes */}
      <pointLight 
        ref={eyesRef}
        position={[0, 0.8, 0.3]} 
        color="#ff0000" 
        intensity={2} 
        distance={3}
        decay={2}
      />
      
      {/* Eye shapes */}
      <mesh position={[0.2, 0.8, 0.3]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      <mesh position={[-0.2, 0.8, 0.3]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      
      {/* Hands */}
      <mesh position={[0.8, 0, 0.3]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      <mesh position={[-0.8, 0, 0.3]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
    </group>
  );
};

// Fire particles that orbit the figure
const FireParticles = ({ quantumState }) => {
  const particlesRef = useRef<THREE.Group>();
  const particleCount = 50;
  const particles = Array.from({ length: particleCount }).map((_, i) => ({
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
  
  // Animate particles
  useFrame((state) => {
    particles.forEach((particle, i) => {
      if (particlesRef.current) {
        const mesh = particlesRef.current.children[i] as THREE.Mesh;
        
        // Orbit around the figure
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

// Explanation visualization
const ExplanationVisualizer = ({ content, quantumState }) => {
  const textRef = useRef<THREE.Group>();
  
  useFrame((state) => {
    if (textRef.current) {
      textRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      textRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });
  
  // Parse content to extract key concepts
  const keywords = content
    ? content.split(' ')
        .filter(word => word.length > 5)
        .slice(0, 5)
    : ['Quantum', 'Neural', 'Network', 'Analysis'];
  
  return (
    <group ref={textRef}>
      {keywords.map((word, i) => (
        <Text
          key={i}
          position={[
            Math.sin(i / keywords.length * Math.PI * 2) * 2,
            i * 0.5 - keywords.length * 0.25,
            Math.cos(i / keywords.length * Math.PI * 2) * 2
          ]}
          fontSize={0.3}
          color="#00ffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#003366"
        >
          {word}
        </Text>
      ))}
      
      {/* Connecting lines */}
      {keywords.map((_, i) => {
        const nextIndex = (i + 1) % keywords.length;
        return (
          <Trail
            key={i}
            width={0.05}
            length={5}
            color="#00ffff"
            attenuation={(t) => t * t}
          >
            <mesh position={[
              Math.sin(i / keywords.length * Math.PI * 2) * 2,
              i * 0.5 - keywords.length * 0.25,
              Math.cos(i / keywords.length * Math.PI * 2) * 2
            ]}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshBasicMaterial color="#00ffff" />
            </mesh>
          </Trail>
        );
      })}
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

// Main component
export const PhoenixVisualization: React.FC<PhoenixVisualizationProps> = ({
  emotionalState,
  quantumState,
  visualizationMode = 'default',
  explanationContent
}) => {
  return (
    <div className="w-full h-full bg-black bg-opacity-80 border-2 border-purple-500 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <color attach="background" args={['#000']} />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <pointLight position={[-10, -10, -10]} color="#80ffff" intensity={0.2} />
        
        {/* Hooded Figure model */}
        <Float
          speed={2}
          rotationIntensity={0.5}
          floatIntensity={0.5}
        >
          <HoodedFigure 
            emotionalState={emotionalState} 
            quantumState={quantumState} 
          />
        </Float>
        
        {/* Fire particles */}
        <FireParticles quantumState={quantumState} />
        
        {/* Explanation visualization when in explanation mode */}
        {visualizationMode === 'explanation' && explanationContent && (
          <ExplanationVisualizer 
            content={explanationContent} 
            quantumState={quantumState}
          />
        )}
        
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
        {/* Decorative corner elements */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-cyan-500 opacity-50"></div>
        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyan-500 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-cyan-500 opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-cyan-500 opacity-50"></div>
        
        {/* Mode indicator */}
        {visualizationMode !== 'default' && (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 px-4 py-1 rounded-full border border-cyan-500">
            <span className="text-cyan-400 text-sm">
              {visualizationMode === 'explanation' ? 'Explanation Visualization' : 'Analysis Mode'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};