
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import CustomNavigation from '@/components/CustomNavigation';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { toast } from '@/components/ui/use-toast';

// Node type definition
interface Node {
  mesh: THREE.Mesh;
  name: string;
  description: string;
  linkedNodes: string[];
}

const MindMap3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [nodeMap, setNodeMap] = useState<Map<string, Node>>(new Map());

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

    // Sample wiki nodes data
    const wikiNodes = [
      { 
        name: "Intelligence Artificielle", 
        description: "Technologie visant à créer des machines capables de simuler l'intelligence humaine",
        links: ["Machine Learning", "Deep Learning", "NLP"]
      },
      { 
        name: "Machine Learning", 
        description: "Branche de l'IA qui permet aux systèmes d'apprendre à partir de données",
        links: ["Intelligence Artificielle", "Deep Learning", "Algorithmes"]
      },
      { 
        name: "Deep Learning", 
        description: "Sous-catégorie du ML utilisant des réseaux de neurones profonds",
        links: ["Intelligence Artificielle", "Machine Learning", "Réseaux de neurones"]
      },
      { 
        name: "NLP", 
        description: "Traitement automatique du langage naturel",
        links: ["Intelligence Artificielle", "Linguistique", "Text Mining"]
      },
      { 
        name: "Algorithmes", 
        description: "Suite d'instructions pour résoudre un problème particulier",
        links: ["Machine Learning", "Informatique", "Structure de données"]
      },
      { 
        name: "Réseaux de neurones", 
        description: "Modèles inspirés du cerveau humain pour l'apprentissage automatique",
        links: ["Deep Learning", "Intelligence Artificielle"]
      },
      { 
        name: "Linguistique", 
        description: "Étude scientifique du langage humain",
        links: ["NLP", "Communication"]
      },
      { 
        name: "Text Mining", 
        description: "Extraction d'information à partir de textes",
        links: ["NLP", "Data Mining"]
      },
      { 
        name: "Informatique", 
        description: "Science du traitement automatique de l'information",
        links: ["Algorithmes", "Programmation"]
      },
      { 
        name: "Structure de données", 
        description: "Manières d'organiser les données pour un usage efficace",
        links: ["Algorithmes", "Informatique"]
      }
    ];

    // Store nodes in a map for easy access
    const nodes = new Map<string, Node>();
    
    // Create nodes
    const createNode = (name: string, position: THREE.Vector3, color: number) => {
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
      sphere.userData.name = name;
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

    // Position nodes in 3D space - use a spherical distribution
    wikiNodes.forEach((wikiNode, index) => {
      // Create a spherical distribution
      const phi = Math.acos(-1 + (2 * index) / wikiNodes.length);
      const theta = Math.sqrt(wikiNodes.length * Math.PI) * phi;
      const radius = 4;
      
      const position = new THREE.Vector3(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi)
      );
      
      // Create color based on position
      const color = new THREE.Color(
        0.5 + 0.5 * Math.sin(position.x),
        0.5 + 0.5 * Math.sin(position.y),
        0.5 + 0.5 * Math.sin(position.z)
      );
      
      const nodeMesh = createNode(wikiNode.name, position, color.getHex());
      scene.add(nodeMesh);
      
      nodes.set(wikiNode.name, {
        mesh: nodeMesh,
        name: wikiNode.name,
        description: wikiNode.description,
        linkedNodes: wikiNode.links
      });
    });

    // Create connections based on links
    wikiNodes.forEach(wikiNode => {
      const sourceNode = nodes.get(wikiNode.name);
      if (sourceNode) {
        wikiNode.links.forEach(targetName => {
          const targetNode = nodes.get(targetName);
          if (targetNode) {
            const startPos = sourceNode.mesh.position;
            const endPos = targetNode.mesh.position;
            
            // Blend colors of the two nodes
            const sourceColor = (sourceNode.mesh.material as THREE.MeshStandardMaterial).color;
            const targetColor = (targetNode.mesh.material as THREE.MeshStandardMaterial).color;
            const blendedColor = new THREE.Color(
              (sourceColor.r + targetColor.r) / 2,
              (sourceColor.g + targetColor.g) / 2,
              (sourceColor.b + targetColor.b) / 2
            );
            
            const connection = createConnection(startPos, endPos, blendedColor.getHex());
            scene.add(connection);
          }
        });
      }
    });

    // Set up raycaster for click detection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Mouse click handler
    const handleClick = (event: MouseEvent) => {
      // Calculate mouse position in normalized device coordinates
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Update the ray with the camera and mouse position
      raycaster.setFromCamera(mouse, camera);
      
      // Find intersections with nodes
      const nodeObjects = Array.from(nodes.values()).map(node => node.mesh);
      const intersects = raycaster.intersectObjects(nodeObjects);
      
      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object as THREE.Mesh;
        const nodeName = clickedMesh.userData.name;
        const clickedNode = nodes.get(nodeName);
        
        if (clickedNode) {
          setSelectedNode(clickedNode);
          
          // Highlight the clicked node
          (clickedMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.8;
          
          // Show toast with node info
          toast({
            title: clickedNode.name,
            description: `${clickedNode.description} - Liens: ${clickedNode.linkedNodes.join(", ")}`,
            duration: 5000,
          });
          
          // Reset the highlight after a delay
          setTimeout(() => {
            (clickedMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.3;
          }, 2000);
        }
      }
    };
    
    window.addEventListener('click', handleClick);

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

    // Update node map for use in React components
    setNodeMap(nodes);

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
      window.removeEventListener('click', handleClick);
      
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
          <p>• <span className="text-primary">Cliquez sur une sphère pour afficher ses informations</span></p>
        </div>
      </div>
      
      {selectedNode && (
        <div className="absolute bottom-6 right-6 max-w-sm z-10">
          <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
            <h3 className="font-bold text-lg">{selectedNode.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{selectedNode.description}</p>
            
            <div className="mt-3">
              <h4 className="text-xs font-semibold mb-1">Articles liés:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedNode.linkedNodes.map(linkName => (
                  <span 
                    key={linkName}
                    className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full"
                  >
                    {linkName}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MindMap3D;
