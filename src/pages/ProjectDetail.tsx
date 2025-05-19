import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Github, FileText, Link as LinkIcon } from 'lucide-react';
import CustomNavigation from '@/components/CustomNavigation';
import { ScrollArea } from '@/components/ui/scroll-area';

// Define the full project data structure
interface ProjectImage {
  url: string;
  alt: string;
}

interface ProjectLink {
  url: string;
  type: 'github' | 'pdf' | 'website' | 'video';
  label: string;
}

export interface ProjectData {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  mainImage: string;
  images: ProjectImage[];
  tech: string[];
  video?: string;
  links: ProjectLink[];
}

// Mock project data
const projectsData: ProjectData[] = [
  {
    id: "neural-environment",
    title: "Neural Environment Simulator",
    shortDescription: "An AI-powered 3D environment that adapts and evolves based on user interaction patterns.",
    fullDescription: `
      The Neural Environment Simulator is a cutting-edge project that combines artificial intelligence 
      with 3D visualization to create dynamic, responsive environments. The system continuously monitors 
      user interactions and adapts the environment in real-time, creating a unique experience for each user.
      
      The core of this technology lies in a neural network model that processes interaction data and 
      generates appropriate responses, altering the virtual environment accordingly. This creates a 
      feedback loop where the environment evolves based on user behavior.
      
      Applications for this technology include personalized learning environments, adaptive gaming 
      experiences, and innovative user interface designs that respond intuitively to user needs.
    `,
    mainImage: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1974&auto=format&fit=crop",
    images: [
      { url: "https://images.unsplash.com/photo-1642058869920-bb39a483e4ed?q=80&w=1932&auto=format&fit=crop", alt: "Neural network visualization" },
      { url: "https://images.unsplash.com/photo-1633412802994-5c058f151b66?q=80&w=1740&auto=format&fit=crop", alt: "3D environment" },
      { url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop", alt: "User interaction dashboard" }
    ],
    tech: ["Three.js", "TensorFlow", "WebGL", "React", "Python"],
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Example YouTube embed URL
    links: [
      { url: "https://github.com", type: "github", label: "View Source Code" },
      { url: "/documents/neural-environment-doc.pdf", type: "pdf", label: "Technical Documentation" },
      { url: "https://example.com", type: "website", label: "Live Demo" }
    ]
  },
  {
    id: "immersive-data",
    title: "Immersive Data Visualization",
    shortDescription: "Converting complex datasets into intuitive, interactive 3D visualizations for enhanced comprehension.",
    fullDescription: `
      The Immersive Data Visualization project transforms complex, multidimensional datasets into intuitive 
      3D visualizations that users can explore and interact with. By leveraging spatial representation and 
      interactive elements, this system makes data analysis more accessible and insightful.
      
      The visualization engine supports various data types and structures, automatically selecting 
      appropriate visual representations based on the data characteristics. Users can navigate through the 
      visualization space, zoom in on specific data points, and reveal additional information through 
      interactive elements.
      
      This approach to data visualization is particularly valuable for analyzing complex relationships, 
      temporal patterns, and multidimensional datasets that are difficult to represent effectively using 
      traditional 2D charts and graphs.
    `,
    mainImage: "https://images.unsplash.com/photo-1633412802994-5c058f151b66?q=80&w=1740&auto=format&fit=crop",
    images: [
      { url: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1932&auto=format&fit=crop", alt: "Data visualization dashboard" },
      { url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1970&auto=format&fit=crop", alt: "Interactive data nodes" },
      { url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop", alt: "User exploring data in VR" }
    ],
    tech: ["D3.js", "React Three Fiber", "Python", "R", "WebXR"],
    links: [
      { url: "https://github.com", type: "github", label: "View Source Code" },
      { url: "https://example.com", type: "website", label: "Live Demo" }
    ]
  },
  {
    id: "generative-art",
    title: "Generative Art Installation",
    shortDescription: "A real-time generative art system that creates unique visuals based on environmental inputs.",
    fullDescription: `
      The Generative Art Installation is an innovative system that creates dynamic, evolving artwork in 
      real-time based on environmental inputs such as sound, movement, temperature, and time of day. 
      The installation uses algorithms inspired by natural processes to generate unique visual compositions 
      that continuously transform in response to their surroundings.
      
      At the core of this system is a generative algorithm that combines principles from fractal geometry, 
      cellular automata, and evolutionary computing to create complex, organic patterns. The environmental 
      inputs serve as parameters that guide the generative process, creating a bridge between the physical 
      space and the digital artwork.
      
      The installation can be deployed in various settings, from public spaces to galleries, creating 
      ambient visual experiences that reflect and respond to their environment in real-time.
    `,
    mainImage: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1935&auto=format&fit=crop",
    images: [
      { url: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1935&auto=format&fit=crop", alt: "Generative art display" },
      { url: "https://images.unsplash.com/photo-1576502200272-341a4b8d5ebb?q=80&w=2065&auto=format&fit=crop", alt: "Algorithm visualization" },
      { url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop", alt: "Interactive installation" }
    ],
    tech: ["WebGL", "GLSL", "p5.js", "Arduino", "Processing"],
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Example YouTube embed URL
    links: [
      { url: "https://github.com", type: "github", label: "View Source Code" },
      { url: "/documents/generative-art-whitepaper.pdf", type: "pdf", label: "Project Whitepaper" }
    ]
  }
];

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const project = projectsData.find(p => p.id === id);
  
  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
          <p className="mb-6">The project you're looking for doesn't exist or has been removed.</p>
          <Link to="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Function to render the correct icon based on link type
  const getLinkIcon = (type: string) => {
    switch (type) {
      case 'github':
        return <Github className="h-4 w-4" />;
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      default:
        return <LinkIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen">
      <CustomNavigation />
      
      {/* Hero section with main image */}
      <div 
        className="h-[50vh] bg-cover bg-center relative"
        style={{ backgroundImage: `url(${project.mainImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10">
          <div className="max-w-6xl mx-auto">
            <Link to="/#projects" className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-2">
              {project.title}
            </h1>
            <div className="flex flex-wrap gap-2 mt-4">
              {project.tech.map((item) => (
                <Badge key={item} className="bg-primary/80 text-white">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Content section */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content - 2/3 width on desktop */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Overview</h2>
              <div className="prose prose-invert max-w-none">
                {project.fullDescription.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4">{paragraph.trim()}</p>
                ))}
              </div>
            </div>
            
            {/* Gallery */}
            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-6">Gallery</h2>
              
              {/* Main image display */}
              <div className="mb-4 rounded-lg overflow-hidden">
                <img 
                  src={project.images[activeImageIndex].url} 
                  alt={project.images[activeImageIndex].alt}
                  className="w-full h-[400px] object-cover"
                />
              </div>
              
              {/* Thumbnails */}
              <div className="grid grid-cols-3 gap-4">
                {project.images.map((image, index) => (
                  <button 
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`rounded-md overflow-hidden border-2 transition-all ${
                      activeImageIndex === index 
                        ? 'border-primary scale-105 shadow-lg' 
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={image.url} 
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-24 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Video section if available */}
            {project.video && (
              <div className="mt-12">
                <h2 className="text-2xl font-semibold mb-6">Video Demo</h2>
                <div className="rounded-lg overflow-hidden aspect-video">
                  <iframe
                    src={project.video}
                    title="Project Video"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar - 1/3 width on desktop */}
          <div className="space-y-8">
            <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Project Links</h3>
              <div className="space-y-3">
                {project.links.map((link, index) => (
                  <a 
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 bg-card/50 hover:bg-card/80 rounded-md transition-colors"
                  >
                    {getLinkIcon(link.type)}
                    <span className="ml-3">{link.label}</span>
                  </a>
                ))}
              </div>
            </div>
            
            <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((item) => (
                  <Badge key={item} variant="outline" className="bg-secondary/30">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
