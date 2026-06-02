import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import user from "../models/user.js";
import argon2 from "argon2";
import { signToken } from "../utils/jwt.js";
import { UserRequest } from "../types/index.js";
import agent from "../models/agent.js";
import { oauthclient } from "../config/google.js";
import axios from "axios";
import file from "../models/file.js";

interface GoogleUserProfile {
    email: string;
    name: string;
}


export const signup = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Incomplete fields"
            })
        }
        const existingUser = await user.findOne({
            email: email
        });
        if (existingUser) {
            return res.status(StatusCodes.CONFLICT).json({
                success: false,
                message: "User Already Exists"
            })
        }
        const encryptedPas = await argon2.hash(password);
        const newUser = await user.create({
            email: email,
            name: name,
            password: encryptedPas
        })
        const token = signToken(newUser._id.toString());
        return res.status(StatusCodes.CREATED).json({
            success: true,
            token: token,
            message: "Signed In Successfully"
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error",
            error: error
        })
    }
}


export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Incomplete fields"
            })
        }
        const loginUser = await user.findOne({
            email: email
        }).select('+password')
        if (!loginUser) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Invalid Email or Password"
            })
        }
        if (!loginUser.password) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Try Login via Google"
            })
        }
        const isMatch = await argon2.verify(loginUser.password, password);
        if (!isMatch) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Invalid Email or Password"
            })
        }
        const token = signToken(loginUser._id.toString());
        return res.status(StatusCodes.ACCEPTED).json({
            success: true,
            message: "Logged In Successfully",
            token: token
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error",
            error: error
        })
    }
}


export const getUserDetails = async (req: UserRequest, res: Response) => {
    try {
        const userId = req.userId;
        const userDetail = await user.findById(userId);
        const agents = await agent.find({
            createdBy: userId
        })
        const files = await file.find({
            createdBy: userId
        })
        const details = {
            name: userDetail?.name, _id: userDetail?._id, email: userDetail?.email, agents, files
        };
        return res.status(StatusCodes.ACCEPTED).json({
            success: true,
            message: "Details Fetched",
            data: details
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error",
            error: error
        })
    }
}


export const googleLogin = async (req: Request, res: Response) => {
    try {
        const { code } = req.query;
        if (!code) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Invalid Request"
            })
        }
        const googleResponse = await oauthclient.getToken(code as string);
        oauthclient.setCredentials(googleResponse.tokens)

        const userResponse = await axios.get<GoogleUserProfile>(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleResponse.tokens.access_token}`)
        if (!userResponse) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Invalid Request"
            })
        }
        const { email, name } = userResponse.data;
        let userDetails = await user.findOne({
            email: email
        })
        if (!userDetails) {
            userDetails = await user.create({
                email: email,
                name: name
            })
        }
        const token = signToken(userDetails._id.toString())
        return res.status(StatusCodes.ACCEPTED).json({
            success: true,
            message: "Logged In Successfully",
            token: token
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error",
            error: error
        })
    }
}

