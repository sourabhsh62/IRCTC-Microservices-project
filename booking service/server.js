const http=require("http")
const {initIO}=require("./src/socket");
const logger=require("./src/utils/logger");
const pool = require("./src/config/db");
const redisClient = require("./src/config/redis");

const express = require("express");
require("dotenv").config();
require("./src/jobs/bookingExpiry.job");
require("./src/workers/email.worker");

const userRoutes = require("./src/routes/user.routes");
const trainRoutes=require("./src/routes/train.routes")
const app = express();

app.use(express.json());

app.use(userRoutes);
app.use(trainRoutes);
const errorHandler=require("./src/middlewares/error.middleware")
app.use(errorHandler)
const server=http.createServer(app);
initIO(server);
server.listen(3000,()=>{
  logger.info("Booking service  running on port 3000")
});
async function gracefulShutdown(signal){

    logger.info(`${signal} received`);

    logger.info("Closing HTTP Server...");

    server.close(async()=>{

        try{

            logger.info("Closing PostgreSQL Connection...");

            await pool.end();

            logger.info("PostgreSQL Closed");

            logger.info("Closing Redis Connection...");

            await redisClient.quit();

            logger.info("Redis Closed");

            logger.info("Booking Service Shutdown Successfully");

            process.exit(0);

        }
        catch(error){

            logger.error(error.message);

            process.exit(1);

        }

    });

}
process.on(
    "SIGINT",
    () => gracefulShutdown("SIGINT")
);

process.on(
    "SIGTERM",
    () => gracefulShutdown("SIGTERM")
);
