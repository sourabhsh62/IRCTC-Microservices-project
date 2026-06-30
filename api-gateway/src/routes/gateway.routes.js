const express = require("express");

const router = express.Router();

const rateLimit = require("express-rate-limit");

const RedisStore = require("rate-limit-redis");

const redisClient = require("../config/redis");

const {

createProxyMiddleware

} = require("http-proxy-middleware");
const {

    USER_SERVICE_URL,

    BOOKING_SERVICE_URL

} = require("../config/constants");
const authMiddleware =
require("../middlewares/auth.middleware");

const limiter = rateLimit({

windowMs:60*1000,

max:10,

message:"Too many requests",

standardHeaders:true,

legacyHeaders:false,

store:new RedisStore({

sendCommand:(...args)=>

redisClient.sendCommand(args)

})

});

router.use(limiter);

router.use(

"/users",

createProxyMiddleware({

target:USER_SERVICE_URL,

changeOrigin:true

})

);

router.use(

"/booking",authMiddleware,

createProxyMiddleware({

target:BOOKING_SERVICE_URL,

changeOrigin:true

})

);

module.exports=router;