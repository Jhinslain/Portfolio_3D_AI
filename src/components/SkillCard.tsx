
import { cn } from '@/lib/utils';

interface SkillCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

const SkillCard = ({ title, description, icon, className }: SkillCardProps) => {
  return (
    <div 
      className={cn(
        "glass-card rounded-lg p-6 transition-all duration-300",
        "hover:border-primary/30 hover:shadow-md hover:shadow-primary/5",
        className
      )}
    >
      <div className="mb-4 text-primary">{icon}</div>
      <h3 className="text-lg font-display font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default SkillCard;
