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
        `http://localhost:3001/users/${userId}`,
        {
            timeout:1000
        }
    );

    return response.data;

}