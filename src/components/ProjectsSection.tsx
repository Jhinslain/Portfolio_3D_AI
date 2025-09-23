import { Button } from '@/components/ui/button';
import ProjectCard from '@/components/ProjectCard';
import { getMainProjects } from '@/data/projects';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ProjectsSection = () => {
  const mainProjects = getMainProjects();

  return (
    <section id="projects" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Projets Principaux
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explorez mes travaux récents à la pointe des technologies d'IA et 3D, 
            mettant en avant des solutions innovantes et des applications créatives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {mainProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              className={`animate-fade-in opacity-100 delay-${(index + 1) * 100}`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-center">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-primary to-accent text-white"
            asChild
          >
            <Link to="/projects">
              <span>Tous les projets</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
