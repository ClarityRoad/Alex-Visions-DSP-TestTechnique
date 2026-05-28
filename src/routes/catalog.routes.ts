import { Router } from "express";
import { CatalogServices } from "../services/catalog.services";

export function makeCatalogRouter( deps: CatalogServices ) : Router {
	const router = Router();
	const { requestCatalog, requestDataset } = deps;

	router.post("/request", (req, res) => {
        const catalog = requestCatalog(req.body?.filter);
        if (catalog) {
            res.json(catalog);
        } else {
            res.status(404).json({ error: "No catalog found" });
        }
    });

    router.get("/datasets/:id", (req, res) => {
        const dataset = requestDataset(req.params.id);
        if (dataset) {
            res.json(dataset);
        } else {
            res.status(404).json({ error: "Dataset not found" });
        }
    });

	return router;
}

