# IvoireChat — Cahier des charges produit & technique

> Document de référence destiné à une IA de développement ou à une équipe produit/tech pour construire une web app conversationnelle d’accès aux services publics ivoiriens.

---

## 1. Vision du produit

**IvoireChat** est une web app conversationnelle destinée à simplifier l’accès aux démarches, informations et services publics en Côte d’Ivoire.

L’objectif n’est pas de créer un simple chatbot, mais une **interface conversationnelle multimodale** capable de :

- comprendre les questions des utilisateurs en langage naturel ;
- expliquer les démarches administratives en termes simples ;
- s’appuyer en priorité sur des **sources officielles ivoiriennes** ;
- afficher des **widgets interactifs** adaptés à la réponse ;
- guider l’utilisateur étape par étape ;
- fonctionner en texte et en voix ;
- intégrer progressivement des langues ivoiriennes ;
- mémoriser localement ou dans une session l’avancement d’une démarche ;
- à terme, préparer des données structurées permettant de préremplir ou transmettre une démarche vers un service officiel compatible.

La promesse produit peut être résumée ainsi :

> **Comprendre → Agir → Vérifier**

L’utilisateur ne doit pas avoir besoin de connaître l’administration, le ministère ou le portail compétent avant de commencer.

---

## 2. Positionnement

IvoireChat doit être pensé comme :

- une **porte d’entrée intelligente vers les services publics ivoiriens** ;
- une couche conversationnelle au-dessus de plusieurs sites et services existants ;
- un assistant qui explique, structure et guide ;
- un outil qui réduit la complexité des démarches ;
- un produit très accessible sur mobile.

Si le projet est indépendant de l’État, il doit afficher clairement une mention du type :

> IvoireChat est un service indépendant. Il n’est pas affilié au Gouvernement de Côte d’Ivoire. Les réponses sont établies à partir de sources publiques officielles lorsqu’elles sont disponibles. Les démarches officielles restent effectuées auprès des administrations compétentes.

Ne pas imiter visuellement un site gouvernemental au point de créer une confusion sur l’identité du service.

---

## 3. Public cible

Le produit doit servir notamment :

- citoyens ivoiriens ;
- résidents en Côte d’Ivoire ;
- diaspora ivoirienne ;
- étudiants ;
- salariés ;
- entrepreneurs ;
- parents ;
- personnes peu familières des démarches administratives ;
- utilisateurs ayant une faible aisance numérique ;
- utilisateurs préférant la voix au texte.

Le produit doit être conçu en priorité pour une utilisation sur smartphone.

---

## 4. Exemples de besoins utilisateurs

Exemples de requêtes :

- « Comment faire mon passeport ? »
- « Quels documents il faut pour créer une entreprise ? »
- « Je veux refaire mon extrait de naissance. »
- « Où je peux faire ma CMU ? »
- « Combien coûte cette démarche ? »
- « Je dois aller où ? »
- « Mon papier est expiré, comment je fais ? »
- « Je veux créer une SARL avec mon frère. »
- « Je suis à Yopougon, où est le service le plus proche ? »
- « Explique-moi ça simplement. »
- « Lis-moi la réponse. »

Le système doit également comprendre des formulations informelles, des phrases imparfaites et du français courant ivoirien.

---

# 5. Philosophie UX

## 5.1. Interface principale

L’application s’articule autour d’un écran de chat.

Éléments principaux :

- logo / nom IvoireChat ;
- conversation ;
- zone de saisie texte ;
- bouton microphone ;
- bouton d’envoi ;
- possibilité d’attacher un document dans une version ultérieure ;
- indication de la langue active ;
- widgets interactifs directement dans le flux conversationnel.

Exemple d’accroche :

> **Que voulez-vous faire ?**

Suggestions possibles :

- Passeport
- État civil
- Santé / CMU
- Créer une entreprise
- Impôts
- Justice
- Emploi
- Éducation
- Transport
- Foncier

---

## 5.2. Principe d’une réponse

Une bonne réponse peut contenir trois couches :

### 1. Comprendre

Explication simple et conversationnelle.

### 2. Agir

Un ou plusieurs widgets permettant à l’utilisateur d’avancer.

### 3. Vérifier

Une ou plusieurs sources officielles et un lien vers le service compétent.

Exemple :

```text
Pour renouveler votre passeport, voici ce qu’il faut préparer.

[Checklist interactive]

[Étapes 1 → 4]

[Voir la source officielle]

[Continuer vers le service officiel]
```

---

# 6. Bibliothèque de widgets

Les widgets ne doivent pas être décoratifs. Ils doivent aider l’utilisateur à comprendre, choisir ou avancer dans une démarche.

## 6.1. ChatBubble

Affiche une réponse texte classique.

Props possibles :

```ts
type ChatBubbleProps = {
  role: "assistant" | "user";
  content: string;
  timestamp?: string;
};
```

---

## 6.2. ChoiceCard

Permet de proposer plusieurs choix.

Exemple :

