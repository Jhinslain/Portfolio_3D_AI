import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import CustomNavigation from '@/components/CustomNavigation';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { fetchWikiSubgraph, WikiNodeData } from '@/services/fetchWikiSubgraph';
import { findShortestPath } from '@/services/findShortestPath';
import { bidirectionalSearch } from '@/services/bidirectionnalSearch';
import { Slider } from '@/components/ui/slider';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [startNode, setStartNode] = useState('');
  const [endNode, setEndNode] = useState('');
  const [pathNodes, setPathNodes] = useState<string[]>([]);
  const [currentCrawlNode, setCurrentCrawlNode] = useState<string>('');
  const [crawlProgress, setCrawlProgress] = useState({ current: 0, total: 0 });
  const [linkDepth, setLinkDepth] = useState(3);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);

  // Create nodes
  const createNode = (name: string, position: THREE.Vector3, color: number, isRoot: boolean = false) => {
    const geometry = new THREE.SphereGeometry(isRoot ? 0.6 : 0.2, 32, 32);
    const material = new THREE.MeshStandardMaterial({ 
      color: isRoot ? 0x00FFFF : color,
      emissive: isRoot ? 0x00FFFF : color,
      emissiveIntensity: isRoot ? 2 : 0.3,
      metalness: isRoot ? 0.9 : 0.3,
      roughness: isRoot ? 0.1 : 0.4
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.copy(position);
    sphere.userData.name = name;
    return sphere;
  };

  // Create text sprite
  const createTextSprite = (text: string, position: THREE.Vector3) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return null;

    canvas.width = 512;
    canvas.height = 128;
    
    // Fond semi-transparent
    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Effet de brillance
    const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.5, '#ffff00');
    gradient.addColorStop(1, '#ffffff');
    
    // Texte avec contour
    context.font = 'Bold 48px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    // Contour du texte
    context.strokeStyle = '#000000';
    context.lineWidth = 8;
    context.strokeText(text, canvas.width / 2, canvas.height / 2);
    
    // Texte principal avec dégradé
    context.fillStyle = gradient;
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ 
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
    const sprite = new THREE.Sprite(material);
    sprite.position.copy(position);
    sprite.position.y += 0.8; // Position plus haute au-dessus de la sphère
    sprite.scale.set(4, 1, 1); // Plus grand
    return sprite;
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

  // Mouse click handler
  const handleClick = (event: MouseEvent) => {
    if (!cameraRef.current || !sceneRef.current) return;

    // Calculate mouse position in normalized device coordinates
    const mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
    
    // Update the ray with the camera and mouse position
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);
    
    // Find intersections with nodes
    const nodeObjects = Array.from(nodeMap.values()).map(node => node.mesh);
    const intersects = raycaster.intersectObjects(nodeObjects);
    
    if (intersects.length > 0) {
      const clickedMesh = intersects[0].object as THREE.Mesh;
      const nodeName = clickedMesh.userData.name;
      console.log('Mesh cliqué :', nodeName);
      const clickedNode = nodeMap.get(nodeName);
      
      if (clickedNode) {
        setSelectedNode(clickedNode);
        
        // Highlight the clicked node
        (clickedMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.8;
        
        // Reset the highlight after a delay
        setTimeout(() => {
          (clickedMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.3;
        }, 2000);
      }
    }
  };

  // Update click handler when nodes change
  useEffect(() => {
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [nodeMap]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Set up scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);
    sceneRef.current = scene;

    // Set up camera
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    camera.position.z = 20;
    cameraRef.current = camera;

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
    
    // Position nodes in 3D space - use a spherical distribution
    wikiNodes.forEach((wikiNode, index) => {
      const isRoot = wikiNode.name.trim().toLowerCase() === searchTerm.trim().toLowerCase();
      const position = isRoot
        ? new THREE.Vector3(0, 0, 0)
        : generateCloudPosition(index, wikiNodes.length - 1, 4, 12);

      const color = isRoot
        ? new THREE.Color(0x00ff00)
        : new THREE.Color(
            0.5 + 0.5 * Math.sin(position.x),
            0.5 + 0.5 * Math.sin(position.y),
            0.5 + 0.5 * Math.sin(position.z)
          );

      const nodeMesh = createNode(wikiNode.name, position, color.getHex(), isRoot);
      sceneRef.current?.add(nodeMesh);

      nodes.set(wikiNode.name, {
        mesh: nodeMesh,
        name: wikiNode.name,
        description: wikiNode.description,
        linkedNodes: wikiNode.links
      });

      // Ajoute le sprite texte seulement pour le root
      if (isRoot) {
        const textSprite = createTextSprite(wikiNode.name, position);
        if (textSprite) {
          sceneRef.current.add(textSprite);
        }
      }
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

    // Set up OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

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
    console.log('Nœuds créés:', Array.from(nodes.entries()).map(([name, node]) => ({
      name,
      description: node.description,
      linkedNodes: node.linkedNodes
    })));

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

  // Function to focus camera on a specific node
  const focusOnNode = (nodeName: string) => {
    const node = nodeMap.get(nodeName);
    if (node && cameraRef.current && controlsRef.current) {
      // Set orbit controls target to node position
      controlsRef.current.target.copy(node.mesh.position);
      
      // Position camera to look at node from a slight distance
      const offsetPosition = node.mesh.position.clone().add(new THREE.Vector3(0, 0, 1.5));
      cameraRef.current.position.copy(offsetPosition);
      
      // Highlight the found node
      (node.mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.8;
      
      // Update the selected node
      setSelectedNode(node);
      
      // Reset the highlight after a delay
      setTimeout(() => {
        (node.mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.3;
      }, 3000);
    }
  };

  // Fonction pour générer une position aléatoire dans un nuage
  const generateCloudPosition = (index: number, totalNodes: number, minRadius: number, maxRadius: number): THREE.Vector3 => {
    // Générer des angles aléatoires pour une distribution sphérique
    const theta = Math.random() * Math.PI * 2; // Angle horizontal
    const phi = Math.acos(2 * Math.random() - 1); // Angle vertical
    
    // Rayon aléatoire entre min et max
    const radius = minRadius + Math.random() * (maxRadius - minRadius);
    
    // Ajouter du bruit pour plus d'organicité
    const noise = Math.sin(index * 0.5) * 0.5;
    
    // Calculer la position avec une distribution sphérique
    return new THREE.Vector3(
      radius * Math.sin(phi) * Math.cos(theta) + noise,
      radius * Math.cos(phi) + noise,
      radius * Math.sin(phi) * Math.sin(theta) + noise
    );
  };

  // Handle search form submission
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim() || !sceneRef.current) return;

    setIsLoading(true);
    try {
      const wikiNodes = await fetchWikiSubgraph(searchTerm, 10, linkDepth);
      
      // Clear existing nodes
      sceneRef.current.children
        .filter(obj => obj.type !== 'AmbientLight' && obj.type !== 'DirectionalLight')
        .forEach(obj => sceneRef.current?.remove(obj));

      nodeMap.clear();
      
      // Create new nodes
      const nodes = new Map<string, Node>();
      
      // Réorganiser les nœuds pour mettre le terme de recherche en premier
      const sortedNodes = [...wikiNodes].sort((a, b) => {
        if (a.name === searchTerm) return -1;
        if (b.name === searchTerm) return 1;
        return 0;
      });
      
      // Créer tous les nœuds
      sortedNodes.forEach((wikiNode, index) => {
        const isRoot = index === 0; // Le premier nœud (terme de recherche) est le root
        const position = isRoot 
          ? new THREE.Vector3(0, 0, 0)
          : generateCloudPosition(index - 1, sortedNodes.length - 1, 4, 12);
        
        const color = isRoot
          ? new THREE.Color(0x00ff00)
          : new THREE.Color(
              0.5 + 0.5 * Math.sin(position.x),
              0.5 + 0.5 * Math.sin(position.y),
              0.5 + 0.5 * Math.sin(position.z)
            );
        
        const nodeMesh = createNode(wikiNode.name, position, color.getHex(), isRoot);
        sceneRef.current?.add(nodeMesh);
        
        // Ajouter le sprite texte seulement pour le premier nœud
        if (isRoot) {
          const textSprite = createTextSprite(wikiNode.name, position);
          if (textSprite) {
            sceneRef.current.add(textSprite);
          }
        }
        
        nodes.set(wikiNode.name, {
          mesh: nodeMesh,
          name: wikiNode.name,
          description: wikiNode.description,
          linkedNodes: wikiNode.links
        });
      });

      // Create connections
      wikiNodes.forEach(wikiNode => {
        const sourceNode = nodes.get(wikiNode.name);
        if (sourceNode) {
          wikiNode.links.forEach(targetName => {
            const targetNode = nodes.get(targetName);
            if (targetNode) {
              const startPos = sourceNode.mesh.position;
              const endPos = targetNode.mesh.position;
              
              const sourceColor = (sourceNode.mesh.material as THREE.MeshStandardMaterial).color;
              const targetColor = (targetNode.mesh.material as THREE.MeshStandardMaterial).color;
              const blendedColor = new THREE.Color(
                (sourceColor.r + targetColor.r) / 2,
                (sourceColor.g + targetColor.g) / 2,
                (sourceColor.b + targetColor.b) / 2
              );
              
              const connection = createConnection(startPos, endPos, blendedColor.getHex());
              sceneRef.current?.add(connection);
            }
          });
        }
      });

      setNodeMap(nodes);
      console.log('Nœuds créés:', Array.from(nodes.entries()).map(([name, node]) => ({
        name,
        description: node.description,
        linkedNodes: node.linkedNodes
      })));
      
      // Focus on the root node
      const rootNodeFromMap = nodes.get(searchTerm);
      if (rootNodeFromMap) {
        focusOnNode(rootNodeFromMap.name);
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour réinitialiser le plan
  const resetScene = () => {
    if (!sceneRef.current) return;
    
    console.log('🧹 Réinitialisation de la scène...');
    // Supprimer tous les objets sauf les lumières
    sceneRef.current.children
      .filter(obj => obj.type !== 'AmbientLight' && obj.type !== 'DirectionalLight')
      .forEach(obj => sceneRef.current?.remove(obj));
    
    // Réinitialiser les états
    nodeMap.clear();
    setNodeMap(new Map());
    setPathNodes([]);
    setCurrentCrawlNode('');
    setCrawlProgress({ current: 0, total: 0 });
  };

  // Gestionnaire de recherche de chemin
  const handlePathSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startNode || !endNode) return;

    setIsLoading(true);
    
    try {
      // Réinitialiser la scène avant de commencer
      resetScene();

      // Fonction pour créer et afficher un nœud
      const createAndDisplayNode = async (nodeName: string, isPathNode: boolean = false, side?: 'start' | 'end') => {
        if (!nodeMap.has(nodeName)) {
          // Calculer une position plus structurée pour les nœuds du chemin
          const position = isPathNode 
            ? new THREE.Vector3(
                (nodeMap.size - 1) * 2, // Espacement horizontal
                0, // Même hauteur
                -nodeMap.size * 0.5 // Léger décalage en profondeur
              )
            : generateCloudPosition(nodeMap.size, 10, 4, 12);

          // Définir la couleur en fonction du type de nœud
          let color;
          if (nodeName === startNode) {
            color = 0x0066FF; // Bleu pour le nœud de départ
          } else if (nodeName === endNode) {
            color = 0xFF0000; // Rouge pour le nœud d'arrivée
          } else if (isPathNode) {
            color = 0x00FFFF; // Cyan pour les nœuds du chemin final
          } else {
            color = 0xFFFFFF; // Blanc pour les autres nœuds
          }
          
          const nodeMesh = createNode(
            nodeName, 
            position, 
            color, 
            nodeName === startNode || nodeName === endNode
          );
          sceneRef.current?.add(nodeMesh);
          
          const wikiNodes = await fetchWikiSubgraph(nodeName, linkDepth, 1);
          
          nodeMap.set(nodeName, {
            mesh: nodeMesh,
            name: nodeName,
            description: wikiNodes[0]?.description || '',
            linkedNodes: wikiNodes[0]?.links || []
          });

          // Créer les connexions avec les nœuds existants
          nodeMap.forEach((existingNode, existingName) => {
            if (existingNode.linkedNodes.includes(nodeName)) {
              const startPos = existingNode.mesh.position;
              const endPos = nodeMesh.position;
              
              const pointsArray = [
                startPos.toArray(),
                endPos.toArray()
              ];

              const geometry = new LineGeometry();
              geometry.setPositions(pointsArray.flat());

              const material = new LineMaterial({
                color: isPathNode ? 0x00FFFF : 0x666666,
                linewidth: isPathNode ? 0.005 : 0.002,
                dashed: false,
                transparent: true,
                opacity: isPathNode ? 1 : 0.3,
              });
              material.resolution.set(window.innerWidth, window.innerHeight);

              const line = new Line2(geometry, material);
              line.computeLineDistances();
              sceneRef.current?.add(line);
            }
          });

          setNodeMap(new Map(nodeMap));
          return true;
        }
        return false;
      };

      // Rechercher le chemin via l'API Wikipedia
      console.log('🔄 Recherche du chemin via l\'API Wikipedia...');
      setCurrentCrawlNode('Recherche du chemin...');
      const path = await bidirectionalSearch(
        startNode,
        endNode,
        6,
        async (currentNode, depth, side) => {
          setCurrentCrawlNode(
            `Exploration ${side === 'start' ? 'depuis le début' : 'depuis la fin'}: "${currentNode}" (profondeur: ${depth})`
          );
          setCrawlProgress({
            current: depth,
            total: 6
          });
          // Créer un nœud pour chaque mot exploré
          await createAndDisplayNode(currentNode, false, side);
        },
        async (node, isPathNode) => {
          await createAndDisplayNode(node, isPathNode);
        }
      );

      if (path) {
        console.log('✅ Chemin trouvé:', path);
        console.log('📊 Longueur du chemin:', path.length, 'nœuds');
        setPathNodes(path);

        // Créer les nœuds du chemin s'ils n'existent pas déjà
        for (const nodeName of path) {
          await createAndDisplayNode(nodeName, true);
        }

        // Mettre en surbrillance le chemin
        setCurrentCrawlNode('Mise en surbrillance du chemin...');
        console.log('\n✨ Mise en surbrillance du chemin trouvé...');
        highlightPath(path);
        setCurrentCrawlNode('Terminé!');
        console.log('🎉 Visualisation terminée!');
      } else {
        console.error('❌ Aucun chemin trouvé entre', startNode, 'et', endNode);
        setCurrentCrawlNode('Aucun chemin trouvé');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la recherche du chemin:', error);
      setCurrentCrawlNode('Erreur lors de la recherche');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour mettre en surbrillance le chemin
  const highlightPath = (path: string[]) => {
    if (!sceneRef.current) return;

    console.log('🎨 Mise en surbrillance du chemin:', path);

    // Mettre en surbrillance les connexions du chemin
    for (let i = 0; i < path.length - 1; i++) {
      const startNode = nodeMap.get(path[i]);
      const endNode = nodeMap.get(path[i + 1]);
      
      if (startNode && endNode) {
        console.log(`🔗 Création de la connexion entre "${path[i]}" et "${path[i + 1]}"`);
        
        const startPos = startNode.mesh.position;
        const endPos = endNode.mesh.position;
        
        // Créer une nouvelle ligne plus épaisse pour le chemin
        const pointsArray = [
          startPos.toArray(),
          endPos.toArray()
        ];

        const geometry = new LineGeometry();
        geometry.setPositions(pointsArray.flat());

        const material = new LineMaterial({
          color: 0x00FFFF,
          linewidth: 0.005,
          dashed: false,
          transparent: true,
          opacity: 1,
        });
        material.resolution.set(window.innerWidth, window.innerHeight);

        const line = new Line2(geometry, material);
        line.computeLineDistances();
        sceneRef.current.add(line);

        // Agrandir les nœuds du chemin
        startNode.mesh.scale.set(1.5, 1.5, 1.5);
        endNode.mesh.scale.set(1.5, 1.5, 1.5);

        // Ajouter un effet de brillance aux nœuds du chemin
        (startNode.mesh.material as THREE.MeshStandardMaterial).emissive.set(0x00FFFF);
        (startNode.mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.8;
        (endNode.mesh.material as THREE.MeshStandardMaterial).emissive.set(0x00FFFF);
        (endNode.mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.8;

        // Mettre à jour la position des nœuds pour un meilleur alignement
        if (i === 0) {
          startNode.mesh.position.set(0, 0, 0);
        }
        endNode.mesh.position.set((i + 1) * 2, 0, -(i + 1) * 0.5);
      } else {
        console.warn(`⚠️ Nœud manquant pour la connexion: ${path[i]} -> ${path[i + 1]}`);
      }
    }

    // Focus sur le premier nœud du chemin
    const firstNode = nodeMap.get(path[0]);
    if (firstNode) {
      focusOnNode(firstNode.name);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <CustomNavigation />
      <div 
        ref={containerRef} 
        className="absolute inset-0 -z-0"
        style={{ pointerEvents: 'auto' }}
      />
      <div className="absolute top-24 left-6 bg-background/70 backdrop-blur-sm p-4 rounded-lg shadow-lg z-10 max-w-[400px]">
        <h1 className="text-xl font-bold mb-2">Graphe de Connaissance 3D</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Explorez les connexions entre articles Wikipedia de deux façons différentes
        </p>
        
        {/* Experience 1: Single Node Exploration */}
        <div className="mb-6 p-4 bg-primary/5 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">1. Exploration d'un sujet</h2>
          <p className="text-sm text-muted-foreground mb-3">
            Entrez un sujet pour voir tous ses articles liés. Plus la profondeur est élevée, plus vous découvrirez de connexions.
          </p>
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex gap-2 mb-3">
              <Input
                type="text"
                placeholder="Ex: Intelligence Artificielle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" variant="outline" size="icon" disabled={isLoading}>
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="px-1">
              <label className="text-sm font-medium mb-2 block">
                Profondeur des liens: {linkDepth}
              </label>
              <Slider
                value={[linkDepth]}
                onValueChange={(value) => setLinkDepth(value[0])}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
            </div>
          </form>
        </div>

        {/* Experience 2: Path Finding */}
        <div className="mb-6 p-4 bg-primary/5 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">2. Trouver un chemin</h2>
          <p className="text-sm text-muted-foreground mb-3">
            Découvrez comment deux sujets sont connectés en trouvant le chemin le plus court entre eux.
          </p>
          <form onSubmit={handlePathSearch} className="mb-4">
            <div className="flex flex-col gap-2">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Sujet de départ..."
                  value={startNode}
                  onChange={(e) => setStartNode(e.target.value)}
                  className={`flex-1 ${startNode ? 'border-blue-500 ring-1 ring-blue-500' : ''}`}
                />
                {startNode && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </div>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Sujet d'arrivée..."
                  value={endNode}
                  onChange={(e) => setEndNode(e.target.value)}
                  className={`flex-1 ${endNode ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                />
                {endNode && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </div>
              <Button type="submit" variant="outline" disabled={isLoading}>
                {isLoading ? 'Recherche en cours...' : 'Trouver le chemin'}
              </Button>
            </div>
          </form>
        </div>

        {/* Crawl status */}
        {isLoading && (
          <div className="mt-4 p-3 bg-primary/10 rounded-lg">
            <p className="text-sm font-medium text-primary mb-1">{currentCrawlNode}</p>
            {crawlProgress.total > 0 && (
              <div className="w-full bg-background/50 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(crawlProgress.current / crawlProgress.total) * 100}%` }}
                />
              </div>
            )}
          </div>
        )}
        
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
