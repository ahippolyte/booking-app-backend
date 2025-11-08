# Conciergerie Marrakech - Backend API

API REST construite avec NestJS, Prisma et PostgreSQL pour la plateforme de réservation de conciergerie à Marrakech.

## 🚀 Technologies

- **NestJS** - Framework Node.js progressif
- **Prisma** - ORM moderne pour PostgreSQL
- **PostgreSQL** - Base de données relationnelle
- **JWT** - Authentification sécurisée
- **Swagger** - Documentation API interactive
- **Stripe** - Infrastructure de paiement (préparée)

## 📋 Prérequis

- Node.js 18+ 
- npm ou yarn
- PostgreSQL 14+

## 🛠️ Installation

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configuration de l'environnement

Copier le fichier `.env.example` vers `.env` :

```bash
cp .env.example .env
```

Modifier les variables d'environnement dans `.env` :

```env
DATABASE_URL="postgresql://user:password@localhost:5432/conciergerie_marrakech?schema=public"
JWT_SECRET=your-super-secret-jwt-key
PORT=3001
```

### 3. Configuration de la base de données PostgreSQL

#### Option A: Installation locale PostgreSQL

```bash
# Sur Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Démarrer le service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Créer la base de données
sudo -u postgres psql
CREATE DATABASE conciergerie_marrakech;
CREATE USER your_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE conciergerie_marrakech TO your_user;
\q
```

#### Option B: Docker

```bash
docker run --name conciergerie-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_USER=user \
  -e POSTGRES_DB=conciergerie_marrakech \
  -p 5432:5432 \
  -d postgres:14
```

### 4. Générer le client Prisma et créer les tables

```bash
# Générer le client Prisma
npm run prisma:generate

# Créer les migrations et appliquer le schéma
npm run prisma:migrate

# (Optionnel) Insérer des données de test
npm run prisma:seed
```

## 🎯 Scripts disponibles

```bash
# Développement avec hot-reload
npm run start:dev

# Build pour production
npm run build

# Démarrer en production
npm run start:prod

# Lancer les tests
npm run test

# Générer le client Prisma
npm run prisma:generate

# Créer une migration
npm run prisma:migrate

# Ouvrir Prisma Studio (interface graphique DB)
npm run prisma:studio

# Insérer des données de test
npm run prisma:seed
```

## 📚 Documentation API

Une fois le serveur démarré, la documentation Swagger est disponible à :

```
http://localhost:3001/api/docs
```

## 🏗️ Architecture

```
src/
├── auth/           # Module d'authentification (JWT, Passport)
├── users/          # Module de gestion des utilisateurs
├── properties/     # Module de gestion des propriétés
├── bookings/       # Module de gestion des réservations
├── payments/       # Module de paiement (Stripe)
├── prisma/         # Service Prisma
├── app.module.ts   # Module racine
└── main.ts         # Point d'entrée de l'application
```

## 🗄️ Modèle de données

### User
- Gestion des utilisateurs (clients, hôtes, administrateurs)
- Authentification JWT
- Rôles: ADMIN, CUSTOMER, HOST

### Property
- Propriétés (riads, villas, appartements)
- Images multiples
- Équipements (amenities)
- Géolocalisation

### Booking
- Réservations avec dates check-in/check-out
- Calcul automatique du prix total
- Statuts: PENDING, CONFIRMED, CANCELLED, COMPLETED

### Payment
- Paiements liés aux réservations
- Intégration Stripe (préparée)
- Statuts: PENDING, COMPLETED, FAILED, REFUNDED

### Review
- Avis clients sur les propriétés
- Note de 1 à 5 étoiles

## 🔐 Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification:

```
Authorization: Bearer <token>
```

## 🌐 Endpoints principaux

### Auth
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/profile` - Profil utilisateur

### Properties
- `GET /api/properties` - Liste des propriétés
- `GET /api/properties/:id` - Détails d'une propriété
- `POST /api/properties` - Créer une propriété (admin)
- `PATCH /api/properties/:id` - Modifier une propriété (admin)
- `DELETE /api/properties/:id` - Supprimer une propriété (admin)

### Bookings
- `GET /api/bookings` - Liste des réservations
- `GET /api/bookings/:id` - Détails d'une réservation
- `POST /api/bookings` - Créer une réservation
- `PATCH /api/bookings/:id` - Modifier une réservation
- `DELETE /api/bookings/:id` - Annuler une réservation

### Payments (préparé pour Stripe)
- `POST /api/payments/create-intent` - Créer une intention de paiement
- `POST /api/payments/webhook` - Webhook Stripe
- `GET /api/payments/:id` - Détails d'un paiement

## 💳 Intégration Stripe (Future)

Le module payments est préparé pour l'intégration Stripe:

1. Créer un compte Stripe
2. Obtenir les clés API (test et production)
3. Configurer les clés dans `.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
4. Implémenter les méthodes de paiement

## 🔒 Sécurité

- Validation des données avec class-validator
- Authentification JWT
- Guards NestJS pour protéger les routes
- CORS configuré pour le frontend
- Variables d'environnement pour les secrets

## 🚀 Déploiement

### Variables d'environnement de production

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@prod-host:5432/db
JWT_SECRET=super-secret-production-key
STRIPE_SECRET_KEY=sk_live_...
CORS_ORIGIN=https://your-domain.com
```

### Build et démarrage

```bash
npm run build
npm run start:prod
```

## 📝 License

MIT

---

Développé avec ❤️ pour offrir la meilleure expérience de réservation à Marrakech
