
import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useIsMobile } from '@/hooks/use-mobile';
import * as THREE from 'three';

const Object3D = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { mouse, viewport } = useThree();

  // Créer une forme géométrique complexe
  useEffect(() => {
    if (!meshRef.current) return;
  }, []);
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Suivre le mouvement de la souris avec un effet d'amortissement
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      mouse.y * 0.5,
      0.1
    );
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      mouse.x * 0.5,
      0.1
    );
    
    // Faire tourner l'objet constamment
    meshRef.current.rotation.z += delta * 0.1;
  });
  
  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1, 0.3, 128, 32, 2, 3]} />
      <meshPhongMaterial 
        color="#00e5ff" 
        emissive="#9b30ff"
        emissiveIntensity={0.5}
        specular="#ffffff"
        shininess={50}
        wireframe={true}
      />
    </mesh>
  );
};

const Scene = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full opacity-80 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        dpr={isMobile ? 1 : 2} // Lower resolution on mobile
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Object3D />
      </Canvas>
    </div>
  );
};

export default Scene;