> Quel type d’entreprise souhaitez-vous créer ?

- Entreprise individuelle
- SARL
- SAS
- Je ne sais pas

Structure :

```ts
type ChoiceCard = {
  type: "choice";
  id: string;
  title: string;
  description?: string;
  options: Array<{
    id: string;
    label: string;
    value: string;
  }>;
  multiple?: boolean;
};
```

---

## 6.3. Checklist

Pour les documents ou actions à préparer.

Exemple :

- [x] CNI
- [ ] Ancien passeport
- [ ] Justificatif
- [x] Paiement

Structure :

```ts
type ChecklistWidget = {
  type: "checklist";
  id: string;
  title: string;
  items: Array<{
    id: string;
    label: string;
    description?: string;
    checked: boolean;
    required?: boolean;
  }>;
};
```

L’état coché doit pouvoir être persisté pendant la conversation.

---

## 6.4. Stepper

Affiche les étapes d’une démarche.

Exemple :

1. Préparer les pièces
2. Effectuer le paiement
3. Prendre rendez-vous
4. Déposer le dossier
5. Récupérer le document

Structure :

```ts
type StepperWidget = {
  type: "stepper";
  id: string;
  title: string;
  currentStep: number;
  steps: Array<{
    id: string;
    label: string;
    status: "pending" | "current" | "done";
  }>;
};
```

---

## 6.5. FeeCard

Affiche les frais connus pour une démarche.

Structure :

```ts
type FeeCard = {
  type: "fee";
  id: string;
  title: string;
  amount?: number;
  currency?: "XOF";
  amountLabel?: string;
  paymentMethods?: string[];
  sourceId?: string;
};
```

Attention : les prix doivent être reliés à une source et à une date de vérification.

---

## 6.6. Timeline

Pour les délais ou étapes dans le temps.

```ts
type TimelineWidget = {
  type: "timeline";
  id: string;
  title: string;
  events: Array<{
    label: string;
    description?: string;
    estimatedDuration?: string;
  }>;
};
```

---

## 6.7. LocationCard

Permet d’afficher un centre, une administration ou un bureau.

```ts
type LocationCard = {
  type: "location";
  id: string;
  name: string;
  address?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  openingHours?: string;
  phone?: string;
  officialUrl?: string;
};
```

À terme, prévoir une carte.

---

## 6.8. AppointmentCard

Prépare ou déclenche une prise de rendez-vous.

```ts
type AppointmentCard = {
  type: "appointment";
  id: string;
  title: string;
  provider?: string;
  available?: boolean;
  officialUrl?: string;
};
```

---

## 6.9. OfficialAction

Bouton vers une démarche officielle.

Exemple :

> **Commencer la démarche officielle**

```ts
type OfficialAction = {
  type: "official_action";
  id: string;
  label: string;
  destinationId: string;
  url?: string;
  external: true;
};
```

Dans l’idéal, ne pas laisser le modèle générer arbitrairement une URL sensible. Utiliser un `destinationId` mappé côté serveur vers une URL autorisée.

---

## 6.10. AlertCard

Pour afficher une information importante.

Types :

- info ;
- warning ;
- urgent ;
- eligibility.

```ts
type AlertCard = {
  type: "alert";
  id: string;
  severity: "info" | "warning" | "critical";
  title: string;
  message: string;
};
```

---

## 6.11. Calculator

Pour certaines démarches calculables avec règles validées.

Exemples :

- frais ;
- cotisations ;
- échéances ;
- estimation simple.

Le calcul doit être effectué par du code déterministe et non par le LLM lorsque c’est possible.

---

## 6.12. DocumentCard

Affiche les informations concernant une pièce.

```ts
type DocumentCard = {
  type: "document";
  id: string;
  title: string;
  required?: boolean;
  description?: string;
  acceptedFormats?: string[];
  status?: "missing" | "ready" | "uploaded";
};
```

---

## 6.13. SourceCard

Affiche la provenance de l’information.

```ts
type SourceCard = {
  type: "source";
  id: string;
  title: string;
  publisher: string;
  url: string;
  verifiedAt?: string;
};
```

---

## 6.14. SummaryCard

Résumé structuré d’une démarche ou d’un dossier.

Exemple :

```text
Création d’entreprise

Nom : Ivoire Livraison
Ville : Abidjan
Forme : SARL
Associés : 2

[Modifier]
[Confirmer]
```

---

## 6.15. VoicePlayer

Permet de lire la réponse à voix haute.

Fonctions :

- play ;
- pause ;
- replay ;
- vitesse ;
- choix de langue/voix si disponible.

---

# 7. Architecture de rendu des widgets

Le LLM ne doit **jamais générer du HTML ou du React arbitraire**.

Le modèle doit répondre avec une structure JSON contrôlée.

Exemple :

