// Types pour les projets
export interface ProjectImage {
  url: string;
  alt: string;
}

export interface ProjectLink {
  url: string;
  type: 'github' | 'pdf' | 'website' | 'video' | 'ReadMe';
  label: string;
}

export interface ProjectData {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  mainImage?: string;
  images?: ProjectImage[];
  video?: string;
  tech: string[];
  links?: ProjectLink[];
  category: 'ai' | 'web' | 'mobile' | 'desktop' | 'game' | 'other';
  status: 'completed' | 'in-progress' | 'not-finished';
  year: number;
  source: 'Polytech' | 'ISCOD' | 'Majoli.io' | 'JungleVR' |'Projet Personnel' ; 
}

// Données des projets
export const projectsData: ProjectData[] = [
  // ========================================
  // PROJET 1: MON PORTFOLIO
  // ========================================
  {
    id: "mon-portfolio",
    title: "Mon Portfolio",
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
      { url: "https://github.com/Jhinslain/Portfolio_3D_AI", type: "github", label: "Voir le Code Source" },
      { url: "https://levreaughislain.com/", type: "website", label: "Site Live" }
    ],
    category: 'web',
    status: 'in-progress',
    year: 2025,
    source: 'Projet Personnel'
  },

  // ========================================
  // PROJET 2: ATELIER BORRELLI
  // ========================================
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
    mainImage: "/projets/atelierborrelli/Borrelli0.png",
    images: [
      { url: "/projets/atelierborrelli/Borrelli0.png", alt: "Interface du site Atelier Borrelli" },
      { url: "/projets/atelierborrelli/Borrelli1.png", alt: "Page de services architecturaux" },
      { url: "/projets/atelierborrelli/Borrelli2.png", alt: "Système de rendez-vous en ligne" },
      { url: "/projets/atelierborrelli/Borrelli3.png", alt: "Galerie de réalisations" },
      { url: "/projets/atelierborrelli/Borrelli4.png", alt: "Page de blog" },
      { url: "/projets/atelierborrelli/Borrelli5.png", alt: "Page de contact" },
      { url: "/projets/atelierborrelli/Borrelli6.png", alt: "Page de réalisations" },
      { url: "/projets/atelierborrelli/Borrelli7.png", alt: "Page de galerie" },
      { url: "/projets/atelierborrelli/Borrelli8.png", alt: "Page de blog" },
    ],
    tech: ["Next.js 14", "React 18", "TypeScript", "Tailwind CSS", "MongoDB", "AWS S3", "SendGrid", "Google Calendar API", "Crisp Chat"],
      links: [
        { url: "https://atelierborrelli.com", type: "website", label: "Site Live" },
        { url: "/projets/atelierborrelli/ReadMeBorrelli.txt", type: "ReadMe", label: "Documentation Technique" }
      ],
    category: 'web',
    status: 'completed',
    year: 2025,
    source: 'Majoli.io'
  },

  // ========================================
  // PROJET 3: MÉMOIRE VIDÉO
  // ========================================
  {
    id: "memoire-video",
    title: "Mémoire Vidéo - Production Audiovisuelle",
    shortDescription: "Vidéo de mémoire de 3 minutes avec montage, animations, effets audio et voix off.",
    fullDescription: `
      Production audiovisuelle complète d'un mémoire de 3 minutes réalisée avec Adobe Premiere Pro. 
      Le projet démontre des compétences en montage vidéo et post-production.
      
      La vidéo intègre une vidéo de fond dynamique, des sous-titres synchronisés, des animations simples
      et des effets de texte. (Un passage a été flouté pour préserver l'anonymat.)
      Effets de masking et retouche vidéo.
      
      La bande sonore utilise des musiques d'Artlist ainsi que des effets audio intégrés. 
      La voix off a été générée avec ElevenLabs. 
      Les séquences géographiques ont été créées avec Google Earth Studio.
      
      Le projet se termine par un générique de fin complet avec crédits et remerciements.
    `,
    mainImage: "/projets/memoireVideo/memoireVideoCouverture.jpg",
    video: "/projets/memoireVideo/MémoireVideo.mp4",
    tech: ["Adobe Premiere Pro", "ElevenLabs", "Artlist", "Google Earth Studio", "Masking", "Post-Production", "Montage Vidéo"],
    
    category: 'other',
    status: 'completed',
    year: 2025,
    source: 'Projet Personnel'
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
