import axios from 'axios';
import { Projeto } from '@/types/projeto';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080'
});

export class UsuarioService{

    listarTodos() {
        return axiosInstance.get("/usuario");
    }

    inserir(usuario: Projeto.Usuario) {
        return axiosInstance.post("/usuario", usuario);
    }

    alterar(usuario: Projeto.Usuario) {
        return axiosInstance.put("/usuario", usuario);
    }
}
