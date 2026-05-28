import { Request, Response, NextFunction } from "express";

export class NegotiationError extends Error {
    statusCode: number; 
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

export function errorHandler(
	err: NegotiationError,
	_req: Request,
	res: Response,
	_next: NextFunction,
): void {
	const statusCode = err.statusCode ?? 500;
	res.status(statusCode).json({
		"@context": ["https://w3id.org/dspace/2025/1/context.jsonld"],
		"@type": "ContractNegotiationError",
		code: String(statusCode),
		reason: [err.message ?? "Internal Server Error"],
	});
}

