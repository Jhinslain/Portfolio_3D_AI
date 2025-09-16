# Archi Borrelli - Site Web Professionnel

Site web professionnel pour **Atelier Borrelli**, cabinet d'architecture dirigé par Flavio Borrelli, Architecte DPLG et Artiste visuel. Le site présente les services architecturaux, les réalisations et permet la prise de rendez-vous en ligne.

## 🎯 Objectif du Site

Le site web d'**Atelier Borrelli** a pour objectif de :
- **Présenter l'expertise** de Flavio Borrelli en architecture et design d'intérieur
- **Promouvoir les services** : conception architecturale, permis de construire, suivi de chantier, conseil en aménagement, études de faisabilité et projets d'art
- **Exposer les réalisations** et projets architecturaux
- **Faciliter la prise de contact** avec un système de rendez-vous en ligne
- **Partager du contenu** via un blog architectural
- **Gérer une galerie** de projets visuels

## 🏗️ Architecture Technique

### Technologies Principales
- **Next.js 14** - Framework React avec App Router
- **React 18** - Bibliothèque UI avec hooks et composants fonctionnels
- **TypeScript** - Typage statique pour la robustesse du code
- **Tailwind CSS** - Framework CSS utilitaire pour le design responsive
- **Shadcn/ui** - Composants UI réutilisables et accessibles
- **Radix UI** - Primitives UI pour l'accessibilité

### Base de Données et Services
- **MongoDB** - Base de données NoSQL pour le contenu dynamique
- **AWS S3** - Stockage des images et médias
- **SendGrid** - Service d'envoi d'emails transactionnels
- **Google Calendar API** - Intégration calendrier pour les rendez-vous
- **Crisp Chat** - Système de chat en direct

## 📱 Fonctionnalités Principales

### 🌐 Interface Multilingue
- **Support FR/EN** avec basculement dynamique
- **Persistance** de la langue choisie via localStorage
- **URLs** avec hash de langue pour le partage

### 🏠 Pages Principales
1. **Accueil** - Présentation interactive des services avec carrousel
2. **À propos** - Profil de Flavio Borrelli et approche architecturale
3. **Services** - 6 services détaillés avec pages individuelles
4. **Réalisations** - Portfolio des projets architecturaux
5. **Galerie** - Galerie visuelle des créations
6. **Blog** - Articles sur l'architecture et les tendances
7. **Contact** - Formulaire de contact et prise de rendez-vous

### 🎨 Design et UX
- **Design responsive** optimisé mobile/desktop
- **Animations fluides** et transitions CSS
- **Navigation intuitive** avec menu hamburger mobile
- **Carrousel interactif** sur la page d'accueil
- **Effets de hover** sophistiqués sur les services
- **Typographie** personnalisée (Semplicita)

## 🔧 API Endpoints Détaillés

### 📝 Blog (`/api/blog/`)
- `GET /api/blog` - Récupérer tous les articles
- `POST /api/blog` - Créer un nouvel article
- `GET /api/blog/published` - Articles publiés uniquement
- `GET /api/blog/slug/[slug]` - Article par slug
- `GET /api/blog/keywords` - Mots-clés pour le SEO

### 📞 Contact (`/api/contact/`)
- `POST /api/contact` - Envoi de message de contact
- `GET /api/contact/admin` - Messages pour l'administration
- **Fonctionnalités** : Validation email, envoi automatique, tracking IP

### 🏗️ Réalisations (`/api/realisations/`)
- `GET /api/realisations` - Récupérer toutes les réalisations
- `POST /api/realisations` - Créer une nouvelle réalisation
- `GET /api/realisations/slug/[slug]` - Réalisation par slug
- **Gestion** : Images, descriptions, catégories

### 📅 Rendez-vous (`/api/rdv/`)
- `POST /api/rdv` - Créer un rendez-vous avec synchronisation Google Calendar
- `GET /api/rdv` - Lister les rendez-vous
- `GET /api/rdv/parametres` - Configuration des créneaux disponibles
- `POST /api/rdv/google-auth` - Authentification Google Calendar
- `GET /api/rdv/google-callback` - Callback OAuth Google Calendar
- **Synchronisation Google Calendar** : Création automatique d'événements, gestion des conflits, emails de confirmation

### 📧 Newsletter (`/api/newsletter/`)
- `POST /api/newsletter/subscribe` - Inscription newsletter
- `GET /api/newsletter/subscribers` - Gestion des abonnés
- `POST /api/newsletter/campaigns` - Création de campagnes
- **Fonctionnalités** : Double opt-in, emails de confirmation

### 🤖 Chatbot (`/api/chatbot/`)
- `GET /api/chatbot/faq` - Questions fréquentes
- `POST /api/chatbot/messages` - Envoi de messages
- `GET /api/chatbot/settings` - Configuration du chatbot
- `GET /api/chatbot/visitor-info` - Informations visiteur

### 📤 Upload (`/api/upload-unified/`)
- `POST /api/upload-unified` - Upload d'images vers S3
- **Support** : Upload simple et multiple
- **Validation** : Types de fichiers, tailles
- **Catégories** : Réalisations, blog, galerie

