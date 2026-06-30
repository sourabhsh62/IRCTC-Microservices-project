const request = require("supertest");

const app = require("../../app");

describe("Gateway Health", () => {

    test("should return 404 for unknown route", async () => {

        const response = await request(app)

            .get("/unknown-route");

        expect(response.statusCode).toBe(404);

    });

});