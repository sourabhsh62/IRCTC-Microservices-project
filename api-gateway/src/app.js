const express = require("express");

const gatewayRoutes = require("./routes/gateway.routes");
const {

    swaggerUi,

    swaggerSpec

} = require("./docs/swagger");

const app = express();

app.use(express.json());
app.use(

"/api-docs",

swaggerUi.serve,

swaggerUi.setup(swaggerSpec)

);

app.use(gatewayRoutes);

module.exports = app;