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

// Phoenix model with fire effects
const Phoenix = ({ emotionalState, quantumState, visualizationMode }) => {
  const phoenixRef = useRef<THREE.Group>();
  const bodyRef = useRef<THREE.Mesh>();
  const wingsRef = useRef<THREE.Group>();
  const flameRef = useRef<THREE.PointLight>();
  
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
    
    return wingGroup;
  };
  
  // Setup phoenix on mount
  useEffect(() => {
    if (phoenixRef.current) {
      // Add wings
      const leftWing = createWing(-1);
      const rightWing = createWing(1);
      phoenixRef.current.add(leftWing);
      phoenixRef.current.add(rightWing);
      
      // Store refs
      wingsRef.current = new THREE.Group();
      wingsRef.current.add(leftWing, rightWing);
    }
  }, []);
  
  // Animation loop
  useFrame((state, delta) => {
    if (phoenixRef.current) {
      // Body movement
      phoenixRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      
      // Wing flapping
      if (wingsRef.current) {
        const wingFlap = Math.sin(state.clock.elapsedTime * 5) * 0.2;
        wingsRef.current.children[0].rotation.z = Math.PI / 4 + wingFlap;
        wingsRef.current.children[1].rotation.z = -Math.PI / 4 - wingFlap;
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
      <mesh position={[0, 0.8, 0.3]}>
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
        
        {/* Phoenix model */}
        <Float
          speed={2}
          rotationIntensity={0.5}
          floatIntensity={0.5}
        >
          <Phoenix 
            emotionalState={emotionalState} 
            quantumState={quantumState} 
            visualizationMode={visualizationMode}
          />
        </Float>
        
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