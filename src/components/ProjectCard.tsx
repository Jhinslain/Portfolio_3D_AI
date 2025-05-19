
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  tech: string[];
  link?: string;
  className?: string;
}

const ProjectCard = ({ id, title, description, image, tech, link, className }: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleProjectClick = () => {
    window.scrollTo(0, 0);
  };
  
  return (
    <div 
      className={cn(
        "glass-card rounded-lg overflow-hidden transition-all duration-500",
        "transform hover:translate-y-[-8px] hover:shadow-xl",
        isHovered ? "scale-[1.02]" : "scale-100",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-56 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
          style={{ 
            backgroundImage: `url(${image})`,
            transform: isHovered ? 'scale(1.05)' : 'scale(1)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-display font-bold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {tech.map((item) => (
            <Badge key={item} variant="outline" className="text-xs bg-secondary/50">
              {item}
            </Badge>
          ))}
        </div>
        
        <Link to={`/project/${id}`} onClick={handleProjectClick}>
          <Button variant="outline" size="sm" className="w-full">
            <span>View Project</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
