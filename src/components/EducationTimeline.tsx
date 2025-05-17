
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { School, GraduationCap, University, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  const [activeEvent, setActiveEvent] = useState<number>(1);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const timelineRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Initialize refs array
  useEffect(() => {
    eventsRef.current = eventsRef.current.slice(0, educationData.length);
  }, []);

  // Track scroll position and update active event
  useEffect(() => {
    const handleScroll = () => {
      if (timelineRef.current) {
        const timelineTop = timelineRef.current.getBoundingClientRect().top;
        const timelineHeight = timelineRef.current.offsetHeight;
        
        // Calculate position for the scroll indicator (as percentage)
        const scrollPercentage = Math.max(0, Math.min(1, 
          (window.innerHeight / 2 - timelineTop) / timelineHeight
        ));
        
        setScrollPosition(scrollPercentage);
        
        // Update active event based on scroll position
        const index = Math.min(
          Math.floor(scrollPercentage * educationData.length),
          educationData.length - 1
        );
        
        if (index >= 0 && index < educationData.length) {
          setActiveEvent(educationData[Math.max(0, index)].id);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <ScrollArea className="relative h-full max-h-[650px] pr-4">
      <div 
        className="space-y-24 relative px-4 py-8"
        ref={timelineRef}
      >
        {/* Timeline vertical line */}
        <div className="absolute left-24 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent" />
        
        {/* Scrolling indicator point */}
        <div 
          className="absolute left-24 w-5 h-5 bg-accent rounded-full transform -translate-x-1/2 z-10 shadow-[0_0_20px_rgba(216,180,254,0.7)] transition-all duration-300"
          style={{ 
            top: `${Math.min(scrollPosition * 100, 95)}%`,
            boxShadow: '0 0 20px rgba(216, 180, 254, 0.7)'
          }}
        >
          <ChevronDown className="w-4 h-4 text-white absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-bounce" />
        </div>
        
        {educationData.map((event, index) => (
          <div 
            key={event.id} 
            ref={el => eventsRef.current[index] = el}
            className={cn(
              "flex flex-col gap-6 relative",
              activeEvent === event.id ? "opacity-100" : "opacity-60"
            )}
          >
            {/* Year marker directly on timeline */}
            <div className="absolute left-24 transform -translate-x-1/2 -translate-y-6">
              <div className={cn(
                "bg-background border-2 rounded-full px-4 py-1 font-display text-xl text-primary transition-all duration-300",
                activeEvent === event.id ? "border-accent text-glow" : "border-primary/20"
              )}>
                {event.year}
              </div>
            </div>
            
            {/* Content card to the right of timeline */}
            <div className="ml-36">
              <Card className={cn(
                "p-6 transition-all duration-300 backdrop-blur-sm",
                activeEvent === event.id 
                  ? "bg-card/70 border-accent/30 shadow-[0_0_15px_rgba(216,180,254,0.2)]" 
                  : "bg-card/50 hover:border-primary/30"
              )}>
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "p-2 rounded-lg transition-all duration-300",
                    activeEvent === event.id ? "bg-accent/20" : "bg-primary/10"
                  )}>
                    {getIcon(event.type)}
                  </div>
                  <div className="space-y-2">
                    <h3 className={cn(
                      "text-xl font-semibold transition-all duration-300",
                      activeEvent === event.id ? "text-accent" : ""
                    )}>{event.title}</h3>
                    <p className="text-muted-foreground">
                      <span className="font-medium">{event.institution}</span>, {event.location}
                    </p>
                    <p>{event.description}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default EducationTimeline;
