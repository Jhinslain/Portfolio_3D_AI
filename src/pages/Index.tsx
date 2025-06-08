import { useRef, useEffect } from 'react';
import CustomNavigation from '@/components/CustomNavigation';
import ParticleScene from '@/components/ParticleScene';
import HeroObject3D from '@/components/HeroObject3D';
import ProjectCard from '@/components/ProjectCard';
import SkillSection from '@/components/SkillSection';
import ContactForm from '@/components/ContactForm';
import CertificationsSection from '@/components/CertificationsSection';
import EducationTimeline from '@/components/EducationTimeline';
import SideNavigation from '@/components/SideNavigation';
import { Button } from '@/components/ui/button';

const Index = () => {
  // Refs for intersection observer
  const sectionRefs = {
    intro: useRef<HTMLDivElement>(null),
    projects: useRef<HTMLDivElement>(null),
    skills: useRef<HTMLDivElement>(null),
    certifications: useRef<HTMLDivElement>(null),
    education: useRef<HTMLDivElement>(null),
    contact: useRef<HTMLDivElement>(null)
  };

  // Set up intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            entry.target.classList.remove('opacity-0');
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all section refs
    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      Object.values(sectionRefs).forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  return (
    <div className="min-h-screen relative">
      <ParticleScene />
      <CustomNavigation />
      <SideNavigation />

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center px-6 py-20 relative">
        <HeroObject3D />
        <div 
          ref={sectionRefs.intro}
          className="max-w-4xl mx-auto opacity-0"
        >
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-16 text-center">
            Portfolio de <span className="text-glow text-primary">Ghislain LEVREAU</span> <br />
          </h1>
          <div className="relative mb-16">
            <svg
              className="absolute -left-4 md:-left-8 -top-4 md:-top-8 w-8 h-8 md:w-12 md:h-12 text-primary/30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
            </svg>
            <div className="text-right px-4 md:px-8">
              <p className="text-xl md:text-2xl text-muted-foreground italic">
                The problem isn't how to make the world more technological. It's about how to make the world more humane again.
              </p>
              <p className="text-lg text-muted-foreground/80 mt-2">
                ― John Maeda
              </p>
            </div>
            <svg
              className="absolute -right-4 md:-right-8 -bottom-4 md:-bottom-8 w-8 h-8 md:w-12 md:h-12 text-primary/30 rotate-180"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
            </svg>
          </div>
          <div className="flex flex-wrap gap-4 mt-8 relative z-10">
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-white" asChild>
              <a href="#projects">Voir mes Projets</a>
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/5" asChild>
              <a href="#contact">Me Contacter</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <SkillSection />

      {/* Projects Section */}
      <section id="projects" className="py-20 px-6">
        <div 
          ref={sectionRefs.projects}
          className="max-w-6xl mx-auto opacity-0"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Projets Principaux
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explorez mes travaux récents à la pointe des technologies d'IA et 3D, 
              mettant en avant des solutions innovantes et des applications créatives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProjectCard
              id="neural-environment"
              title="Simulateur d'Environnement Neural"
              description="Un environnement 3D piloté par l'IA qui s'adapte et évolue en fonction des interactions utilisateur."
              image="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1974&auto=format&fit=crop"
              tech={["Three.js", "TensorFlow", "WebGL"]}
              className="animate-fade-in opacity-100 delay-100"
            />
            <ProjectCard
              id="immersive-data"
              title="Visualisation de Données Immersive"
              description="Conversion de jeux de données complexes en visualisations 3D intuitives et interactives pour une meilleure compréhension."
              image="https://images.unsplash.com/photo-1633412802994-5c058f151b66?q=80&w=1740&auto=format&fit=crop"
              tech={["D3.js", "React Three Fiber", "Python"]}
              className="animate-fade-in opacity-100 delay-200"
            />
            <ProjectCard
              id="generative-art"
              title="Installation d'Art Génératif"
              description="Un système d'art génératif en temps réel qui crée des visuels uniques basés sur des entrées environnementales."
              image="https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1935&auto=format&fit=crop"
              tech={["WebGL", "GLSL", "p5.js"]}
              className="animate-fade-in opacity-100 delay-300"
            />
          </div>
        </div>
      </section>

      {/* Education Timeline Section */}
      <section id="education" className="py-20 px-6 bg-gradient-to-b from-background/30 to-background/60">
        <div 
          ref={sectionRefs.education}
          className="max-w-6xl mx-auto opacity-0"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Parcours Académique
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Mon parcours éducatif dans le domaine de l'informatique et des technologies immersives.
            </p>
          </div>

          <EducationTimeline />
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="py-20 px-6 bg-gradient-to-b from-background/50 to-background">
        <div 
          ref={sectionRefs.certifications}
          className="max-w-6xl mx-auto opacity-0"
        >
          <CertificationsSection />
        </div>
      </section>

      

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6">
        <div 
          ref={sectionRefs.contact}
          className="max-w-6xl mx-auto opacity-0"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Me Contacter
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Vous avez une idée de projet ou souhaitez collaborer ? Créons ensemble quelque chose d'extraordinaire.
            </p>
          </div>

          <ContactForm />

          <div className="flex justify-center mt-12 space-x-8">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                <path d="M9 18c-4.51 2-5-2-7-2"></path>
              </svg>
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect width="4" height="12" x="2" y="9"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail">
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Portfolio de Ghislain LEVREAU | Construit avec React, Three.js & Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
