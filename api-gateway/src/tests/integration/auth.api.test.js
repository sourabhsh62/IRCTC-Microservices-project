const request = require("supertest");

const app = require("../../app");
const logger = require("../../utils/logger");
const jwt = require("jsonwebtoken");

jest.mock("../../utils/logger");
expect(logger.error)

.toHaveBeenCalled();

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

    test(

"should return 401 when jwt token is invalid",

async()=>{

const response=

await request(app)

.get("/booking")

.set(

"Authorization",

"Bearer invalid_token"

);

expect(response.statusCode)

.toBe(401);

expect(response.body.message)

.toBe("Invalid Token");

}

);

test(

"should return 401 when jwt token is invalid",

async()=>{

const response=

await request(app)

.get("/booking")

.set(

"Authorization",

"Bearer invalid_token"

);

expect(response.statusCode)

.toBe(401);

expect(response.body.message)

.toBe("Invalid Token");

expect(logger.error)

.toHaveBeenCalled();

}

);

});