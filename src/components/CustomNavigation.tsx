
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useMobile } from '@/hooks/use-mobile';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Brain } from 'lucide-react';

const CustomNavigation = () => {
  const { isMobile } = useMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const links = [
    { href: '/', label: 'Accueil' },
    { href: '/unity-game', label: 'Unity Game' },
    { href: '/ai-demo', label: 'Démo IA' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-colors duration-300 ${
        isScrolled ? 'bg-background/80 backdrop-blur-md border-b border-border/50' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="font-display text-xl font-semibold flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            AI Portfolio
          </span>
        </Link>

        {isMobile ? (
          <Collapsible open={isMenuOpen} onOpenChange={setIsMenuOpen} className="w-full">
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto">
                {isMenuOpen ? 'Fermer' : 'Menu'}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-lg">
              <nav className="flex flex-col p-4 space-y-2">
                {links.map((link) => (
                  <Link 
                    key={link.href} 
                    to={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-4 py-2 rounded-md transition-colors ${isActive(link.href)
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-muted'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <nav className="flex items-center space-x-1">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-md transition-colors ${isActive(link.href)
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default CustomNavigation;
