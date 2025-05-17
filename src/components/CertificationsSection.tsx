
import React, { useState, useMemo } from 'react';
import CertificationCard, { CertificationProps } from './CertificationCard';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { BookOpen, Search } from 'lucide-react';

// Sample certifications data - this would typically come from an API or CMS
const certifications: CertificationProps[] = [
  {
    title: "Machine Learning Specialization",
    issuer: "Coursera & Stanford University",
    date: "Aug 2023",
    skills: ["Python", "TensorFlow", "Machine Learning", "Neural Networks"],
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1974&auto=format&fit=crop"
  },
  {
    title: "Deep Learning with PyTorch",
    issuer: "Udacity",
    date: "May 2023",
    skills: ["PyTorch", "Deep Learning", "Computer Vision"],
    image: "https://images.unsplash.com/photo-1633412802994-5c058f151b66?q=80&w=1740&auto=format&fit=crop"
  },
  {
    title: "Three.js and WebGL Mastery",
    issuer: "Udemy",
    date: "Jan 2024",
    skills: ["Three.js", "WebGL", "3D Graphics", "JavaScript"],
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1935&auto=format&fit=crop"
  },
  {
    title: "Full-Stack Web Development",
    issuer: "freeCodeCamp",
    date: "Nov 2022",
    skills: ["React", "Node.js", "MongoDB", "Express"],
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1470&auto=format&fit=crop"
  },
  {
    title: "Artificial Intelligence: Principles and Techniques",
    issuer: "edX & MIT",
    date: "Apr 2023",
    skills: ["AI", "Machine Learning", "Algorithms", "Problem Solving"],
    image: "https://images.unsplash.com/photo-1677442135813-6ac2a71c2290?q=80&w=1632&auto=format&fit=crop"
  },
  {
    title: "Unity Game Development Fundamentals",
    issuer: "Unity Learn",
    date: "Jul 2023",
    skills: ["Unity", "C#", "Game Design", "3D Modeling"],
    image: "https://images.unsplash.com/photo-1580234811497-9df7fd2f357e?q=80&w=1467&auto=format&fit=crop"
  }
];

const CertificationsSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  
  // Extract all unique skills from certifications
  const allSkills = useMemo(() => {
    const skillSet = new Set<string>();
    certifications.forEach(cert => {
      cert.skills.forEach(skill => skillSet.add(skill));
    });
    return Array.from(skillSet).sort();
  }, []);
  
  // Filter certifications based on search query and selected skills
  const filteredCertifications = useMemo(() => {
    return certifications.filter(cert => {
      // Filter by search query
      const matchesQuery = 
        searchQuery === '' || 
        cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.issuer.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by selected skills
      const matchesSkills = 
        selectedSkills.length === 0 || 
        selectedSkills.some(skill => cert.skills.includes(skill));
      
      return matchesQuery && matchesSkills;
    });
  }, [searchQuery, selectedSkills]);
  
  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  return (
    <section id="certifications" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Certifications & Online Learning
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A collection of certificates and courses I've completed to continuously develop my skills and stay current with emerging technologies.
          </p>
        </div>
        
        {/* Search and filter controls */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search certifications..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Filter by skills:
            </h3>
            <div className="flex flex-wrap gap-2">
              {allSkills.map(skill => (
                <Badge
                  key={skill}
                  variant={selectedSkills.includes(skill) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleSkill(skill)}
                >
                  {skill}
                </Badge>
              ))}
              {selectedSkills.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedSkills([])}
                  className="text-xs h-6"
                >
                  Clear filters
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Certifications grid */}
        {filteredCertifications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCertifications.map((certification, index) => (
              <CertificationCard
                key={index}
                {...certification}
                className="animate-fade-in opacity-100"
                style={{ animationDelay: `${index * 100}ms` }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No certifications match your filters</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CertificationsSection;
