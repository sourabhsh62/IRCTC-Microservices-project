const express=require("express");
require("dotenv").config();

const trainRoutes=
require("./src/routes/train.routes");

const app=express();

app.use(express.json());

app.use(trainRoutes);

app.listen(
3002,
()=>{
console.log(
"Train Service Running"
);
}
);