import { Response } from "express";
import { UserRequest } from "../types/index.js";
import { StatusCodes } from "http-status-codes";
import File from "../models/file.js";
import { deleteFromCloudinary, uploadToCloudinary } from "../config/cloudinary.js";
import { addToQueue } from "../utils/jobQueue.js";

export const uploadFile = async (req: UserRequest, res: Response) => {
    try {
        const userId = req.userId;
        const file = req.file;
        if (!file) {
            return res.status(StatusCodes.BAD_GATEWAY).json({
                success: false,
                message: "File is Missing"
            })
        }
        const resp = await uploadToCloudinary(file);
        const f = await File.create({
            url: resp.secure_url,
            publicId: resp.public_id,
            status: "PENDING",
            createdBy: userId
        });
        console.log(file.path)
        addToQueue(file.path, f._id.toString())
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "File Uploaded Task is Distributing"
        })

    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error",
            error: error
        })
    }
}

export const deleteFile = async (req: UserRequest, res: Response) => {
    try {
        const userId = req.userId
        const { fileId } = req.params;
        if (!fileId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Invalid Request"
            })
        }
        const existFile = await File.findOne({
            _id: fileId,
            createdBy: userId
        });
        if (!existFile) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "File Not Found"
            })
        }
        await deleteFromCloudinary(existFile.publicId);
        await File.findByIdAndDelete(existFile._id)
        return res.status(StatusCodes.NO_CONTENT).json({
            success: true,
            message: "File Deleted Successfully"
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error",
            error: error
        })
    }
}
