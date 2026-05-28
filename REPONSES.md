## 1.1 Vue d'ensemble

> En vos propres mots (10 à 20 lignes maximum), expliquez :

1. Ce qu'est un Dataspace et quel problème il résout
2. Le rôle des deux acteurs principaux que sont le Provider et le Consumer
3. Pourquoi l'interopérabilité nécessite un protocole standardisé plutôt qu'une simple API REST classique

---

**1.** Un Dataspace est un écosystème technique permettant un partage interopérable de données et de manière controlée entre différentes entités autonomes, régi par des règles d'utilisation.
Il répond aux problèmes de sécurité, de controle et de confiance lors du partage de données entre entités ne se faisant pas forcément confiance. L'accès et l'usage sont encadrés par une politique proposée par le Provider et acceptée ou négociée par le Consumer.

**2.** Le Provider est l'acteur proposant un Dataset dans un catalogue, selon des conditions d'accès définies.
Le Consumer est celui qui consulte le catalogue, demande l'accès à ces données et peut engager une négociation avec le Provider. 
Ensemble ils suivent un processus de découverte via catalogue, de négociation contractuelle afin d'établir un accord, puis de transfert des données sous les conditions prévues par cet accord.

**3.** L'interopérabilité nécessite un protocole standardisé car le Dataspace implique des échanges complexes entre systèmes hétérogènes, tels que le catalogue, la négociation, l’accord et le transfert. 
Un protocole standard permet de définir des types de messages normalisés et des règles de validation communes, afin que tous les participants interprètent correctement les négociations, les accords et transferts, indépendamment de leurs implémentations internes.
Une API REST classique pourrait exposer des endpoints, mais ne définirait pas à elle seule le sens des messages, les états de la négociation contractuelle ou les règles communes nécessaires à l’interopérabilité.



## 1.2 DCAT & ODRL

> Répondez brièvement aux questions suivantes :

1. Dans le DSP, qu'est-ce qu'un Catalog ? Quelle relation entretient-il avec un Dataset et une Distribution ?
2. Qu'est-ce qu'une Offer dans le contexte ODRL ? Quelle différence y a-t-il entre une Offer contenue dans un catalogue et un Agreement issu d'une négociation ?
3. Donnez un exemple concret de règle ODRL que vous pourriez exprimer pour restreindre l'usage d'un jeu de données (utilisez la structure permission, action, constraint).
4. Pourquoi les Offer dans un Catalog ou un Dataset ne doivent-elles pas contenir d'attribut target, alors que les Offer dans un ContractRequestMessage doivent en avoir un ?

---

**1.** Un Catalog dans le DSP est une collection de Datasets représentant les ressources proposées par le Provider. Un Dataset décrit une ressource de données disponible, avec ses métadonnées et sa politique d'usage (Offer). La Distribution est rattachée à un Dataset et décrit la manière d'accéder à cette donnée ou de la transférer. Un Dataset peut être exposé via une ou plusieurs Distrubutions.

**2.** Dans un contexte ODRL, une Offer est une proposition de politique d'usage associée à un Dataset précis proposé par un Provider, Elle représente une proposition prédéfinie par le Provider lors de la publication de son Dataset, mais pas encore acceptée par un Consumer. L'Agreement vient une fois qu'un accord a été trouvé et validé entre un Consumer et un Provider.

**3.** Un exemple de règle ODRL pourrait être la restriction de l’usage d’un Dataset à des recherches internes uniquement, jusqu’au 27 juin 2026.

```json
{
  "@context": "https://w3id.org/dspace/2025/1/context.jsonld",
  "permission": [
    {
      "action": "use",
      "constraint": [
        {
          "leftOperand": "dateTime",
          "operator": "lt",
          "rightOperand": {
            "@value": "2026-06-28",
            "@type": "xsd:date"
          }
        },
        {
          "leftOperand": "purpose",
          "operator": "eq",
          "rightOperand": "internal-research"
        }
      ]
    }
  ]
}
```

L’action `use` est autorisée seulement si la contrainte `purpose` est égale à `internal-research` et si la date du `28 juin 2026` n’est pas dépassée.


**4.** Dans un Catalog ou un Dataset, l’Offer est déjà située dans le contexte du Dataset auquel elle appartient. Ajouter un attribut `target` pourrait causer des incohérences.
Au contraire d'un `ContractRequestMessage`, l'Offer envoyé est autonome et doit donc spécifier le Dataset visé, en utilisant un `target` afin que le Provider ait le contexte de la négociation.


## 1.3 Négociation de contrat

> Décrivez en quelques phrases la state machine du Contract Negotiation Protocol :

1. Quels sont les états possibles, qui envoie quel message pour faire progresser l'état, et quel est l'état final qui autorise un transfert de données ?

---

**1.** La state machine du Contract Negotiation Protocol décrit les étapes d’une négociation de contrat entre un Consumer et un Provider.  

Les états possibles sont `REQUESTED`, `OFFERED`, `ACCEPTED`, `AGREED`, `VERIFIED`, `FINALIZED` et `TERMINATED`.

Exemple: Le Consumer peut initier la négociation avec un `ContractRequestMessage`, ce qui place la négociation en état `REQUESTED`. Le Provider peut ensuite répondre avec un `ContractOfferMessage`, ce qui fait passer la négociation en état `OFFERED`, ou produire un `ContractAgreementMessage`, ce qui mène vers l’état `AGREED`. Le Consumer peut accepter l’offre via un `ContractNegotiationEventMessage` de type `ACCEPTED`, ce qui fait évoluer la négociation vers `ACCEPTED`.

Une fois un accord trouvé, le Consumer le vérifie avec un `ContractAgreementVerificationMessage`, ce qui fait passer la négociation en état `VERIFIED`. Le Provider finalise ensuite la négociation avec un `ContractNegotiationEventMessage` de type `FINALIZED`, ce qui place la négociation en état `FINALIZED`.

L’état `FINALIZED` est l’état final qui autorise l’initiation du transfert de données. L’état `TERMINATED` permet de terminer la négociation en cas d’échec, d’annulation ou de refus.


## 1.4 Choix d'implémentation

> Mes choix d'implémentation

---

**1** Le paramètre `filter` est accepté dans mon body de POST /catalog/request. j'ai implémenté un filtrage basique par `titre` et `@id`.

**2** Mon ContractNegotiationError inclut `@context`, `@type`, `code` et `reason`. Les champs `consumerPid` et `providerPid` requis par la spec ne sont pas inclus. Le handler d'erreur global n'a pas accès à ce contexte sans refonte de ma classe NegotiationError. Choix fait par simplification pour un MVP.
