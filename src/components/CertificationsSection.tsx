import React, { useState, useMemo } from 'react';
import CertificationCard, { CertificationProps } from './CertificationCard';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { BookOpen, Search } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination';

import openClassrooms from '../assets/images/OpenClassrooms.png';
import udemy from '../assets/images/Udemy.png';


// Sample certifications data - this would typically come from an API or CMS
const certifications: CertificationProps[] = [
  {
    title: "Apprenez à programmer en C++",
    issuer: "OpenClassrooms",
    date: "2025",
    skills: ["C++"],
    image: openClassrooms,
    link: "https://openclassrooms.com/fr/courses/1894236-apprenez-a-programmer-en-c"
  },
  {
    title: "Programmez en orienté objet avec C++",
    issuer: "OpenClassrooms",
    date: "2025",
    skills: ["C++"],
    image: openClassrooms,
    link: "https://openclassrooms.com/fr/courses/7137751-programmez-en-oriente-objet-avec-c"
  },
  {
    title: "Réalisez la maquette d'une application mobile avec Adobe XD",
    issuer: "OpenClassrooms",
    date: "2025",
    skills: ["Design"],
    image: openClassrooms,
    link: "https://openclassrooms.com/fr/courses/3014016-realisez-la-maquette-d-une-application-mobile-avec-adobe-xd"
  },
  {
    title: "UNREAL ENGINE 5 : Guide complet développeur de jeux",
    issuer: "Udemy",
    date: "2025",
    skills: ["UE5", "Design"],
    image: udemy,
    link: "https://www.udemy.com/course/developpeur-unreal-engine-5-blueprint-guide-complet-creer-des-jeux/learn/lecture/28499158?start=0#overview"
  },
  {
    title: "Débutez avec Angular",
    issuer: "OpenClassrooms",
    date: "2025",
    skills: ["Web"],
    image: openClassrooms,
    link: "https://openclassrooms.com/fr/courses/7471261-debutez-avec-angular"
  },
  {
    title: "Complétez vos connaissances sur Angular",
    issuer: "OpenClassrooms",
    date: "2025",
    skills: ["Web"],
    image: openClassrooms,
    link: "https://openclassrooms.com/fr/courses/7471271-completez-vos-connaissances-sur-angular"
  },
  {
    title: "Passez au Full Stack avec Node.js, Express et MongoDB",
    issuer: "OpenClassrooms",
    date: "2025",
    skills: ["Web", "Data"],
    image: openClassrooms,
    link: "https://openclassrooms.com/fr/courses/6390246-passez-au-full-stack-avec-node-js-express-et-mongodb"
  },
  {
    title: "Concevez votre site web avec PHP et MySQL",
    issuer: "OpenClassrooms",
    date: "2025",
    skills: ["Web", "Data"],
    image: openClassrooms,
    link: "https://openclassrooms.com/fr/courses/918836-concevez-votre-site-web-avec-php-et-mysql"
  },
  {
    title: "Requêtez une base de données avec SQL",
    issuer: "OpenClassrooms",
    date: "2025",
    skills: ["Data"],
    image: openClassrooms,
    link: "https://openclassrooms.com/fr/courses/7818671-requetez-une-base-de-donnees-avec-sql"
  },
  {
    title: "Réalisez un dashboard avec Tableau",
    issuer: "OpenClassrooms",
    date: "2025",
    skills: ["Data", "Design"],
    image: openClassrooms,
    link: "https://openclassrooms.com/fr/courses/8200086-realisez-un-dashboard-avec-tableau"
  }
];


const CertificationsSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
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

  // Calculate pagination
  const totalPages = Math.ceil(filteredCertifications.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCertifications.slice(indexOfFirstItem, indexOfLastItem);
  
  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll back to the top of the section when changing pages
    document.getElementById('certifications')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Generate page numbers array for pagination
  const pageNumbers = [];
  const maxVisiblePages = 5;
  
  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    // Always show first page
    pageNumbers.push(1);
    
    // Calculate middle pages
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(currentPage + 1, totalPages - 1);
    
    // Add ellipsis if needed
    if (startPage > 2) {
      pageNumbers.push(-1); // use -1 to represent ellipsis
    }
    
    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    // Add ellipsis if needed
    if (endPage < totalPages - 1) {
      pageNumbers.push(-2); // use -2 to represent ellipsis (different key)
    }
    
    // Always show last page
    pageNumbers.push(totalPages);
  }

  return (
    <section id="certifications" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Certifications & Formation en Ligne
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Une collection de certificats et de cours que j'ai complétés pour développer continuellement mes compétences et rester à jour avec les technologies émergentes.
          </p>
        </div>
        
        {/* Search and filter controls */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Rechercher des certifications..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Filtrer par compétences :
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
                  onClick={() => {
                    setSelectedSkills([]);
                    setCurrentPage(1);
                  }}
                  className="text-xs h-6"
                >
                  Effacer les filtres
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Results count */}
        <div className="mb-4 text-sm text-muted-foreground">
          Affichage de {currentItems.length} sur {filteredCertifications.length} certifications
          {(searchQuery || selectedSkills.length > 0) && " (filtrées)"}
        </div>
        
        {/* Certifications grid */}
        {currentItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((certification, index) => (
              <CertificationCard
                key={indexOfFirstItem + index}
                {...certification}
                className="animate-fade-in opacity-100"
                style={{ animationDelay: `${index * 100}ms` }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucune certification ne correspond à vos filtres</p>
          </div>
        )}
        
        {/* Pagination controls */}
        {filteredCertifications.length > itemsPerPage && (
          <div className="mt-12">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {pageNumbers.map((page, index) => (
                  page < 0 ? (
                    <PaginationItem key={`ellipsis-${page}`}>
                      <span className="px-4 py-2">...</span>
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={currentPage === page}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </section>
  );
};

export default CertificationsSection;
