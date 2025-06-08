import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const sections = [
  { id: 'home', label: 'Accueil' },
  { id: 'skills', label: 'Compétences' },
  { id: 'projects', label: 'Projets' },
  { id: 'education', label: 'Formation' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'contact', label: 'Contact' },
];

const SideNavigation = () => {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
      <ul className="space-y-4">
        {sections.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={cn(
                'flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group',
                activeSection === id && 'text-primary'
              )}
            >
              <span className={cn(
                'w-2 h-2 rounded-full transition-all duration-300',
                activeSection === id ? 'bg-primary' : 'bg-muted-foreground/30'
              )} />
              <span className="opacity-70 group-hover:opacity-100 transition-opacity">
                {label}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SideNavigation; 