const request = require("supertest");

const app = require("../../app");

describe("Gateway Authentication", () => {

    test(

        "should return 401 when authorization header is missing",

        async () => {

            const response = await request(app)

                .get("/booking");

            expect(response.statusCode)

                .toBe(401);

            expect(response.body.message)

                .toBe("Authorization header missing");

        }

    );

});