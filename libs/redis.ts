/* eslint-disable no-console */
import { createClient, type RedisClientType } from "redis";

function creatingClient(): RedisClientType | undefined {
  try {
    return createClient({
      socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
      },
      password: process.env.REDIS_PASSWORD,
    });
  } catch (err) {
    console.error("Failed to create Redis client!", err);
  }
}

export default async function getRedisClient(): Promise<
  RedisClientType | undefined
> {
  const client = creatingClient();

  if (client)
    try {
      if (!client.isOpen) {
        await client.connect();
        console.log("Redis is online.");
      }

      return client;
    } catch (err) {
      console.warn("Failed to connect Redis client!", err);
      console.warn("Disconnecting the Redis client...");

      if (client) {
        try {
          // eslint-disable-next-line @typescript-eslint/await-thenable, @typescript-eslint/no-unsafe-call
          await client.destroy();
          console.info("Redis client disconnected.");
        } catch {
          console.warn(
            "Failed to quit the Redis client after failing to connect.",
          );
        }
      }
    }
}
