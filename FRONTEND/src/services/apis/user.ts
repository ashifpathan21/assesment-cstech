import toast from "react-hot-toast";
import api from "../apiConnector"
import type { NavigateFunction } from "react-router-dom";
import type { ILogin, ISignup, IUser } from "../../types";


export const signup = async (data: ISignup, navigate: NavigateFunction, setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    setLoading(true)
    try {
        const res = await api.post('/user/signup', data);
       
        localStorage.setItem('token', res.data.token);
        toast.success(res.data.message)
        navigate('/', { replace: true })
    } catch (error: any) {
        toast.error(error.response.data.message)
    } finally {
        setLoading(false)
    }
}


export const login = async (data: ILogin, navigate: NavigateFunction, setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    setLoading(true)
    try {
        const res = await api.post('/user/login', data);
        if (!res.data.success) {
            toast.error(res.data.message)
            return
        }
        localStorage.setItem('token', res.data.token);
        toast.success(res.data.message)
        navigate('/', { replace: true })
    } catch (error: any) {
        toast.error(error.response.data.message)
    } finally {
        setLoading(false)
    }
}


export const googleLogin = async (code: string, navigate: NavigateFunction, setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    setLoading(true)
    try {
        const res = await api.get(`/user/google/login?code=${code}`);
       
        localStorage.setItem('token', res.data.token);
        toast.success(res.data.message)
        navigate('/', { replace: true })
    } catch (error: any) {
        toast.error(error.response.data.message)
    } finally {
        setLoading(false)
    }
}

export const getUserDetails = async (navigate: NavigateFunction, setUser: React.Dispatch<React.SetStateAction<IUser | undefined>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    setLoading(true)
    try {
        const res = await api.get('/user/info');
        setUser(res.data.data);
        setLoading(false);
    } catch (error: any) {
        toast.error(error.response.data.message);
        localStorage.removeItem('token')
        navigate('/auth')
    }
}