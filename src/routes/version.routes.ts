import { Router } from "express";
import { VersionServices } from "../services/version.services";

export function makeVersionRouter( deps: VersionServices ) : Router {
	const router = Router();
    const { getVersionInfo } = deps;

	router.get("/.well-known/dspace-version", (_req, res) => {
        res.json(getVersionInfo());
    });

	return router;
}

