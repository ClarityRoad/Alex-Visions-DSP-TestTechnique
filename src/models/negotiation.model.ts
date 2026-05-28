import { Schema, model } from "mongoose";

enum NegotiationState {
    REQUESTED = "REQUESTED",
    OFFERED = "OFFERED",
    AGREED = "AGREED",
    ACCEPTED = "ACCEPTED",
    VERIFIED = "VERIFIED",
    FINALIZED = "FINALIZED",
    TERMINATED = "TERMINATED",
}

interface INegotiation {
    providerPid: string;
    consumerPid: string;
    state: NegotiationState;
    offer: Record<string, unknown>;
    callbackAddress: string;
}


const NegotiationSchema = new Schema({
    providerPid: { type: String, required: true },
    consumerPid: { type: String, required: true },
    state: { type: String, enum: Object.values(NegotiationState), required: true },
    offer: { type: Schema.Types.Mixed, required: true },
    callbackAddress: { type: String, required: true },
}, { timestamps: true });

export const NegotiationModel = model<INegotiation>("Negotiation", NegotiationSchema);

export { INegotiation, NegotiationSchema, NegotiationState };