```json
{
  "message": "Voici les documents à préparer.",
  "widgets": [
    {
      "type": "checklist",
      "id": "passport_documents",
      "title": "Documents nécessaires",
      "items": [
        {
          "id": "cni",
          "label": "Carte nationale d'identité",
          "checked": false,
          "required": true
        }
      ]
    },
    {
      "type": "official_action",
      "id": "passport_action",
      "label": "Continuer vers le service officiel",
      "destinationId": "passport_service",
      "external": true
    }
  ]
}
```

Le frontend fait ensuite :

```ts
switch (widget.type) {
  case "checklist":
    return <Checklist {...widget} />;

  case "choice":
    return <ChoiceCard {...widget} />;

  case "stepper":
    return <Stepper {...widget} />;

  case "fee":
    return <FeeCard {...widget} />;

  case "official_action":
    return <OfficialAction {...widget} />;

  default:
    return null;
}
```

Le schéma JSON doit être validé côté serveur avec Zod, JSON Schema, Pydantic ou équivalent.

---

# 8. Gestion de l’état

Les widgets doivent pouvoir conserver leur état.

Exemple :

```ts
type WidgetState = {
  widgetId: string;
  conversationId: string;
  value: unknown;
  updatedAt: string;
};
```

Exemple pour une checklist :

```json
{
  "widgetId": "passport_documents",
  "conversationId": "conv_123",
  "value": {
    "cni": true,
    "old_passport": true,
    "payment": false
  }
}
```

L’assistant pourra ensuite dire :

> Vous avez déjà préparé 2 documents sur 3.

---

# 9. Le « dossier universel »

À terme, la conversation doit construire progressivement un objet structuré représentant la démarche.

Exemple :

```json
{
  "person": {
    "firstName": "Jean",
    "lastName": "Kouassi",
    "phone": null,
    "email": null
  },
  "request": {
    "type": "company_creation",
    "status": "in_progress"
  },
  "company": {
    "name": "Ivoire Livraison",
    "legalForm": "SARL",
    "activity": "Livraison",
    "city": "Abidjan",
    "partners": 2
  },
  "documents": {
    "identityCard": {
      "status": "ready"
    }
  }
}
```

Chaque widget peut mettre à jour une partie de cet objet.

Exemple :

```text
ChoiceCard
→ company.legalForm = "SARL"

LocationCard
→ company.city = "Abidjan"

Checklist
→ documents.identityCard.status = "ready"
```

Le dossier doit rester séparé du texte de la conversation.

---

# 10. Préremplissage et transmission vers les services officiels

Cette fonctionnalité est une **évolution future importante**, mais elle doit être anticipée dans l’architecture.

Objectif :

> Les informations déjà saisies dans IvoireChat peuvent, avec accord explicite de l’utilisateur, servir à préparer ou préremplir une démarche officielle.

Trois niveaux :

## Niveau 1 — Information

IvoireChat explique uniquement.

## Niveau 2 — Préparation

IvoireChat collecte et structure les informations nécessaires.

## Niveau 3 — Transmission

IvoireChat transmet les données vers un service officiel compatible.

---

## 10.1. Méthode idéale : API officielle

Exemple :

```http
POST /api/dossiers
```

Payload :

```json
{
  "companyName": "Ivoire Livraison",
  "activity": "Livraison",
  "city": "Abidjan",
  "partners": 2
}
```

Réponse :

```json
{
  "draftId": "ABC123",
  "continueUrl": "https://service-officiel.ci/dossier/ABC123"
}
```

L’utilisateur poursuit alors directement sur le service officiel.

---

## 10.2. Jeton temporaire

Autre architecture possible :

```text
IvoireChat
→ génère un jeton temporaire
→ redirige vers le service public
→ le service récupère les données via ce jeton
```

Exemple :

```text
https://service-officiel.ci/continue?t=abc123
```

Le token :

- est à usage unique ;
- expire rapidement ;
- ne contient pas directement les données personnelles ;
- est associé à une autorisation explicite.

---

## 10.3. Paramètres URL

À utiliser uniquement pour des données non sensibles.

Exemple :

```text
?type=sarl&city=abidjan
```

Ne jamais y mettre :

- numéro de CNI ;
- date de naissance complète ;
- téléphone ;
- adresse personnelle ;
- documents ;
- données sensibles.

---

## 10.4. Automatisation navigateur

Possible techniquement, mais ne doit pas être le socle du produit.

Risques :

- fragile ;
- dépend des changements d’interface ;
- captcha ;
- authentification ;
- responsabilité ;
- sécurité ;
- conditions d’utilisation du site cible.

À utiliser seulement dans des contextes autorisés et contrôlés.

---

# 11. Consentement utilisateur

Avant toute transmission :

1. afficher les données comprises ;
2. permettre la modification ;
3. demander confirmation ;
4. demander consentement explicite pour la transmission.

Exemple :

```text
J’ai compris :

Nom : Jean Kouassi
Ville : Cocody
Activité : Livraison
Associés : 2

[Modifier]

[Confirmer]
```

Puis :

```text
Autoriser IvoireChat à transmettre ces informations au service concerné ?

[Annuler]
[Autoriser et continuer]
```

