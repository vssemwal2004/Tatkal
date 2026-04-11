const crypto = require('crypto');
const { getRedisClient } = require('./redisClient');

const LOCK_SCRIPT = `
if redis.call("get", KEYS[1]) == ARGV[1] then
  return redis.call("del", KEYS[1])
else
  return 0
end
`;

const acquireLock = async (key, ttlMs = 5000) => {
  const client = await getRedisClient();
  if (!client) return 'no-redis';

  const token = crypto.randomBytes(16).toString('hex');
  const result = await client.set(key, token, { NX: true, PX: ttlMs });
  if (result !== 'OK') {
    return null;
  }
  return token;
};

const releaseLock = async (key, token) => {
  if (!token || token === 'no-redis') return;
  const client = await getRedisClient();
  if (!client) return;
  try {
    await client.eval(LOCK_SCRIPT, { keys: [key], arguments: [token] });
  } catch (error) {
    console.error('Redis lock release failed:', error?.message || error);
  }
};

module.exports = {
  acquireLock,
  releaseLock
};
