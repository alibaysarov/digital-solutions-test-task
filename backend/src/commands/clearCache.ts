import redisClient from "../utils/redis";

async function main() {
    try {
        await redisClient.flushall();
        console.log('All keys in the current Redis DB have been cleared.');
    } catch (err) {
        console.error('Error clearing Redis cache:', err);
    }
}
main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await redisClient.quit();
    });