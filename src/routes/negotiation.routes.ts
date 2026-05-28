import { Router } from "express";
import { NegotiationServices } from "../services/negotiation.services";
import { validateBody } from "../middlewares/validate.middleware";
import { NegotiationError } from "../middlewares/negotiationError.middleware";

export function makeNegotiationRouter( deps: NegotiationServices ) : Router {
	const router = Router();
    const { createNegotiation, getNegotiation, acceptNegotiation, verifyAgreement, terminateNegotiation, getAllNegotiations } = deps;



    router.get("/", async ( _req, res, next) => {
        try {
            const negotiations = await getAllNegotiations();
            res.json(negotiations);
        } catch (e) {
            next(e)
        }
    });


    router.get("/:providerPid", async (req, res, next) => {
        try {
            const negotiation = await getNegotiation(req.params.providerPid as string);
            if (negotiation) {
                res.json(negotiation);
            } else {
                return next(new NegotiationError("Negotiation not found", 404));
            }
        } catch (e) {
            next(e)
        }
    });


    router.post("/request", validateBody(["@context","@type", "consumerPid", "offer", "callbackAddress"]), async (req, res, next) => {
        try {
            const negotiation = await createNegotiation({
                consumerPid: req.body.consumerPid,
                offer: req.body.offer,
                callbackAddress: req.body.callbackAddress,
            });
            if (negotiation) {
                res.status(201).json(negotiation);
            } else {
                res.status(404).json({ error: "Negotiation not found" });
            }
        } catch (e) {
            next(e)
        }
    });


    router.post("/:providerPid/events", validateBody(["@context","@type", "eventType","consumerPid", "providerPid"]), async (req, res, next) => {
        try {
            if (req.body.eventType !== "ACCEPTED") {
                return next(
                  new NegotiationError("Invalid eventType, expected ACCEPTED", 400)
                );
              }
            const negotiation = await acceptNegotiation(req.params.providerPid as string);
            if (!negotiation) {
                const exists = await getNegotiation(req.params.providerPid as string);
                if (!exists) {
                    return next(new NegotiationError("Negotiation not found", 404));
                }
                return next(new NegotiationError("Negotiation not in AGREED state", 400));
            }
            res.json(negotiation);
        } catch (e) {
            next(e)
        }
    });



    router.post("/:providerPid/agreement/verification", validateBody(["@context","@type", "consumerPid", "providerPid"]), async (req, res, next) => {
        try {
            const negotiation = await verifyAgreement(req.params.providerPid as string);
                if (!negotiation) {
                    const exists = await getNegotiation(req.params.providerPid as string);
                    if (!exists) {
                        return next(new NegotiationError("Negotiation not found", 404));
                    }
                    return next (new NegotiationError("Negotiation not in ACCEPTED state", 400));
                }
                res.json(negotiation);
        } catch (e) {
            next(e)
        }
    });


    router.post("/:providerPid/termination",validateBody(["@context","@type", "consumerPid", "providerPid"]), async (req, res, next) => {
        try {
            const negotiation = await terminateNegotiation(req.params.providerPid as string);
            if (!negotiation) {
                return next(new NegotiationError("Negotiation not found", 404));
            }
            res.json(negotiation);
        } catch (e) {
            next(e)
        }
    });

	return router;
}