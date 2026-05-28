# DSP Provider Connector — Visions Test Technique

Connecteur Provider implémentant le [Dataspace Protocol 2025-1-RC1](https://eclipse-dataspace-protocol-base.github.io/DataspaceProtocol/2025-1-RC1/).  
Stack : TypeScript, Express 5, MongoDB/Mongoose.

## Prérequis

- [Docker](https://www.docker.com/) & Docker Compose
- [Node.js](https://nodejs.org/) v18+ (pour `npm test` uniquement)

## Lancer le projet

### Avec Docker

```bash
docker-compose up
```

L'API est disponible sur `http://localhost:3000`.

## Variables d'environnement

| Variable    | Description     | Défaut                                            |
|-------------|-----------------|---------------------------------------------------|
| `PORT`      | Port du serveur | `3000`                                            |
| `MONGO_URI` | URI MongoDB     | `mongodb://mongo:27017/vision-test-technique`     |

## Tester les endpoints

Une collection Postman est disponible à la racine : `Vision-DSP.postman_collection.json`.

Elle contient le flux nominal complet dans l'ordre :

1. Negotiation Request (REQUESTED + AGREED)
2. Negotiation Events (ACCEPTED)
3. Negotiation Agreement Verification (VERIFIED + FINALIZED)
4. Negotiation Termination

Le `providerPid` est automatiquement extrait de la réponse 1 et injecté dans les requêtes suivantes.

## Tests

MongoDB doit être accessible sur `localhost:27017`. Lancez d'abord `npm install && npm run start:dev`, puis dans un autre terminal :

```bash
npm test
```


## Endpoints

| Méthode | Chemin                                              | Description                                                 |
|---------|-----------------------------------------------------|-------------------------------------------------------------|
| GET     | `/.well-known/dspace-version`                       | Retourne les versions du protocole supportées               |
| POST    | `/catalog/request`                                  | Retourne le catalogue complet du Provider                   |
| GET     | `/catalog/datasets/:id`                             | Retourne un Dataset spécifique par son identifiant          |
| GET     | `/negotiations`                                     | Liste toutes les négociations                               |
| GET     | `/negotiations/:providerPid`                        | Retourne l'état d'une négociation                           |
| POST    | `/negotiations/request`                             | Initie une nouvelle négociation (Consumer → Provider)       |
| POST    | `/negotiations/:providerPid/events`                 | Le Consumer accepte l'offre courante (eventType: ACCEPTED)  |
| POST    | `/negotiations/:providerPid/agreement/verification` | Le Consumer vérifie l'accord                                |
| POST    | `/negotiations/:providerPid/termination`            | Termine une négociation                                     |

> Tous les endpoints (sauf `/.well-known/dspace-version`) nécessitent un header `Authorization: Bearer <token>` (Aucun token particulier n'est requis).


# Alex-Visions-TestTechniqueDSP
# Alex-Visions-DSP-TestTechnique
