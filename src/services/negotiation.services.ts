import { INegotiation, NegotiationModel, NegotiationState } from "../models/negotiation.model";
import crypto from "crypto";

interface CreateNegotiationBody {
    consumerPid: string;
    offer: Record<string, unknown>;
    callbackAddress: string;
}

export interface NegotiationServices {
    createNegotiation: (body: CreateNegotiationBody) => Promise<INegotiation | null>
    getNegotiation: (providerPid: string) => Promise<INegotiation | null>
    acceptNegotiation: (providerPid: string) => Promise<INegotiation | null>
    verifyAgreement: (providerPid: string) => Promise<INegotiation | null>
    terminateNegotiation: (providerPid: string) => Promise<INegotiation | null>
    getAllNegotiations: () => Promise<INegotiation[] | null>
}

export function makeNegotiationServices(): NegotiationServices {
    return {



        createNegotiation: async (body) => {
            // Ici je pourrai directement créer la négociation avec le state AGREED mais je préfère le faire en deux étapes comme exemple et pour être conforme avec la state machine du protocole
            const newNegotiation = new NegotiationModel({
                providerPid: crypto.randomUUID(),
                consumerPid: body.consumerPid,
                offer: body.offer,
                callbackAddress: body.callbackAddress,
                state: NegotiationState.REQUESTED,
            });
            await newNegotiation.save();

            const updatedNegotiation = await NegotiationModel.findOneAndUpdate(
                { providerPid: newNegotiation.providerPid },
                { state: NegotiationState.AGREED },
                { new: true }
            );

            if (!updatedNegotiation) {
                return null;
            }
            try {
                // Le consumer n'existe pas donc le callback va echouer mais le trycatch permet de continuer la négociation
                await fetch(`${body.callbackAddress}/negotiations/${updatedNegotiation.consumerPid}/agreement`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json"},
                    body: JSON.stringify({
                        "@context": ["https://w3id.org/dspace/2025/1/context.jsonld"],
                        "@type": "ContractAgreementMessage",
                        "providerPid": updatedNegotiation.providerPid,
                        "consumerPid": updatedNegotiation.consumerPid,
                        "callbackAddress": body.callbackAddress,
                        "agreement": {
                            "@type": "Agreement",
                            "@id": crypto.randomUUID(),
                            "target": body.offer["target"],
                            "timestamp": new Date().toISOString(),
                            "assigner": "urn:example:web3-dao-provider-hyperliquid",
                            "assignee": body.consumerPid,
                        }
                    })
                });
                } catch (e) {
                console.warn("Callback to consumer failed:", e);
            }
            return updatedNegotiation;
        },


        getNegotiation: async (providerPid: string) => {
            return await NegotiationModel.findOne({providerPid: providerPid});
        },


        acceptNegotiation: async (providerPid: string) => {
            return await NegotiationModel.findOneAndUpdate(
                { providerPid, state: NegotiationState.AGREED }, 
                { state: NegotiationState.ACCEPTED },
                { new: true }
            );
        },


        verifyAgreement: async (providerPid: string) => {
            const verifiedNegotiation = await NegotiationModel.findOneAndUpdate(
                { providerPid, state: NegotiationState.ACCEPTED },
                { state: NegotiationState.VERIFIED },
                { new: true }
            );
            if (!verifiedNegotiation) {
                return null;
            }
            const finalizedNegotiation = await NegotiationModel.findOneAndUpdate(
                { providerPid, state: NegotiationState.VERIFIED },
                { state: NegotiationState.FINALIZED },
                { new: true }
            );
            if (!finalizedNegotiation) {
                return null;
            }
            try {
                await fetch(`${finalizedNegotiation.callbackAddress}/negotiations/${finalizedNegotiation.consumerPid}/events`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json"},
                    body: JSON.stringify({
                        "@context": ["https://w3id.org/dspace/2025/1/context.jsonld"],
                        "@type": "ContractNegotiationEventMessage",
                        "providerPid": finalizedNegotiation.providerPid,
                        "consumerPid": finalizedNegotiation.consumerPid,
                        "eventType": "FINALIZED",
                    })
                });
            } catch (e) {
                console.warn("Callback to consumer failed:", e);
            }
            return finalizedNegotiation;
        },


        terminateNegotiation: async (providerPid: string) => {
            const terminatedNegotiation = await NegotiationModel.findOneAndUpdate(
                { providerPid },
                { state: NegotiationState.TERMINATED },
                { new: true }
            );
            if (!terminatedNegotiation) {
                return null;
            }
            try {
                await fetch(`${terminatedNegotiation.callbackAddress}/negotiations/${terminatedNegotiation.consumerPid}/termination`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json"},
                    body: JSON.stringify({
                        "@context": ["https://w3id.org/dspace/2025/1/context.jsonld"],
                        "@type": "ContractNegotiationTerminationMessage",
                        "providerPid": terminatedNegotiation.providerPid,
                        "consumerPid": terminatedNegotiation.consumerPid,
                    })
                });
            } catch (e) {
                console.warn("Callback to consumer failed:", e);
            }
            return terminatedNegotiation;
        },

        getAllNegotiations: async () => {
            return await NegotiationModel.find();
        },
    }
}