import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { GraduationCap, University, ChevronDown, Briefcase, Laptop } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

type WorkType = 'university' | 'graduation' | 'work' | 'internship';

interface EducationEvent {
  id: number;
  year: string;
  title: string;
  institution: string;
  location?: string;
  duration?: string;
  description?: string;
  type: WorkType;
}

const educationData: EducationEvent[] = [
  {
    id: 1,
    year: '2026',
    title: "Diplôme Mastère Management de la Transformation digitale en IA",
    institution: 'ISCOD',
    description: "Mastère spécialisé en management de la transformation digitale en IA (niveau 7 – RNCP)",
    type: 'graduation'
  },
  {
    id: 2,
    year: '2025',
    title: "Alternance ISCOD (Management de la Transformation digitale en IA) – Majoli.io",
    institution: 'ISCOD, Majoli.io',
    location: 'Marseille',
    duration: '1 ans',
    description: "Formation en alternance à l'ISCOD, réalisée en tant que développeur full stack chez Majoli.io",
    type: 'internship'
  },
  {
    id: 3,
    year: '2024',
    title: "Diplôme d'Ingénieur Informatique",
    institution: 'Polytech',
    location: 'Marseille Luminy',
    description: "Obtention du diplôme d'ingénieur informatique avec une spécialisation en Réalité Virtuelle et Augmentée",
    type: 'graduation'
  },
  {
    id: 4,
    year: '2024',
    title: "Woofing maraîchage",
    institution: 'Ferme de Pâques',
    location: 'Belgique',
    duration: '1 mois',
    type: 'work'
  },
  {
    id: 5,
    year: '2024',
    title: "Stage de 5ème année chez JungleVR",
    institution: 'JungleVR',
    location: 'Distanciel',
    duration: '6 mois',
    description:"Stage de fin d'études en tant que développeur Unity, dédié à la création de jeux mobiles android 3D",
    type: 'internship'
  },
  {
    id: 6,
    year: '2024',
    title: "Spécialisation Réalité Virtuelle et Augmentée | 5ème année",
    institution: 'Polytech',
    location: 'Marseille',
    duration: '1 an',
    description: "Spécialisation pour la dernière année de mon parcours en Réalité Virtuelle et Augmentée (RéVA) avec réalisation de projets immersifs, dont un simulateur VR en milieu nucléaire, des jeux et projets d'analyse d'image en temps réel",
    type: 'university'
  },
  {
    id: 7,
    year: '2023',
    title: "Animateur en accueil de loisirs",
    institution: "Communauté de communes des Gorges de l'Ardèche",
    location: 'Vallon-Pont-d\'Arc',
    duration: '1 mois',
    type: 'work'
  },
  {
    id: 8,
    year: '2023',
    title: "Stage de 4ème année chez TURCAN",
    institution: 'TURCAN',
    location: 'Mison',
    description: "Stage chez Turcan, avec création d'un site Wordpress pour la visibilité de l'entreprise et développement d'une application de gestion des plannings en Angular, Ionic, PHP et MySQL",
    type: 'internship'
  },
  {
    id: 9,
    year: '2022',
    title: "Cycle d'Ingénierie Informatique | 4ème année",
    institution: 'Polytech',
    location: 'Marseille',
    description: "Année de formation technique axée sur la programmation avancée, la cybersécurité et la 3D",
    type: 'university'
  } ,
  {
    id: 10,
    year: '2021',
    title: "Stage de 3ème année chez COME IN VR",
    institution: 'COME IN VR',
    location: 'Martigues',
    description: "Stage de développeur 3D Unity chez COME IN VR, avec conception de simulateurs immersifs en réalité virtuelle, création d'environnements 3D et d'assets sous Blender/Substance Painter, et scripting d'interactions VR",
    type: 'internship'
  },
  {
    id: 11,
    year: '2021',
    title: "Début du Cycle d'Ingénieur Informatique | 3ème année",
    institution: 'Polytech',
    location: 'Marseille',
    description: "Première année de spécialisation en informatique axée sur le développement logiciel (C, C++, R), l'algorithmique et la sécurité, avec des projets en C (IA Puissance 4) et en JavaScript/Node.js (TodoList full stack)",
    type: 'university'
  },
  {
    id: 12,
    year: '2019',
    title: "Cycle Préparatoire PeiP",
    institution: 'Polytech',
    location: 'Marseille Saint-Jérôme',
    duration: '2 ans',
    description: "Cycle préparatoire intégré du réseau Polytech (PeiP), axé sur les fondamentaux scientifiques et techniques en mathématiques, physique, informatique et ingénierie",
    type: 'university'
  } ,
  {
    id: 13,
    year: '2019',
    title: "Diplôme du Baccalauréat Scientifique",
    institution: 'Lycée Paul-Arène',
    location: 'Sisteron',
    description: "Obtention du Bac S, spécialité Physique-Chimie avec mention AB",
    type: 'graduation'
  }
];

