import { cn } from '@/lib/utils';
import { useState } from 'react';

interface SkillCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

const SkillCard = ({ title, description, icon, className }: SkillCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Diviser la description en lignes et formater chaque ligne
  const formattedDescription = description.split('\n\n').map((line, index) => (
    <div key={index} className="mb-2 last:mb-0">
      {line}
    </div>
  ));

  return (
    <div 
      className={cn(
        "glass-card rounded-lg p-6 transition-all duration-300 relative overflow-visible",
        "hover:border-primary/30 hover:shadow-md hover:shadow-primary/5",
        "cursor-pointer",
        className
      )}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
        <div className="bg-background/80 backdrop-blur-sm rounded-full p-2">
          {icon}
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-display font-semibold mb-3 text-center">{title}</h3>
        <div 
          className={cn(
            "text-sm text-muted-foreground space-y-2",
            "md:block",
            isExpanded ? "block" : "hidden"
          )}
        >
          {formattedDescription}
        </div>
      </div>
    </div>
  );
};

export default SkillCard;
