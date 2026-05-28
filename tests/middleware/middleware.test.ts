import request from "supertest";
import { app } from "../../src/app";

import mongoose from "mongoose";

import { env } from "../../src/config/env";



beforeAll(async () => {
    await mongoose.connect(env.mongoUri as string);
});

afterAll(async () => {
    await mongoose.disconnect();
});

describe("Auth middleware", () => {
    it("should return 401 without token", async () => {
        const res = await request(app).get("/negotiations");
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty("error", "Unauthorized");
    });
    it("should return 401 without Bearer prefix", async () => {
        const res = await request(app)
            .get("/negotiations")
            .set("Authorization", "malformedtoken"); 
        expect(res.status).toBe(401);
    });
    it("should return 200 with valid Bearer token", async () => {
        const res = await request(app).get("/negotiations").set("Authorization", "Bearer testtoken");
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
    });
});