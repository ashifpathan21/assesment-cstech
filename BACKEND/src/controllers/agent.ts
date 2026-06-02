import { StatusCodes } from "http-status-codes";
import { UserRequest } from "../types/index.js";
import { Response } from "express";
import agent from "../models/agent.js";
import * as countryCodes from "country-codes-list";


export const addAgent = async (req: UserRequest, res: Response) => {
    try {
        const userId = req.userId
        const { name, email, password, countryCode, phoneNumber } = req.body
        if (!name || !email || !password || !countryCode || !phoneNumber) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Insufficient Fields"
            })
        }
        const isValidCountryCode = countryCodes.filter("countryCode", countryCode);
        if (!isValidCountryCode) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Invalid Country Code"
            })
        }
        const existingAgent = await agent.findOne({
            email: email,
            createdBy: userId
        })
        if (existingAgent) {
            return res.status(StatusCodes.CONFLICT).json({
                success: false,
                message: "Agent Already Exist"
            })
        }
        const newAgent = await agent.create({
            name: name,
            email: email,
            password: password,
            countryCode: countryCode,
            phoneNumber: phoneNumber,
            createdBy: userId
        });
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Agent Created Successfully",
            data: newAgent
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error",
            error: error
        })
    }
}


export const updateAgent = async (req: UserRequest, res: Response) => {
    try {
        const { agentId } = req.params;
        const userId = req.userId;
        const { name, email, password, countryCode, phoneNumber } = req.body
        if ((!name && !email && !password && !countryCode && !phoneNumber) || !agentId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Invalid Request"
            })
        }
        const isValidCountryCode = countryCodes.filter("countryCode", countryCode);
        if (!isValidCountryCode) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Invalid Country Code"
            })
        }
        const existingAgent = await agent.findOne({
            _id: agentId,
            createdBy: userId
        })
        if (!existingAgent) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Agent not found"
            })
        }
        if (email && existingAgent.email !== email) {
            const isEmailExist = await agent.findOne({
                email: email,
                createdBy: String(userId)
            })
            if (isEmailExist) {
                return res.status(StatusCodes.CONFLICT).json({
                    success: false,
                    message: "Email Already Exist"
                })
            }
        }
        const updatedAgent = await agent.findByIdAndUpdate(existingAgent._id, {
            email: email ?? existingAgent.email,
            name: name ?? existingAgent.name,
            phoneNumber: phoneNumber ?? existingAgent.phoneNumber,
            countryCode: countryCode ?? existingAgent.countryCode,
            password: password ?? existingAgent.password
        }, { new: true })
        return res.status(StatusCodes.ACCEPTED).json({
            success: true,
            message: "Agent Updated Successfully",
            data: updatedAgent
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error",
            error: error
        })
    }
}


export const deleteAgent = async (req: UserRequest, res: Response) => {
    try {
        const { agentId } = req.params;
        if (!agentId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Invalid Request"
            })
        }
        const userId = req.userId;
        const existingAgent = await agent.findOne({
            _id: agentId,
            createdBy: userId
        })
        if (!existingAgent) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Agent not found"
            })
        }
        await agent.findByIdAndDelete(existingAgent._id);
        return res.status(StatusCodes.NO_CONTENT).json({
            success: true,
            message: "Agent Deleted Successfully"
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error",
            error: error
        })
    }
}