---

# 12. Fonctionnalités vocales

La voix est une fonctionnalité centrale.

Pipeline :

```text
Audio utilisateur
↓
Speech-to-Text
↓
Détection de langue
↓
Compréhension
↓
Réponse structurée
↓
Text-to-Speech
↓
Lecture audio
```

---

## 12.1. Bouton microphone

Dans la zone de saisie :

```text
[ + ]  Posez votre question...  [🎙️] [➤]
```

États :

- idle ;
- listening ;
- processing ;
- speaking ;
- error.

---

## 12.2. Mode conversation vocale

Un mode plein écran peut être proposé :

```text
┌───────────────────────────┐
│                           │
│            ◉              │
│      IvoireChat écoute    │
│                           │
│   Parlez naturellement    │
│                           │
│   Français · Dioula ▾     │
│                           │
│        Terminer           │
└───────────────────────────┘
```

Pendant que l’IA répond oralement, les widgets correspondants peuvent apparaître à l’écran.

---

# 13. Langues

Phase initiale :

- français.

Puis pilotes sur des langues utilisées en Côte d’Ivoire.

Exemples potentiels à évaluer :

- dioula ;
- baoulé ;
- bété ;
- sénoufo ;
- autres langues selon disponibilité des modèles et validation terrain.

Le support linguistique ne doit pas être déclaré « disponible » avant validation réelle par des locuteurs natifs.

Le système doit également être testé sur :

- français ivoirien ;
- expressions locales ;
- nouchi ;
- phrases mélangeant français et langue locale ;
- accents variés ;
- débit oral rapide ;
- bruit ambiant mobile.

---

# 14. Gestion des sources

IvoireChat ne doit pas utiliser librement n’importe quelle information du web pour les démarches administratives importantes.

Créer une **allowlist de sources officielles ou validées**.

Exemples de catégories :

- portail du Gouvernement ;
- service public ;
- ministères ;
- impôts ;
- CNPS ;
- CNAM / CMU ;
- justice ;
- CEPICI ;
- passeport ;
- éducation ;
- fonction publique ;
- transport ;
- douanes ;
- collectivités publiques.

Table possible :

```ts
type TrustedSource = {
  id: string;
  name: string;
  domain: string;
  category: string;
  trustLevel: "official" | "partner";
  enabled: boolean;
};
```

---

# 15. Système RAG

Les réponses administratives doivent être produites via un système RAG.

Architecture :

```text
Question utilisateur
↓
Classification de l’intention
↓
Recherche dans les sources autorisées
↓
Récupération des passages pertinents
↓
LLM
↓
Réponse structurée
↓
Texte + widgets + citations
```

Le LLM ne doit pas répondre uniquement de mémoire sur des données sensibles comme :

- prix ;
- délais ;
- critères ;
- pièces obligatoires ;
- conditions d’éligibilité ;
- coordonnées ;
- procédures officielles.

Ces éléments doivent idéalement provenir d’une source consultable.

---

# 16. Pipeline d’ingestion

Créer un service d’ingestion permettant de collecter :

- pages web ;
- PDF officiels ;
- FAQ ;
- fiches pratiques ;
- textes réglementaires pertinents.

Pipeline :

```text
URL / document
↓
Extraction
↓
Nettoyage
↓
Découpage
↓
Métadonnées
↓
Embeddings
↓
Index de recherche
```

Métadonnées recommandées :

```ts
type KnowledgeChunk = {
  id: string;
  sourceId: string;
  title: string;
  text: string;
  url: string;
  ministry?: string;
  category?: string;
  publishedAt?: string;
  verifiedAt: string;
  validFrom?: string;
  validTo?: string;
};
```

---

# 17. Détection d’intention

Avant génération, classifier la demande.

Exemples d’intentions :

```text
passport.new
passport.renew
birth_certificate.request
nationality_certificate.request
company.create
cmu.register
tax.pay
service.locate
procedure.cost
procedure.documents
procedure.status
procedure.explain
```

Cette classification permet :

- de choisir les sources ;
- d’utiliser le bon template de réponse ;
- de sélectionner les widgets adaptés ;
- de construire le dossier universel.

---

# 18. Format de réponse du modèle

Exemple recommandé :

```ts
type AssistantResponse = {
  message: string;

  intent?: {
    name: string;
    confidence: number;
  };

  widgets: Widget[];

  sources: Array<{
    id: string;
    title: string;
    url: string;
    publisher: string;
    verifiedAt?: string;
  }>;

  extractedData?: Record<string, unknown>;

  nextActions?: Array<{
    id: string;
    label: string;
    action: string;
  }>;
};
```

Le serveur valide toujours ce format avant de l’envoyer au client.

---

# 19. Stack technique recommandée

## Frontend

- Next.js
- TypeScript
- React
- Tailwind CSS
- shadcn/ui ou composants maison
- React Query / TanStack Query
- Zustand ou store équivalent pour état local

## Backend

Deux choix simples :

