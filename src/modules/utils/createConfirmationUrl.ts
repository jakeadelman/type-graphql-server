import { redis } from "../../redis";
import { v4 } from "uuid";

export const createConfirmationUrl = async (userId: number) => {
  const token = v4();
  await redis.set(token, userId, "ex", 60 * 60 * 24); // 1 day expiration
  console.log("created conf");
  return `https://socialslant.io/confirm?id=${token}`;
};
