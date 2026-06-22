const redisClient =
require("../config/redis");

async function acquireLock(lockKey){

    const result =
    await redisClient.set(
        lockKey,
        "locked",
        {
            NX:true,
            EX:10
        }
    );

    return result==="OK";

}

async function releaseLock(lockKey){

    await redisClient.del(lockKey);

}

module.exports={
    acquireLock,
    releaseLock
};