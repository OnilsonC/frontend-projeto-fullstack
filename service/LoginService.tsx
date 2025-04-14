import axios from "axios";
import { Projeto } from '@/types';

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL_API
})

export class LoginService{

    novoCadastro(usuario: Projeto.Usuario){
        return axiosInstance.post("/auth/novousuario", usuario);
    }
}
