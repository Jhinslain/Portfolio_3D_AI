import { useRef, useEffect } from 'react';
import CustomNavigation from '@/components/CustomNavigation';
import ParticleScene from '@/components/ParticleScene';
import HeroObject3D from '@/components/HeroObject3D';
import ProjectCard from '@/components/ProjectCard';
import SkillCard from '@/components/SkillCard';
import ContactForm from '@/components/ContactForm';
import CertificationsSection from '@/components/CertificationsSection';
import EducationTimeline from '@/components/EducationTimeline';
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

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center px-6 py-20 relative">
        <HeroObject3D />
        <div 
          ref={sectionRefs.intro}
          className="max-w-4xl mx-auto opacity-0"
        >
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
            Crafting <span className="text-glow text-primary">Digital Experiences</span> <br />
            with AI & 3D Technology
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl">
            Transforming ideas into immersive, interactive realities 
            at the intersection of artificial intelligence and 3D design.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-white">
              View My Projects
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/5">
              Contact Me
            </Button>
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

      {/* Projects Section */}
      <section id="projects" className="py-20 px-6">
        <div 
          ref={sectionRefs.projects}
          className="max-w-6xl mx-auto opacity-0"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Featured Projects
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore my recent work at the cutting edge of AI and 3D technologies, 
              highlighting innovative solutions and creative applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProjectCard
              id="neural-environment"
              title="Neural Environment Simulator"
              description="An AI-powered 3D environment that adapts and evolves based on user interaction patterns."
              image="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1974&auto=format&fit=crop"
              tech={["Three.js", "TensorFlow", "WebGL"]}
              className="animate-fade-in opacity-100 delay-100"
            />
            <ProjectCard
              id="immersive-data"
              title="Immersive Data Visualization"
              description="Converting complex datasets into intuitive, interactive 3D visualizations for enhanced comprehension."
              image="https://images.unsplash.com/photo-1633412802994-5c058f151b66?q=80&w=1740&auto=format&fit=crop"
              tech={["D3.js", "React Three Fiber", "Python"]}
              className="animate-fade-in opacity-100 delay-200"
            />
            <ProjectCard
              id="generative-art"
              title="Generative Art Installation"
              description="A real-time generative art system that creates unique visuals based on environmental inputs."
              image="https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1935&auto=format&fit=crop"
              tech={["WebGL", "GLSL", "p5.js"]}
              className="animate-fade-in opacity-100 delay-300"
            />
          </div>
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

      {/* Skills Section */}
      <section id="skills" className="py-20 px-6 bg-gradient-to-b from-transparent to-background/80">
        <div 
          ref={sectionRefs.skills}
          className="max-w-6xl mx-auto opacity-0"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Technical Expertise
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A blend of technical skills, creative thinking, and problem-solving 
              abilities that drive innovative digital experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <SkillCard
              title="3D Development"
              description="Expert in creating immersive 3D experiences using Three.js, WebGL, and other rendering technologies."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3c.5 0 1 .2 1.4.6l7 7c.8.8.8 2 0 2.8l-7 7c-.8.8-2 .8-2.8 0l-7-7c-.8-.8-.8-2 0-2.8l7-7c.4-.4.9-.6 1.4-.6z"></path>
                  <path d="M17.5 7.5 12 13"></path>
                  <path d="m5 15 5-5"></path>
                  <path d="m5 9 5 5"></path>
                </svg>
              }
            />
            <SkillCard
              title="AI & Machine Learning"
              description="Developing intelligent systems using TensorFlow, PyTorch, and implementing computer vision algorithms."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                  <path d="M7 7v10"></path>
                  <path d="M11 7v10"></path>
                  <path d="m15 7 2 10"></path>
                </svg>
              }
            />
            <SkillCard
              title="Interactive Design"
              description="Creating intuitive, responsive interfaces that blur the line between digital and physical experiences."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 6l9 4-9 4V6z"></path>
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
              }
            />
            <SkillCard
              title="Procedural Generation"
              description="Building algorithms for generating complex, organic structures and environments dynamically."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                </svg>
              }
            />
            <SkillCard
              title="Shader Programming"
              description="Writing custom GLSL shaders for creating stunning visual effects and optimized rendering."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v19"></path>
                  <path d="M5 3c-.5 0-1 .2-1.4.6L3 4.2C2 5.3 2 7 3 8l8 8c.8.8.8 2.3 0 3l-1 1c-.7.7-1.8.7-2.5 0L2 14.5"></path>
                  <path d="M21 3c.5 0 1 .2 1.4.6L23 4.2c1 1 1 2.8 0 3.8l-8 8c-.8.8-.8 2.3 0 3l1 1c.7.7 1.8.7 2.5 0l5.5-5.5"></path>
                </svg>
              }
            />
            <SkillCard
              title="Real-time Physics"
              description="Implementing physics simulations for realistic object interactions and natural movement."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 13A5 5 0 1 1 19 13a5 5 0 0 1-10 0Z"></path>
                  <path d="M3 11.5a3.5 3.5 0 1 0 7 0 3.5 3.5 0 1 0-7 0Z"></path>
                  <path d="M18 6.05A3.5 3.5 0 1 0 18 13"></path>
                  <path d="M9 19a3.5 3.5 0 1 0-3.5-3.5"></path>
                </svg>
              }
            />
          </div>
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
              Get In Touch
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Have a project idea or want to collaborate? Let's create something amazing together.
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
          <p>© {new Date().getFullYear()} Portfolio | Built with React, Three.js & Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
