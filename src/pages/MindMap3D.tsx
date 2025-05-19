
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import CustomNavigation from '@/components/CustomNavigation';

const MindMap3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Set up scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);

    // Set up camera
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    camera.position.z = 5;

    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create sample nodes for the mind map
    const createNode = (position: THREE.Vector3, color: number) => {
      const geometry = new THREE.SphereGeometry(0.2, 32, 32);
      const material = new THREE.MeshStandardMaterial({ 
        color: color,
        emissive: color,
        emissiveIntensity: 0.3,
        metalness: 0.3,
        roughness: 0.4
      });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.copy(position);
      return sphere;
    };

    // Create connections between nodes
    const createConnection = (start: THREE.Vector3, end: THREE.Vector3, color: number) => {
      const points = [start, end];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ 
        color: color,
        transparent: true,
        opacity: 0.6
      });
      return new THREE.Line(geometry, material);
    };

    // Create sample data for visualization
    const nodes: THREE.Mesh[] = [];
    const connections: THREE.Line[] = [];
    const nodeCount = 30;
    const connectionCount = 50;
    
    // Create random nodes
    for (let i = 0; i < nodeCount; i++) {
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      
      // Create color based on position (just for visual variety)
      const color = new THREE.Color(
        0.5 + 0.5 * Math.sin(position.x),
        0.5 + 0.5 * Math.sin(position.y),
        0.5 + 0.5 * Math.sin(position.z)
      );
      
      const node = createNode(position, color.getHex());
      scene.add(node);
      nodes.push(node);
    }
    
    // Create random connections
    for (let i = 0; i < connectionCount; i++) {
      const startIndex = Math.floor(Math.random() * nodes.length);
      const endIndex = Math.floor(Math.random() * nodes.length);
      
      if (startIndex !== endIndex) {
        const start = nodes[startIndex].position;
        const end = nodes[endIndex].position;
        
        // Color that blends the two node colors
        const startColor = (nodes[startIndex].material as THREE.MeshStandardMaterial).color;
        const endColor = (nodes[endIndex].material as THREE.MeshStandardMaterial).color;
        const blendedColor = new THREE.Color(
          (startColor.r + endColor.r) / 2,
          (startColor.g + endColor.g) / 2,
          (startColor.b + endColor.b) / 2
        );
        
        const connection = createConnection(start, end, blendedColor.getHex());
        scene.add(connection);
        connections.push(connection);
      }
    }

    // Set up OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Slowly rotate the entire graph
      scene.rotation.y += 0.001;
      
      // Update controls
      controls.update();
      
      // Render
      renderer.render(scene, camera);
    };
    
    animate();

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <CustomNavigation />
      <div 
        ref={containerRef} 
        className="absolute inset-0 -z-0"
        style={{ pointerEvents: 'auto' }}
      />
      <div className="absolute top-24 left-6 bg-background/70 backdrop-blur-sm p-4 rounded-lg shadow-lg z-10">
        <h1 className="text-xl font-bold mb-2">Graphe de Connaissance 3D</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Visualisation des liens entre articles Wikipedia
        </p>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Cliquez et faites glisser pour faire pivoter la vue</p>
          <p>• Utilisez la molette pour zoomer/dézoomer</p>
          <p>• Clic droit + glisser pour déplacer la vue</p>
        </div>
      </div>
    </div>
  );
};

export default MindMap3D;
