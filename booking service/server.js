const http=require("http")
const {initIO}=require("./src/socket");
const logger=require("./src/utils/logger");

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