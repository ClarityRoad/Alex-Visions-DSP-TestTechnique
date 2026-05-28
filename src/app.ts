import express from "express"

import { makeCatalogRouter } from "./routes/catalog.routes";
import { makeVersionRouter } from "./routes/version.routes";

import { makeVersionServices } from "./services/version.services";
import { makeCatalogServices } from "./services/catalog.services";

import { makeNegotiationServices } from "./services/negotiation.services";
import { makeNegotiationRouter } from "./routes/negotiation.routes";

import { authMiddleware } from "./middlewares/auth.middleware";

import { errorHandler } from "./middlewares/negotiationError.middleware";


const app = express();

// Je protege toutes les routes pour l'exemple sauf le endpoint /.well-known/dspace-version par convention 
app.use(express.json());

const versionServices = makeVersionServices();
const versionRouter = makeVersionRouter(versionServices);

app.use(versionRouter); 

app.use(authMiddleware); 


const catalogServices = makeCatalogServices();
const catalogRouter = makeCatalogRouter(catalogServices);

const negotiationServices = makeNegotiationServices();
const negotiationRouter = makeNegotiationRouter(negotiationServices);

app.use("/catalog", catalogRouter);
app.use("/negotiations", negotiationRouter);

app.use(errorHandler);


export { app };