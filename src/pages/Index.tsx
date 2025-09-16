import { useRef, useEffect } from 'react';
import CustomNavigation from '@/components/CustomNavigation';
import ParticleScene from '@/components/ParticleScene';
import HeroObject3D from '@/components/HeroObject3D';
import ProjectsSection from '@/components/ProjectsSection';
import SkillSection from '@/components/SkillSection';
import ContactForm from '@/components/ContactForm';
import CertificationsSection from '@/components/CertificationsSection';
import EducationTimeline from '@/components/EducationTimeline';
import SideNavigation from '@/components/SideNavigation';
import Footer from '@/components/Footer';
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

      {/* Projects Section */}
      <div ref={sectionRefs.projects} className="opacity-0">
        <ProjectsSection />
      </div>

      {/* Skills Section */}
      <SkillSection />

      {/* Education Timeline Section */}
      <section id="education" className="py-20 px-6 bg-gradient-to-b from-background/60 to-background/90">
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
      <section id="certifications" className="py-20 px-6 bg-gradient-to-b from-background/80 to-background">
        <div 
          ref={sectionRefs.certifications}
          className="max-w-6xl mx-auto opacity-0"
        >
          <CertificationsSection />
        </div>
      </section>

      

      {/* Contact Section - Hidden */}
      <section id="contact" className="py-20 px-6 hidden">
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
      <Footer />
    </div>
  );
};

export default Index;
