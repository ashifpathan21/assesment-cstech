import { Worker } from "bullmq";
import file from "../models/file.js";
import agent from "../models/agent.js";
import { connection } from "../utils/jobQueue.js";
import { promises as fs } from "fs";
import { extractSpreadsheetData } from "../utils/extract.js";

export const resumeWorker = new Worker(
    "job-queue",
    async (job) => {
        const { path, id } = job.data;

        const f = await file.findOneAndUpdate(
            { _id: id, status: "PENDING" },
            { status: "PROCESSING" },
            { new: true }
        );

        if (!f) {
            await fs.unlink(path).catch(() => { });
            return;
        }

        try {
            console.log("Processing File:", f._id.toString());

            const data = await extractSpreadsheetData(path);

            if (
                !Array.isArray(data) ||
                data.length === 0 ||
                !data.every(
                    (row) =>
                        row?.FirstName &&
                        row?.Phone &&
                        row?.Notes
                )
            ) {
                f.status = "FAILED";
                await f.save();
                await fs.unlink(path).catch(() => { });
                return;
            }

            const agents = await agent.find({
                createdBy: f.createdBy,
            });

            if (agents.length === 0) {
                f.status = "FAILED";
                await f.save();
                await fs.unlink(path).catch(() => { });
                return;
            }

           
            data.forEach((row, index) => {
                const targetAgent = agents[index % agents.length];

                targetAgent.assignedTask.push({
                    firstName: row.FirstName,
                    phone: row.Phone,
                    notes: row.Notes,
                });
            });

            await Promise.all(
                agents.map((agentDoc) => agentDoc.save())
            );

            f.status = "DONE";
            await f.save();

            await fs.unlink(path).catch(() => { });

            console.log("Completed File:", f._id.toString());
        } catch (err: any) {
            console.error(
                "Error Processing File:",
                f._id.toString(),
                err
            );

            f.status = "FAILED";
            await f.save();

            await fs.unlink(path).catch(() => { });

            throw err;
        }
    },
    {
        connection,
        concurrency: 2,
    }
);