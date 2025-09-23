import SkillCard from '@/components/SkillCard';

import vrIcon from '@/assets/images/skills/VR2.png';
import aiIcon from '@/assets/images/skills/Robot2.png';
import dbIcon from '@/assets/images/skills/Data2.png';
import webIcon from '@/assets/images/skills/FullStack2.png';
import designIcon from '@/assets/images/skills/Design.png';
import toolsIcon from '@/assets/images/skills/Outils.png';
import marketingIcon from '@/assets/images/skills/Marketing.png';
import projetIcon from '@/assets/images/skills/Projet.png';

const skills = [
  {
    title: "XR, Jeux & Réalité Virtuelle",
    description: "→ Moteurs de jeu : Unity (C#), Unreal Engine 5 (Blueprint, C++)\n\n→ XR & animation VR : OpenXR, IK tracking (tête, mains, corps), Mixamo\n\n→ Modélisation & textures : Blender, Substance Painter",
    icon: <img src={vrIcon} alt="XR & VR" className="w-20 h-20 object-contain" />
  },
  {
    title: "Intelligence Artificielle",
    description: "→ Langage & frameworks IA : Python, PyTorch, TensorFlow\n\n→ Outils IA intégrés : ChatGPT, Gemini, Cursor, ElevenLabs, Lovable",
    icon: <img src={aiIcon} alt="IA" className="w-20 h-20 object-contain" />
  },
  {
    title: "Développement Web & Full Stack",
    description: "→ Langages : HTML, CSS, JavaScript, PHP, C, Python, Java\n\n→ Front-end : React, Angular, Tailwind CSS, Ionic\n\n→ Back-end : Node.js, Express.js, Next.js\n\n→ CMS / No-code : WordPress, Bubble.io\n\n→ API & temps réel : REST API, WebSockets",
    icon: <img src={webIcon} alt="Web Development" className="w-20 h-20 object-contain" />
  },
  {
    title: "Data & Bases de Données",
    description: "→ Visualisation & reporting : Power BI, Tableau\n\n→ Bases de données : SQL, SQLite, Oracle, MySQL, MongoDB",
    icon: <img src={dbIcon} alt="Data" className="w-20 h-20 object-contain" />
  },
  {
    title: "Design, Vidéo & UI/UX",
    description: "→ Suite Adobe : Illustrator, After Effects, Premiere Pro, Substance, Adobe XD\n\n→ Prototypage & graphisme : Figma, Canva Pro\n\n→ Identité visuelle : Création de logos, charte graphique, animations",
    icon: <img src={designIcon} alt="Design" className="w-20 h-20 object-contain" />
  },
  {
    title: "Marketing & Communication",
    description: 
      "→ Prospection & emailing : SmartLead, Apollo, Cold Emailing, MillionVerifier\n\n" +
      "→ Automatisation & interaction client : Twilio, Hubspot, Ringover, Stripe",
    icon: <img src={marketingIcon} alt="Marketing" className="w-20 h-20 object-contain" />
  },
  {
    title: "Gestion de Projets",
    description: "→ Pilotage projet : Coordination d'une équipe (2 devs, 1 designer) chez Majoli.io sur la création d'un CMS\n\n" +
    "→ Gestion & organisation : Trello, Notion, Slack, Microsoft 365, Google Workspace\n\n" +
    "→ Déploiement & versioning :GitHub, GitLab, AWS Amplify\n\n",
    icon: <img src={projetIcon} alt="Projet" className="w-20 h-20 object-contain" />
  },
  {
    title: "Outils & Écosystème",
    description: "→ Versioning & collaboration : Git / GitHub / GitLab / GitKraken\n\n→ Déploiement & hébergement : Netlify, OVH, AWS Amplify\n\n→ Organisation & gestion : Notion, Trello, Microsoft 365, Google Workspace",
    icon: <img src={toolsIcon} alt="Tools" className="w-20 h-20 object-contain" />
  }
];

interface SkillSectionProps {
  className?: string;
}

const SkillSection = ({ className = "" }: SkillSectionProps) => {
  return (
    <section id="skills" className={`py-20 px-6 bg-gradient-to-b from-transparent to-background/60 ${className}`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Compétences
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Une combinaison de compétences techniques, de pensée créative et de résolution de problèmes 
            qui stimulent les expériences numériques innovantes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 gap-y-20">
          {skills.map((skill, index) => (
            <SkillCard
              key={index}
              title={skill.title}
              description={skill.description}
              icon={skill.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillSection; 