const request = require("supertest");

const express = require("express");

jest.mock("http-proxy-middleware", () => ({

    createProxyMiddleware: jest.fn(() => {

        return (req, res) => {

            res.status(200).json({

                message: "Proxy Working"

            });

        };

    })

}));

const app = require("../../app");

describe("Gateway Proxy", () => {

    test(

        "should proxy user request",

        async () => {

            const response = await request(app)

                .get("/users");

            expect(response.statusCode)

                .toBe(200);

            expect(response.body.message)

                .toBe("Proxy Working");

        }

    );

});