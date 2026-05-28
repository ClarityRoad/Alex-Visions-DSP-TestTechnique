const catalog = {
    "@context": [
      "https://w3id.org/dspace/2025/1/context.jsonld"
    ],
    "@id": "urn:uuid:a046485e-eab5-4524-a4d9-24b85064a047",
    "@type": "Catalog",
    "participantId": "urn:example:web3-dao-provider-hyperliquid",
    "service": [
      {
        "@id": "urn:uuid:7b4b02e3-0f60-4c34-a7bb-998833886b36",
        "@type": "DataService",
        "endpointURL": "https://hyperliquidprovider.com/connector"
      }
    ],
    "dataset": [
      {
        "@id": "urn:uuid:60c90014-604f-4096-8ede-b1ff02282f6d",
        "@type": "Dataset",
        "title": "Web3 - DAO Governance Participation - Hyperliquid",
        "description": "Dataset that contains the participation of DAO governance in the Hyperliquid platform.",
        "hasPolicy": [
          {
            "@id": "urn:uuid:bf67ee54-4888-44fb-bf04-872324306929",
            "@type": "Offer",
            "permission": [
              {
                "action": "use",
                "constraint": [
                  {
                    "leftOperand": "purpose",
                    "operator": "eq",
                    "rightOperand": "research"
                  }
                ]
              }
            ]
          }
        ],
        "distribution": [
          {
            "@id": "urn:uuid:87ee5c91-b4a9-4f9f-9b47-961d2345fefb",
            "@type": "Distribution",
            "format": "HttpData-PULL",
            "accessService": "urn:uuid:7b4b02e3-0f60-4c34-a7bb-998833886b36"
          }
        ]
      }
    ]
  };

export { catalog };