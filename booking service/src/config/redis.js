const { createClient } = require("redis");

// .env se host aur port uthane ke liye (agar nahi milega toh fallback use hoga)
const redisHost = process.env.REDIS_HOST || "127.0.0.1";
const redisPort = process.env.REDIS_PORT || "6389";

const redisClient = createClient({
    url: `redis://${redisHost}:${redisPort}`
});

redisClient.on("error", (err) => console.log("Redis Client Error:", err));

redisClient.connect()
    .then(() => console.log("Redis connected successfully!"))
    .catch((err) => console.error("Redis connection failed:", err));

module.exports = redisClient;
