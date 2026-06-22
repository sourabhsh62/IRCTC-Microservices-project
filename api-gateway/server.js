const express = require("express");
const {createProxyMiddleware}=require("http-proxy-middleware")
const app=express();
const rateLimit=
require("express-rate-limit");

const RedisStore=
require("rate-limit-redis");

const redisClient=
require("./src/config/redis");
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
app.use(limiter);
app.use("/users",createProxyMiddleware({target:"http://localhost:3001",changeOrigin:true}));
app.use("/booking",createProxyMiddleware({target:"http://localhost:3002",changeOrigin:true}));
app.listen(3000,()=>{
    console.log("API Gateway Running on 3000")
})