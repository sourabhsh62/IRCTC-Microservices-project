const express = require("express");

const router = express.Router();

const rateLimit = require("express-rate-limit");

const RedisStore = require("rate-limit-redis");

const redisClient = require("../config/redis");

const {

createProxyMiddleware

} = require("http-proxy-middleware");

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

target:"http://localhost:3001",

changeOrigin:true

})

);

router.use(

"/booking",

createProxyMiddleware({

target:"http://localhost:3002",

changeOrigin:true

})

);

module.exports=router;