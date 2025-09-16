import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Github, FileText, Link as LinkIcon, Calendar, Tag } from 'lucide-react';
import CustomNavigation from '@/components/CustomNavigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getProjectById, ProjectData } from '@/data/projects';
import { cn } from '@/lib/utils';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const project = getProjectById(id || '');
  
  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Projet Non Trouvé</h2>
          <p className="mb-6">Le projet que vous recherchez n'existe pas ou a été supprimé.</p>
          <Link to="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l'Accueil
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
            <Link to="/projects" className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux Projets
            </Link>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-2">
              {project.title}
            </h1>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge 
                className={cn(
                  "bg-primary/80 text-white",
                  project.status === 'completed' && "bg-green-500/80",
                  project.status === 'in-progress' && "bg-yellow-500/80",
                  project.status === 'planned' && "bg-blue-500/80"
                )}
              >
                {project.status === 'completed' && 'Terminé'}
                {project.status === 'in-progress' && 'En cours'}
                {project.status === 'planned' && 'Planifié'}
              </Badge>
              <Badge className="bg-white/20 text-white">
                <Calendar className="w-3 h-3 mr-1" />
                {project.year}
              </Badge>
              <Badge className="bg-white/20 text-white">
                <Tag className="w-3 h-3 mr-1" />
                {project.category === 'ai' && 'IA'}
                {project.category === 'web' && 'Web'}
                {project.category === 'mobile' && 'Mobile'}
                {project.category === 'desktop' && 'Desktop'}
                {project.category === 'game' && 'Jeu'}
                {project.category === 'other' && 'Autre'}
              </Badge>
              <Badge className="bg-white/20 text-white rounded-md">
                {project.source}
              </Badge>
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
              <h2 className="text-2xl font-semibold mb-4">Aperçu</h2>
              <div className="prose prose-invert max-w-none">
                {project.fullDescription.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4">{paragraph.trim()}</p>
                ))}
              </div>
            </div>
            
            {/* Gallery */}
            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-6">Galerie</h2>
              
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
                <h2 className="text-2xl font-semibold mb-6">Démo Vidéo</h2>
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
              <h3 className="text-xl font-semibold mb-4">Liens du Projet</h3>
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
                  <Badge key={item} variant="outline" className="bg-secondary/30 rounded-md">
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