### Option A

Next.js full-stack

Bon pour MVP rapide.

### Option B

Next.js frontend + FastAPI backend

Bon si la partie IA, ingestion et RAG devient importante.

---

## Base de données

PostgreSQL.

Extensions possibles :

- pgvector pour embeddings ;
- Redis pour cache/session.

---

## Stockage

Object storage compatible S3 pour :

- pièces jointes ;
- documents ;
- audio temporaire.

---

## Recherche

Recherche hybride :

- BM25 / recherche texte ;
- embeddings ;
- reranking.

---

## Authentification

MVP :

- aucune authentification obligatoire.

Plus tard :

- email ;
- téléphone ;
- passkey ;
- authentification fédérée si partenaires officiels.

---

# 20. Modèle de données minimal

## User

```ts
type User = {
  id: string;
  createdAt: string;
};
```

Peut être anonyme au départ.

---

## Conversation

```ts
type Conversation = {
  id: string;
  userId?: string;
  language: string;
  createdAt: string;
  updatedAt: string;
};
```

---

## Message

```ts
type Message = {
  id: string;
  conversationId: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
};
```

---

## WidgetInstance

```ts
type WidgetInstance = {
  id: string;
  conversationId: string;
  messageId: string;
  type: string;
  config: unknown;
  state?: unknown;
  createdAt: string;
  updatedAt: string;
};
```

---

## Case / Dossier

```ts
type Case = {
  id: string;
  conversationId: string;
  type: string;
  status:
    | "draft"
    | "in_progress"
    | "ready"
    | "transferred"
    | "completed";
  data: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};
```

---

# 21. API interne possible

## Chat

```http
POST /api/chat
```

Body :

```json
{
  "conversationId": "conv_123",
  "message": "Je veux faire mon passeport",
  "language": "fr"
}
```

---

## Widget state

```http
PATCH /api/widgets/:id/state
```

---

## Voice transcription

```http
POST /api/voice/transcribe
```

---

## Voice synthesis

```http
POST /api/voice/speak
```

---

## Conversation

```http
GET /api/conversations/:id
```

---

## Case / dossier

```http
GET /api/cases/:id
PATCH /api/cases/:id
```

---

## Sources

```http
GET /api/sources
```

---

# 22. Architecture générale

```text
                           ┌──────────────────┐
                           │   Utilisateur    │
                           └────────┬─────────┘
                                    │
                         Texte / Voix / Widgets
                                    │
                                    ▼
                         ┌────────────────────┐
                         │   Next.js Client   │
                         └─────────┬──────────┘
                                   │
                                   ▼
                         ┌────────────────────┐
                         │      API Layer     │
                         └─────────┬──────────┘
                                   │
                 ┌─────────────────┼─────────────────┐
                 ▼                 ▼                 ▼
        ┌────────────────┐ ┌───────────────┐ ┌──────────────┐
        │ Conversation   │ │ AI Orchestrator│ │ Voice Layer  │
        │ State          │ └───────┬───────┘ └──────────────┘
        └────────────────┘         │
                                   ▼
                         ┌───────────────────┐
                         │ Intent Detection  │
                         └─────────┬─────────┘
                                   │
                                   ▼
                         ┌───────────────────┐
                         │    RAG Search     │
                         └─────────┬─────────┘
                                   │
                         ┌─────────▼─────────┐
                         │ Trusted Sources   │
                         └─────────┬─────────┘
                                   │
                                   ▼
                         ┌───────────────────┐
                         │        LLM        │
                         └─────────┬─────────┘
                                   │
                                   ▼
                     JSON response structurée
                                   │
                                   ▼
                    Text + Widgets + Sources
```

---

# 23. Sécurité

La sécurité doit être pensée dès le départ.

## Principes

- minimisation des données ;
- chiffrement en transit ;
- chiffrement au repos ;
- séparation des données personnelles et des conversations si possible ;
- expiration des données temporaires ;
- journalisation limitée ;
- aucune donnée sensible dans les URLs ;
- protection CSRF/XSS ;
- rate limiting ;
- validation stricte des payloads ;
- liens officiels issus d’une allowlist ;
- scan des fichiers uploadés ;
- contrôle des permissions ;
- audit des accès.

---

## 23.1. LLM security

Le modèle ne doit jamais pouvoir :

- générer librement une URL d’administration inconnue ;
- déclencher une action sensible sans confirmation ;
- modifier des données critiques sans validation ;
- décider seul d’envoyer un dossier ;
- exécuter du HTML ou JavaScript.

Utiliser des outils/functions strictement typés.

---

# 24. Confidentialité

Le MVP doit pouvoir fonctionner sans compte.

Idéalement :

- pas de publicité ;
- pas de revente de données ;
- historique facultatif ;
- suppression simple ;
- données sensibles stockées uniquement si nécessaire ;
- consentement clair avant transmission.

Pour les documents :

- stockage temporaire par défaut ;
- chiffrement ;
- suppression automatique ;
- ne jamais réutiliser les documents pour un autre objectif sans consentement.

