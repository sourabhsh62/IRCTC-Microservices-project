const logger=require("../utils/logger");
function errorHandler(err,req,res,next){
logger.error(err.stack)
return res.status(

err.statusCode || 500

).json({

success:false,

message:err.message

});
}

module.exports=errorHandler