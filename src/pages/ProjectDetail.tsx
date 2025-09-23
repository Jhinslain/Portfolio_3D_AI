import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Github, FileText, Link as LinkIcon, Calendar, Tag, Play, X, Users, User, Users2, UserCheck } from 'lucide-react';
import CustomNavigation from '@/components/CustomNavigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getProjectById, ProjectData } from '@/data/projects';
import { cn } from '@/lib/utils';

// Type pour les éléments de médias organisés
interface MediaItem {
  type: 'video' | 'image';
  url: string;
  alt?: string;
  title?: string;
}

// Fonction pour organiser les médias selon la logique demandée
const organizeMedia = (project: ProjectData): MediaItem[] => {
  const mediaItems: MediaItem[] = [];
  
  // Si il y a une vidéo, l'ajouter en premier
  if (project.video) {
    mediaItems.push({
      type: 'video',
      url: project.video,
      title: 'Démo Vidéo'
    });
  }
  
  // Puis ajouter toutes les images (si elles existent)
  if (project.images) {
    project.images.forEach(image => {
      mediaItems.push({
        type: 'image',
        url: image.url,
        alt: image.alt
      });
    });
  }
  
  return mediaItems;
};

// Fonction pour déterminer si une URL est une vidéo locale ou YouTube
const isLocalVideo = (url: string): boolean => {
  return url.startsWith('/') && (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov'));
};

// Fonction pour obtenir la thumbnail d'une vidéo
const getVideoThumbnail = (url: string): string => {
  if (isLocalVideo(url)) {
    // Pour les vidéos locales, on ne peut pas générer de thumbnail automatiquement
    // On utilise une image placeholder ou la première frame
    return '/placeholder.svg';
  } else if (url.includes('youtube')) {
    // Pour YouTube, extraire l'ID et générer la thumbnail
    const videoId = url.split('/').pop()?.split('?')[0];
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
  return '/placeholder.svg';
};

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [showReadMe, setShowReadMe] = useState(false);
  const [readMeContent, setReadMeContent] = useState<string>('');
  const [loadingReadMe, setLoadingReadMe] = useState(false);
  
  const project = getProjectById(id || '');
  
  // Organiser les médias selon la logique demandée
  const mediaItems = project ? organizeMedia(project) : [];

  // Fonction pour charger le ReadMe
  const loadReadMe = async (readMeUrl: string) => {
    if (!project) return;
    
    setLoadingReadMe(true);
    
    try {
      const response = await fetch(readMeUrl);
      
      if (response.ok) {
        const content = await response.text();
        setReadMeContent(content);
        setShowReadMe(true);
      } else {
        setReadMeContent('Fichier de documentation non trouvé.');
        setShowReadMe(true);
      }
    } catch (error) {
      setReadMeContent('Erreur lors du chargement de la documentation.');
      setShowReadMe(true);
    } finally {
      setLoadingReadMe(false);
    }
  };
  
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

  // Fonction pour convertir le Markdown en HTML basique
  const parseMarkdown = (text: string) => {
    return text
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-6 mb-3 text-primary">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-8 mb-4 text-primary">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-6 text-primary">$1</h1>')
      
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
      
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-muted p-4 rounded-lg overflow-x-auto my-4"><code>$1</code></pre>')
      .replace(/`([^`]+)`/g, '<code class="bg-muted px-2 py-1 rounded text-sm">$1</code>')
      
      // Lists - traiter les listes en premier pour éviter les <br> dans les listes
      .replace(/^\* (.*$)/gim, '<li class="ml-4 mb-1">• $1</li>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1">• $1</li>')
      
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">$1</a>')
      
      // Line breaks - traiter les lignes vides et doubles retours à la ligne comme des paragraphes
      .replace(/\n\s*\n/g, '</p><p class="mb-4">')
      // Supprimer tous les retours à la ligne simples (pour la lisibilité du code)
      .replace(/\n/g, ' ');
  };

  // Function to render the correct icon based on link type
  const getLinkIcon = (type: string) => {
    switch (type) {
      case 'github':
        return <Github className="h-4 w-4" />;
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'ReadMe':
        return <FileText className="h-4 w-4" />;
      default:
        return <LinkIcon className="h-4 w-4" />;
    }
  };

  // Fonction pour gérer les clics sur les liens
  const handleLinkClick = (link: any) => {
    if (link.type === 'ReadMe' || (link.type === 'pdf' && link.url.includes('ReadMe'))) {
      // C'est un lien ReadMe, on charge le contenu avec l'URL spécifiée
      loadReadMe(link.url);
    } else {
      // C'est un lien normal, on ouvre dans un nouvel onglet
      window.open(link.url, '_blank');
    }
  };

  return (
    <div className="min-h-screen">
      <CustomNavigation />
      
      {/* Hero section with main image */}
      <div 
        className="h-[50vh] bg-cover bg-center relative"
        style={{ 
          backgroundImage: project.mainImage ? `url(${project.mainImage})` : 'none',
          backgroundColor: project.mainImage ? 'transparent' : 'hsl(var(--primary))'
        }}
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
                  "bg-primary/80 text-white rounded-md hover:bg-primary/80",
                  project.status === 'completed' && "bg-purple-500/80 hover:bg-purple-500/80",
                  project.status === 'in-progress' && "bg-blue-500/80 hover:bg-blue-500/80",
                  project.status === 'not-finished' && "bg-gray-500/80 hover:bg-gray-500/80"
                )}
              >
                {project.status === 'completed' && 'Terminé'}
                {project.status === 'in-progress' && 'En cours'}
                {project.status === 'not-finished' && 'Non fini'}
              </Badge>
              <Badge className="bg-white/20 text-white rounded-md hover:bg-white/20">
                <Calendar className="w-3 h-3 mr-1" />
                {project.year}
              </Badge>
              <Badge className="bg-white/20 text-white rounded-md hover:bg-white/20">
                <Tag className="w-3 h-3 mr-1" />
                {project.category === 'ai' && 'IA'}
                {project.category === 'web' && 'Web'}
                {project.category === 'mobile' && 'Mobile'}
                {project.category === 'desktop' && 'Desktop'}
                {project.category === 'game' && 'Jeu'}
                {project.category === 'other' && 'Autre'}
              </Badge>
              {project.team && (
                <Badge className="bg-white/20 text-white rounded-md hover:bg-white/20">
                  {project.team === 'solo' && <User className="w-3 h-3 mr-1" />}
                  {project.team === 'team' && <Users className="w-3 h-3 mr-1" />}
                  {project.team === 'duo' && <Users2 className="w-3 h-3 mr-1" />}
                  {project.team === 'solo' && 'Solo'}
                  {project.team === 'team' && 'Équipe'}
                  {project.team === 'duo' && 'Binôme'}
                </Badge>
              )}
              <Badge className="bg-white/20 text-white rounded-md hover:bg-white/20">
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
              <div className="max-w-none">
                <div 
                  className="text-muted-foreground leading-relaxed whitespace-pre-line"
                  dangerouslySetInnerHTML={{ 
                    __html: `<p class="mb-4">${parseMarkdown(project.fullDescription.trim())}</p>` 
                  }}
                />
              </div>
            </div>
            
            {/* Gallery avec médias organisés */}
            {mediaItems.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-semibold mb-6">Galerie</h2>
                
                {/* Affichage principal du média actif */}
                <div className="mb-4 rounded-lg overflow-hidden">
                  {mediaItems[activeMediaIndex].type === 'video' ? (
                    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                      {isLocalVideo(mediaItems[activeMediaIndex].url) ? (
                        <video
                          src={mediaItems[activeMediaIndex].url}
                          controls
                          className="w-full h-full object-cover"
                          title={mediaItems[activeMediaIndex].title || "Project Video"}
                        >
                          Votre navigateur ne supporte pas la lecture de vidéos.
                        </video>
                      ) : (
                        <iframe
                          src={mediaItems[activeMediaIndex].url}
                          title={mediaItems[activeMediaIndex].title || "Project Video"}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      )}
                    </div>
                  ) : (
                    <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                      <img 
                        src={mediaItems[activeMediaIndex].url} 
                        alt={mediaItems[activeMediaIndex].alt || `Image ${activeMediaIndex + 1}`}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  )}
                </div>
                
                {/* Thumbnails pour tous les médias - seulement s'il y a plus d'un élément */}
                {mediaItems.length > 1 && (
                  <div className="grid grid-cols-3 gap-4">
                    {mediaItems.map((media, index) => (
                      <button 
                        key={index}
                        onClick={() => setActiveMediaIndex(index)}
                        className={`rounded-md overflow-hidden border-2 transition-all relative ${
                          activeMediaIndex === index 
                            ? 'border-primary scale-105 shadow-lg' 
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        {media.type === 'video' ? (
                          <div className="relative">
                            <img 
                              src={getVideoThumbnail(media.url)} 
                              alt={media.title || `Vidéo ${index + 1}`}
                              className="w-full h-24 object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                              <Play className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        ) : (
                          <img 
                            src={media.url} 
                            alt={media.alt || `Image ${index + 1}`}
                            className="w-full h-24 object-contain bg-muted rounded"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Sidebar - 1/3 width on desktop */}
          <div className="space-y-8">
            {/* Liens du Projet - seulement s'il y en a */}
            {project.links && project.links.length > 0 && (
              <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Liens du Projet</h3>
                <div className="space-y-3">
                  {project.links.map((link, index) => (
                    <button
                      key={index}
                      onClick={() => handleLinkClick(link)}
                      className="flex items-center p-3 bg-card/50 hover:bg-card/80 hover:translate-x-2 hover:shadow-lg rounded-md transition-all duration-200 group overflow-hidden w-full text-left"
                    >
                      <span className="transition-transform duration-200">
                        {getLinkIcon(link.type)}
                      </span>
                      <span className="ml-3 transition-transform duration-200 group-hover:translate-x-1">{link.label}</span>
                      {link.type === 'pdf' && link.url.includes('/project/') && loadingReadMe && (
                        <div className="ml-auto animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
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

      {/* Popup ReadMe */}
      <Dialog open={showReadMe} onOpenChange={setShowReadMe}>
        <DialogContent className="max-w-4xl max-h-[80vh] p-0 flex flex-col">
          <DialogHeader className="flex-shrink-0 bg-background border-b p-6 pb-4">
            <DialogTitle className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              Documentation Technique
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-6 pt-4 scrollbar-thin">
            {loadingReadMe ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-3">Chargement...</span>
              </div>
            ) : (
              <div 
                className="prose prose-invert max-w-none prose-p:mb-1 prose-li:mb-0.5 readme-content"
                dangerouslySetInnerHTML={{ 
                  __html: `<p class="mb-1">${parseMarkdown(readMeContent)}</p>` 
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectDetail;
