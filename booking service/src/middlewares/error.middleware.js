const logger=require("../utils/logger");
function errorHandler(err,req,res,next){
logger.error(err.stack)
return res.status(500).json({success:false,message:err.message || "Internal server Error"});

}

module.exports=errorHandler