---

# 25. Design system

Direction visuelle :

- moderne ;
- institutionnel sans être bureaucratique ;
- chaleureux ;
- mobile-first ;
- accessible ;
- très lisible ;
- forte hiérarchie typographique ;
- composants arrondis mais sobres ;
- espace généreux ;
- animations discrètes.

Éviter :

- surcharge graphique ;
- trop de texte ;
- look « chatbot IA générique » ;
- imitation directe d’un site gouvernemental officiel.

---

# 26. Home page

Proposition :

```text
─────────────────────────────────────

IvoireChat

L’administration ivoirienne,
en langage simple.

[ Que voulez-vous faire ?         🎙️ ]

Suggestions :

[ Passeport ]
[ Extrait de naissance ]
[ CMU ]
[ Créer une entreprise ]
[ Impôts ]
[ Trouver un service ]

Des réponses simples.
Des sources officielles.

─────────────────────────────────────
```

---

# 27. Écran de chat

Structure :

```text
┌──────────────────────────────────────┐
│ IvoireChat                 Français ▾│
├──────────────────────────────────────┤
│                                      │
│ User                                 │
│ Je veux créer une entreprise         │
│                                      │
│ IvoireChat                           │
│ D’accord. Je vais vous guider.       │
│                                      │
│ Quel type d’entreprise ?             │
│                                      │
│ [Entreprise individuelle]            │
│ [SARL]                               │
│ [Je ne sais pas]                     │
│                                      │
│ Source : CEPICI                      │
│                                      │
├──────────────────────────────────────┤
│ +  Posez votre question...  🎙️  ➤   │
└──────────────────────────────────────┘
```

---

# 28. Exemple de parcours — Passeport

Utilisateur :

> Je veux refaire mon passeport.

Assistant :

> Très bien. Je vais vous aider à préparer la démarche.

Widget :

```text
Pourquoi souhaitez-vous refaire votre passeport ?

[ Expiré ]
[ Perdu ]
[ Volé ]
[ Abîmé ]
```

Puis :

```text
Documents à préparer

[ ] CNI
[ ] Ancien passeport
[ ] Document complémentaire selon le cas

2 documents sur 3 prêts
```

Puis :

```text
Étapes

✓ Identifier la situation
✓ Préparer les pièces
○ Effectuer le paiement
○ Prendre rendez-vous
○ Se présenter au centre
```

Puis :

```text
[ Continuer vers le service officiel ]
```

---

# 29. Exemple de parcours — Création d’entreprise

Utilisateur :

> Je veux ouvrir une société de livraison.

Assistant :

> Très bien. Serez-vous seul ou avec des associés ?

Widget :

```text
[ Seul ]
[ Avec des associés ]
[ Je ne sais pas ]
```

Puis :

```text
Quelle forme envisagez-vous ?

[ Entreprise individuelle ]
[ SARL ]
[ Autre ]
[ Aidez-moi à choisir ]
```

Puis collecte progressive :

```text
Nom envisagé
Activité
Ville
Nombre d’associés
```

Résumé :

```text
Votre projet

Nom : Ivoire Livraison
Activité : Livraison
Ville : Abidjan
Forme : SARL
Associés : 2

[ Modifier ]
[ Confirmer ]
```

Puis :

```text
[ Voir les documents à préparer ]
[ Continuer vers le service compétent ]
```

---

# 30. Navigation suggérée

Navigation minimale :

- Accueil
- Nouveau chat
- Mes démarches
- Sources
- À propos
- Confidentialité

Sur mobile :

- Accueil
- Chat
- Démarches
- Profil

---

# 31. MVP recommandé

Le MVP ne doit pas tout faire.

## MVP 1

Fonctionnalités essentielles :

1. chat texte ;
2. sources officielles ;
3. RAG ;
4. ChoiceCard ;
5. Checklist ;
6. Stepper ;
7. FeeCard ;
8. SourceCard ;
9. OfficialAction ;
10. état de conversation ;
11. responsive mobile ;
12. français.

Thèmes initiaux possibles :

- passeport ;
- état civil ;
- création d’entreprise ;
- CMU ;
- impôts ;
- quelques services très demandés.

---

## MVP 1.5

Ajouter :

- Speech-to-Text ;
- Text-to-Speech ;
- VoicePlayer ;
- mode conversation vocale ;
- résumé de dossier ;
- historique local.

---

## MVP 2

Ajouter :

- langues ivoiriennes pilotes ;
- LocationCard ;
- carte ;
- upload de documents ;
- explication de documents ;
- dossier universel ;
- profil utilisateur facultatif.

---

## MVP 3

Ajouter selon partenariats :

- API administrations ;
- préremplissage ;
- création de brouillons officiels ;
- rendez-vous ;
- paiement ;
- transmission de dossier ;
- suivi de statut.

---

# 32. Roadmap technique recommandée

## Phase 1 — Fondations

