const { createClient } = require('redis');

let redisClient;
let redisReady = false;
let connecting = null;

const buildRedisUrl = () => {
  if (process.env.REDIS_URL) return process.env.REDIS_URL;
  if (process.env.REDIS_HOST) {
    const port = process.env.REDIS_PORT || 6379;
    return `redis://${process.env.REDIS_HOST}:${port}`;
  }
  return null;
};

const getRedisClient = async () => {
  const url = buildRedisUrl();
  if (!url) return null;

  if (!redisClient) {
    redisClient = createClient({ url });
    redisClient.on('error', (error) => {
      redisReady = false;
      console.error('Redis client error:', error?.message || error);
    });
    redisClient.on('ready', () => {
      redisReady = true;
    });
  }

  if (!redisReady) {
    if (!connecting) {
      connecting = redisClient.connect().catch((error) => {
        console.error('Redis connection failed:', error?.message || error);
        redisReady = false;
      });
    }
    await connecting;
  }

  return redisReady ? redisClient : null;
};

module.exports = {
  getRedisClient
};
