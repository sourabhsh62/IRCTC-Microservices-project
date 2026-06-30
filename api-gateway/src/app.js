const express=require("express");

const helmet=require("helmet");

const cors=require("cors");

const {

CLIENT_URL

}=require("./config/constants");

const {

swaggerUi,

swaggerSpec

}=require("./docs/swagger");

const gatewayRoutes=require("./routes/gateway.routes");

const app=express();

app.use(helmet());

app.use(

cors({

origin:CLIENT_URL,

credentials:true

})

);

app.use(express.json());

app.use(

"/api-docs",

swaggerUi.serve,

swaggerUi.setup(swaggerSpec)

);

app.use(gatewayRoutes);

module.exports=app;