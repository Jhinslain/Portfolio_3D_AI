
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ProjectData } from '@/data/projects';

export interface ProjectCardProps {
  project: ProjectData;
  className?: string;
}

const ProjectCard = ({ 
  project, 
  className
}: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleCardClick = () => {
    window.location.href = `/project/${project.id}`;
  };

  const handleLiveClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Empêche le clic de la carte
    const liveLink = project.links?.find(link => link.type === 'website');
    if (liveLink) {
      window.open(liveLink.url, '_blank');
    }
  };
  
  return (
    <div 
      className={cn(
        "glass-card rounded-lg overflow-hidden transition-all duration-500",
        "transform hover:translate-y-[-8px] hover:shadow-xl",
        isHovered ? "scale-[1.02]" : "scale-100",
        "cursor-pointer",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="relative h-56 overflow-hidden">
        {project.mainImage ? (
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
            style={{ 
              backgroundImage: `url(${project.mainImage})`,
              transform: isHovered ? 'scale(1.05)' : 'scale(1)'
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <div className="text-4xl opacity-50">📁</div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-display font-bold">{project.title}</h3>
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs rounded-md",
              project.status === 'completed' && "bg-purple-500/20 text-purple-400 border-purple-500/30",
              project.status === 'in-progress' && "bg-blue-500/20 text-blue-400 border-blue-500/30",
              project.status === 'not-finished' && "bg-gray-500/20 text-gray-400 border-gray-500/30"
            )}
          >
            {project.status === 'completed' && 'Terminé'}
            {project.status === 'in-progress' && 'En cours'}
            {project.status === 'not-finished' && 'Non fini'}
          </Badge>
        </div>
        
        <div className="mb-2">
          <Badge variant="outline" className="text-xs bg-secondary/30 text-muted-foreground rounded-md">
            {project.source}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">{project.shortDescription}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.slice(0, 3).map((item) => (
            <Badge key={item} variant="outline" className="text-xs bg-secondary/50 rounded-md">
              {item}
            </Badge>
          ))}
          {project.tech.length > 3 && (
            <Badge variant="outline" className="text-xs bg-secondary/50 rounded-md">
              +{project.tech.length - 3}
            </Badge>
          )}
        </div>
        
        {project.links?.some(link => link.type === 'website') && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={handleLiveClick}
          >
            <span>Live</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
