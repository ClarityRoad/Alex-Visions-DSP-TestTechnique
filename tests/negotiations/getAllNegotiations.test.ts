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

describe("GET /negotiations", () => {
    it("should return 200 with all negotiations", async () => {
        const res = await request(app)
    .get("/negotiations")
    .set("Authorization", "Bearer testtoken");

        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
    })
});