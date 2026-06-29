const express = require("express");

const { swaggerUi, swaggerSpec } = require("./docs/swagger");

const userRoutes = require("./routes/user.routes");
const trainRoutes = require("./routes/train.routes");

const errorHandler = require("./middlewares/error.middleware");

const app = express();

app.use(express.json());

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

app.use(userRoutes);
app.use(trainRoutes);

app.use(errorHandler);

module.exports = app;