// Types pour les projets
export interface ProjectImage {
  url: string;
  alt: string;
}

export interface ProjectLink {
  url: string;
  type: 'github' | 'pdf' | 'website' | 'video';
  label: string;
}

export interface ProjectData {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  mainImage: string;
  images: ProjectImage[];
  tech: string[];
  video?: string;
  links: ProjectLink[];
  category: 'ai' | 'web' | 'mobile' | 'desktop' | 'game' | 'other';
  status: 'completed' | 'in-progress' | 'planned';
  year: number;
  source: 'Polytech' | 'ISCOD' | 'Majoli.io' | 'JungleVR' |'Projet Personnel' ; 
}

// Données des projets
export const projectsData: ProjectData[] = [
  {
    id: "portfolio-website",
    title: "Site Portfolio Interactif",
    shortDescription: "Un portfolio web moderne avec des animations 3D et des interactions immersives.",
    fullDescription: `
      Un site portfolio moderne construit avec React et Three.js, mettant en avant des animations 3D 
      fluides et des interactions utilisateur immersives. Le site utilise des technologies web modernes 
      pour créer une expérience visuelle unique et engageante.
    `,
    mainImage: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=2069&auto=format&fit=crop",
    images: [
      { url: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=2069&auto=format&fit=crop", alt: "Interface du portfolio" },
      { url: "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1974&auto=format&fit=crop", alt: "Animations 3D" }
    ],
    tech: ["React", "Three.js", "TypeScript", "Tailwind CSS", "Vite"],
    links: [
      { url: "https://github.com", type: "github", label: "Voir le Code Source" },
      { url: "https://example.com", type: "website", label: "Site Live" }
    ],
    category: 'web',
    status: 'completed',
    year: 2024,
    source: 'Projet Personnel'
  },
  {
    id: "atelier-borrelli",
    title: "Atelier Borrelli - Site Web Professionnel",
    shortDescription: "Site web professionnel pour un cabinet d'architecture avec système de rendez-vous en ligne, blog et galerie de projets.",
    fullDescription: `
      Site web professionnel complet pour Atelier Borrelli, cabinet d'architecture dirigé par Flavio Borrelli. 
      Le projet intègre une solution complète de présentation des services architecturaux avec des fonctionnalités 
      avancées de gestion de contenu et de prise de rendez-vous.
      
      Le site présente 6 services architecturaux détaillés : conception architecturale, permis de construire, 
      suivi de chantier, conseil en aménagement, études de faisabilité et projets d'art. Il inclut un système 
      de rendez-vous en ligne synchronisé avec Google Calendar, un blog architectural multilingue (FR/EN), 
      et une galerie de réalisations dynamique.
      
      L'architecture technique utilise Next.js 14 avec App Router, TypeScript, Tailwind CSS et Shadcn/ui 
      pour une interface moderne et responsive. Le backend intègre MongoDB pour le contenu dynamique, 
      AWS S3 pour le stockage des images, SendGrid pour l'envoi d'emails et Crisp Chat pour le support client.
      
      Le projet comprend 8 endpoints API complets pour la gestion du blog, des contacts, des réalisations, 
      des rendez-vous, de la newsletter, du chatbot et de l'upload de fichiers. L'interface d'administration 
      permet la gestion complète du contenu sans intervention technique.
    `,
    mainImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
    images: [
      { url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop", alt: "Interface du site Atelier Borrelli" },
      { url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=2126&auto=format&fit=crop", alt: "Page de services architecturaux" },
      { url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1970&auto=format&fit=crop", alt: "Système de rendez-vous en ligne" },
      { url: "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1974&auto=format&fit=crop", alt: "Galerie de réalisations" }
    ],
    tech: ["Next.js 14", "React 18", "TypeScript", "Tailwind CSS", "MongoDB", "AWS S3", "SendGrid", "Google Calendar API"],
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    links: [
      { url: "https://github.com", type: "github", label: "Voir le Code Source" },
      { url: "https://atelierborrelli.com", type: "website", label: "Site Live" },
      { url: "/documents/atelier-borrelli-doc.pdf", type: "pdf", label: "Documentation Technique" }
    ],
    category: 'web',
    status: 'completed',
    year: 2025,
    source: 'Majoli.io'
  }
];

// Configuration des projets principaux
// Pour changer les projets affichés sur la page d'accueil, modifiez les indices ci-dessous
// Exemple : [0, 2, 4] affichera les projets aux indices 0, 2 et 4
const MAIN_PROJECT_INDICES = [0, 1, 2]; // Indices des projets à afficher comme principaux

// Fonctions utilitaires
export const getMainProjects = (): ProjectData[] => {
  return MAIN_PROJECT_INDICES.map(index => projectsData[index]).filter(Boolean);
};

export const getAllProjects = (): ProjectData[] => {
  return projectsData;
};

export const getProjectById = (id: string): ProjectData | undefined => {
  return projectsData.find(project => project.id === id);
};

export const getProjectsByCategory = (category: ProjectData['category']): ProjectData[] => {
  return projectsData.filter(project => project.category === category);
};

export const getProjectsByStatus = (status: ProjectData['status']): ProjectData[] => {
  return projectsData.filter(project => project.status === status);
};
