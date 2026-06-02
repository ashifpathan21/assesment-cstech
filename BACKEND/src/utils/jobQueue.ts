import "dotenv/config";
import { Queue } from "bullmq";

if (!process.env.REDIS_URL) {
    throw new Error("REDIS_URL is missing");
}

export const connection = {
    url: process.env.REDIS_URL,
};

export const queue = new Queue("job-queue", { connection });

export const addToQueue = async (path: string, id: string) => {
    await queue.add(
        "process-file",
        {
            path: path,
            id: id
        },
        {
            removeOnComplete: true,
            removeOnFail: 100,
        }
    );
};
