import toast from "react-hot-toast";
import api from "../apiConnector"
import type { IAgent } from "../../types";


export const addAgent = async (data: IAgent) => {
    try {
        const res = await api.post('/agent/', data);
       
        toast.success(res.data.message)
    } catch (error: any) {
        toast.error(error.response.data.message)
    }
}

export const updateAgent = async (data: Partial<IAgent>, agentId: string) => {
    try {
        const res = await api.patch(`/agent/${agentId}`, data);
       
        toast.success(res.data.message)
    } catch (error: any) {
        toast.error(error.response.data.message)
    }
}


export const deleteAgent = async (agentId: string) => {
    try {
        const res = await api.delete(`/agent/${agentId}`);
       
        toast.success(res.data.message)
    } catch (error: any) {
        toast.error(error.response.data.message)
    }
}

