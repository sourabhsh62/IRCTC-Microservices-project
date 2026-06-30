require("dotenv").config();

const app = require("./src/app");

const http = require("http");
const {

    PORT

} = require("./src/config/constants");

const server = http.createServer(app);


server.listen(PORT,()=>{

console.log(

`API Gateway Running On Port ${PORT}`

);

});