- initialiser Next.js ;
- créer design system ;
- construire écran de chat ;
- créer schéma de widgets ;
- créer composants ;
- mettre en place PostgreSQL ;
- gérer conversations.

## Phase 2 — IA

- API chat ;
- prompt système ;
- JSON structuré ;
- validation Zod ;
- classification intention ;
- RAG ;
- sources.

## Phase 3 — Démarches

- passeport ;
- état civil ;
- entreprise ;
- CMU ;
- autres priorités.

## Phase 4 — Voix

- enregistrement ;
- transcription ;
- lecture ;
- gestion états audio.

## Phase 5 — Langues

- corpus de test ;
- tests locuteurs ;
- adaptation ;
- évaluation.

## Phase 6 — Intégrations

- partenaires ;
- APIs ;
- préremplissage ;
- transmission sécurisée.

---

# 33. Arborescence frontend possible

```text
src/
├── app/
│   ├── page.tsx
│   ├── chat/
│   │   └── page.tsx
│   ├── api/
│   │   ├── chat/
│   │   ├── voice/
│   │   └── widgets/
│   └── layout.tsx
│
├── components/
│   ├── chat/
│   │   ├── Chat.tsx
│   │   ├── ChatBubble.tsx
│   │   ├── Composer.tsx
│   │   └── VoiceButton.tsx
│   │
│   ├── widgets/
│   │   ├── WidgetRenderer.tsx
│   │   ├── ChoiceCard.tsx
│   │   ├── Checklist.tsx
│   │   ├── Stepper.tsx
│   │   ├── FeeCard.tsx
│   │   ├── SourceCard.tsx
│   │   ├── OfficialAction.tsx
│   │   └── VoicePlayer.tsx
│   │
│   └── ui/
│
├── lib/
│   ├── ai/
│   ├── rag/
│   ├── sources/
│   ├── db/
│   ├── voice/
│   └── security/
│
├── schemas/
│   ├── assistant-response.ts
│   ├── widgets.ts
│   └── cases.ts
│
└── types/
```

---

# 34. Prompt système de départ pour l’assistant

Exemple conceptuel :

```text
Tu es IvoireChat, un assistant qui aide les utilisateurs à comprendre
et accomplir des démarches administratives en Côte d’Ivoire.

Objectifs :
- utiliser un langage simple ;
- poser une seule question à la fois lorsque possible ;
- éviter le jargon ;
- t’appuyer uniquement sur les sources validées fournies ;
- ne jamais inventer un tarif, délai, document ou règle ;
- afficher des widgets lorsqu’ils aident l’utilisateur à agir ;
- citer les sources officielles ;
- distinguer clairement les informations vérifiées des éléments incertains ;
- demander confirmation avant toute action ou transmission de données ;
- ne jamais collecter plus de données que nécessaire.

Lorsque tu réponds, respecte strictement le schéma JSON fourni.
Tu n’écris jamais de HTML ou de JavaScript.
Tu ne génères jamais une URL officielle arbitraire.
```

---

# 35. Règles de génération des widgets

Le modèle peut choisir :

### `choice`

Quand il faut demander une décision.

### `checklist`

Quand plusieurs éléments doivent être préparés.

### `stepper`

Quand une démarche comporte plusieurs étapes.

### `fee`

Quand un tarif officiel validé existe.

### `location`

Quand l’utilisateur doit se rendre quelque part.

### `source`

Quand une information doit être justifiée.

### `official_action`

Quand une prochaine étape doit se faire sur un service officiel.

### `alert`

Quand une condition importante doit être signalée.

Le modèle ne doit pas créer un widget si une phrase simple suffit.

---

# 36. Observabilité

Prévoir :

- erreurs API ;
- temps de réponse ;
- échec RAG ;
- taux de réponse sans source ;
- widget utilisé ;
- taux de clic sur lien officiel ;
- taux d’abandon par démarche ;
- erreurs de transcription ;
- satisfaction utilisateur.

Ne pas enregistrer inutilement des données personnelles dans les logs.

---

# 37. Analytics produit

Événements possibles :

```text
conversation_started
message_sent
intent_detected
widget_rendered
choice_selected
checklist_updated
source_opened
official_action_clicked
voice_started
voice_transcribed
case_completed
```

---

# 38. Tests

## Tests unitaires

- validation des widgets ;
- reducers d’état ;
- parser réponse LLM ;
- permissions ;
- fonctions de calcul.

## Tests intégration

- API chat ;
- base de données ;
- récupération RAG ;
- état widget ;
- génération source.

## Tests E2E

Parcours :

- passeport ;
- création entreprise ;
- CMU ;
- conversation vocale.

## Tests IA

Créer un dataset de prompts réels.

Exemples :

```text
Je veux mon passeport
Mon papier est fini
Je dois refaire extrait naissance
Je veux ouvrir business avec mon frère
Je dois aller où pour CMU
```

Mesurer :

- bonne intention ;
- bonne source ;
- absence d’hallucination ;
- widget pertinent ;
- simplicité de la réponse.

