import request from "supertest";
import { app } from "../../src/app";

describe("GET /.well-known/dspace-version", () => {
    it("should return 200 with protocol versions", async () => {
        const res = await request(app).get("/.well-known/dspace-version");
        
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("protocolVersions");
        expect(res.body.protocolVersions).toBeInstanceOf(Array);
        expect(res.body.protocolVersions).toContainEqual({ version: "2025-1", path: "/api/v1" });
    });
});