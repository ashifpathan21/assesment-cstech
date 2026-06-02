import { NextFunction, Response } from "express";
import { UserRequest } from "../types/index.js";
import { StatusCodes } from "http-status-codes";
import { decodeToken } from "../utils/jwt.js";
import user from "../models/user.js";

export const authMiddleware = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Token is Missing"
            })
        }
        const userId = decodeToken(token);
        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Unauthorized Access"
            })
        }
        const u = await user.findById(userId)
        if (!u) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Unauthorized Access"
            })
        }
        req.userId = userId.toString()
        next()
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error",
            error: error
        })
    }
}