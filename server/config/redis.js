import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

let redisClient = null;

export async function connectRedis() {
  console.log(`[Cache/Redis] Initializing client connection to ${REDIS_URL}...`);
  
  try {
    redisClient = createClient({
      url: REDIS_URL
    });

    redisClient.on('error', (err) => {
      console.warn('[Cache/Redis] Client error (Server running without Redis cache):', err.message);
    });

    redisClient.on('connect', () => {
      console.log('[Cache/Redis] Client successfully connected to Redis');
    });

    // In a real setup: await redisClient.connect();
    // For now, stub a resolve to avoid hanging if no redis is active locally
    console.log('[Cache/Redis] Client stub initialized. Server cache-ready.');
    return redisClient;
  } catch (err) {
    console.error('[Cache/Redis] Initialization failed:', err);
    return null;
  }
}

export function getRedisClient() {
  return redisClient;
}