const EducationTimeline = () => {
  const [activeEvent, setActiveEvent] = useState<number>(1);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [activeFilter, setActiveFilter] = useState<WorkType | 'all'>('all');
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

  const getIcon = (type: WorkType) => {
    switch (type) {
      case 'internship':
        return <Laptop className="w-8 h-8 text-primary" />;
      case 'university':
        return <University className="w-8 h-8 text-primary" />;
      case 'graduation':
        return <GraduationCap className="w-8 h-8 text-primary" />;
      case 'work':
        return <Briefcase className="w-8 h-8 text-primary" />;
      default:
        return <GraduationCap className="w-8 h-8 text-primary" />;
    }
  };

  const filteredEvents = educationData.filter(event => 
    activeFilter === 'all' || event.type === activeFilter
  );

  return (
    <ScrollArea className="relative h-full overflow-y-auto pr-4">
      <div className="flex justify-center gap-1 sm:gap-2 mb-4 sm:mb-8 px-2">
        <button
          onClick={() => setActiveFilter('all')}
          className={cn(
            "px-2 sm:px-4 py-2 rounded-full text-sm font-medium transition-all",
            activeFilter === 'all' 
              ? "bg-accent text-white" 
              : "bg-primary/10 hover:bg-primary/20"
          )}
          title="Tous"
        >
          <span className="hidden sm:inline">Tous</span>
          <span className="sm:hidden">•</span>
        </button>
        <button
          onClick={() => setActiveFilter('university')}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
            activeFilter === 'university' 
              ? "bg-accent text-white" 
              : "bg-primary/10 hover:bg-primary/20"
          )}
          title="Formation"
        >
          <University className="w-4 h-4" />
          <span className="hidden sm:inline">Formation</span>
        </button>
        <button
          onClick={() => setActiveFilter('graduation')}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
            activeFilter === 'graduation' 
              ? "bg-accent text-white" 
              : "bg-primary/10 hover:bg-primary/20"
          )}
          title="Diplômes"
        >
          <GraduationCap className="w-4 h-4" />
          <span className="hidden sm:inline">Diplômes</span>
        </button>
        <button
          onClick={() => setActiveFilter('internship')}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
            activeFilter === 'internship' 
              ? "bg-accent text-white" 
              : "bg-primary/10 hover:bg-primary/20"
          )}
          title="Stages"
        >
          <Laptop className="w-4 h-4" />
          <span className="hidden sm:inline">Stages</span>
        </button>
        <button
          onClick={() => setActiveFilter('work')}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
            activeFilter === 'work' 
              ? "bg-accent text-white" 
              : "bg-primary/10 hover:bg-primary/20"
          )}
          title="Travail"
        >
          <Briefcase className="w-4 h-4" />
          <span className="hidden sm:inline">Travail</span>
        </button>
      </div>

      <div 
        className="space-y-16 sm:space-y-24 relative px-2 sm:px-4 py-4 sm:py-8"
        ref={timelineRef}
      >
        {/* Timeline vertical line */}
        <div className="absolute left-1/2 sm:left-24 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent" />
        
        {/* Scrolling indicator point */}
        <div 
          className="absolute left-1/2 sm:left-24 w-5 h-5 bg-accent rounded-full transform -translate-x-1/2 z-1 shadow-[0_0_20px_rgba(216,180,254,0.7)] transition-all duration-300"
          style={{ 
            top: `${Math.min(scrollPosition * 100, 95)}%`,
            boxShadow: '0 0 20px rgba(216, 180, 254, 0.7)'
          }}
        >
          <ChevronDown className="w-4 h-4 text-white absolute left-10 top-full transform -translate-x-1/2 mt-1 animate-bounce" />
        </div>
        
        {filteredEvents.map((event, index) => (
          <div 
            key={event.id} 
            ref={el => eventsRef.current[index] = el}
            className={cn(
              "flex flex-col gap-6 relative",
              activeEvent === event.id ? "opacity-100" : "opacity-60"
            )}
          >
            {/* Year marker directly on timeline */}
            <div className="absolute left-1/2 sm:left-24 transform -translate-x-1/2 sm:-translate-y-6 translate-y-6 z-20">
              <div className={cn(
                "bg-background border-2 rounded-full px-2 sm:px-4 py-1 font-display text-sm sm:text-xl text-primary transition-all duration-300",
                activeEvent === event.id ? "border-accent text-glow" : "border-primary/20"
              )}>
                {event.year}
              </div>
            </div>
            
            {/* Content card to the right of timeline */}
            <div className="mt-8 sm:mt-0 sm:ml-36">
              <Card className={cn(
                "p-4 sm:p-6 transition-all duration-300 backdrop-blur-sm",
                activeEvent === event.id 
                  ? "bg-card/70 border-accent/30 shadow-[0_0_15px_rgba(216,180,254,0.2)]" 
                  : "bg-card/50 hover:border-primary/30"
              )}>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className={cn(
                    "p-2 rounded-lg transition-all duration-300",
                    activeEvent === event.id ? "bg-accent/20" : "bg-primary/10"
                  )}>
                    {getIcon(event.type)}
                  </div>
                  <div className="space-y-2 text-center sm:text-left">
                    <h3 className={cn(
                      "text-lg sm:text-xl font-semibold transition-all duration-300",
                      activeEvent === event.id ? "text-accent" : ""
                    )}>{event.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      <span className="font-medium">{event.institution}</span>
                      {event.location && `, ${event.location}`}
                      {event.duration && ` • ${event.duration}`}
                    </p>
                    <p className="text-sm sm:text-base">{event.description}</p>
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
