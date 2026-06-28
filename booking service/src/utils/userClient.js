const axios=require("axios");
const axiosRetry=require("axios-retry").default;
const CircuitBreaker=require("opossum");

axiosRetry(axios,{
    retries:2,
    retryDelay:()=>1000
});

async function getUser(userId){

    const response=
    await axios.get(
        `${process.env.USER_SERVICE_URL}/users/${userId}`,
        {
            timeout:1000
        }
    );

    return response.data;

}

const breaker=
new CircuitBreaker(
    getUser,
    {
        timeout:3000,
        errorThresholdPercentage:50,
        resetTimeout:5000
    }
);

breaker.fallback(()=>{

    throw new Error(
        "User Service unavailable"
    );

});