import toast from "react-hot-toast"
import api from "../apiConnector"

export const uploadFile = async (data: FormData) => {
    const toastId = toast.loading("Uploading File")
    try {
        const res = await api.post('/file/', data);
       
        toast.success(res.data.message);
    } catch (error: any) {
        toast.error(error.response.data.message)
    } finally {
        toast.dismiss(toastId)
    }
}


export const deleteFile = async (fileId: string) => {
    const toastId = toast.loading("Deleting File")
    try {
        const res = await api.delete(`/file/${fileId}`);
       
        toast.success(res.data.message);
    } catch (error: any) {
        toast.error(error.response.data.message)
    } finally {
        toast.dismiss(toastId)
    }
}