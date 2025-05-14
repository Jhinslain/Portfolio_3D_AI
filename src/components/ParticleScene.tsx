
import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useIsMobile } from '@/hooks/use-mobile';
import * as THREE from 'three';

const ParticleField = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const { mouse, viewport } = useThree();
  
  useEffect(() => {
    if (!pointsRef.current) return;
    
    // Create particles
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 2000;
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    const color1 = new THREE.Color('#00e5ff'); // primary cyan
    const color2 = new THREE.Color('#9b30ff'); // accent purple
    
    for (let i = 0; i < particleCount; i++) {
      // Position particles in a rectangular shape
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
      
      // Mix colors
      const mixedColor = color1.clone().lerp(color2, Math.random());
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
      
      // Vary particle sizes
      sizes[i] = Math.random() * 0.1 + 0.05;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    if (pointsRef.current) {
      pointsRef.current.geometry = particleGeometry;
    }
  }, []);
  
  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    
    // Make particles move with mouse and time
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const sizes = pointsRef.current.geometry.attributes.size.array as Float32Array;
    
    for (let i = 0; i < positions.length; i += 3) {
      // Gentle wave motion
      positions[i] += Math.sin(state.clock.elapsedTime * 0.1 + i) * 0.002;
      positions[i + 1] += Math.cos(state.clock.elapsedTime * 0.1 + i) * 0.002;
      
      // Subtle mouse influence
      const idx = Math.floor(i / 3);
      const distance = Math.sqrt(
        Math.pow(positions[i] - mouse.x * viewport.width, 2) +
        Math.pow(positions[i + 1] - mouse.y * viewport.height, 2)
      );
      
      if (distance < 1.5) {
        // Particles close to mouse get slightly larger
        sizes[idx] = Math.min(sizes[idx] + 0.02, 0.3);
      } else {
        // Particles away from mouse gradually return to original size
        sizes[idx] = Math.max(sizes[idx] * 0.98, 0.05);
      }
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.geometry.attributes.size.needsUpdate = true;
    
    // Rotate the entire particle field slowly
    pointsRef.current.rotation.y += delta * 0.05;
    pointsRef.current.rotation.x += delta * 0.02;
  });
  
  return (
    <points ref={pointsRef}>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
};

const Scene = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={isMobile ? 1 : 2} // Lower resolution on mobile
      >
        <ParticleField />
      </Canvas>
    </div>
  );
};

export default Scene;
