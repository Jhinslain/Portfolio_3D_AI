import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

import { Brain, Network } from 'lucide-react';

import logo from '../assets/images/Jhin.png';
import gragasGif from '../assets/images/gragasGif.gif';
import gragasSound from '../assets/images/GragasCum.mp3';

const CustomNavigation = () => {
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showScreamer, setShowScreamer] = useState(false);
  const location = useLocation();
  const nameRef = useRef<HTMLSpanElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const links = [
    { href: '/', label: 'Accueil' },
    { href: '/unity-game', label: 'Unity Game' },
    { href: '/mind-map', label: 'Mindmap 3D' },
    { href: '/ai-demo', label: 'Démo IA' }
  ];

  const handleScrollTo = (sectionId: string) => {
    if (location.pathname !== '/') {
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNameClick = () => {
    setClickCount(prev => {
      const newCount = prev + 1;
      if (newCount >= 5) {
        setShowScreamer(true);
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        }
        setTimeout(() => setShowScreamer(false), 1000);
        return 0;
      }
      return newCount;
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (nameRef.current && !nameRef.current.contains(event.target as Node)) {
        setClickCount(0);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-colors duration-300 ${
          isScrolled ? 'bg-background/80 backdrop-blur-md border-b border-border/50' : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="font-display text-xl font-semibold flex items-center gap-2">
            <img src={logo} alt="Logo" className="w-8 h-8" />
            <span 
              ref={nameRef}
              className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent cursor-pointer"
              onClick={handleNameClick}
            >
              Ghislain LEVREAU  
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

      {showScreamer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
          <img 
            src={gragasGif} 
            alt="Screamer" 
            className="w-96 h-96 object-contain"
          />
        </div>
      )}

      <audio ref={audioRef} src={gragasSound} preload="auto" />
    </>
  );
};

export default CustomNavigation;