---

# 39. Accessibilité

Respecter au minimum :

- navigation clavier ;
- labels ARIA ;
- contrastes ;
- taille de texte lisible ;
- zones tactiles adaptées ;
- lecture écran ;
- pas d’information uniquement communiquée par couleur ;
- sous-titres ou transcription pour l’audio.

---

# 40. Performance mobile

Priorité mobile.

Objectifs :

- bundle léger ;
- chargement progressif ;
- streaming de réponse ;
- widgets lazy-loaded ;
- compression audio ;
- cache des assets ;
- fonctionnement acceptable sur réseau lent.

---

# 41. Fonctionnement réseau limité

Contexte important pour certains utilisateurs.

Prévoir si possible :

- écran léger ;
- faible consommation de données ;
- réponses texte avant audio ;
- reprise après coupure réseau ;
- conservation temporaire du draft ;
- cache local des démarches commencées.

---

# 42. Règles produit importantes

1. Ne jamais cacher la source officielle.
2. Ne jamais prétendre être l’administration si ce n’est pas le cas.
3. Ne jamais envoyer une donnée sensible sans consentement.
4. Ne jamais faire confiance directement au texte retourné par le modèle.
5. Valider tous les widgets côté serveur.
6. Ne jamais générer arbitrairement des liens sensibles.
7. Ne pas demander deux fois une information déjà disponible dans le dossier.
8. Permettre de modifier une information extraite par l’IA.
9. Toujours indiquer lorsqu’une information n’est pas suffisamment vérifiée.
10. Garder l’utilisateur maître de la démarche.

---

# 43. Décision d’architecture essentielle

IvoireChat doit séparer cinq couches :

```text
1. Conversation
2. Connaissance officielle
3. État de la démarche
4. Widgets / interface
5. Actions externes
```

Ne pas mélanger ces couches.

La conversation n’est pas la base de données métier.

Les widgets ne sont pas la source de vérité.

Le LLM n’est pas le moteur de règles.

Les sites officiels ne doivent pas être pilotés sans mécanisme d’intégration explicite.

---

# 44. Vision long terme

IvoireChat peut évoluer vers une interface universelle des démarches ivoiriennes.

À terme :

```text
Utilisateur
   ↓
IvoireChat
   ↓
Comprendre son besoin
   ↓
Choisir la bonne démarche
   ↓
Collecter uniquement les informations nécessaires
   ↓
Préparer les documents
   ↓
Vérifier
   ↓
Créer le dossier
   ↓
Transmettre au service officiel
   ↓
Suivre l’avancement
```

L’utilisateur n’a alors plus besoin de connaître :

- le ministère ;
- l’agence ;
- le portail ;
- le formulaire exact ;
- le vocabulaire administratif.

Il dit simplement ce qu’il veut accomplir.

---

# 45. Priorité immédiate pour le développement

Commencer par construire un prototype fonctionnel avec :

```text
Next.js
TypeScript
Tailwind
PostgreSQL
LLM
RAG
Structured Outputs
```

Widgets MVP :

```text
ChatBubble
ChoiceCard
Checklist
Stepper
FeeCard
SourceCard
OfficialAction
VoicePlayer
```

Construire d’abord **3 parcours administratifs parfaitement maîtrisés** plutôt que 50 parcours superficiels.

Recommandation :

1. Passeport
2. Création d’entreprise
3. État civil

Puis élargir.

---

# 46. Première version à demander à une IA de code

Prompt possible :

```text
À partir de ce cahier des charges, construis le squelette d’une application
Next.js 15+ / TypeScript / Tailwind appelée IvoireChat.

Priorité :
1. architecture propre ;
2. mobile-first ;
3. écran d’accueil ;
4. écran de chat ;
5. système de widgets typés ;
6. WidgetRenderer ;
7. faux backend de chat avec réponses JSON simulées ;
8. persistance de l’état des checklists côté client ;
9. design accessible ;
10. structure prête à accueillir un backend RAG.

Ne construis pas encore les intégrations administratives réelles.
Commence par une implémentation mockée mais structurée comme un vrai produit.
```

---

# 47. Définition de réussite du MVP

Le MVP est réussi si un utilisateur peut :

1. ouvrir IvoireChat sur son téléphone ;
2. demander comment faire une démarche ;
3. recevoir une réponse simple ;
4. voir la source officielle ;
5. utiliser une checklist ou un stepper ;
6. faire des choix interactifs ;
7. reprendre son avancement ;
8. parler au chatbot ;
9. écouter une réponse ;
10. être redirigé vers le service officiel approprié.

Sans avoir besoin de comprendre l’organisation administrative ivoirienne.

---

# 48. Résumé en une phrase

> **IvoireChat est une couche conversationnelle multimodale au-dessus des services publics ivoiriens, capable d’expliquer, guider, structurer une démarche avec des widgets interactifs, fonctionner en voix et évoluer vers le préremplissage sécurisé des services officiels.**
