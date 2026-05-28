import { catalog } from "../data/catalog.mock";

export interface CatalogServices {
    requestCatalog: (filter?: string) => typeof catalog;
    requestDataset: (id: string) => typeof catalog.dataset[0] | null;
}

export function makeCatalogServices(): CatalogServices {
    return {
        requestCatalog: (filter?: string) => {
            if (!filter) return catalog;
            const filtered = catalog.dataset.filter(d => 
                d.title.toLowerCase().includes(filter.toLowerCase()) || d["@id"] === filter
            );
            return { ...catalog, dataset: filtered };
        },
        requestDataset: (id: string) => {
            return catalog.dataset.find((dataset) => dataset["@id"] === id) || null;
        },
    }
}   