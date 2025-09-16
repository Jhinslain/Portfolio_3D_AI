import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProjectCard from '@/components/ProjectCard';
import { getAllProjects, ProjectData } from '@/data/projects';
import CustomNavigation from '@/components/CustomNavigation';
import { ArrowLeft, Search, Filter, Grid, List } from 'lucide-react';
import { Link } from 'react-router-dom';

const AllProjects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('year-desc');

  const allProjects = getAllProjects();

  const categories = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'ai', label: 'Intelligence Artificielle' },
    { value: 'web', label: 'Développement Web' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'desktop', label: 'Desktop' },
    { value: 'game', label: 'Jeux' },
    { value: 'other', label: 'Autres' }
  ];

  const statuses = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'completed', label: 'Terminé' },
    { value: 'in-progress', label: 'En cours' },
    { value: 'planned', label: 'Planifié' }
  ];

  const sources = [
    { value: 'all', label: 'Toutes les sources' },
    { value: 'Projet Personnel', label: 'Projet Personnel' },
    { value: 'Majoli.io', label: 'Majoli.io' },
    { value: 'Polytech', label: 'Polytech' },
    { value: 'ISCOD', label: 'ISCOD' },
    { value: 'JungleVR', label: 'JungleVR' }
  ];

  const sortOptions = [
    { value: 'year-desc', label: 'Année (récent)' },
    { value: 'year-asc', label: 'Année (ancien)' },
    { value: 'title-asc', label: 'Titre (A-Z)' },
    { value: 'title-desc', label: 'Titre (Z-A)' },
    { value: 'status', label: 'Statut' }
  ];

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = allProjects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.tech.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
      const matchesSource = selectedSource === 'all' || project.source === selectedSource;
      
      return matchesSearch && matchesCategory && matchesStatus && matchesSource;
    });

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'year-desc':
          return b.year - a.year;
        case 'year-asc':
          return a.year - b.year;
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'status':
          const statusOrder = { 'completed': 0, 'in-progress': 1, 'planned': 2 };
          return statusOrder[a.status] - statusOrder[b.status];
        default:
          return 0;
      }
    });

    return filtered;
  }, [allProjects, searchTerm, selectedCategory, selectedStatus, selectedSource, sortBy]);

  const getStatusColor = (status: ProjectData['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in-progress':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'planned':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusLabel = (status: ProjectData['status']) => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'in-progress':
        return 'En cours';
      case 'planned':
        return 'Planifié';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen">
      <CustomNavigation />
      
      {/* Header */}
      <div className="bg-gradient-to-b from-background/60 to-background/90 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/#projects">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </Button>
            </Link>
            <h1 className="text-3xl md:text-4xl font-display font-bold">
              Tous les Projets
            </h1>
          </div>
          
          <p className="text-muted-foreground max-w-2xl">
            Découvrez l'ensemble de mes projets, des applications web aux jeux VR, 
            en passant par les solutions d'intelligence artificielle.
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="py-8 px-6 bg-background/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher un projet..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Source Filter */}
            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger>
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                {sources.map(source => (
                  <SelectItem key={source.value} value={source.value}>
                    {source.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {filteredAndSortedProjects.length} projet{filteredAndSortedProjects.length > 1 ? 's' : ''} trouvé{filteredAndSortedProjects.length > 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid/List */}
      <div className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          {filteredAndSortedProjects.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Aucun projet trouvé</h3>
                <p>Essayez de modifier vos critères de recherche ou de filtrage.</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedStatus('all');
                  setSelectedSource('all');
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                : "space-y-6"
            }>
              {filteredAndSortedProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  className={viewMode === 'list' ? "flex flex-row h-48" : ""}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 px-6 bg-gradient-to-t from-background/60 to-background/90">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-primary mb-2">
                {allProjects.length}
              </div>
              <div className="text-sm text-muted-foreground">Projets Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400 mb-2">
                {allProjects.filter(p => p.status === 'completed').length}
              </div>
              <div className="text-sm text-muted-foreground">Terminés</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400 mb-2">
                {allProjects.filter(p => p.status === 'in-progress').length}
              </div>
              <div className="text-sm text-muted-foreground">En Cours</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400 mb-2">
                {allProjects.filter(p => p.status === 'planned').length}
              </div>
              <div className="text-sm text-muted-foreground">Planifiés</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProjects;