### 💬 Crisp Chat (`/api/crisp/`)
- `GET /api/crisp/config` - Configuration du chat
- `POST /api/crisp/config` - Activation/désactivation
- **Fonctionnalités** : Chat en direct, configuration dynamique

## 🚀 Installation et Déploiement

### Prérequis
- Node.js 18+
- MongoDB
- Compte AWS S3
- Clé API SendGrid
- Compte Google Calendar API


### Variables d'Environnement Requises
```env
MONGODB_URI
S3_ACCESS_KEY_ID
S3_SECRET_ACCESS_KEY
S3_REGION
S3_BUCKET_NAME
SENDGRID_API_KEY
FROM_EMAIL
ADMIN_EMAIL
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
NEXT_PUBLIC_BASE_URL
```

### Scripts Disponibles
```bash
npm run dev      # Serveur de développement
```

## 📁 Structure du Projet

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── api/               # Endpoints API
│   │   ├── blog/          # Gestion du blog
│   │   ├── contact/       # Messages de contact
│   │   ├── realisations/  # Portfolio
│   │   ├── rdv/          # Rendez-vous
│   │   ├── newsletter/   # Newsletter
│   │   ├── chatbot/      # Chatbot
│   │   ├── upload-unified/ # Upload S3
│   │   └── crisp/        # Configuration chat
│   ├── a_propos/         # Page À propos
│   ├── services/         # Pages services individuels
│   ├── realisations/     # Page réalisations
│   ├── galerie/          # Galerie photos
│   ├── blog/             # Blog et articles
│   ├── contact/          # Contact et RDV
│   └── admin/            # Interface d'administration
├── components/            # Composants React
│   ├── ui/               # Composants Shadcn/ui
│   ├── Hero3.tsx         # Page d'accueil interactive
│   ├── Navbar2.tsx       # Navigation principale
│   ├── ContactForm.tsx   # Formulaire de contact
│   ├── RendezVous.tsx    # Prise de rendez-vous
│   ├── Gallery.tsx       # Galerie photos
│   ├── Blog.tsx          # Composant blog
│   └── Realisations.tsx  # Portfolio
├── lib/                   # Utilitaires et configurations
│   ├── api/              # Fonctions API
│   ├── mongodb.ts        # Connexion base de données
│   ├── s3.ts             # Gestion AWS S3
│   ├── sendgrid.ts       # Envoi d'emails
│   └── google-calendar.ts # Intégration calendrier
├── hooks/                 # Hooks React personnalisés
├── types/                 # Types TypeScript
└── config/                # Configurations
```

## 🎨 Services Architecturaux

### 1. Conception Architecturale
- Projets sur-mesure : neuf, rénovation, extension
- Design unique adapté aux besoins clients
- Intégration créativité et expertise technique

### 2. Permis de Construire
- Gestion des démarches administratives
- Prise en charge des formalités
- Garantie de conformité réglementaire

### 3. Suivi de Chantier
- Organisation et coordination des travaux
- Respect des délais et du budget
- Assurance qualité tout au long du projet

### 4. Conseil en Aménagement
- Optimisation et valorisation des espaces
- Repenser l'agencement pour plus de fonctionnalité
- Amélioration esthétique et confort

### 5. Études de Faisabilité
- Analyse technique, réglementaire et financière
- Évaluation de la viabilité des projets
- Sécurisation de l'investissement

### 6. Projets d'Art
- Intégration de l'art dans l'architecture
- Création d'œuvres uniques
- Personnalisation des espaces de vie et de travail

## 🌟 Fonctionnalités Avancées

### 📱 Responsive Design
- **Mobile First** : Optimisé pour tous les écrans
- **Touch Gestures** : Navigation tactile intuitive
- **Performance** : Chargement rapide sur mobile

### 🔍 SEO et Performance
- **Meta tags** dynamiques par page
- **Images optimisées** avec Next.js Image
- **Sitemap** automatique
- **Schema.org** pour le référencement

### 🔒 Sécurité
- **Validation** des données côté serveur
- **Sanitisation** des entrées utilisateur
- **Rate limiting** sur les APIs sensibles
- **HTTPS** obligatoire en production

### 📊 Analytics et Tracking
- **Suivi des visiteurs** avec Google Analytics
- **Métriques de performance** Core Web Vitals
- **Tracking des conversions** (contacts, RDV)

## 🚀 Déploiement

Le site est déployé sur **AWS Amplify** avec le domaine personnalisé **atelierborrelli.com**.

### Variables d'Environnement
- Configurer toutes les variables dans la console Amplify
- **MongoDB Atlas** pour la base de données
- **AWS S3** pour le stockage des images


## 👨‍💻 Développement

**Développé entièrement par Ghislain LEVREAU** de l'agence **[Majoli.io](https://majoli.io)**

## 📄 Propriété

**Propriété du client Flavio Borrelli** - Atelier Borrelli © 2025

---


