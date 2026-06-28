const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {

    definition: {

        openapi: "3.0.0",

        info: {

            title: "IRCTC Booking Service API",

            version: "1.0.0",

            description: "Booking Service Documentation"

        },

        servers: [

            {

                url: "http://localhost:3000"

            }

        ],

        components: {

            securitySchemes: {

                bearerAuth: {

                    type: "http",

                    scheme: "bearer",

                    bearerFormat: "JWT"

                }

            }

        }

    },

    apis: ["./src/routes/*.js"]

};

const swaggerSpec = swaggerJsDoc(options);

module.exports = {

    swaggerUi,

    swaggerSpec

};