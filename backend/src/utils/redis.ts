import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();
// @ts-ignore
// export const redis = new Redis(process.env.REDIS_URL)


const redisClient = new Redis({
    host: 'redis',
    port: 6379,
    password: '',
});

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

export default redisClient;