const http = require("http");
require("dotenv").config();

const app = require("./src/app");

const { initIO } = require("./src/socket");
const logger = require("./src/utils/logger");
const pool = require("./src/config/db");
const redisClient = require("./src/config/redis");

// Background Jobs
require("./src/jobs/bookingExpiry.job");
require("./src/workers/email.worker");

const server = http.createServer(app);

initIO(server);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    logger.info(`Booking Service Running On Port ${PORT}`);
});

// Graceful Shutdown
async function gracefulShutdown(signal) {

    logger.info(`${signal} received`);
    logger.info("Closing HTTP Server...");

    server.close(async () => {

        try {

            logger.info("Closing PostgreSQL Connection...");
            await pool.end();
            logger.info("PostgreSQL Closed");

            logger.info("Closing Redis Connection...");
            await redisClient.quit();
            logger.info("Redis Closed");

            logger.info("Booking Service Shutdown Successfully");

            process.exit(0);

        } catch (error) {

            logger.error(error.message);

            process.exit(1);

        }

    });

}

process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));