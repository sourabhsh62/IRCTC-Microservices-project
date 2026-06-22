const express=require("express");
require('dotenv').config();
const userRoutes=
require("./src/routes/user.routes");

const app=express();

app.use(express.json());

app.use(userRoutes);

app.listen(
3001,
()=>{
console.log(
"User Service Running on port 3001"
);
}
);