const express = require("express");

const gatewayRoutes = require("./routes/gateway.routes");

const app = express();

app.use(express.json());

app.use(gatewayRoutes);

module.exports = app;