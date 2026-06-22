const express = require("express");
const {createProxyMiddleware}=require("http-proxy-middleware")
const app=express();
app.use("/users",createProxyMiddleware({target:"http://localhost:3001",changeOrigin:true}));
app.use("/booking",createProxyMiddleware({target:"http://localhost:3002",changeOrigin:true}));
app.listen(3000,()=>{
    console.log("API Gateway Running on 3000")
})