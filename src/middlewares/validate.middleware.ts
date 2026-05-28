import { Request, Response, NextFunction } from "express";

export function validateBody(requiredFields: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            res.status(400).json({ error: `Missing required fields: ${missingFields.join(", ")}` });
            return;
        }
        next();
    };
}