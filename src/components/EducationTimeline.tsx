
import React from 'react';
import { Card } from '@/components/ui/card';
import { School, GraduationCap, University } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EducationEvent {
  id: number;
  year: string;
  title: string;
  institution: string;
  location: string;
  description: string;
  type: 'school' | 'university' | 'graduation';
}

const educationData: EducationEvent[] = [
  {
    id: 1,
    year: '2024',
    title: "Diplôme d'Ingénieur Informatique",
    institution: 'Polytech',
    location: 'Marseille Luminy',
    description: "Obtention du diplôme d'ingénieur informatique avec une spécialisation en Réalité Virtuelle et Augmentée.",
    type: 'graduation'
  },
  {
    id: 2,
    year: '2021',
    title: "Licence Informatique",
    institution: 'Université Aix-Marseille',
    location: 'Marseille',
    description: "Formation en algorithmique, structures de données et développement logiciel.",
    type: 'university'
  },
  {
    id: 3,
    year: '2019',
    title: "Baccalauréat Scientifique",
    institution: 'Lycée Jean Perrin',
    location: 'Marseille',
    description: "Spécialisation en mathématiques et sciences de l'ingénieur avec mention Très Bien.",
    type: 'school'
  }
];

const EducationTimeline = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'school':
        return <School className="w-8 h-8 text-primary" />;
      case 'university':
        return <University className="w-8 h-8 text-primary" />;
      case 'graduation':
        return <GraduationCap className="w-8 h-8 text-primary" />;
      default:
        return <GraduationCap className="w-8 h-8 text-primary" />;
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* Timeline vertical line */}
      <div className="hidden md:block absolute left-[calc(10%-1px)] top-12 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent" />
      
      {educationData.map((event, index) => (
        <div 
          key={event.id} 
          className={cn(
            "flex flex-col md:flex-row md:gap-8 opacity-0 animate-fade-in",
            index % 2 === 0 ? "md:flex-row" : "md:flex-row"
          )}
          style={{ 
            animationDelay: `${index * 150}ms`, 
            animationFillMode: 'forwards' 
          }}
        >
          {/* Year marker */}
          <div className="md:w-1/5 flex items-start justify-end">
            <div className="bg-background border border-primary/20 rounded-full px-4 py-1 font-display text-xl md:text-2xl text-primary relative">
              {event.year}
              <div className="hidden md:block absolute w-3 h-3 bg-primary rounded-full right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
          
          {/* Content card */}
          <Card className={cn(
            "md:w-4/5 p-6 hover:border-primary/30 transition-all duration-300",
            "mt-4 md:mt-0 bg-card/50 backdrop-blur-sm"
          )}>
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-lg">
                {getIcon(event.type)}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{event.title}</h3>
                <p className="text-muted-foreground">
                  <span className="font-medium">{event.institution}</span>, {event.location}
                </p>
                <p>{event.description}</p>
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default EducationTimeline;
