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
  team?: 'solo' | 'team' | 'duo';
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
    team: 'solo',
    source: 'Projet Personnel'
  },

  // ========================================
  // PROJET 2: ATELIER BORRELLI
  // ========================================
  {
    id: "atelier-borrelli",
    title: "Atelier Borrelli - Site Web Professionnel",
    shortDescription: "Un site web professionnel pour un atelier d'architecture avec système de rendez-vous en ligne, blog, newsletter, chatbot et galerie de projets.",
    fullDescription: `
      Un site web professionnel complet pour Atelier Borrelli, un architecture individuel aliant art et architecture. 
      Le projet intègre une solution complète de présentation des services architecturaux avec des fonctionnalités 
      avancées de gestion de contenu et de prise de rendez-vous.
      
      Le site présente 6 services architecturaux détaillés : conception architecturale, permis de construire, 
      suivi de chantier, conseil en aménagement, études de faisabilité et projets d'art. Il inclut un système 
      de chois de la langue FR/EN, de la langue choisie est persistée dans le localStorage.

      Le site comprend plusieurs fonctionnalités : 
      - rendez-vous en ligne synchronisé avec Google Calendar, 
      - un blog, 
      - une newsletter,
      - un chatbot,
      - un formulaire de contact,
      - une galerie de réalisations,
      - un système d'adiministration avec login sécurisé, gestion du blog, des contacts, des réalisations, des rendez-vous, de la newsletter, du chatbot.
      
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
    team: 'solo',
    source: 'Majoli.io'
  },

  // ========================================
  // PROJET 3: SYSTÈME MARKETING DIGITAL COMPLET
  // ========================================
  {
    id: "systeme-marketing-digital",
    title: "Système Marketing Digital Complet",
    shortDescription: "Système automatisé d'analyse web, extraction de contacts avec interface graphique moderne.",
    fullDescription: `
      Un système marketing digital complet combinant trois composants puissants pour optimiser les campagnes 
      marketing : analyse de performances web, extraction de contacts qualifiés et gestion des campagnes.
      
      **Composant 1 - Système de Scoring Multi-API :**
      Analyse les performances web des prospects via Google PageSpeed Insights et génère des hooks 
      personnalisés pour les campagnes. Le système traite les performances en parallèle pour identifier 
      les sites avec des problèmes (opportunités de vente) et créer des messages personnalisés basés 
      sur les scores réels. Cas d'usage : "Votre site mobile est noté 45/100 par Google, nous pouvons 
      l'améliorer..." pour l'emailing et le phoning ciblé.
      
      **Composant 2 - Application Fullstack avec Interface Graphique :**
      Interface moderne React avec backend Node.js pour gérer toutes les bases de domaines. 
      Le système automatise la récupération des domaines de la veille via tâches cron quotidiennes 
      (6h00). Enrichissement WHOIS/RDAP pour récupérer emails, numéros de téléphone, organisations et adresses. 
      Le système récupère uniquement les contacts non protégés, puis procède à la déduplication (suppression 
      des doublons) avant validation des emails via Million Verifier pour éliminer les potentiels bounces.
      
      **Fonctionnalités avancées de gestion des données :**
      - **Gestion des CSV** : Import/export de fichiers CSV avec aperçu des 10 premières lignes et téléchargement fichiers traités
      - **Tri géographique** : Filtrage par localisation, ville, département et région
      - **Recherche ciblée** : Recherche sur un domaine spécifique avec résultats détaillés
      - **Téléchargement OpenData** : Possibilité de télécharger la base complète de 10 millions de lignes
      - **Dashboards statistiques** : Visualisations avancées avec métriques de performance et analyses géographiques
      
      **⚠️ Important :** L'utilisation des bases de données ne respecte pas le RGPD. Ce système est destiné 
      uniquement à des fins de démonstration technique.

    `,
    mainImage: "/projets/marketing-digital/image1.png",
    images: [
      { url: "/projets/marketing-digital/image2.png", alt: "Dashboard d'analyse des performances" },
      { url: "/projets/marketing-digital/image3.png", alt: "Interface de gestion des campagnes" }
    ],
    tech: ["Node.js", "React", "TypeScript", "MongoDB", "Docker", "Google PageSpeed Insights API", "Million Verifier API", "SmartLead API", "WHOIS/RDAP", "Web Scraping"],
    links: [
      { url: "https://github.com/Jhinslain/Cold-Emailing-Toolkit", type: "github", label: "Voir le Code Source" }
    ],
    category: 'web',
    status: 'completed',
    year: 2025,
    team: 'solo',
    source: 'Majoli.io'
  },

  // ========================================
  // PROJET 4: MÉMOIRE VIDÉO
  // ========================================
  {
    id: "memoire-video",
    title: "Mémoire Vidéo - Production Audiovisuelle",
    shortDescription: "Vidéo de mémoire de 3 minutes avec montage, animations, effets audio et voix off.",
    fullDescription: `
      Production audiovisuelle complète d'un mémoire de 3 minutes réalisée avec Adobe Premiere Pro. 
      Le projet démontre des compétences en montage vidéo et post-production.
      
      La vidéo intègre une vidéo de fond dynamique, des sous-titres synchronisés, des animations simples
      et des effets de texte. (Un passage a été flouté et la vidéo coupée pour préserver l'anonymat.)
      Effets de masking et retouche vidéo.
      
      La bande sonore utilise des musiques d'Artlist ainsi que des effets audio intégrés. 
      La voix off a été générée avec ElevenLabs. 
      Les séquences géographiques ont été créées avec Google Earth Studio.
      
      Le projet se termine par un générique de fin avec crédits et remerciements.
    `,
    mainImage: "/projets/memoireVideo/memoireVideoCouverture.jpg",
    video: "https://drive.google.com/file/d/1UHzLYBrSHwpyLOGvrnQnl_hhc1jkBoOH/preview",
    tech: ["Adobe Premiere Pro", "ElevenLabs", "Artlist", "Google Earth Studio", "Masking", "Post-Production", "Montage Vidéo"],
    
    category: 'other',
    status: 'completed',
    year: 2025,
    team: 'duo',
    source: 'Projet Personnel'
  },

  // ========================================
  // PROJET 5: REALISTIC VR CHARACTER MOVEMENT
  // ========================================
  {
    id: "realistic-vr-character-movement",
    title: "Realistic VR Character Movement",
    shortDescription: "Système de déplacement immersif et réaliste pour personnage VR avec Inverse Kinematics et animations procédurales.",
    fullDescription: `
      Développement d'un système de déplacement immersif et réaliste pour un personnage en réalité virtuelle (VR) 
      dans Unity. Le projet intègre des personnages 3D avec squelette provenant de la plateforme Mixamo pour 
      créer une expérience VR authentique et engageante.
      
      **Configuration complète du corps en VR :**
      Le système repose sur une configuration complète du corps en réalité virtuelle, incluant le contrôle 
      précis des bras et des jambes par Inverse Kinematics (IK). Cette technologie permet un mouvement naturel 
      et fluide des membres du personnage en fonction des mouvements réels de l'utilisateur.
      
      **Fonctionnalités avancées :**
      - **Animations de mains** : Système d'animations de mains pour une immersion accrue et des interactions 
        naturelles avec l'environnement virtuel
      - **Mouvement de marche procédural** : Implémentation d'un système de marche procédural qui s'adapte 
        automatiquement aux mouvements de l'utilisateur
      - **Ajustement de taille** : Le système permet d'ajuster la taille du personnage pour correspondre 
        exactement à la hauteur réelle de l'utilisateur, garantissant une immersion optimale
      - **Sélection de personnages** : Interface permettant de changer facilement de personnage en cours 
        d'utilisation, offrant une variété d'avatars disponibles
      
      Le projet utilise Unity avec C# pour le développement, OpenXR pour la compatibilité VR, et des techniques 
      avancées d'Inverse Kinematics pour créer une expérience de mouvement réaliste et immersive.
    `,
    mainImage: "/projets/character-movement/image1.png",
    video: "https://drive.google.com/file/d/1nJsRfn9lt0Ei_3q8UPn2oY3jbYzBbJ2N/preview",
    tech: ["Unity", "C#", "Inverse Kinematics", "OpenXR", "Mixamo", "VR Development", "3D Animation"],
    category: 'game',
    status: 'completed',
    year: 2024,
    team: 'solo',
    source: 'Projet Personnel'
  },

  // ========================================
  // PROJET 6: CRAZY COOK FUSION
  // ========================================
  {
    id: "crazy-cook-fusion",
    title: "Crazy Cook Fusion - Jeu Mobile 3D",
    shortDescription: "Jeu mobile 3D inspiré du Suika Game développé sur Unity avec système de fusion d'ingrédients et modes de jeu variés.",
    fullDescription: `
      Crazy Cook Mobile est un jeu mobile en 3D développé sur Unity lors de mon stage chez JungleVR. 
      Le jeu s'inspire du célèbre Suika Game et utilise les assets du jeu Crazy Cook VR de JungleVR pour 
      créer une expérience mobile immersive et addictive.
      
      **Mécaniques de jeu principales :**
      Le but du jeu est de tirer les ingrédients dans une marmite sans qu'ils ne débordent. Les ingrédients 
      similaires fusionnent au toucher, créant un ingrédient supérieur selon un système de progression. 
      Le joueur contrôle un canon à l'aide de commandes tactiles simples, assisté par une ligne de trajectoire 
      pour viser précisément. En relâchant son doigt, l'ingrédient est lancé dans la marmite.
      
      **Système de surchauffe :**
      Attention, si le canon surchauffe, l'ingrédient sera brûlé et ne pourra plus fusionner, ajoutant 
      une dimension stratégique au gameplay et nécessitant une gestion intelligente des tirs.
      
      **Modes de jeu variés :**
      - **Mode infini** : Défi de battre le meilleur score avec une progression continue
      - **Mode recette** : Compléter une recette spécifique sans excédent d'ingrédients
      - **Mode journalier** : Calendrier avec une recette aléatoire à compléter chaque jour
      
      **Expérience utilisateur complète :**
      Le jeu possède un décor travaillé avec des environnements détaillés, des feedbacks visuels 
      satisfaisants, des animations fluides, ainsi que des effets sonores immersifs et des musiques 
      adaptées. Un menu de paramètres permet de régler l'audio et les préférences selon les goûts du joueur.
      
      Développé avec Unity et C#, ce projet démontre des compétences en développement mobile, game design, 
      et intégration d'assets 3D pour créer une expérience de jeu complète et engageante.
    `,
    mainImage: "/projets/CCF/image13.png",
    images: [
      { url: "/projets/CCF/image1.png", alt: "Interface du jeu Crazy Cook Fusion" },
      { url: "/projets/CCF/image2.png", alt: "Interface du jeu Crazy Cook Fusion" },
      { url: "/projets/CCF/image3.png", alt: "Interface du jeu Crazy Cook Fusion" },
      { url: "/projets/CCF/image4.png", alt: "Interface du jeu Crazy Cook Fusion" },
      { url: "/projets/CCF/image5.png", alt: "Interface du jeu Crazy Cook Fusion" },
      { url: "/projets/CCF/image6.png", alt: "Interface du jeu Crazy Cook Fusion" },
      { url: "/projets/CCF/image7.png", alt: "Interface du jeu Crazy Cook Fusion" },
      { url: "/projets/CCF/image8.png", alt: "Interface du jeu Crazy Cook Fusion" },
      { url: "/projets/CCF/image9.png", alt: "Interface du jeu Crazy Cook Fusion" },
      { url: "/projets/CCF/image10.png", alt: "Interface du jeu Crazy Cook Fusion" },
      { url: "/projets/CCF/image11.png", alt: "Interface du jeu Crazy Cook Fusion" },
      { url: "/projets/CCF/image12.png", alt: "Interface du jeu Crazy Cook Fusion" },
      { url: "/projets/CCF/image13.png", alt: "Interface du jeu Crazy Cook Fusion" },
      { url: "/projets/CCF/image14.png", alt: "Interface du jeu Crazy Cook Fusion" },
      { url: "/projets/CCF/image15.png", alt: "Interface du jeu Crazy Cook Fusion" },
    ],
    video: "https://drive.google.com/file/d/1d7uX3mWVrnQu31H-pyUBl-AR-gq8c6u1/preview",
    tech: ["Unity", "C#", "Mobile Development", "3D Game Development", "Game Design", "Asset Integration", "Touch Controls", "UI/UX Design"],
    links: [
      { url: "/projets/CCF/Rapport_CCF.pdf", type: "pdf", label: "Rapport de Stage" },
      { url: "https://drive.google.com/file/d/1fRuSPWgFAGkmY92uVMId5MVhDWfPQwwp/view?usp=drive_link", type: "website", label: "Télécharger l'APK" }
    ],
    category: 'mobile',
    status: 'completed',
    year: 2024,
    team: 'solo',
    source: 'JungleVR'
  },

  // ========================================
  // PROJET 7: SKI RUSH
  // ========================================
  {
    id: "ski-rush",
    title: "Ski Rush - Jeu Mobile Endless Ski",
    shortDescription: "Premier jeu mobile 3D développé sur Unity, style endless game de ski avec système de cosmétiques et effets météorologiques.",
    fullDescription: `
      Ski Rush est le premier jeu mobile que j'ai réalisé lors de mon stage chez JungleVR. C'est un jeu 3D 
      développé sur Unity, dans le style endless game de ski qui offre une expérience immersive et addictive 
      sur mobile.
      
      **Mécaniques de jeu principales :**
      Le joueur contrôle un skieur qui descend en ligne droite avec des mouvements simples à l'aide d'un 
      slider qui ajuste la position du skieur. Le but est de passer à travers des portes de ski de descente, 
      tout en évitant des obstacles comme des rochers ou des arbres. Ces obstacles sont placés de manière 
      aléatoire sans bloquer complètement le chemin du slalom, mais leur nombre augmente progressivement au fil du temps pour ajouter du défi.
      
      **Système d'animations :**
      Le skieur est animé avec des mouvements variés tels que l'idle (position de repos), le slide (glissement), 
      et la chute lorsqu'il touche un obstacle. Ces animations fluides contribuent à l'immersion et au 
      réalisme du gameplay.
      
      **Effets météorologiques et cycle jour/nuit :**
      Pour accroître la difficulté, des effets météorologiques apparaissent durant les parties, notamment 
      de la neige, du brouillard, et du gel. De plus, un cycle jour/nuit plonge le joueur dans des descentes 
      nocturnes où il devra skier avec une lampe torche, ajoutant un élément de concentration supplémentaire 
      et une ambiance immersive.
      
      **Système de cosmétiques et économie :**
      Pour prolonger l'intérêt du jeu, un système de cosmétiques a été mis en place. Les joueurs peuvent 
      acheter des skins pour le personnage, les skis, et les bâtons à l'aide des points gagnés, appelés 
      snowflakes, que le joueur récolte en passant avec succès à travers les portes de ski.
      
      **Système de pooling pour l'optimisation :**
      Pour augmenter les performances du jeu, un système de pooling a été implémenté pour gérer 
      efficacement les objets du jeu. Au lieu de créer et supprimer constamment les obstacles, particules 
      et autres éléments, le système garde un cache d'objets réutilisables. Cette technique évite les 
      allocations mémoire fréquentes et réduit le garbage collection, garantissant une fluidité optimale 
      sur mobile.
      
      **Monétisation :**
      Des publicités sont intégrées à la fin de chaque partie pour offrir une opportunité de gagner 50 
      snowflakes supplémentaires si le joueur choisit de les visionner, créant un modèle économique 
      équilibré pour le jeu mobile.
    `,
    mainImage: "/projets/SkiRush/image1.png",
    images: [
      { url: "/projets/SkiRush/image1.png", alt: "Écran de démarrage Ski Rush" },
      { url: "/projets/SkiRush/image2.png", alt: "Gameplay Ski Rush - Descente de jour" },
      { url: "/projets/SkiRush/image3.png", alt: "Gameplay Ski Rush - Slalom" },
      { url: "/projets/SkiRush/image4.png", alt: "Gameplay Ski Rush - Obstacles" },
      { url: "/projets/SkiRush/image5.png", alt: "Gameplay Ski Rush - Descente nocturne" },
      { url: "/projets/SkiRush/image6.png", alt: "Gameplay Ski Rush - Brouillard" },
      { url: "/projets/SkiRush/image7.png", alt: "Interface de personnalisation" },
      { url: "/projets/SkiRush/image8.png", alt: "Menu de cosmétiques" },
      { url: "/projets/SkiRush/image9.png", alt: "Sélection d'équipements" },
      { url: "/projets/SkiRush/image10.png", alt: "Interface de jeu" },
      { url: "/projets/SkiRush/image11.png", alt: "Menu principal" }
    ],
    video: "https://drive.google.com/file/d/1Wf3Y-dkVCDsRcY8uEzjen9US5TiZT8fl/preview",
    tech: ["Unity", "C#", "Mobile Development", "3D Game Development", "Game Design", "Animation", "Publicité sur Mobile", "Endless Game"],
    links: [
      { url: "https://drive.google.com/file/d/1qZ0l0_1gtaQkax2LhNcXLTcdtzLfWl9E/view?usp=drive_link", type: "website", label: "Télécharger l'APK" },
      { url: "https://drive.google.com/file/d/1Wf3Y-dkVCDsRcY8uEzjen9US5TiZT8fl/preview", type: "video", label: "Démonstration du Jeu" }
    ],
    category: 'mobile',
    status: 'completed',
    year: 2024,
    team: 'solo',
    source: 'JungleVR'
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
